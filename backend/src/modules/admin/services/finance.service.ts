import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';

@Injectable()
export class AdminFinanceService {
  constructor(private prisma: PrismaService) {}

  async getFinanceDashboard() {
    const [totalRevenue, pendingSettlements, commissions, settlements] =
      await Promise.all([
        this.prisma.order.aggregate({
          _sum: { total: true },
          where: { paymentStatus: true },
        }),
        this.prisma.sellerSettlement.aggregate({
          _sum: { netAmount: true },
          where: { status: 'PENDING' },
        }),
        this.prisma.commission.aggregate({ _sum: { amount: true } }),
        this.prisma.sellerSettlement.findMany({
          where: { status: { in: ['PENDING', 'PROCESSING'] } },
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: { seller: { select: { id: true, name: true } } },
        }),
      ]);

    return {
      totalRevenue: totalRevenue._sum.total || 0,
      pendingSettlementAmount: pendingSettlements._sum.netAmount || 0,
      totalCommission: commissions._sum.amount || 0,
      netCashFlow:
        (totalRevenue._sum.total || 0) -
        (pendingSettlements._sum.netAmount || 0),
      pendingSettlements: settlements,
    };
  }

  async getSettlements(query: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;

    const [settlements, total] = await Promise.all([
      this.prisma.sellerSettlement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { seller: { select: { id: true, name: true } } },
      }),
      this.prisma.sellerSettlement.count({ where }),
    ]);
    return {
      settlements,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async generateSettlement(data: {
    sellerId: string;
    periodStart: string;
    periodEnd: string;
  }) {
    const store = await this.prisma.store.findUnique({
      where: { id: data.sellerId },
    });
    if (!store) throw new NotFoundException('Store not found');

    const orders = await this.prisma.order.findMany({
      where: {
        paymentStatus: true,
        paidAt: {
          gte: new Date(data.periodStart),
          lte: new Date(data.periodEnd),
        },
        items: { some: { product: { storeId: data.sellerId } } },
      },
      include: {
        items: {
          where: { product: { storeId: data.sellerId } },
          include: { product: { select: { id: true, name: true } } },
        },
      },
    });

    let grossAmount = 0;
    let totalCommission = 0;
    const items: Array<{
      orderId: string;
      amount: number;
      commission: number;
      fee: number;
      netAmount: number;
    }> = [];

    for (const order of orders) {
      const orderTotal = order.items.reduce(
        (s, i) => s + i.price * i.quantity,
        0,
      );
      const commission = orderTotal * ((store.commissionRate || 5) / 100);
      const net = orderTotal - commission;
      grossAmount += orderTotal;
      totalCommission += commission;
      items.push({
        orderId: order.id,
        amount: orderTotal,
        commission,
        fee: 0,
        netAmount: net,
      });
    }

    const netAmount = grossAmount - totalCommission;

    return this.prisma.sellerSettlement.create({
      data: {
        settlementNumber: `STL-${Date.now().toString(36).toUpperCase()}`,
        sellerId: data.sellerId,
        periodStart: new Date(data.periodStart),
        periodEnd: new Date(data.periodEnd),
        grossAmount,
        commission: totalCommission,
        fee: 0,
        netAmount,
        status: 'PENDING',
        items: { create: items },
      },
      include: { items: true, seller: { select: { id: true, name: true } } },
    });
  }

  async processSettlement(settlementId: string, status: string) {
    const settlement = await this.prisma.sellerSettlement.findUnique({
      where: { id: settlementId },
    });
    if (!settlement) throw new NotFoundException('Settlement not found');
    return this.prisma.sellerSettlement.update({
      where: { id: settlementId },
      data: {
        status,
        processedAt: status === 'COMPLETED' ? new Date() : undefined,
      },
    });
  }

  async getInvoices(query: { page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [invoices, total] = await Promise.all([
      this.prisma.invoice.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          seller: { select: { id: true, name: true } },
          order: { select: { id: true, orderNumber: true } },
          items: { include: { product: { select: { id: true, name: true } } } },
        },
      }),
      this.prisma.invoice.count(),
    ]);
    return {
      invoices,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createInvoice(data: {
    orderId: string;
    sellerId: string;
    subtotal: number;
    tax?: number;
    discount?: number;
    total: number;
    dueDate?: string;
    notes?: string;
  }) {
    const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`;
    return this.prisma.invoice.create({
      data: {
        invoiceNumber,
        orderId: data.orderId,
        sellerId: data.sellerId,
        subtotal: data.subtotal,
        tax: data.tax || 0,
        discount: data.discount || 0,
        total: data.total,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        notes: data.notes,
      },
      include: {
        seller: { select: { id: true, name: true } },
        order: { select: { id: true, orderNumber: true } },
      },
    });
  }

  async updateInvoice(
    invoiceId: string,
    data: { status?: string; notes?: string },
  ) {
    const inv = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
    });
    if (!inv) throw new NotFoundException('Invoice not found');
    return this.prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: data.status,
        paidAt: data.status === 'PAID' ? new Date() : undefined,
        notes: data.notes,
      },
    });
  }

  async getTaxReport(quarter: string, year: string) {
    const q = parseInt(quarter);
    const y = parseInt(year);
    const startMonth = (q - 1) * 3;
    const from = new Date(y, startMonth, 1);
    const to = new Date(y, startMonth + 3, 0, 23, 59, 59);

    const orders = await this.prisma.order.findMany({
      where: { paymentStatus: true, paidAt: { gte: from, lte: to } },
      select: { total: true, paidAt: true },
    });

    const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
    const vatRate = 15;
    const totalVat = Math.round(totalRevenue * (vatRate / 100));
    const totalOrders = orders.length;

    const monthlyData: Array<{
      month: string;
      revenue: number;
      taxable: number;
      vat: number;
    }> = [];
    for (let m = 0; m < 3; m++) {
      const monthStart = new Date(y, startMonth + m, 1);
      const monthEnd = new Date(y, startMonth + m + 1, 0, 23, 59, 59);
      const monthOrders = orders.filter(
        (o) => o.paidAt && o.paidAt >= monthStart && o.paidAt <= monthEnd,
      );
      const monthRevenue = monthOrders.reduce((s, o) => s + o.total, 0);
      monthlyData.push({
        month: monthStart.toLocaleString('default', { month: 'long' }),
        revenue: monthRevenue,
        taxable: monthRevenue,
        vat: Math.round(monthRevenue * (vatRate / 100)),
      });
    }

    return {
      quarter: q,
      year: y,
      totalRevenue,
      vatRate,
      totalVat,
      totalOrders,
      monthly: monthlyData,
      period: { from, to },
    };
  }

  async getEscrowTransactions(query: { page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.prisma.escrowTransaction.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          order: { select: { id: true, orderNumber: true, total: true } },
        },
      }),
      this.prisma.escrowTransaction.count(),
    ]);
    return {
      transactions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCreditNotes() {
    return this.prisma.creditNote.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        order: { select: { id: true, orderNumber: true, total: true } },
        returnRequest: { select: { id: true, reason: true } },
      },
    });
  }

  async getCommissions(query: { page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [commissions, total] = await Promise.all([
      this.prisma.commission.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          seller: { select: { id: true, name: true } },
          order: { select: { id: true, orderNumber: true } },
        },
      }),
      this.prisma.commission.count(),
    ]);
    return {
      commissions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAdminAffiliates(query: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;

    const [affiliates, total] = await Promise.all([
      this.prisma.affiliateProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              avatar: true,
            },
          },
          _count: {
            select: { clicks: true, conversions: true, commissions: true },
          },
        },
      }),
      this.prisma.affiliateProfile.count({ where }),
    ]);
    return {
      affiliates,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateAdminAffiliate(affiliateId: string, status?: string) {
    const profile = await this.prisma.affiliateProfile.findUnique({
      where: { id: affiliateId },
    });
    if (!profile) throw new NotFoundException('Affiliate not found');
    if (status) {
      await this.prisma.affiliateProfile.update({
        where: { id: affiliateId },
        data: { status },
      });
    }
    return { message: 'Affiliate updated', affiliateId };
  }
}
