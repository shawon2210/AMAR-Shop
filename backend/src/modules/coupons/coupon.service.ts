import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class CouponService {
  constructor(private prisma: PrismaService) {}

  async validateCoupon(
    code: string,
    userId: string,
    subtotal: number,
  ): Promise<{
    valid: boolean;
    message: string;
    discount: number;
    coupon: any;
  }> {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return {
        valid: false,
        message: 'Invalid coupon code',
        discount: 0,
        coupon: null,
      };
    }

    if (!coupon.isActive) {
      return {
        valid: false,
        message: 'Coupon is not active',
        discount: 0,
        coupon: null,
      };
    }

    const now = new Date();

    if (coupon.startsAt && now < coupon.startsAt) {
      return {
        valid: false,
        message: 'Coupon has not started yet',
        discount: 0,
        coupon: null,
      };
    }

    if (coupon.expiresAt && now > coupon.expiresAt) {
      return {
        valid: false,
        message: 'Coupon has expired',
        discount: 0,
        coupon: null,
      };
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return {
        valid: false,
        message: 'Coupon usage limit reached',
        discount: 0,
        coupon: null,
      };
    }

    if (subtotal < coupon.minPurchase) {
      return {
        valid: false,
        message: `Minimum purchase of ${coupon.minPurchase} required`,
        discount: 0,
        coupon: null,
      };
    }

    const userUsage = await this.prisma.couponUsage.count({
      where: { couponId: coupon.id, userId },
    });

    if (userUsage >= coupon.maxPerUser) {
      return {
        valid: false,
        message: `Coupon usage limit per user reached (max ${coupon.maxPerUser})`,
        discount: 0,
        coupon: null,
      };
    }

    let discount = 0;
    switch (coupon.type) {
      case 'PERCENTAGE':
        discount = (subtotal * coupon.value) / 100;
        break;
      case 'FIXED':
        discount = coupon.value;
        break;
      case 'FREE_SHIPPING':
        discount = 0;
        break;
      default:
        return {
          valid: false,
          message: 'Unknown coupon type',
          discount: 0,
          coupon: null,
        };
    }

    if (coupon.type !== 'FREE_SHIPPING' && discount > subtotal) {
      discount = subtotal;
    }

    return {
      valid: true,
      message: 'Coupon applied successfully',
      discount,
      coupon,
    };
  }

  async applyCoupon(
    couponId: string,
    userId: string,
    orderId: string,
    discount: number,
  ) {
    await this.prisma.$transaction(async (tx) => {
      await tx.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } },
      });

      await tx.couponUsage.create({
        data: {
          couponId,
          userId,
          orderId,
          discount,
        },
      });
    });
  }

  async getCoupons(query: {
    page?: number;
    limit?: number;
    isActive?: boolean;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};
    if (query.isActive !== undefined) where.isActive = query.isActive;

    const [coupons, total] = await Promise.all([
      this.prisma.coupon.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.coupon.count({ where }),
    ]);
    return {
      coupons,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createCoupon(data: {
    code: string;
    type: string;
    value: number;
    minPurchase?: number;
    maxUses?: number;
    maxPerUser?: number;
    isActive?: boolean;
    startsAt?: string;
    expiresAt?: string;
  }) {
    return this.prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        type: data.type,
        value: data.value,
        minPurchase: data.minPurchase || 0,
        maxUses: data.maxUses,
        maxPerUser: data.maxPerUser || 1,
        isActive: data.isActive !== false,
        startsAt: data.startsAt ? new Date(data.startsAt) : undefined,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      },
    });
  }

  async updateCoupon(
    couponId: string,
    data: {
      code?: string;
      type?: string;
      value?: number;
      minPurchase?: number;
      maxUses?: number;
      maxPerUser?: number;
      isActive?: boolean;
      startsAt?: string;
      expiresAt?: string;
    },
  ) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id: couponId },
    });
    if (!coupon) throw new NotFoundException('Coupon not found');

    return this.prisma.coupon.update({
      where: { id: couponId },
      data: {
        code: data.code,
        type: data.type,
        value:
          data.value !== undefined ? parseFloat(String(data.value)) : undefined,
        minPurchase:
          data.minPurchase !== undefined
            ? parseFloat(String(data.minPurchase))
            : undefined,
        maxUses:
          data.maxUses !== undefined
            ? parseInt(String(data.maxUses))
            : undefined,
        maxPerUser:
          data.maxPerUser !== undefined
            ? parseInt(String(data.maxPerUser))
            : undefined,
        isActive: data.isActive,
        startsAt: data.startsAt ? new Date(data.startsAt) : undefined,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      },
    });
  }

  async deleteCoupon(couponId: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id: couponId },
    });
    if (!coupon) throw new NotFoundException('Coupon not found');
    await this.prisma.coupon.delete({ where: { id: couponId } });
    return { message: 'Coupon deleted', couponId };
  }
}
