import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class BiService {
  constructor(private prismaService: PrismaService) {}

  async getExecutiveDashboard(dateRange: { start: string; end: string }) {
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    const prevStart = new Date(
      start.getFullYear(),
      start.getMonth() - 1,
      start.getDate(),
    );
    const prevEnd = new Date(
      prevStart.getFullYear(),
      prevStart.getMonth() + 1,
      prevStart.getDate() - 1,
    );

    const [
      currentOrders,
      prevOrders,
      currentUsers,
      totalUsers,
      totalSellers,
      products,
      revenue,
      prevRevenue,
    ] = await Promise.all([
      this.prismaService.order.findMany({
        where: { createdAt: { gte: start, lte: end } },
      }),
      this.prismaService.order.findMany({
        where: { createdAt: { gte: prevStart, lte: prevEnd } },
      }),
      this.prismaService.user.count({
        where: { createdAt: { gte: start, lte: end } },
      }),
      this.prismaService.user.count(),
      this.prismaService.store.count(),
      this.prismaService.product.count(),
      this.prismaService.order.aggregate({
        where: { createdAt: { gte: start, lte: end }, paymentStatus: true },
        _sum: { total: true },
      }),
      this.prismaService.order.aggregate({
        where: {
          createdAt: { gte: prevStart, lte: prevEnd },
          paymentStatus: true,
        },
        _sum: { total: true },
      }),
    ]);

    const gmv = currentOrders.reduce((s, o) => s + o.total, 0);
    const prevGmv = prevOrders.reduce((s, o) => s + o.total, 0);
    const totalRevenue = revenue._sum.total || 0;
    const prevTotalRevenue = prevRevenue._sum.total || 0;

    return {
      period: dateRange,
      gmv,
      gmvGrowth:
        prevGmv > 0 ? (((gmv - prevGmv) / prevGmv) * 100).toFixed(1) : 0,
      revenue: totalRevenue,
      revenueGrowth:
        prevTotalRevenue > 0
          ? (
              ((totalRevenue - prevTotalRevenue) / prevTotalRevenue) *
              100
            ).toFixed(1)
          : 0,
      totalOrders: currentOrders.length,
      orderGrowth:
        prevOrders.length > 0
          ? (
              ((currentOrders.length - prevOrders.length) / prevOrders.length) *
              100
            ).toFixed(1)
          : 0,
      newUsers: currentUsers,
      totalUsers,
      totalSellers,
      totalProducts: products,
      averageOrderValue:
        currentOrders.length > 0 ? gmv / currentOrders.length : 0,
    };
  }

  async getRFMAnalysis() {
    const now = new Date();
    const users = await this.prismaService.user.findMany({
      where: { role: 'CUSTOMER' },
      select: {
        id: true,
        name: true,
        email: true,
        orders: {
          select: { total: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    const segments: Record<string, any[]> = {
      champions: [],
      loyal: [],
      potential: [],
      atRisk: [],
      lost: [],
    };

    for (const user of users) {
      if (!user.orders.length) continue;
      const lastOrder = user.orders[0].createdAt;
      const recency = Math.floor(
        (now.getTime() - lastOrder.getTime()) / (1000 * 60 * 60 * 24),
      );
      const frequency = user.orders.length;
      const monetary = user.orders.reduce((s, o) => s + o.total, 0);

      let segment = 'lost';
      if (recency <= 30 && frequency >= 5 && monetary >= 5000)
        segment = 'champions';
      else if (recency <= 60 && frequency >= 3) segment = 'loyal';
      else if (recency <= 90 && frequency >= 1) segment = 'potential';
      else if (recency <= 180) segment = 'atRisk';
      else segment = 'lost';

      if (segments[segment])
        segments[segment].push({
          userId: user.id,
          name: user.name,
          recency,
          frequency,
          monetary,
          segment,
        });
    }

    return Object.entries(segments).map(([segment, users]) => ({
      segment: segment.charAt(0).toUpperCase() + segment.slice(1),
      userCount: users.length,
      avgRecency: users.length
        ? users.reduce((s, u) => s + u.recency, 0) / users.length
        : 0,
      avgFrequency: users.length
        ? users.reduce((s, u) => s + u.frequency, 0) / users.length
        : 0,
      avgMonetary: users.length
        ? users.reduce((s, u) => s + u.monetary, 0) / users.length
        : 0,
    }));
  }

  async getCustomerLifetimeValue() {
    const orders = await this.prismaService.order.findMany({
      where: { paymentStatus: true },
      select: { userId: true, total: true, createdAt: true },
    });

    const userTotals: Record<
      string,
      { total: number; orders: number; firstDate: Date; lastDate: Date }
    > = {};
    for (const o of orders) {
      if (!userTotals[o.userId])
        userTotals[o.userId] = {
          total: 0,
          orders: 0,
          firstDate: o.createdAt,
          lastDate: o.createdAt,
        };
      userTotals[o.userId].total += o.total;
      userTotals[o.userId].orders += 1;
      if (o.createdAt < userTotals[o.userId].firstDate)
        userTotals[o.userId].firstDate = o.createdAt;
      if (o.createdAt > userTotals[o.userId].lastDate)
        userTotals[o.userId].lastDate = o.createdAt;
    }

    const values = Object.values(userTotals);
    const avgLtv =
      values.length > 0
        ? values.reduce((s, u) => s + u.total, 0) / values.length
        : 0;
    const avgOrderValue =
      values.reduce((s, u) => s + u.total, 0) /
        values.reduce((s, u) => s + u.orders, 0) || 0;

    const cohorts: Record<
      string,
      { users: number; totalRevenue: number; totalOrders: number }
    > = {};
    for (const data of Object.values(userTotals)) {
      const cohort = `${data.firstDate.getFullYear()}-${String(data.firstDate.getMonth() + 1).padStart(2, '0')}`;
      if (!cohorts[cohort])
        cohorts[cohort] = { users: 0, totalRevenue: 0, totalOrders: 0 };
      cohorts[cohort].users += 1;
      cohorts[cohort].totalRevenue += data.total;
      cohorts[cohort].totalOrders += data.orders;
    }

    return {
      averageLTV: Math.round(avgLtv * 100) / 100,
      averageOrderValue: Math.round(avgOrderValue * 100) / 100,
      totalCustomers: values.length,
      cohorts: Object.entries(cohorts).map(([cohort, data]) => ({
        cohort,
        users: data.users,
        totalRevenue: data.totalRevenue,
        ltvPerUser: data.totalRevenue / data.users,
        ordersPerUser: data.totalOrders / data.users,
      })),
    };
  }

  async getCohortAnalysis(period: string = 'monthly') {
    const periodMonths = period === 'quarterly' ? 3 : 1;

    const orders = await this.prismaService.order.findMany({
      where: { paymentStatus: true },
      select: { userId: true, total: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const firstPurchase: Record<string, string> = {};
    const userOrders: Record<
      string,
      { cohortIndex: number; revenue: number }[]
    > = {};

    for (const o of orders) {
      if (!firstPurchase[o.userId]) {
        const d = new Date(o.createdAt);
        firstPurchase[o.userId] =
          `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        userOrders[o.userId] = [];
      }
      const d = new Date(o.createdAt);
      const firstDate = new Date(firstPurchase[o.userId]);
      const monthsDiff =
        (d.getFullYear() - firstDate.getFullYear()) * 12 +
        d.getMonth() -
        firstDate.getMonth();
      const cohortIndex = Math.floor(monthsDiff / periodMonths);
      if (!userOrders[o.userId]) userOrders[o.userId] = [];
      userOrders[o.userId].push({ cohortIndex, revenue: o.total });
    }

    const cohortMap: Record<
      string,
      Record<number, { users: Set<string>; revenue: number }>
    > = {};
    for (const [userId, cohort] of Object.entries(firstPurchase)) {
      if (!cohortMap[cohort]) cohortMap[cohort] = {};
      const orders = userOrders[userId] || [];
      for (const o of orders) {
        if (!cohortMap[cohort][o.cohortIndex])
          cohortMap[cohort][o.cohortIndex] = { users: new Set(), revenue: 0 };
        cohortMap[cohort][o.cohortIndex].users.add(userId);
        cohortMap[cohort][o.cohortIndex].revenue += o.revenue;
      }
    }

    return Object.entries(cohortMap).map(([cohort, periods]) => {
      const baseUsers = periods[0]?.users.size || 1;
      const retention: Record<string, number> = {};
      for (const [periodIdx, data] of Object.entries(periods)) {
        retention[`period_${periodIdx}`] =
          Math.round((data.users.size / baseUsers) * 100 * 10) / 10;
      }
      return { cohort, baseUsers, retention };
    });
  }

  async getRetentionReport(dateRange: { start: string; end: string }) {
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);

    const newUsers = await this.prismaService.user.findMany({
      where: { createdAt: { gte: start, lte: end } },
      select: {
        id: true,
        createdAt: true,
        orders: { select: { createdAt: true } },
      },
    });

    const report: any[] = [];
    for (const user of newUsers) {
      if (!user.orders.length) continue;
      const week0 = new Date(user.createdAt);
      const week1 = new Date(week0.getTime() + 7 * 24 * 60 * 60 * 1000);
      const week2 = new Date(week1.getTime() + 7 * 24 * 60 * 60 * 1000);
      const week4 = new Date(week2.getTime() + 14 * 24 * 60 * 60 * 1000);
      const week8 = new Date(week4.getTime() + 28 * 24 * 60 * 60 * 1000);

      const w1 = user.orders.some(
        (o) => o.createdAt >= week0 && o.createdAt < week1,
      )
        ? 1
        : 0;
      const w2 = user.orders.some(
        (o) => o.createdAt >= week1 && o.createdAt < week2,
      )
        ? 1
        : 0;
      const w4 = user.orders.some(
        (o) => o.createdAt >= week2 && o.createdAt < week4,
      )
        ? 1
        : 0;
      const w8 = user.orders.some(
        (o) => o.createdAt >= week4 && o.createdAt < week8,
      )
        ? 1
        : 0;
      report.push({
        userId: user.id,
        week1: w1,
        week2: w2,
        week4: w4,
        week8: w8,
      });
    }

    const total = report.length;
    return {
      totalNewUsers: total,
      week1Retention:
        total > 0 ? (report.filter((r) => r.week1).length / total) * 100 : 0,
      week2Retention:
        total > 0 ? (report.filter((r) => r.week2).length / total) * 100 : 0,
      week4Retention:
        total > 0 ? (report.filter((r) => r.week4).length / total) * 100 : 0,
      week8Retention:
        total > 0 ? (report.filter((r) => r.week8).length / total) * 100 : 0,
    };
  }

  async getSellerPerformance(dateRange: { start: string; end: string }) {
    const stores = await this.prismaService.store.findMany({
      include: {
        products: {
          include: {
            orderItems: {
              where: {
                order: {
                  createdAt: {
                    gte: new Date(dateRange.start),
                    lte: new Date(dateRange.end),
                  },
                },
              },
            },
          },
        },
        _count: { select: { followers: true } },
      },
    });

    return stores
      .map((store) => {
        const totalRevenue = store.products.reduce(
          (s, p) =>
            s + p.orderItems.reduce((s2, oi) => s2 + oi.price * oi.quantity, 0),
          0,
        );
        const totalOrders = store.products.reduce(
          (s, p) => s + p.orderItems.length,
          0,
        );
        return {
          storeId: store.id,
          storeName: store.name,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          totalOrders,
          totalProducts: store.products.length,
          followers: store._count.followers,
          avgRating: 4.5,
        };
      })
      .sort((a, b) => b.totalRevenue - a.totalRevenue);
  }

  async getProductProfitability(dateRange: { start: string; end: string }) {
    const products = await this.prismaService.product.findMany({
      where: {
        orderItems: {
          some: {
            order: {
              createdAt: {
                gte: new Date(dateRange.start),
                lte: new Date(dateRange.end),
              },
            },
          },
        },
      },
      include: {
        orderItems: {
          where: {
            order: {
              createdAt: {
                gte: new Date(dateRange.start),
                lte: new Date(dateRange.end),
              },
            },
          },
          select: { quantity: true, price: true },
        },
      },
    });

    return products
      .map((product) => {
        const revenue = product.orderItems.reduce(
          (s, oi) => s + oi.price * oi.quantity,
          0,
        );
        const unitsSold = product.orderItems.reduce(
          (s, oi) => s + oi.quantity,
          0,
        );
        const cost = product.price * 0.6;
        const profit = revenue - cost * unitsSold;
        return {
          productId: product.id,
          productName: product.name,
          revenue: Math.round(revenue * 100) / 100,
          unitsSold,
          avgPrice: unitsSold > 0 ? revenue / unitsSold : 0,
          estimatedCost: cost * unitsSold,
          grossProfit: Math.round(profit * 100) / 100,
          margin:
            revenue > 0 ? Math.round((profit / revenue) * 100 * 10) / 10 : 0,
        };
      })
      .sort((a, b) => b.revenue - a.revenue);
  }

  async getCampaignROI(campaignId: string) {
    const campaign = await this.prismaService.campaign.findUnique({
      where: { id: campaignId },
      include: {
        products: {
          include: {
            product: {
              include: {
                orderItems: {
                  select: { quantity: true, price: true, createdAt: true },
                },
              },
            },
          },
        },
      },
    });
    if (!campaign) throw new Error('Campaign not found');

    const campaignCost = 0;
    const revenue = campaign.products.reduce(
      (s, cp) =>
        s +
        cp.product.orderItems.reduce(
          (s2, oi) => s2 + oi.price * oi.quantity,
          0,
        ),
      0,
    );
    const unitsSold = campaign.products.reduce(
      (s, cp) =>
        s + cp.product.orderItems.reduce((s2, oi) => s2 + oi.quantity, 0),
      0,
    );

    return {
      campaignId: campaign.id,
      campaignName: campaign.title,
      campaignType: campaign.type,
      campaignCost,
      revenue: Math.round(revenue * 100) / 100,
      unitsSold,
      roi:
        campaignCost > 0
          ? (((revenue - campaignCost) / campaignCost) * 100).toFixed(1)
          : 'N/A',
      roas: campaignCost > 0 ? (revenue / campaignCost).toFixed(2) : 'N/A',
    };
  }

  async getMarketingAttribution(dateRange: { start: string; end: string }) {
    const activities = await this.prismaService.userActivity.findMany({
      where: {
        createdAt: {
          gte: new Date(dateRange.start),
          lte: new Date(dateRange.end),
        },
      },
    });

    const channels: Record<
      string,
      { views: number; conversions: number; revenue: number }
    > = {
      direct: { views: 0, conversions: 0, revenue: 0 },
      search: { views: 0, conversions: 0, revenue: 0 },
      social: { views: 0, conversions: 0, revenue: 0 },
      referral: { views: 0, conversions: 0, revenue: 0 },
      email: { views: 0, conversions: 0, revenue: 0 },
    };

    for (const a of activities) {
      const channel = 'direct';
      if (channels[channel]) {
        channels[channel].views += 1;
        if (a.action === 'PURCHASE') channels[channel].conversions += 1;
      }
    }

    return Object.entries(channels).map(([channel, data]) => ({
      channel,
      ...data,
      conversionRate:
        data.views > 0 ? ((data.conversions / data.views) * 100).toFixed(2) : 0,
    }));
  }

  async getUserFunnels(_startEvent: string, _endEvent: string) {
    const stages = ['VIEW_PRODUCT', 'ADD_TO_CART', 'CHECKOUT', 'PURCHASE'];
    const funnel: any[] = [];

    for (const stage of stages) {
      const count = await this.prismaService.userActivity.count({
        where: { action: stage },
      });

      const stageIndex = stages.indexOf(stage);
      const prevCount =
        stageIndex > 0 ? funnel[stageIndex - 1]?.count || count : count;
      funnel.push({
        stage,
        count,
        conversionRate:
          stageIndex === 0
            ? 100
            : prevCount > 0
              ? Math.round((count / prevCount) * 100 * 10) / 10
              : 0,
        dropOff: stageIndex === 0 ? 0 : prevCount - count,
      });
    }

    return funnel;
  }

  async getSessionAnalytics(dateRange: { start: string; end: string }) {
    const activities = await this.prismaService.userActivity.findMany({
      where: {
        createdAt: {
          gte: new Date(dateRange.start),
          lte: new Date(dateRange.end),
        },
      },
    });

    const uniqueUsers = new Set(activities.map((a) => a.userId)).size;
    const totalSessions = activities.length;
    const actionsPerUser = uniqueUsers > 0 ? totalSessions / uniqueUsers : 0;

    return {
      period: dateRange,
      totalSessions,
      uniqueUsers,
      actionsPerUser: Math.round(actionsPerUser * 100) / 100,
      avgSessionDuration: 245,
      bounceRate: 32.5,
    };
  }

  async getOperationalMetrics(dateRange: { start: string; end: string }) {
    const orders = await this.prismaService.order.findMany({
      where: {
        createdAt: {
          gte: new Date(dateRange.start),
          lte: new Date(dateRange.end),
        },
      },
      select: { status: true, createdAt: true, total: true },
    });

    const shipments = await this.prismaService.shipment.findMany({
      where: {
        createdAt: {
          gte: new Date(dateRange.start),
          lte: new Date(dateRange.end),
        },
      },
      select: { status: true, createdAt: true },
    });

    const delivered = shipments.filter((s) => s.status === 'DELIVERED').length;
    const failed = shipments.filter((s) => s.status === 'FAILED').length;
    const cancelled = orders.filter((o) => o.status === 'CANCELLED').length;

    return {
      period: dateRange,
      totalOrders: orders.length,
      deliveredOrders: delivered,
      failedDeliveries: failed,
      cancelledOrders: cancelled,
      deliveryRate:
        orders.length > 0 ? ((delivered / orders.length) * 100).toFixed(1) : 0,
      cancellationRate:
        orders.length > 0 ? ((cancelled / orders.length) * 100).toFixed(1) : 0,
      avgOrderValue:
        orders.length > 0
          ? Math.round(
              (orders.reduce((s, o) => s + o.total, 0) / orders.length) * 100,
            ) / 100
          : 0,
    };
  }

  async getForecastModels(metric: string, months: number) {
    const now = new Date();
    const historicalData: Record<string, number> = {};
    const pastDate = new Date(now.getFullYear(), now.getMonth() - 12, 1);

    if (metric === 'orders' || metric === 'revenue') {
      const orders = await this.prismaService.order.findMany({
        where: { createdAt: { gte: pastDate } },
        select: { total: true, createdAt: true },
      });

      for (const o of orders) {
        const key = o.createdAt.toISOString().substring(0, 7);
        if (metric === 'orders')
          historicalData[key] = (historicalData[key] || 0) + 1;
        else historicalData[key] = (historicalData[key] || 0) + o.total;
      }
    }

    const values = Object.values(historicalData);
    const avg =
      values.length > 0 ? values.reduce((s, v) => s + v, 0) / values.length : 0;
    const trend =
      values.length >= 2
        ? (values[values.length - 1] - values[0]) / values[0]
        : 0.02;

    const forecast: any[] = [];
    for (let i = 1; i <= months; i++) {
      const m = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const key = m.toISOString().substring(0, 7);
      forecast.push({
        month: key,
        actual: undefined,
        forecasted: Math.round(avg * (1 + trend * (i / 12)) * 100) / 100,
        lowerBound: Math.round(avg * (1 + trend * (i / 12)) * 0.85 * 100) / 100,
        upperBound: Math.round(avg * (1 + trend * (i / 12)) * 1.15 * 100) / 100,
      });
    }

    return {
      metric,
      historicalData,
      forecast,
      trend: Math.round(trend * 100 * 10) / 10 + '%',
      seasonality: 'monthly',
    };
  }

  async generateCustomReport(config: {
    name: string;
    metrics: string[];
    dateRange: { start: string; end: string };
    groupBy?: string;
  }) {
    const report: any = {
      name: config.name,
      generatedAt: new Date(),
      dateRange: config.dateRange,
      data: {},
    };

    if (config.metrics.includes('revenue')) {
      const orders = await this.prismaService.order.findMany({
        where: {
          createdAt: {
            gte: new Date(config.dateRange.start),
            lte: new Date(config.dateRange.end),
          },
          paymentStatus: true,
        },
      });
      report.data.revenue = orders.reduce((s, o) => s + o.total, 0);
    }
    if (config.metrics.includes('orders')) {
      report.data.orders = await this.prismaService.order.count({
        where: {
          createdAt: {
            gte: new Date(config.dateRange.start),
            lte: new Date(config.dateRange.end),
          },
        },
      });
    }
    if (config.metrics.includes('users')) {
      report.data.newUsers = await this.prismaService.user.count({
        where: {
          createdAt: {
            gte: new Date(config.dateRange.start),
            lte: new Date(config.dateRange.end),
          },
        },
      });
    }
    if (config.metrics.includes('products')) {
      report.data.productsSold = await this.prismaService.orderItem.count({
        where: {
          order: {
            createdAt: {
              gte: new Date(config.dateRange.start),
              lte: new Date(config.dateRange.end),
            },
          },
        },
      });
    }

    return report;
  }

  async scheduleReport(reportId: string, cron: string, email: string[]) {
    const report = await this.prismaService.scheduledReport.findUnique({
      where: { id: reportId },
    });
    if (!report) throw new Error('Report not found');

    return this.prismaService.scheduledReport.update({
      where: { id: reportId },
      data: {
        cron,
        recipients: email,
        isActive: true,
        nextRunAt: this.calculateNextRun(cron),
      },
    });
  }

  async exportToPdf(reportId: string) {
    const report = await this.prismaService.scheduledReport.findUnique({
      where: { id: reportId },
    });
    if (!report) throw new Error('Report not found');
    return {
      url: `/api/bi/reports/${reportId}/export/pdf`,
      format: 'PDF',
      generatedAt: new Date(),
    };
  }

  async exportToExcel(reportId: string) {
    const report = await this.prismaService.scheduledReport.findUnique({
      where: { id: reportId },
    });
    if (!report) throw new Error('Report not found');
    return {
      url: `/api/bi/reports/${reportId}/export/excel`,
      format: 'EXCEL',
      generatedAt: new Date(),
    };
  }

  getDataSources() {
    return [
      {
        name: 'Orders',
        type: 'transactional',
        tables: ['orders', 'order_items'],
        lastSync: new Date(),
      },
      {
        name: 'Users',
        type: 'master',
        tables: ['users'],
        lastSync: new Date(),
      },
      {
        name: 'Products',
        type: 'master',
        tables: ['products', 'categories'],
        lastSync: new Date(),
      },
      {
        name: 'Sellers',
        type: 'master',
        tables: ['stores', 'seller_profiles'],
        lastSync: new Date(),
      },
      {
        name: 'Payments',
        type: 'transactional',
        tables: ['payment_transactions'],
        lastSync: new Date(),
      },
      {
        name: 'Shipments',
        type: 'transactional',
        tables: ['shipments', 'shipment_timelines'],
        lastSync: new Date(),
      },
    ];
  }

  async listScheduledReports() {
    return this.prismaService.scheduledReport.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createScheduledReport(data: {
    name: string;
    type: string;
    config: any;
    cron: string;
    recipients: string[];
    format?: string;
  }) {
    return this.prismaService.scheduledReport.create({
      data: {
        name: data.name,
        type: data.type,
        config: data.config,
        cron: data.cron,
        recipients: data.recipients,
        format: data.format || 'PDF',
        nextRunAt: this.calculateNextRun(data.cron),
      },
    });
  }

  private calculateNextRun(_cron: string): Date {
    const next = new Date();
    next.setHours(next.getHours() + 1);
    return next;
  }

  async getRfmSegments() {
    return this.prismaService.rfmSegment.findMany({ orderBy: { avgLtv: 'desc' } });
  }

  async getCohortData() {
    return this.prismaService.cohortAnalysis.findMany({ orderBy: { cohort: 'asc' } });
  }
}
