import crypto from 'node:crypto';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  private generateOrderNumber(): string {
    const date = new Date();
    const y = date.getFullYear().toString().slice(-2);
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    const uid = crypto.randomUUID().split('-').slice(0, 2).join('');
    return `AMR-${y}${m}${d}-${uid}`;
  }

  async create(
    userId: string,
    data: {
      addressId: string;
      paymentMethod: string;
      note?: string;
      items: { productId: string; quantity: number; price: number }[];
      subtotal: number;
      shipping: number;
      discount: number;
      total: number;
    },
  ) {
    if (!data.items || data.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    const address = await this.prisma.address.findUnique({
      where: { id: data.addressId },
    });
    if (!address) throw new BadRequestException('Shipping address not found');
    if (address.userId !== userId) {
      throw new ForbiddenException('Shipping address does not belong to you');
    }

    const productIds = data.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true, stockCount: true, inStock: true },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of data.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new BadRequestException(`Product ${item.productId} not found`);
      }
      if (!product.inStock || product.stockCount < item.quantity) {
        throw new BadRequestException(
          `Product ${item.productId} is out of stock or has insufficient stock`,
        );
      }
    }

    const order = await this.prisma.order.create({
      data: {
        orderNumber: this.generateOrderNumber(),
        userId,
        addressId: data.addressId,
        paymentMethod: data.paymentMethod as any,
        subtotal: data.subtotal,
        shipping: data.shipping,
        discount: data.discount,
        total: data.total,
        note: data.note,
        status: 'PENDING',
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, images: true } },
          },
        },
        address: true,
      },
    });

    await this.prisma.cartItem.deleteMany({
      where: {
        userId,
        productId: { in: productIds },
      },
    });

    return order;
  }

  async findByUser(userId: string, status?: string, skip = 0, take = 10) {
    const where: any = { userId };
    if (status && status !== 'ALL') {
      where.status = status.toUpperCase();
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: { select: { id: true, name: true, images: true } },
            },
          },
          address: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { orders, total, skip, take };
  }

  async findById(id: string, userId?: string) {
    const where: any = { id };
    if (userId) where.userId = userId;

    const order = await this.prisma.order.findFirst({
      where,
      include: {
        items: {
          include: {
            product: { include: { store: { select: { name: true } } } },
          },
        },
        address: true,
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, status: any) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }
}
