import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class FulfillmentService {
  constructor(private prisma: PrismaService) {}

  async assignWarehouse(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { address: true, items: { include: { product: true } } },
    });
    if (!order) throw new NotFoundException('Order not found');

    const warehouses = await this.prisma.warehouse.findMany({
      where: { isActive: true },
    });
    if (!warehouses.length) throw new NotFoundException('No active warehouses');

    let bestWarehouse = warehouses[0];
    let bestScore = Infinity;

    for (const wh of warehouses) {
      let score = 0;
      const inv = await this.prisma.inventory.findMany({
        where: { warehouseId: wh.id },
      });
      const stockMap = new Map(inv.map((i) => [i.productId, i.quantity]));
      let shortfalls = 0;

      for (const item of order.items) {
        const available = stockMap.get(item.productId) || 0;
        if (available < item.quantity) shortfalls += item.quantity - available;
      }

      score += shortfalls * 10;
      score += Math.random() * 5;

      if (score < bestScore) {
        bestScore = score;
        bestWarehouse = wh;
      }
    }

    return { warehouse: bestWarehouse, score: bestScore };
  }

  async selectCourier(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { address: true, items: { include: { product: true } } },
    });
    if (!order) throw new NotFoundException('Order not found');

    const couriers = await this.prisma.courier.findMany({
      where: { isActive: true },
      include: { zones: true },
    });
    if (!couriers.length) throw new NotFoundException('No active couriers');

    const totalWeight = order.items.reduce(
      (s, i) => s + (i.product.weight || 0.5) * i.quantity,
      0,
    );
    const district = order.address.district || order.address.city;

    let best: any = null;
    let bestCost = Infinity;

    for (const c of couriers) {
      const zone = c.zones.find(
        (z) => z.isActive && z.districts.includes(district),
      );
      const baseFee = zone?.baseFee || c.baseRate;
      const cost =
        baseFee +
        totalWeight * c.perKgRate +
        (order.paymentMethod === 'COD' ? zone?.codFee || c.codFee : 0);

      if (cost < bestCost) {
        bestCost = cost;
        best = {
          courier: c,
          cost,
          zone,
          estimatedDays: zone?.estDays || c.deliveryDays,
        };
      }
    }

    return best;
  }

  async createShipment(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { address: true, items: { include: { product: true } } },
    });
    if (!order) throw new NotFoundException('Order not found');

    const assignment = await this.selectCourier(orderId);
    if (!assignment) throw new BadRequestException('No courier available');

    const trackingId =
      'AMR' +
      Date.now().toString(36).toUpperCase() +
      Math.random().toString(36).substring(2, 6).toUpperCase();

    const shipment = await this.prisma.shipment.create({
      data: {
        orderId,
        courierId: assignment.courier.id,
        trackingId,
        status: 'PENDING',
        weight: order.items.reduce(
          (s, i) => s + (i.product.weight || 0.5) * i.quantity,
          0,
        ),
        shippingFee: assignment.cost,
        deliveryAddress: `${order.address.street}, ${order.address.city}, ${order.address.district || order.address.division || ''}`,
        estimatedDays: assignment.estimatedDays,
      },
    });

    await this.prisma.shipmentTimeline.create({
      data: {
        shipmentId: shipment.id,
        status: 'PENDING',
        note: 'Shipment created',
      },
    });

    await this.prisma.order.update({
      where: { id: orderId },
      data: { trackingNumber: trackingId, status: 'PROCESSING' },
    });

    return shipment;
  }

  async getDeliverySlots(pincode: string) {
    const couriers = await this.prisma.courier.findMany({
      where: { isActive: true },
      include: { zones: { where: { isActive: true } } },
    });

    const slots: any[] = [];
    for (const c of couriers) {
      const slotsForCourier = await this.prisma.deliverySlot.findMany({
        where: { courierId: c.id, pincode, isActive: true },
      });
      const availableSlots = slotsForCourier.filter(
        (s) => s.bookedOrders < s.maxOrders,
      );
      for (const s of availableSlots) {
        slots.push({
          courier: c.name,
          slotId: s.id,
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
          available: s.maxOrders - s.bookedOrders,
        });
      }
    }
    return slots;
  }

  async schedulePickup(
    shipmentId: string,
    slot: { date: string; timeSlot: string },
  ) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id: shipmentId },
    });
    if (!shipment) throw new NotFoundException('Shipment not found');

    await this.prisma.shipment.update({
      where: { id: shipmentId },
      data: {
        status: 'PICKUP_SCHEDULED',
        notes: `Pickup scheduled: ${slot.date} ${slot.timeSlot}`,
      },
    });

    await this.prisma.shipmentTimeline.create({
      data: {
        shipmentId,
        status: 'PICKUP_SCHEDULED',
        note: `Pickup scheduled for ${slot.date} at ${slot.timeSlot}`,
      },
    });

    return { success: true, shipmentId, scheduled: slot };
  }

  async calculateSLA(fromWarehouse: string, toAddress: string) {
    const { city, district, division } = await this.parseAddress(toAddress);
    const couriers = await this.prisma.courier.findMany({
      where: { isActive: true },
      include: {
        zones: {
          where: { districts: { has: district || city }, isActive: true },
        },
      },
    });

    return couriers.map((c) => {
      const zone = c.zones[0];
      return {
        courier: c.name,
        estimatedDays: zone?.estDays || c.deliveryDays,
        sla: `${zone?.estDays || c.deliveryDays} business days`,
      };
    });
  }

  async getFulfillmentOptions(sellerId: string) {
    const seller = await this.prisma.store.findUnique({
      where: { id: sellerId },
    });
    if (!seller) throw new NotFoundException('Seller not found');

    const warehouses = await this.prisma.warehouse.count({
      where: { isActive: true },
    });
    const couriers = await this.prisma.courier.count({
      where: { isActive: true },
    });

    return {
      fbl: {
        available: warehouses > 0,
        warehouses,
        description: 'Fulfillment by AmrShop',
      },
      selfFulfilled: { available: true, description: 'Self fulfillment' },
      dropship: { available: true, description: 'Dropship from supplier' },
    };
  }

  async processCODReconciliation(date: string) {
    const targetDate = new Date(date);
    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const shipments = await this.prisma.shipment.findMany({
      where: {
        status: 'DELIVERED',
        deliveredAt: { gte: targetDate, lt: nextDate },
        codAmount: { gt: 0 },
      },
      include: { courier: true },
    });

    const totalCOD = shipments.reduce((s, sh) => s + (sh.codAmount || 0), 0);
    const totalFee = shipments.reduce((s, sh) => s + (sh.shippingFee || 0), 0);

    return {
      date,
      totalShipments: shipments.length,
      totalCOD,
      totalFee,
      netRemittance: totalCOD - totalFee,
      shipments: shipments.map((s) => ({
        id: s.id,
        trackingId: s.trackingId,
        codAmount: s.codAmount,
        fee: s.shippingFee,
      })),
    };
  }

  async getCourierPerformance(dateRange: { start: string; end: string }) {
    const logs = await this.prisma.courierPerformanceLog.findMany({
      where: {
        date: { gte: new Date(dateRange.start), lte: new Date(dateRange.end) },
      },
      include: { courier: { select: { id: true, name: true } } },
    });

    const aggregated: Record<string, any> = {};
    for (const log of logs) {
      if (!aggregated[log.courierId]) {
        aggregated[log.courierId] = {
          courierId: log.courierId,
          courierName: log.courier.name,
          totalShipments: 0,
          delivered: 0,
          failed: 0,
          returned: 0,
          onTime: 0,
          codCollected: 0,
          codRemitted: 0,
        };
      }
      aggregated[log.courierId].totalShipments += log.totalShipments;
      aggregated[log.courierId].delivered += log.delivered;
      aggregated[log.courierId].failed += log.failed;
      aggregated[log.courierId].returned += log.returned;
      aggregated[log.courierId].onTime += log.onTime;
      aggregated[log.courierId].codCollected += log.codCollected;
      aggregated[log.courierId].codRemitted += log.codRemitted;
    }

    return Object.values(aggregated).map((a: any) => ({
      ...a,
      deliveryRate:
        a.totalShipments > 0
          ? ((a.delivered / a.totalShipments) * 100).toFixed(1)
          : 0,
      onTimeRate:
        a.delivered > 0 ? ((a.onTime / a.delivered) * 100).toFixed(1) : 0,
      failureRate:
        a.totalShipments > 0
          ? ((a.failed / a.totalShipments) * 100).toFixed(1)
          : 0,
    }));
  }

  async trackShipment(trackingId: string) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { trackingId },
      include: {
        courier: { select: { id: true, name: true, slug: true } },
        order: { select: { id: true, orderNumber: true } },
        timeline: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!shipment) throw new NotFoundException('Shipment not found');

    return {
      trackingId: shipment.trackingId,
      status: shipment.status,
      courier: shipment.courier,
      order: shipment.order,
      estimatedDays: shipment.estimatedDays,
      timeline: shipment.timeline,
    };
  }

  private async parseAddress(address: string) {
    const parts = address.split(',').map((s) => s.trim());
    return {
      street: parts[0] || '',
      city: parts[1] || '',
      district: parts[2] || '',
      division: parts[3] || '',
    };
  }
}
