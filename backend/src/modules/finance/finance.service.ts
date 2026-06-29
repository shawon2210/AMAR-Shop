import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async createEscrow(orderId: string, amount: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');

    const existing = await this.prisma.escrowTransaction.findUnique({
      where: { orderId },
    });
    if (existing)
      throw new BadRequestException('Escrow already exists for this order');

    return this.prisma.escrowTransaction.create({
      data: { orderId, amount, status: 'HELD' },
    });
  }

  async releaseEscrow(orderId: string) {
    const escrow = await this.prisma.escrowTransaction.findUnique({
      where: { orderId },
    });
    if (!escrow) throw new NotFoundException('Escrow not found');
    if (escrow.status !== 'HELD')
      throw new BadRequestException('Escrow not in HELD status');

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) throw new NotFoundException('Order not found');

    const commission = await this.calculateCommission(orderId);

    await this.prisma.$transaction([
      this.prisma.escrowTransaction.update({
        where: { id: escrow.id },
        data: { status: 'RELEASED', releasedAt: new Date() },
      }),
      this.prisma.accountingEntry.create({
        data: {
          entryNumber: `ACC-${Date.now()}`,
          type: 'CREDIT',
          account: 'REVENUE',
          amount: escrow.amount - commission.totalCommission,
          description: `Escrow release for order ${order.orderNumber}`,
          referenceId: orderId,
          referenceType: 'order',
          entryDate: new Date(),
        },
      }),
      this.prisma.accountingEntry.create({
        data: {
          entryNumber: `ACC-${Date.now() + 1}`,
          type: 'DEBIT',
          account: 'COMMISSION_INCOME',
          amount: commission.totalCommission,
          description: `Commission for order ${order.orderNumber}`,
          referenceId: orderId,
          referenceType: 'order',
          entryDate: new Date(),
        },
      }),
    ]);

    return {
      success: true,
      orderId,
      releasedAmount: escrow.amount,
      commission: commission.totalCommission,
    };
  }

  async refundToEscrow(orderId: string, amount: number) {
    const escrow = await this.prisma.escrowTransaction.findUnique({
      where: { orderId },
    });
    if (!escrow) throw new NotFoundException('Escrow not found');

    await this.prisma.escrowTransaction.update({
      where: { id: escrow.id },
      data: { status: 'PARTIALLY_REFUNDED', amount: { decrement: amount } },
    });

    await this.prisma.accountingEntry.create({
      data: {
        entryNumber: `ACC-${Date.now()}`,
        type: 'DEBIT',
        account: 'ACCOUNTS_PAYABLE',
        amount,
        description: `Refund to escrow for order ${orderId}`,
        referenceId: orderId,
        referenceType: 'order',
        entryDate: new Date(),
      },
    });

    return {
      success: true,
      orderId,
      refundedAmount: amount,
      remainingBalance: escrow.amount - amount,
    };
  }

  async calculateCommission(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) throw new NotFoundException('Order not found');

    const items = await this.prisma.orderItem.findMany({
      where: { orderId },
      include: { product: { include: { store: true } } },
    });

    const commissions: any[] = [];
    let totalCommission = 0;

    for (const item of items) {
      const rate = item.product.store?.commissionRate || 5.0;
      const amount = item.price * item.quantity * (rate / 100);
      commissions.push({
        sellerId: item.product.storeId,
        orderId,
        amount,
        rate,
      });
      totalCommission += amount;
    }

    return { totalCommission, items: commissions };
  }

  async generateSellerSettlement(
    sellerId: string,
    dateRange: { start: string; end: string },
  ) {
    const orders = await this.prisma.order.findMany({
      where: {
        status: 'DELIVERED',
        createdAt: {
          gte: new Date(dateRange.start),
          lte: new Date(dateRange.end),
        },
        items: { some: { product: { storeId: sellerId } } },
      },
      include: {
        items: {
          where: { product: { storeId: sellerId } },
          include: { product: true },
        },
      },
    });

    const items: any[] = [];
    let grossAmount = 0;
    let totalCommission = 0;

    for (const order of orders) {
      for (const item of order.items) {
        const commissionRate = 5.0;
        const itemTotal = item.price * item.quantity;
        const commission = itemTotal * (commissionRate / 100);
        grossAmount += itemTotal;
        totalCommission += commission;
        items.push({
          orderId: order.id,
          amount: itemTotal,
          commission,
          fee: 0,
          netAmount: itemTotal - commission,
        });
      }
    }

    const fee = grossAmount * 0.01;
    const netAmount = grossAmount - totalCommission - fee;

    const count = await this.prisma.sellerSettlement.count();
    const settlementNumber = `STL-${String(count + 1).padStart(6, '0')}`;

    return this.prisma.sellerSettlement.create({
      data: {
        settlementNumber,
        sellerId,
        periodStart: new Date(dateRange.start),
        periodEnd: new Date(dateRange.end),
        grossAmount,
        commission: totalCommission,
        fee,
        netAmount,
        status: 'PENDING',
        items: { create: items },
      },
      include: { items: true },
    });
  }

  async processSettlement(settlementId: string) {
    const settlement = await this.prisma.sellerSettlement.findUnique({
      where: { id: settlementId },
    });
    if (!settlement) throw new NotFoundException('Settlement not found');
    if (settlement.status !== 'PENDING')
      throw new BadRequestException('Settlement not in PENDING status');

    await this.prisma.$transaction([
      this.prisma.sellerSettlement.update({
        where: { id: settlementId },
        data: { status: 'COMPLETED', processedAt: new Date() },
      }),
      this.prisma.accountingEntry.create({
        data: {
          entryNumber: `ACC-${Date.now()}`,
          type: 'DEBIT',
          account: 'ACCOUNTS_PAYABLE',
          amount: settlement.netAmount,
          description: `Settlement ${settlement.settlementNumber}`,
          referenceId: settlementId,
          referenceType: 'settlement',
          entryDate: new Date(),
        },
      }),
    ]);

    return { success: true, settlementId, netAmount: settlement.netAmount };
  }

  async getAccountingEntries(dateRange?: { start: string; end: string }) {
    const where: any = {};
    if (dateRange) {
      where.entryDate = {
        gte: new Date(dateRange.start),
        lte: new Date(dateRange.end),
      };
    }
    return this.prisma.accountingEntry.findMany({
      where,
      orderBy: { entryDate: 'desc' },
      take: 100,
    });
  }

  async generateTaxReport(quarter: number, year: number) {
    const startMonth = (quarter - 1) * 3 + 1;
    const startDate = new Date(year, startMonth - 1, 1);
    const endDate = new Date(year, startMonth + 2, 0);

    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        paymentStatus: true,
      },
    });

    const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
    const totalVAT = totalRevenue * 0.15;
    const totalOrders = orders.length;

    return {
      quarter,
      year,
      period: `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`,
      totalRevenue,
      vatRate: '15%',
      totalVAT,
      totalOrders,
      taxableAmount: totalRevenue,
    };
  }

  async createInvoice(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true } },
        address: true,
        user: true,
      },
    });
    if (!order) throw new NotFoundException('Order not found');

    const count = await this.prisma.invoice.count();
    const invoiceNumber = `INV-${String(count + 1).padStart(6, '0')}`;

    return this.prisma.invoice.create({
      data: {
        invoiceNumber,
        orderId,
        sellerId: order.items[0]?.product.storeId || '',
        subtotal: order.subtotal,
        tax: order.subtotal * 0.15,
        discount: order.discount,
        total: order.total,
        status: 'DRAFT',
        items: {
          create: order.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.price,
            total: item.price * item.quantity,
          })),
        },
      },
      include: {
        items: { include: { product: { select: { id: true, name: true } } } },
      },
    });
  }

  async createCreditNote(returnId: string) {
    const returnRequest = await this.prisma.returnRequest.findUnique({
      where: { id: returnId },
      include: { order: { include: { items: true } } },
    });
    if (!returnRequest) throw new NotFoundException('Return request not found');

    const count = await this.prisma.creditNote.count();
    const creditNoteNumber = `CN-${String(count + 1).padStart(6, '0')}`;

    const amount = returnRequest.order.items
      .filter((i) => i.productId === returnRequest.productId)
      .reduce((s, i) => s + i.price * returnRequest.quantity, 0);

    return this.prisma.creditNote.create({
      data: {
        creditNoteNumber,
        returnId,
        orderId: returnRequest.orderId,
        amount,
        reason: returnRequest.reason,
        status: 'DRAFT',
      },
    });
  }

  async reconcilePayments(date: string) {
    const targetDate = new Date(date);
    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const txns = await this.prisma.paymentTransaction.findMany({
      where: { createdAt: { gte: targetDate, lt: nextDate } },
    });

    const matched = txns.filter((t) => t.status === 'SUCCESS');
    const unmatched = txns.filter(
      (t) => t.status === 'PENDING' || t.status === 'FAILED',
    );

    return {
      date,
      totalTransactions: txns.length,
      matched: matched.length,
      unmatched: unmatched.length,
      totalAmount: txns.reduce((s, t) => s + t.amount, 0),
      matchedAmount: matched.reduce((s, t) => s + t.amount, 0),
      pendingAmount: unmatched.reduce((s, t) => s + t.amount, 0),
    };
  }

  async getCashFlow(dateRange: { start: string; end: string }) {
    const entries = await this.prisma.accountingEntry.findMany({
      where: {
        entryDate: {
          gte: new Date(dateRange.start),
          lte: new Date(dateRange.end),
        },
      },
      orderBy: { entryDate: 'asc' },
    });

    const cashEntries = entries.filter(
      (e) => e.account === 'CASH' || e.account === 'BANK',
    );
    const inflows = cashEntries
      .filter((e) => e.type === 'CREDIT')
      .reduce((s, e) => s + e.amount, 0);
    const outflows = cashEntries
      .filter((e) => e.type === 'DEBIT')
      .reduce((s, e) => s + e.amount, 0);

    const byMonth: Record<string, { inflows: number; outflows: number }> = {};
    for (const e of cashEntries) {
      const key = e.entryDate.toISOString().substring(0, 7);
      if (!byMonth[key]) byMonth[key] = { inflows: 0, outflows: 0 };
      if (e.type === 'CREDIT') byMonth[key].inflows += e.amount;
      else byMonth[key].outflows += e.amount;
    }

    return {
      totalInflows: inflows,
      totalOutflows: outflows,
      netCashFlow: inflows - outflows,
      monthly: Object.entries(byMonth).map(([month, data]) => ({
        month,
        ...data,
        net: data.inflows - data.outflows,
      })),
    };
  }

  async getRevenueForecast(months: number) {
    const now = new Date();
    const past6Months = new Date(now.getFullYear(), now.getMonth() - 6, 1);

    const monthlyRevenue: Record<string, number> = {};
    const orders = await this.prisma.order.findMany({
      where: { createdAt: { gte: past6Months }, paymentStatus: true },
      select: { total: true, createdAt: true },
    });

    for (const o of orders) {
      const key = o.createdAt.toISOString().substring(0, 7);
      monthlyRevenue[key] = (monthlyRevenue[key] || 0) + o.total;
    }

    const values = Object.values(monthlyRevenue);
    const avgRevenue =
      values.length > 0 ? values.reduce((s, v) => s + v, 0) / values.length : 0;
    const growthRate =
      values.length >= 2
        ? (values[values.length - 1] - values[0]) / values[0]
        : 0.1;

    const forecast: any[] = [];
    for (let i = 1; i <= months; i++) {
      const forecastMonth = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const key = forecastMonth.toISOString().substring(0, 7);
      const projected = avgRevenue * (1 + growthRate * (i / 12));
      forecast.push({
        month: key,
        projectedRevenue: Math.round(projected * 100) / 100,
      });
    }

    return {
      historicalRevenue: monthlyRevenue,
      forecast,
      avgMonthlyRevenue: avgRevenue,
      growthRate,
    };
  }

  async getBalanceSheet(date: string) {
    const asOfDate = new Date(date);

    const assets = await this.prisma.accountingEntry.findMany({
      where: {
        entryDate: { lte: asOfDate },
        account: { in: ['CASH', 'BANK', 'ACCOUNTS_RECEIVABLE'] },
      },
    });

    const liabilities = await this.prisma.accountingEntry.findMany({
      where: {
        entryDate: { lte: asOfDate },
        account: { in: ['ACCOUNTS_PAYABLE'] },
      },
    });

    const totalAssets = assets.reduce(
      (s, e) => s + (e.type === 'DEBIT' ? e.amount : -e.amount),
      0,
    );
    const totalLiabilities = liabilities.reduce(
      (s, e) => s + (e.type === 'CREDIT' ? e.amount : -e.amount),
      0,
    );

    const settlements = await this.prisma.sellerSettlement.findMany({
      where: {
        status: { in: ['PENDING', 'PROCESSING'] },
        createdAt: { lte: asOfDate },
      },
    });
    const pendingSettlements = settlements.reduce(
      (s, st) => s + st.netAmount,
      0,
    );

    return {
      asOfDate: date,
      assets: {
        cashAndBank: totalAssets,
        accountsReceivable: 0,
        total: totalAssets,
      },
      liabilities: {
        accountsPayable: totalLiabilities,
        pendingSettlements,
        total: totalLiabilities + pendingSettlements,
      },
      equity: {
        retainedEarnings: totalAssets - totalLiabilities - pendingSettlements,
      },
    };
  }

  async getProfitAndLoss(dateRange: { start: string; end: string }) {
    const entries = await this.prisma.accountingEntry.findMany({
      where: {
        entryDate: {
          gte: new Date(dateRange.start),
          lte: new Date(dateRange.end),
        },
      },
    });

    const revenue = entries
      .filter((e) => e.account === 'REVENUE' && e.type === 'CREDIT')
      .reduce((s, e) => s + e.amount, 0);
    const commissionIncome = entries
      .filter((e) => e.account === 'COMMISSION_INCOME' && e.type === 'DEBIT')
      .reduce((s, e) => s + e.amount, 0);
    const expenses = entries
      .filter(
        (e) =>
          e.type === 'DEBIT' &&
          e.account !== 'COMMISSION_INCOME' &&
          e.account !== 'ACCOUNTS_RECEIVABLE',
      )
      .reduce((s, e) => s + e.amount, 0);

    const grossProfit = revenue - 0;
    const netProfit = grossProfit + commissionIncome - expenses;

    return {
      period: dateRange,
      revenue: {
        grossRevenue: revenue,
        commissionIncome,
        totalRevenue: revenue + commissionIncome,
      },
      expenses: { operating: expenses, totalExpenses: expenses },
      grossProfit,
      netProfit,
      margin:
        revenue > 0 ? ((netProfit / revenue) * 100).toFixed(2) + '%' : '0%',
    };
  }

  async getEscrowStatus(orderId?: string) {
    const where: any = {};
    if (orderId) where.orderId = orderId;
    return this.prisma.escrowTransaction.findMany({
      where,
      include: { order: { select: { orderNumber: true, total: true } } },
    });
  }

  async listSettlements(sellerId?: string) {
    const where: any = {};
    if (sellerId) where.sellerId = sellerId;
    return this.prisma.sellerSettlement.findMany({
      where,
      include: { seller: { select: { id: true, name: true } }, items: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async listInvoices(orderId?: string) {
    const where: any = {};
    if (orderId) where.orderId = orderId;
    return this.prisma.invoice.findMany({
      where,
      include: {
        items: { include: { product: { select: { id: true, name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
