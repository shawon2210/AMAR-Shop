import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';

@Injectable()
export class AdminSellerService {
  constructor(private prisma: PrismaService) {}

  async getSellers(query: {
    page?: number;
    limit?: number;
    search?: string;
    kycStatus?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = { isSeller: true };

    if (query.kycStatus === 'verified')
      where.sellerProfile = { isKycVerified: true };
    if (query.kycStatus === 'pending')
      where.sellerProfile = {
        isKycVerified: false,
        kycSubmittedAt: { not: null },
      };
    if (query.kycStatus === 'none') where.sellerProfile = null;

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' as const } },
        { phone: { contains: query.search } },
        {
          store: {
            name: { contains: query.search, mode: 'insensitive' as const },
          },
        },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          isActive: true,
          createdAt: true,
          store: {
            select: {
              id: true,
              name: true,
              slug: true,
              isActive: true,
              followerCount: true,
              rating: true,
            },
          },
          sellerProfile: {
            select: {
              id: true,
              isKycVerified: true,
              kycSubmittedAt: true,
              kycVerifiedAt: true,
              kycRejectedReason: true,
              level: true,
              performanceScore: true,
              totalOrders: true,
              totalRevenue: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      sellers: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async approveSeller(sellerId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: sellerId },
      include: { sellerProfile: true, store: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.sellerProfile)
      throw new BadRequestException('User has no seller profile');

    await this.prisma.sellerProfile.update({
      where: { userId: sellerId },
      data: {
        isKycVerified: true,
        kycVerifiedAt: new Date(),
        kycRejectedReason: null,
      },
    });

    if (user.store) {
      await this.prisma.store.update({
        where: { id: user.store.id },
        data: { isActive: true },
      });
    }

    return { message: 'Seller approved successfully', sellerId };
  }

  async rejectSeller(sellerId: string, reason: string) {
    if (!reason) throw new BadRequestException('Rejection reason is required');
    const user = await this.prisma.user.findUnique({
      where: { id: sellerId },
      include: { sellerProfile: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.sellerProfile)
      throw new BadRequestException('User has no seller profile');

    await this.prisma.sellerProfile.update({
      where: { userId: sellerId },
      data: { isKycVerified: false, kycRejectedReason: reason },
    });
    return { message: 'Seller rejected', sellerId, reason };
  }

  async updateSeller(sellerId: string, data: { commissionRate?: number }) {
    const user = await this.prisma.user.findUnique({
      where: { id: sellerId },
      include: { store: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (user.store && data.commissionRate !== undefined) {
      await this.prisma.store.update({
        where: { id: user.store.id },
        data: {
          commissionRate: data.commissionRate,
          commission: data.commissionRate,
        },
      });
    }
    return { message: 'Seller updated', sellerId };
  }

  async toggleStoreStatus(sellerId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: sellerId },
      include: { store: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.store) throw new BadRequestException('User has no store');

    const store = await this.prisma.store.update({
      where: { id: user.store.id },
      data: { isActive: !user.store.isActive },
    });
    return {
      message: `Store ${store.isActive ? 'activated' : 'suspended'}`,
      isActive: store.isActive,
    };
  }
}
