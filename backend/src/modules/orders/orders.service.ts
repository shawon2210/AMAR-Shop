import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  private generateOrderNumber(): string {
    const date = new Date();
    const y = date.getFullYear().toString().slice(-2);
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    const rand = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, '0');
    return `AMR-${y}${m}${d}-${rand}`;
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
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: { product: { select: { id: true, name: true, images: true } } },
        },
        address: true,
      },
    });

    // Clear cart items that were ordered
    await this.prisma.cartItem.deleteMany({
      where: {
        userId,
        productId: { in: data.items.map(i => i.productId) },
      },
    });

    return order;
  }

  async findByUser(
    userId: string,
    status?: string,
    skip = 0,
    take = 10,
  ) {
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
            include: { product: { select: { id: true, name: true, images: true } } },
          },
          address: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { orders, total, skip, take };
  }

  async findById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
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
