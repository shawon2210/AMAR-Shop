import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class LogisticsService {
  constructor(private prisma: PrismaService) {}

  async createShipment(orderId: string, courierId?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } }, address: true },
    });
    if (!order) throw new NotFoundException('Order not found');

    const courier = courierId
      ? await this.prisma.courier.findUnique({ where: { id: courierId } })
      : await this.prisma.courier.findFirst({ where: { isActive: true } });

    if (!courier) throw new NotFoundException('No active courier found');

    const totalWeight = order.items.reduce((sum, item) => sum + (item.product.weight || 0.5) * item.quantity, 0);
    const shippingFee = courier.baseRate + (totalWeight * courier.perKgRate);

    const trackingId = 'AMR' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();

    const shipment = await this.prisma.shipment.create({
      data: {
        orderId,
        courierId: courier.id,
        trackingId,
        status: 'PENDING',
        weight: totalWeight,
        shippingFee,
        deliveryAddress: `${order.address.street}, ${order.address.city}, ${order.address.district || ''}`,
        estimatedDays: courier.deliveryDays,
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

  async getCouriers() {
    return this.prisma.courier.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true, baseRate: true, perKgRate: true, codFee: true, deliveryDays: true, logo: true },
    });
  }

  async getDeliveryZones(courierId: string) {
    return this.prisma.deliveryZone.findMany({
      where: { courierId, isActive: true },
    });
  }

  async calculateShipping(weight: number, district: string, courierId: string) {
    const courier = await this.prisma.courier.findUnique({ where: { id: courierId } });
    if (!courier) throw new NotFoundException('Courier not found');

    const zone = await this.prisma.deliveryZone.findFirst({
      where: { courierId, districts: { has: district }, isActive: true },
    });

    const baseFee = zone?.baseFee || courier.baseRate;
    const perKgRate = courier.perKgRate;
    const codFee = zone?.codFee || courier.codFee;

    const shippingFee = baseFee + (weight * perKgRate);

    return {
      courier: courier.name,
      weight,
      district,
      baseFee,
      perKgRate,
      shippingFee,
      codFee,
      estimatedDays: zone?.estDays || courier.deliveryDays,
    };
  }

  async updateTracking(shipmentId: string, trackingId: string) {
    const shipment = await this.prisma.shipment.findUnique({ where: { id: shipmentId } });
    if (!shipment) throw new NotFoundException('Shipment not found');

    return this.prisma.shipment.update({
      where: { id: shipmentId },
      data: { trackingId },
    });
  }

  async getShipmentStatus(trackingId: string) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { trackingId },
      include: {
        courier: { select: { id: true, name: true, slug: true } },
        order: { select: { id: true, orderNumber: true } },
        timeline: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!shipment) throw new NotFoundException('Shipment not found');

    return shipment;
  }

  async getDeliveryTimeline(shipmentId: string) {
    const shipment = await this.prisma.shipment.findUnique({ where: { id: shipmentId } });
    if (!shipment) throw new NotFoundException('Shipment not found');

    const timeline = await this.prisma.shipmentTimeline.findMany({
      where: { shipmentId },
      orderBy: { createdAt: 'desc' },
    });

    return { shipmentId, trackingId: shipment.trackingId, status: shipment.status, timeline };
  }
}
