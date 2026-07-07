import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';

@Injectable()
export class AdminDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalSellers,
      totalProducts,
      totalOrders,
      revenueAgg,
      recentOrders,
      pendingSellers,
      lowStockProducts,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isSeller: true } }),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: true },
      }),
      this.prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, avatar: true } },
          items: {
            take: 3,
            include: { product: { select: { name: true, images: true } } },
          },
        },
      }),
      this.prisma.sellerProfile.findMany({
        where: { isKycVerified: false, kycSubmittedAt: { not: null } },
        include: {
          user: { select: { id: true, name: true, phone: true, email: true } },
        },
      }),
      this.prisma.product.count({
        where: { stockCount: { lte: 10 }, inStock: true },
      }),
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

  async getAnalytics() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [revenueData, orderData, userData, topCategories, topSellers] =
      await Promise.all([
        this.prisma.order.findMany({
          where: { paymentStatus: true, paidAt: { gte: thirtyDaysAgo } },
          select: { total: true, paidAt: true },
        }),
        this.prisma.order.groupBy({ by: ['status'], _count: { id: true } }),
        this.prisma.user.groupBy({ by: ['role'], _count: { id: true } }),
        this.prisma.product.groupBy({
          by: ['categoryId'],
          _count: { id: true },
          _sum: { soldCount: true },
          orderBy: { _sum: { soldCount: 'desc' } },
          take: 10,
        }),
        this.prisma.store.findMany({
          orderBy: { rating: 'desc' },
          take: 10,
          select: {
            id: true,
            name: true,
            followerCount: true,
            rating: true,
            _count: { select: { products: true } },
          },
        }),
      ]);

    const revenueChart: { date: string; revenue: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayRevenue = revenueData
        .filter((r) => r.paidAt && r.paidAt.toISOString().split('T')[0] === dateStr)
        .reduce((sum, r) => sum + r.total, 0);
      revenueChart.push({ date: dateStr, revenue: dayRevenue });
    }

    const topCategoriesWithNames = await Promise.all(
      topCategories.map(async (c) => {
        const cat = await this.prisma.category.findUnique({ where: { id: c.categoryId } });
        return {
          categoryId: c.categoryId,
          categoryName: cat?.name || 'Unknown',
          productCount: c._count.id,
          totalSold: c._sum.soldCount || 0,
        };
      }),
    );

    return {
      revenueChart,
      orderStats: orderData,
      userStats: userData,
      topCategories: topCategoriesWithNames,
      topSellers,
    };
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
        include: {
          store: {
            select: { id: true, name: true, followerCount: true, rating: true, _count: { select: { products: true } } },
          },
          sellerProfile: { select: { totalOrders: true, totalRevenue: true, performanceScore: true } },
        },
      });
      return { totalSellers: sellers.length, sellers, period: { from, to } };
    }

    if (type === 'products') {
      const products = await this.prisma.product.findMany({
        where: { createdAt: { gte: from, lte: to } },
        orderBy: { soldCount: 'desc' },
        include: {
          category: { select: { id: true, name: true } },
          store: { select: { id: true, name: true } },
        },
      });
      const totalProducts = products.length;
      const totalSold = products.reduce((sum, p) => sum + p.soldCount, 0);
      return { totalProducts, totalSold, products, period: { from, to } };
    }

    throw new BadRequestException('Invalid report type. Use: sales, sellers, products');
  }

  async updateSettings(commissionRate?: number) {
    if (commissionRate !== undefined) {
      await this.prisma.store.updateMany({
        data: { commission: commissionRate, commissionRate },
      });
      return { message: 'Settings updated', commissionRate };
    }
    return { message: 'Settings updated' };
  }

  async getComplianceDashboard() {
    const [
      totalFlaggedReviews,
      totalDisputedOrders,
      pendingKycApprovals,
      reportedProducts,
    ] = await Promise.all([
      this.prisma.review.count({ where: { reported: true } }),
      this.prisma.dispute.count(),
      this.prisma.sellerProfile.count({
        where: { isKycVerified: false, kycSubmittedAt: { not: null } },
      }),
      this.prisma.product.count({ where: { status: 'reported' } }),
    ]);

    return {
      totalFlaggedReviews,
      totalDisputedOrders,
      pendingKycApprovals,
      reportedProducts,
    };
  }
}
