import crypto from 'node:crypto';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CouponService } from '../coupons/coupon.service';

@Injectable()
export class OrdersService {
  constructor(
    private prismaService: PrismaService,
    private couponService: CouponService,
  ) {}

  private generateOrderNumber(): string {
    const date = new Date();
    const y = date.getFullYear().toString().slice(-2);
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    const uid = crypto.randomUUID().split('-').slice(0, 2).join('');
    return `AMR-${y}${m}${d}-${uid}`;
  }

  private readonly FREE_SHIPPING_THRESHOLD = 2000;
  private readonly SHIPPING_COST = 60;

  async create(
    userId: string,
    data: {
      addressId: string;
      paymentMethod: string;
      note?: string;
      items: { productId: string; quantity: number }[];
      couponCode?: string;
    },
  ) {
    if (!data.items || data.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    const address = await this.prismaService.address.findUnique({
      where: { id: data.addressId },
    });
    if (!address) throw new BadRequestException('Shipping address not found');
    if (address.userId !== userId) {
      throw new ForbiddenException('Shipping address does not belong to you');
    }

    const productIds = data.items.map((i) => i.productId);
    const products = await this.prismaService.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        price: true,
        stockCount: true,
        inStock: true,
        storeId: true,
      },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    // Validate stock and calculate totals
    let subtotal = 0;
    const orderItems: {
      productId: string;
      quantity: number;
      price: number;
      storeId: string;
    }[] = [];

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

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        storeId: product.storeId,
      });
    }

    const shipping =
      subtotal >= this.FREE_SHIPPING_THRESHOLD ? 0 : this.SHIPPING_COST;

    let discount = 0;
    let coupon: any = null;

    if (data.couponCode) {
      const validation = await this.couponService.validateCoupon(
        data.couponCode,
        userId,
        subtotal,
      );
      discount = validation.discount;
      coupon = validation.coupon;
    }

    const total = subtotal + shipping - discount;

    // Use transaction for atomic order creation and stock reservation
    const order = await this.prismaService.$transaction(async (tx) => {
      // Create order with calculated totals
      const order = await tx.order.create({
        data: {
          orderNumber: this.generateOrderNumber(),
          userId,
          addressId: data.addressId,
          paymentMethod: data.paymentMethod as any,
          subtotal,
          shipping,
          discount,
          total,
          note: data.note,
          status: 'PENDING',
          items: {
            create: orderItems.map((item) => ({
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

      // Reserve stock (decrement stockCount)
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockCount: { decrement: item.quantity } },
        });
      }

      // Clear cart items
      await tx.cartItem.deleteMany({
        where: {
          userId,
          productId: { in: productIds },
        },
      });

      return order;
    });

    // Apply coupon usage tracking if coupon was used
    if (coupon) {
      await this.couponService.applyCoupon(
        coupon.id,
        userId,
        order.id,
        discount,
      );
    }

    return order;
  }

  async findByUser(userId: string, status?: string, skip = 0, take = 10) {
    const where: any = { userId };
    if (status && status !== 'ALL') {
      where.status = status.toUpperCase();
    }

    const [orders, total] = await Promise.all([
      this.prismaService.order.findMany({
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
      this.prismaService.order.count({ where }),
    ]);

    return { orders, total, skip, take };
  }

  async findById(id: string, userId?: string) {
    const where: any = { id };
    if (userId) where.userId = userId;

    const order = await this.prismaService.order.findFirst({
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
    const order = await this.prismaService.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    return this.prismaService.order.update({
      where: { id },
      data: { status },
    });
  }
}
