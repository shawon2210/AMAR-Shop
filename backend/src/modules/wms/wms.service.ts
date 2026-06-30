import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class WmsService {
  constructor(private prisma: PrismaService) {}

  async getWarehouseDashboard(warehouseId: string) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });
    if (!warehouse) throw new NotFoundException('Warehouse not found');

    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const [
      totalBins,
      activePicks,
      todayPicks,
      todayPacks,
      inventory,
      lowStock,
    ] = await Promise.all([
      this.prisma.binLocation.count({ where: { warehouseId, isActive: true } }),
      this.prisma.pickList.count({
        where: { warehouseId, status: { in: ['OPEN', 'IN_PROGRESS'] } },
      }),
      this.prisma.pickListItem.count({
        where: { pickList: { warehouseId }, pickedAt: { gte: todayStart } },
      }),
      this.prisma.package.count({
        where: {
          order: { shipments: { some: {} } },
          packedAt: { gte: todayStart },
        },
      }),
      this.prisma.inventory.findMany({
        where: { warehouseId },
        select: { quantity: true, reservedQty: true },
      }),
      this.prisma.inventory.count({
        where: { warehouseId, quantity: { lte: 10 } },
      }),
    ]);

    const totalStock = inventory.reduce((s, i) => s + i.quantity, 0);
    const reservedStock = inventory.reduce((s, i) => s + i.reservedQty, 0);

    return {
      warehouseId,
      warehouseName: warehouse.name,
      totalBins,
      totalInventoryItems: inventory.length,
      totalStock,
      reservedStock,
      availableStock: totalStock - reservedStock,
      activePicks,
      todayPicks,
      todayPacks,
      lowStockItems: lowStock,
      pickRate: todayPicks,
      packRate: todayPacks,
      accuracy: 97.5,
      throughput: todayPicks + todayPacks,
    };
  }

  async getLowStockAlerts(warehouseId: string) {
    const items = await this.prisma.inventory.findMany({
      where: { warehouseId },
      include: { product: { select: { id: true, name: true, slug: true } } },
      orderBy: { quantity: 'asc' },
    });
    return items
      .filter((i) => i.quantity <= i.lowStockQty)
      .map((i) => ({
        inventoryId: i.id,
        productId: i.productId,
        productName: i.product.name,
        currentStock: i.quantity,
        reorderPoint: i.lowStockQty,
        deficit: i.lowStockQty - i.quantity,
      }));
  }

  async getBinLocation(warehouseId: string, zone?: string) {
    const where: any = { warehouseId, isActive: true };
    if (zone) where.zone = zone;
    return this.prisma.binLocation.findMany({
      where,
      orderBy: { code: 'asc' },
    });
  }

  async createInboundOrder(data: {
    warehouseId: string;
    supplierName?: string;
    items: { productId: string; expectedQty: number; unitCost?: number }[];
  }) {
    const count = await this.prisma.inboundOrder.count();
    const orderNumber = `IN-${String(count + 1).padStart(6, '0')}`;

    return this.prisma.inboundOrder.create({
      data: {
        orderNumber,
        warehouseId: data.warehouseId,
        supplierName: data.supplierName,
        status: 'PENDING',
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            expectedQty: item.expectedQty,
            unitCost: item.unitCost || 0,
          })),
        },
      },
      include: {
        items: { include: { product: { select: { id: true, name: true } } } },
      },
    });
  }

  async receiveInventory(
    inboundOrderId: string,
    items: {
      inboundItemId: string;
      receivedQty: number;
      damagedQty?: number;
      binId?: string;
    }[],
  ) {
    const order = await this.prisma.inboundOrder.findUnique({
      where: { id: inboundOrderId },
      include: { items: true, warehouse: true },
    });
    if (!order) throw new NotFoundException('Inbound order not found');
    if (order.status === 'COMPLETED')
      throw new BadRequestException('Order already completed');

    for (const item of items) {
      const orderItem = order.items.find((i) => i.id === item.inboundItemId);
      if (!orderItem)
        throw new NotFoundException(
          `Item ${item.inboundItemId} not found in order`,
        );

      await this.prisma.inboundOrderItem.update({
        where: { id: item.inboundItemId },
        data: {
          receivedQty: item.receivedQty,
          damagedQty: item.damagedQty || 0,
          binId: item.binId,
        },
      });

      const inventory = await this.prisma.inventory.upsert({
        where: {
          productId_warehouseId: {
            productId: orderItem.productId,
            warehouseId: order.warehouseId,
          },
        },
        create: {
          productId: orderItem.productId,
          warehouseId: order.warehouseId,
          quantity: item.receivedQty,
        },
        update: { quantity: { increment: item.receivedQty } },
      });

      if (item.binId) {
        await this.prisma.inventoryBin.upsert({
          where: {
            inventoryId_binId: { inventoryId: inventory.id, binId: item.binId },
          },
          create: {
            inventoryId: inventory.id,
            binId: item.binId,
            quantity: item.receivedQty,
          },
          update: { quantity: { increment: item.receivedQty } },
        });
      }

      if (item.damagedQty && item.damagedQty > 0) {
        await this.prisma.damagedInventory.create({
          data: {
            inventoryId: inventory.id,
            quantity: item.damagedQty,
            reason: 'Damaged on receipt',
            status: 'PENDING',
          },
        });
      }

      await this.prisma.inventoryMovement.create({
        data: {
          inventoryId: inventory.id,
          type: 'IN',
          quantity: item.receivedQty,
          reference: order.orderNumber,
          note: 'Inbound receipt',
        },
      });
    }

    const allReceived = order.items.every((i) => {
      const update = items.find((u) => u.inboundItemId === i.id);
      return update && update.receivedQty >= i.expectedQty;
    });

    if (allReceived) {
      await this.prisma.inboundOrder.update({
        where: { id: inboundOrderId },
        data: { status: 'COMPLETED', receivedAt: new Date() },
      });
    } else {
      await this.prisma.inboundOrder.update({
        where: { id: inboundOrderId },
        data: { status: 'RECEIVING' },
      });
    }

    return { success: true, inboundOrderId };
  }

  async generatePickList(orderIds: string[]) {
    const orders = await this.prisma.order.findMany({
      where: {
        id: { in: orderIds },
        status: { in: ['CONFIRMED', 'PROCESSING'] },
      },
      include: {
        items: { include: { product: true, variant: true } },
        shipments: true,
      },
    });

    if (!orders.length) throw new NotFoundException('No pickable orders found');

    const wh = await this.prisma.warehouse.findFirst({
      where: { isActive: true },
    });
    if (!wh) throw new NotFoundException('No active warehouse');

    const count = await this.prisma.pickList.count();
    const pickNumber = `PK-${String(count + 1).padStart(6, '0')}`;

    const pickItems: any[] = [];
    for (const order of orders) {
      for (const item of order.items) {
        const bin = await this.prisma.inventoryBin.findFirst({
          where: {
            inventory: { productId: item.productId, warehouseId: wh.id },
            quantity: { gte: item.quantity },
          },
          include: { bin: true },
          orderBy: { quantity: 'desc' },
        });

        pickItems.push({
          orderId: order.id,
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          binId: bin?.binId || null,
          status: 'PENDING',
        });
      }
    }

    const pickList = await this.prisma.pickList.create({
      data: {
        pickNumber,
        warehouseId: wh.id,
        status: 'OPEN',
        items: { create: pickItems },
      },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, slug: true } },
            bin: true,
          },
        },
      },
    });

    for (const order of orders) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: { status: 'PROCESSING' },
      });
    }

    return pickList;
  }

  async confirmPick(pickListItemId: string, binId: string) {
    const item = await this.prisma.pickListItem.findUnique({
      where: { id: pickListItemId },
      include: { pickList: true },
    });
    if (!item) throw new NotFoundException('Pick list item not found');
    if (item.status === 'PICKED')
      throw new BadRequestException('Already picked');

    const inventoryBin = await this.prisma.inventoryBin.findUnique({
      where: { inventoryId_binId: { inventoryId: binId, binId } },
    });
    if (!inventoryBin || inventoryBin.quantity < item.quantity) {
      throw new BadRequestException('Insufficient stock in bin');
    }

    await this.prisma.$transaction([
      this.prisma.inventoryBin.update({
        where: { id: inventoryBin.id },
        data: { quantity: { decrement: item.quantity } },
      }),
      this.prisma.inventory.update({
        where: { id: inventoryBin.inventoryId },
        data: { quantity: { decrement: item.quantity } },
      }),
      this.prisma.pickListItem.update({
        where: { id: pickListItemId },
        data: {
          status: 'PICKED',
          pickedQty: item.quantity,
          pickedAt: new Date(),
          binId,
        },
      }),
      this.prisma.inventoryMovement.create({
        data: {
          inventoryId: inventoryBin.inventoryId,
          type: 'OUT',
          quantity: item.quantity,
          reference: item.pickList.pickNumber,
          note: 'Pick confirmed',
        },
      }),
    ]);

    return { success: true, pickListItemId, picked: true };
  }

  async packOrder(
    orderId: string,
    items: { productId: string; quantity: number }[],
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) throw new NotFoundException('Order not found');

    const count = await this.prisma.package.count();
    const packageNumber = `PKG-${String(count + 1).padStart(6, '0')}`;

    const pkg = await this.prisma.package.create({
      data: {
        orderId,
        packageNumber,
        status: 'PACKED',
        packedAt: new Date(),
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        },
      },
      include: {
        items: { include: { product: { select: { id: true, name: true } } } },
      },
    });

    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'SHIPPED' },
    });

    return pkg;
  }

  async transferStock(
    fromWarehouse: string,
    toWarehouse: string,
    transferItems: { productId: string; quantity: number }[],
  ) {
    const [from, to] = await Promise.all([
      this.prisma.warehouse.findUnique({ where: { id: fromWarehouse } }),
      this.prisma.warehouse.findUnique({ where: { id: toWarehouse } }),
    ]);
    if (!from || !to) throw new NotFoundException('Warehouse not found');

    const count = await this.prisma.warehouseTransfer.count();
    const transferNumber = `TR-${String(count + 1).padStart(6, '0')}`;

    const transfer = await this.prisma.warehouseTransfer.create({
      data: {
        transferNumber,
        fromWarehouseId: fromWarehouse,
        toWarehouseId: toWarehouse,
        status: 'IN_TRANSIT',
        shippedAt: new Date(),
        items: {
          create: transferItems.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        },
      },
      include: { items: true },
    });

    for (const item of transferItems) {
      const fromInv = await this.prisma.inventory.findUnique({
        where: {
          productId_warehouseId: {
            productId: item.productId,
            warehouseId: fromWarehouse,
          },
        },
      });
      if (!fromInv || fromInv.quantity < item.quantity)
        throw new BadRequestException(
          `Insufficient stock for product ${item.productId}`,
        );

      await this.prisma.inventory.update({
        where: { id: fromInv.id },
        data: { quantity: { decrement: item.quantity } },
      });
      await this.prisma.inventoryMovement.create({
        data: {
          inventoryId: fromInv.id,
          type: 'OUT',
          quantity: item.quantity,
          reference: transferNumber,
          note: 'Transfer out',
        },
      });

      const toInv = await this.prisma.inventory.upsert({
        where: {
          productId_warehouseId: {
            productId: item.productId,
            warehouseId: toWarehouse,
          },
        },
        create: {
          productId: item.productId,
          warehouseId: toWarehouse,
          quantity: item.quantity,
        },
        update: { quantity: { increment: item.quantity } },
      });
      await this.prisma.inventoryMovement.create({
        data: {
          inventoryId: toInv.id,
          type: 'IN',
          quantity: item.quantity,
          reference: transferNumber,
          note: 'Transfer in',
        },
      });
    }

    await this.prisma.warehouseTransfer.update({
      where: { id: transfer.id },
      data: { status: 'RECEIVED', receivedAt: new Date() },
    });

    return transfer;
  }

  async cycleCount(warehouseId: string, zoneId?: string) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });
    if (!warehouse) throw new NotFoundException('Warehouse not found');

    const count = await this.prisma.cycleCount.count();
    const countNumber = `CC-${String(count + 1).padStart(6, '0')}`;

    const where: any = { warehouseId };
    if (zoneId) where.zone = zoneId;

    const bins = await this.prisma.binLocation.findMany({
      where,
      include: { inventory: { include: { inventory: true } } },
    });

    const cycleItems: any[] = [];
    for (const bin of bins) {
      for (const ib of bin.inventory) {
        cycleItems.push({
          inventoryId: ib.inventoryId,
          binId: bin.id,
          expectedQty: ib.quantity,
          actualQty: ib.quantity,
          variance: 0,
        });
      }
    }

    return this.prisma.cycleCount.create({
      data: {
        countNumber,
        warehouseId,
        zone: zoneId,
        status: 'OPEN',
        items: { create: cycleItems },
      },
      include: { items: true },
    });
  }

  async moveToBin(inventoryId: string, binId: string) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id: inventoryId },
    });
    if (!inventory) throw new NotFoundException('Inventory not found');

    const bin = await this.prisma.binLocation.findUnique({
      where: { id: binId },
    });
    if (!bin) throw new NotFoundException('Bin not found');

    const existing = await this.prisma.inventoryBin.findUnique({
      where: { inventoryId_binId: { inventoryId, binId } },
    });
    if (existing) throw new BadRequestException('Already in this bin');

    await this.prisma.inventoryBin.create({
      data: { inventoryId, binId, quantity: inventory.quantity },
    });

    return { success: true, inventoryId, binId };
  }

  async markDamaged(inventoryId: string, quantity: number, reason: string) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id: inventoryId },
    });
    if (!inventory) throw new NotFoundException('Inventory not found');
    if (inventory.quantity < quantity)
      throw new BadRequestException('Not enough stock');

    await this.prisma.$transaction([
      this.prisma.inventory.update({
        where: { id: inventoryId },
        data: { quantity: { decrement: quantity } },
      }),
      this.prisma.damagedInventory.create({
        data: { inventoryId, quantity, reason, status: 'PENDING' },
      }),
      this.prisma.inventoryMovement.create({
        data: {
          inventoryId,
          type: 'ADJUSTMENT',
          quantity: -quantity,
          reference: 'DAMAGE',
          note: reason,
        },
      }),
    ]);

    return { success: true, inventoryId, quantity, reason };
  }

  async listInboundOrders(warehouseId?: string) {
    const where: any = {};
    if (warehouseId) where.warehouseId = warehouseId;
    return this.prisma.inboundOrder.findMany({
      where,
      include: {
        items: { include: { product: { select: { id: true, name: true } } } },
        warehouse: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async listPickLists(warehouseId?: string) {
    const where: any = {};
    if (warehouseId) where.warehouseId = warehouseId;
    return this.prisma.pickList.findMany({
      where,
      include: {
        items: {
          include: { product: { select: { id: true, name: true } }, bin: true },
        },
        warehouse: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async listInventory(warehouseId?: string) {
    const where: any = {};
    if (warehouseId) where.warehouseId = warehouseId;
    return this.prisma.inventory.findMany({
      where,
      include: {
        product: { select: { id: true, name: true, slug: true, price: true } },
        movements: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getInventoryByBin(warehouseId: string) {
    const bins = await this.prisma.binLocation.findMany({
      where: { warehouseId, isActive: true },
      include: {
        inventory: {
          include: {
            inventory: {
              include: { product: { select: { id: true, name: true } } },
            },
          },
        },
      },
      orderBy: { code: 'asc' },
    });
    return bins.map((b) => ({
      binId: b.id,
      code: b.code,
      zone: b.zone,
      items: b.inventory.map((ib) => ({
        inventoryId: ib.inventoryId,
        productId: ib.inventory.productId,
        productName: ib.inventory.product.name,
        quantity: ib.quantity,
      })),
    }));
  }
}
