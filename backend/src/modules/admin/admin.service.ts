import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalUsers, totalSellers, totalProducts, totalOrders, revenueAgg, recentOrders, pendingSellers, lowStockProducts] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isSeller: true } }),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: true } }),
      this.prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, avatar: true } }, items: { take: 3, include: { product: { select: { name: true, images: true } } } } },
      }),
      this.prisma.sellerProfile.findMany({ where: { isKycVerified: false, kycSubmittedAt: { not: null } }, include: { user: { select: { id: true, name: true, phone: true, email: true } } } }),
      this.prisma.product.count({ where: { stockCount: { lte: 10 }, inStock: true } }),
    ]);

    const revenueData = await this.prisma.order.findMany({
      where: { paymentStatus: true, paidAt: { gte: thirtyDaysAgo } },
      select: { total: true, paidAt: true },
      orderBy: { paidAt: 'asc' },
    });

    const revenueChart: { date: string; revenue: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayRevenue = revenueData
        .filter((r) => r.paidAt && r.paidAt.toISOString().split('T')[0] === dateStr)
        .reduce((sum, r) => sum + r.total, 0);
      revenueChart.push({ date: dateStr, revenue: dayRevenue });
    }

    return {
      totalUsers,
      totalSellers,
      totalProducts,
      totalOrders,
      totalRevenue: revenueAgg._sum.total || 0,
      revenueChart,
      recentOrders,
      pendingSellerApprovals: pendingSellers,
      lowStockAlerts: lowStockProducts,
    };
  }

  async getUsers(query: { page?: number; limit?: number; search?: string; role?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' as const } },
        { phone: { contains: query.search } },
        { email: { contains: query.search, mode: 'insensitive' as const } },
      ];
    }
    if (query.role) where.role = query.role;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, phone: true, role: true, isSeller: true, isActive: true, isVerified: true, createdAt: true, lastLoginAt: true, avatar: true },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateUser(userId: string, data: { isActive?: boolean; role?: string; isVerified?: boolean }) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id: userId },
      data: data as any,
      select: { id: true, name: true, email: true, phone: true, role: true, isActive: true, isVerified: true },
    });
  }

  async getSellers(query: { page?: number; limit?: number; search?: string; kycStatus?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = { isSeller: true };

    if (query.kycStatus === 'verified') where.sellerProfile = { isKycVerified: true };
    if (query.kycStatus === 'pending') where.sellerProfile = { isKycVerified: false, kycSubmittedAt: { not: null } };
    if (query.kycStatus === 'none') where.sellerProfile = null;

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' as const } },
        { phone: { contains: query.search } },
        { store: { name: { contains: query.search, mode: 'insensitive' as const } } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, name: true, email: true, phone: true, isActive: true, createdAt: true,
          store: { select: { id: true, name: true, slug: true, isActive: true, followerCount: true, rating: true } },
          sellerProfile: { select: { id: true, isKycVerified: true, kycSubmittedAt: true, kycVerifiedAt: true, kycRejectedReason: true, level: true, performanceScore: true, totalOrders: true, totalRevenue: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { sellers: users, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async approveSeller(sellerId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: sellerId },
      include: { sellerProfile: true, store: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.sellerProfile) throw new BadRequestException('User has no seller profile');

    await this.prisma.sellerProfile.update({
      where: { userId: sellerId },
      data: { isKycVerified: true, kycVerifiedAt: new Date(), kycRejectedReason: null },
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
    if (!user.sellerProfile) throw new BadRequestException('User has no seller profile');

    await this.prisma.sellerProfile.update({
      where: { userId: sellerId },
      data: { isKycVerified: false, kycRejectedReason: reason },
    });

    return { message: 'Seller rejected', sellerId, reason };
  }

  async getProducts(query: { page?: number; limit?: number; status?: string; search?: string; category?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};

    if (query.status) where.status = query.status;
    if (query.category) where.categoryId = query.category;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' as const } },
        { description: { contains: query.search, mode: 'insensitive' as const } },
      ];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { id: true, name: true } },
          store: { select: { id: true, name: true } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { products, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async approveProduct(productId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    return this.prisma.product.update({
      where: { id: productId },
      data: { status: 'active' },
    });
  }

  async rejectProduct(productId: string, reason: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    return this.prisma.product.update({
      where: { id: productId },
      data: { status: 'rejected', rejectReason: reason },
    });
  }

  async getOrders(query: { page?: number; limit?: number; status?: string; from?: string; to?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};

    if (query.status) where.status = query.status;
    if (query.from || query.to) {
      const createdAt: Record<string, Date> = {};
      if (query.from) createdAt.gte = new Date(query.from);
      if (query.to) createdAt.lte = new Date(query.to);
      where.createdAt = createdAt;
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, phone: true } },
          items: { include: { product: { select: { id: true, name: true, images: true } } } },
          address: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getPayments(query: { page?: number; limit?: number; status?: string; from?: string; to?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};

    if (query.status) where.status = query.status;
    if (query.from || query.to) {
      const createdAt: Record<string, Date> = {};
      if (query.from) createdAt.gte = new Date(query.from);
      if (query.to) createdAt.lte = new Date(query.to);
      where.createdAt = createdAt;
    }

    const [payments, total] = await Promise.all([
      this.prisma.paymentTransaction.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { order: { select: { id: true, orderNumber: true } }, user: { select: { id: true, name: true } } },
      }),
      this.prisma.paymentTransaction.count({ where }),
    ]);

    return { payments, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getFlashSales() {
    return this.prisma.campaign.findMany({
      where: { type: 'FLASH_SALE' },
      orderBy: { createdAt: 'desc' },
      include: {
        store: { select: { id: true, name: true } },
        products: { include: { product: { select: { id: true, name: true, images: true, price: true } } } },
      },
    });
  }

  async createFlashSale(data: any) {
    return this.prisma.campaign.create({
      data: {
        title: data.title,
        slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 8),
        type: 'FLASH_SALE',
        description: data.description,
        banner: data.banner,
        status: data.status || 'DRAFT',
        startsAt: new Date(data.startsAt),
        endsAt: new Date(data.endsAt),
        discount: data.discount,
        maxProducts: data.maxProducts,
      },
    });
  }

  async getCategories() {
    return this.prisma.category.findMany({
      include: { _count: { select: { products: true } }, parent: { select: { id: true, name: true } } },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createCategory(data: any) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return this.prisma.category.create({
      data: {
        name: data.name,
        bnName: data.bnName,
        slug,
        icon: data.icon,
        description: data.description,
        image: data.image,
        parentId: data.parentId,
        sortOrder: data.sortOrder || 0,
      },
    });
  }

  async getBanners() {
    return this.prisma.banner.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async createBanner(data: any) {
    return this.prisma.banner.create({
      data: {
        title: data.title,
        image: data.image,
        link: data.link,
        position: data.position,
        sortOrder: data.sortOrder || 0,
        storeId: data.storeId,
      },
    });
  }

  async getCoupons(query: { page?: number; limit?: number; isActive?: boolean }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};
    if (query.isActive !== undefined) where.isActive = query.isActive;

    const [coupons, total] = await Promise.all([
      this.prisma.coupon.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.coupon.count({ where }),
    ]);

    return { coupons, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async createCoupon(data: any) {
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

  async getAnalytics() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [revenueData, orderData, userData, topCategories, topSellers] = await Promise.all([
      this.prisma.order.findMany({ where: { paymentStatus: true, paidAt: { gte: thirtyDaysAgo } }, select: { total: true, paidAt: true } }),
      this.prisma.order.groupBy({ by: ['status'], _count: { id: true } }),
      this.prisma.user.groupBy({ by: ['role'], _count: { id: true } }),
      this.prisma.product.groupBy({ by: ['categoryId'], _count: { id: true }, _sum: { soldCount: true }, orderBy: { _sum: { soldCount: 'desc' } }, take: 10 }),
      this.prisma.store.findMany({ orderBy: { rating: 'desc' }, take: 10, select: { id: true, name: true, followerCount: true, rating: true, _count: { select: { products: true } } } }),
    ]);

    const revenueChart: { date: string; revenue: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayRevenue = revenueData.filter((r) => r.paidAt && r.paidAt.toISOString().split('T')[0] === dateStr).reduce((sum, r) => sum + r.total, 0);
      revenueChart.push({ date: dateStr, revenue: dayRevenue });
    }

    const topCategoriesWithNames = await Promise.all(
      topCategories.map(async (c) => {
        const cat = await this.prisma.category.findUnique({ where: { id: c.categoryId } });
        return { categoryId: c.categoryId, categoryName: cat?.name || 'Unknown', productCount: c._count.id, totalSold: c._sum.soldCount || 0 };
      }),
    );

    return { revenueChart, orderStats: orderData, userStats: userData, topCategories: topCategoriesWithNames, topSellers };
  }

  async getReports(type: string, query: { from?: string; to?: string }) {
    const from = query.from ? new Date(query.from) : new Date(0);
    const to = query.to ? new Date(query.to) : new Date();

    if (type === 'sales') {
      const orders = await this.prisma.order.findMany({
        where: { createdAt: { gte: from, lte: to } },
        include: { items: true },
      });
      const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
      const totalOrders = orders.length;
      const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

      return { totalSales, totalOrders, avgOrderValue, orders, period: { from, to } };
    }

    if (type === 'sellers') {
      const sellers = await this.prisma.user.findMany({
        where: { isSeller: true, createdAt: { gte: from, lte: to } },
        include: { store: { select: { id: true, name: true, followerCount: true, rating: true, _count: { select: { products: true } } } }, sellerProfile: { select: { totalOrders: true, totalRevenue: true, performanceScore: true } } },
      });

      return { totalSellers: sellers.length, sellers, period: { from, to } };
    }

    if (type === 'products') {
      const products = await this.prisma.product.findMany({
        where: { createdAt: { gte: from, lte: to } },
        orderBy: { soldCount: 'desc' },
        include: { category: { select: { id: true, name: true } }, store: { select: { id: true, name: true } } },
      });

      const totalProducts = products.length;
      const totalSold = products.reduce((sum, p) => sum + p.soldCount, 0);

      return { totalProducts, totalSold, products, period: { from, to } };
    }

    throw new BadRequestException('Invalid report type. Use: sales, sellers, products');
  }

  async updateSettings(data: any) {
    const results: Record<string, unknown> = {};
    if (data.commissionRate !== undefined) {
      await this.prisma.store.updateMany({ data: { commission: data.commissionRate, commissionRate: data.commissionRate } });
      results.commissionRate = data.commissionRate;
    }
    return { message: 'Settings updated', ...results };
  }

  async getSupportTickets(query: { page?: number; limit?: number; status?: string; priority?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};

    if (query.status) where.status = query.status;
    if (query.priority) where.priority = query.priority;

    const [tickets, total] = await Promise.all([
      this.prisma.supportTicket.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, phone: true, avatar: true } } },
      }),
      this.prisma.supportTicket.count({ where }),
    ]);

    return { tickets, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
