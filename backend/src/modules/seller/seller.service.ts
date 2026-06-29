import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const suffix = Math.random().toString(36).substring(2, 8);
  return `${base}-${suffix}`;
}

@Injectable()
export class SellerService {
  constructor(private prisma: PrismaService) {}

  private async getStore(sellerId: string) {
    const store = await this.prisma.store.findUnique({
      where: { userId: sellerId },
    });
    if (!store)
      throw new NotFoundException('Store not found. Create a store first.');
    return store;
  }

  async getDashboard(sellerId: string) {
    const store = await this.getStore(sellerId);
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalProducts,
      orderStats,
      recentOrders,
      revenueData,
      sellerProfile,
    ] = await Promise.all([
      this.prisma.product.count({ where: { storeId: store.id } }),
      this.prisma.orderItem.aggregate({
        where: { product: { storeId: store.id } },
        _count: { id: true },
        _sum: { price: true },
      }),
      this.prisma.order.findMany({
        where: { items: { some: { product: { storeId: store.id } } } },
        include: {
          items: {
            where: { product: { storeId: store.id } },
            include: {
              product: { select: { id: true, name: true, images: true } },
            },
          },
          user: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.orderItem.findMany({
        where: {
          product: { storeId: store.id },
          createdAt: { gte: thirtyDaysAgo },
        },
        select: { price: true, quantity: true, createdAt: true },
      }),
      this.prisma.sellerProfile.findUnique({
        where: { userId: sellerId },
        select: {
          id: true,
          totalOrders: true,
          totalRevenue: true,
          totalProducts: true,
          totalFollowers: true,
          avgRating: true,
          performanceScore: true,
          responseRate: true,
          level: true,
          onVacation: true,
          isKycVerified: true,
        },
      }),
    ]);

    const revenueChart: { date: string; revenue: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayRevenue = revenueData
        .filter(
          (item) => item.createdAt.toISOString().split('T')[0] === dateStr,
        )
        .reduce((sum, item) => sum + item.price * item.quantity, 0);
      revenueChart.push({ date: dateStr, revenue: dayRevenue });
    }

    return {
      totalProducts,
      totalOrders: orderStats._count.id,
      totalRevenue: orderStats._sum.price || 0,
      totalFollowers: store.followerCount,
      avgRating: store.rating,
      recentOrders,
      revenueChart,
      sellerProfile,
    };
  }

  async getProducts(
    sellerId: string,
    query: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
      category?: string;
    },
  ) {
    const store = await this.getStore(sellerId);
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { storeId: store.id };
    if (query.status) where.status = query.status;
    if (query.category) where.categoryId = query.category;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' as const } },
        {
          description: { contains: query.search, mode: 'insensitive' as const },
        },
      ];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          _count: { select: { orderItems: true, reviews: true } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createProduct(sellerId: string, data: any) {
    const store = await this.getStore(sellerId);

    const category = await this.prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) throw new BadRequestException('Category not found');

    const slug = generateSlug(data.name);

    const product = await this.prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        shortDescription: data.shortDescription,
        price: data.price,
        originalPrice: data.originalPrice,
        images: data.images || [],
        stockCount: data.stockCount || 0,
        weight: data.weight,
        categoryId: data.categoryId,
        storeId: store.id,
        status: 'pending',
        minOrderQty: data.minOrderQty || 1,
        maxOrderQty: data.maxOrderQty,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
      },
      include: {
        category: { select: { id: true, name: true } },
      },
    });

    await this.prisma.store.update({
      where: { id: store.id },
      data: { sellerProfile: { update: { totalProducts: { increment: 1 } } } },
    });

    return product;
  }

  async updateProduct(productId: string, sellerId: string, data: any) {
    const store = await this.getStore(sellerId);
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');
    if (product.storeId !== store.id)
      throw new ForbiddenException('Not your product');

    if (data.name) {
      data.slug = generateSlug(data.name);
    }

    return this.prisma.product.update({
      where: { id: productId },
      data,
      include: { category: { select: { id: true, name: true } } },
    });
  }

  async deleteProduct(productId: string, sellerId: string) {
    const store = await this.getStore(sellerId);
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');
    if (product.storeId !== store.id)
      throw new ForbiddenException('Not your product');

    await this.prisma.product.delete({ where: { id: productId } });

    await this.prisma.store.update({
      where: { id: store.id },
      data: { sellerProfile: { update: { totalProducts: { decrement: 1 } } } },
    });

    return { message: 'Product deleted successfully' };
  }

  async getOrders(
    sellerId: string,
    query: { page?: number; limit?: number; status?: string; search?: string },
  ) {
    const store = await this.getStore(sellerId);
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      items: { some: { product: { storeId: store.id } } },
    };
    if (query.status) where.status = query.status;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            where: { product: { storeId: store.id } },
            include: {
              product: {
                select: { id: true, name: true, images: true, price: true },
              },
            },
          },
          user: { select: { id: true, name: true, phone: true } },
          address: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateOrderStatus(
    orderItemId: string,
    sellerId: string,
    status: string,
  ) {
    const store = await this.getStore(sellerId);
    const orderItem = await this.prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: { product: true, order: true },
    });
    if (!orderItem) throw new NotFoundException('Order item not found');
    if (orderItem.product.storeId !== store.id)
      throw new ForbiddenException('Not your product');

    return this.prisma.order.update({
      where: { id: orderItem.orderId },
      data: { status: status as any },
    });
  }

  async getInventory(
    sellerId: string,
    query: { page?: number; limit?: number; lowStock?: boolean },
  ) {
    const store = await this.getStore(sellerId);
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { storeId: store.id };
    if (query.lowStock) {
      where.stockCount = { lte: 10 };
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          stockCount: true,
          soldCount: true,
          price: true,
          images: true,
          status: true,
          updatedAt: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const lowStockCount = await this.prisma.product.count({
      where: { storeId: store.id, stockCount: { lte: 10 } },
    });

    return {
      products,
      total,
      lowStockCount,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAnalytics(
    sellerId: string,
    dateRange?: { from?: string; to?: string },
  ) {
    const store = await this.getStore(sellerId);
    const now = new Date();
    const from = dateRange?.from
      ? new Date(dateRange.from)
      : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const to = dateRange?.to ? new Date(dateRange.to) : now;

    const [salesData, topProducts, categoryBreakdown, totalViews] =
      await Promise.all([
        this.prisma.orderItem.findMany({
          where: {
            product: { storeId: store.id },
            createdAt: { gte: from, lte: to },
          },
          select: { price: true, quantity: true, createdAt: true },
          orderBy: { createdAt: 'asc' },
        }),
        this.prisma.product.findMany({
          where: { storeId: store.id },
          orderBy: { soldCount: 'desc' },
          take: 10,
          select: {
            id: true,
            name: true,
            slug: true,
            soldCount: true,
            price: true,
            stockCount: true,
            images: true,
          },
        }),
        this.prisma.product.groupBy({
          by: ['categoryId'],
          where: { storeId: store.id },
          _count: { id: true },
          _sum: { soldCount: true },
        }),
        this.prisma.browsingHistory.count({
          where: {
            product: { storeId: store.id },
            createdAt: { gte: from, lte: to },
          },
        }),
      ]);

    const salesChart: { date: string; sales: number; revenue: number }[] = [];
    const dayMap = new Map<string, { sales: number; revenue: number }>();
    for (const item of salesData) {
      const dateStr = item.createdAt.toISOString().split('T')[0];
      const existing = dayMap.get(dateStr) || { sales: 0, revenue: 0 };
      existing.sales += item.quantity;
      existing.revenue += item.price * item.quantity;
      dayMap.set(dateStr, existing);
    }
    for (
      let i = 0;
      i <= Math.ceil((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000));
      i++
    ) {
      const date = new Date(from.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const day = dayMap.get(dateStr) || { sales: 0, revenue: 0 };
      salesChart.push({ date: dateStr, ...day });
    }

    const categoriesWithNames = await Promise.all(
      categoryBreakdown.map(async (c) => {
        const cat = await this.prisma.category.findUnique({
          where: { id: c.categoryId },
        });
        return {
          categoryId: c.categoryId,
          categoryName: cat?.name || 'Unknown',
          productCount: c._count.id,
          totalSold: c._sum.soldCount || 0,
        };
      }),
    );

    const totalOrders = salesData.reduce((sum, d) => sum + d.quantity, 0);
    const conversion =
      totalViews > 0
        ? Number(((totalOrders / totalViews) * 100).toFixed(2))
        : 0;

    return {
      salesChart,
      topProducts,
      categoryBreakdown: categoriesWithNames,
      totalViews,
      totalOrders,
      conversion,
    };
  }

  async getFinance(sellerId: string) {
    const store = await this.getStore(sellerId);
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: sellerId },
    });

    const [pendingPayouts, commissions, sellerPayouts] = await Promise.all([
      this.prisma.sellerPayout.findMany({
        where: { sellerId: store.id, status: 'PENDING' },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.commission.findMany({
        where: { sellerId: store.id },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      this.prisma.sellerPayout.findMany({
        where: { sellerId: store.id },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ]);

    const totalCommission = commissions.reduce((sum, c) => sum + c.amount, 0);

    return {
      wallet: wallet
        ? {
            balance: wallet.balance,
            totalEarned: wallet.totalEarned,
            totalSpent: wallet.totalSpent,
          }
        : { balance: 0, totalEarned: 0, totalSpent: 0 },
      pendingPayouts: pendingPayouts.reduce((sum, p) => sum + p.netAmount, 0),
      pendingPayoutsCount: pendingPayouts.length,
      commissions: { total: totalCommission, items: commissions },
      payoutHistory: sellerPayouts,
    };
  }

  async getStoreProfile(sellerId: string) {
    const store = await this.getStore(sellerId);
    const sellerProfile = await this.prisma.sellerProfile.findUnique({
      where: { userId: sellerId },
      select: {
        id: true,
        businessName: true,
        businessAddress: true,
        businessType: true,
        isKycVerified: true,
        level: true,
        performanceScore: true,
        totalOrders: true,
        totalRevenue: true,
        totalProducts: true,
        totalFollowers: true,
        avgRating: true,
        onVacation: true,
        vacationMessage: true,
        vacationUntil: true,
      },
    });

    return { store, sellerProfile };
  }

  async updateStore(sellerId: string, data: any) {
    const store = await this.getStore(sellerId);
    const storeData: Record<string, unknown> = {};
    if (data.name !== undefined) storeData.name = data.name;
    if (data.description !== undefined)
      storeData.description = data.description;
    if (data.logo !== undefined) storeData.logo = data.logo;
    if (data.banner !== undefined) storeData.banner = data.banner;

    if (Object.keys(storeData).length > 0) {
      await this.prisma.store.update({
        where: { id: store.id },
        data: storeData,
      });
    }

    if (
      data.vacationMode !== undefined ||
      data.vacationMessage !== undefined ||
      data.vacationUntil !== undefined
    ) {
      const profileData: Record<string, unknown> = {};
      if (data.vacationMode !== undefined)
        profileData.onVacation = data.vacationMode;
      if (data.vacationMessage !== undefined)
        profileData.vacationMessage = data.vacationMessage;
      if (data.vacationUntil !== undefined)
        profileData.vacationUntil = new Date(data.vacationUntil);

      await this.prisma.sellerProfile.update({
        where: { userId: sellerId },
        data: profileData,
      });
    }

    return this.getStoreProfile(sellerId);
  }

  async getKycStatus(userId: string) {
    const profile = await this.prisma.sellerProfile.findUnique({
      where: { userId },
      select: {
        id: true,
        isKycVerified: true,
        kycSubmittedAt: true,
        kycVerifiedAt: true,
        kycRejectedReason: true,
        businessName: true,
        businessType: true,
        nidNumber: true,
        nidImageFront: true,
        nidImageBack: true,
        bankName: true,
        bankAccountName: true,
        bankAccountNumber: true,
        bkashNumber: true,
        nagadNumber: true,
      },
    });

    if (!profile) {
      return {
        isKycVerified: false,
        kycSubmitted: false,
        message: 'No KYC data found. Please complete your seller profile.',
      };
    }

    return {
      isKycVerified: profile.isKycVerified,
      kycSubmitted: !!profile.kycSubmittedAt,
      kycSubmittedAt: profile.kycSubmittedAt,
      kycVerifiedAt: profile.kycVerifiedAt,
      kycRejectedReason: profile.kycRejectedReason,
      businessInfo: {
        businessName: profile.businessName,
        businessType: profile.businessType,
      },
      documents: {
        nidProvided: !!profile.nidNumber,
        bankProvided: !!profile.bankAccountNumber,
        bkashProvided: !!profile.bkashNumber,
        nagadProvided: !!profile.nagadNumber,
      },
    };
  }
}
