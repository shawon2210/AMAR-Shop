import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  private async ensureWallet(userId: string) {
    let wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await this.prisma.wallet.create({
        data: { userId },
      });
    }
    return wallet;
  }

  async getBalance(userId: string) {
    const wallet = await this.ensureWallet(userId);
    return {
      balance: wallet.balance,
      totalEarned: wallet.totalEarned,
      totalSpent: wallet.totalSpent,
      bonusBalance: wallet.bonusBalance,
      cashbackBalance: wallet.cashbackBalance,
    };
  }

  async addFunds(userId: string, amount: number, method: string) {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');
    const wallet = await this.ensureWallet(userId);

    const balanceBefore = wallet.balance;
    const balanceAfter = balanceBefore + amount;

    await this.prisma.wallet.update({
      where: { userId },
      data: { balance: balanceAfter, totalEarned: { increment: amount } },
    });

    await this.prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        userId,
        type: 'DEPOSIT',
        amount,
        balanceBefore,
        balanceAfter,
        reference: method,
        description: `Deposit via ${method}`,
        status: 'COMPLETED',
      },
    });

    return { balance: balanceAfter, amount, method, message: 'Funds added successfully' };
  }

  async deductFunds(userId: string, amount: number, reference: string) {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');
    const wallet = await this.ensureWallet(userId);
    if (wallet.balance < amount) throw new BadRequestException('Insufficient balance');

    const balanceBefore = wallet.balance;
    const balanceAfter = balanceBefore - amount;

    await this.prisma.wallet.update({
      where: { userId },
      data: { balance: balanceAfter, totalSpent: { increment: amount } },
    });

    await this.prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        userId,
        type: 'PURCHASE',
        amount: -amount,
        balanceBefore,
        balanceAfter,
        reference,
        description: `Payment for ${reference}`,
        status: 'COMPLETED',
      },
    });

    return { balance: balanceAfter, amount, message: 'Payment deducted successfully' };
  }

  async processRefund(userId: string, amount: number, orderId: string) {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');
    const wallet = await this.ensureWallet(userId);

    const balanceBefore = wallet.balance;
    const balanceAfter = balanceBefore + amount;

    await this.prisma.wallet.update({
      where: { userId },
      data: { balance: balanceAfter, totalEarned: { increment: amount } },
    });

    await this.prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        userId,
        type: 'REFUND',
        amount,
        balanceBefore,
        balanceAfter,
        reference: orderId,
        description: `Refund for order ${orderId}`,
        status: 'COMPLETED',
      },
    });

    return { balance: balanceAfter, amount, message: 'Refund processed successfully' };
  }

  async addCashback(userId: string, amount: number, reference: string) {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');
    const wallet = await this.ensureWallet(userId);

    const balanceBefore = wallet.balance;
    const balanceAfter = balanceBefore + amount;

    await this.prisma.wallet.update({
      where: { userId },
      data: {
        balance: balanceAfter,
        cashbackBalance: { increment: amount },
        totalEarned: { increment: amount },
      },
    });

    await this.prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        userId,
        type: 'CASHBACK',
        amount,
        balanceBefore,
        balanceAfter,
        reference,
        description: `Cashback for ${reference}`,
        status: 'COMPLETED',
      },
    });

    return { balance: balanceAfter, amount, message: 'Cashback added successfully' };
  }

  async getTransactions(
    userId: string,
    query: { page?: number; limit?: number; type?: string },
  ) {
    const wallet = await this.ensureWallet(userId);
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = { walletId: wallet.id };

    if (query.type) where.type = query.type;

    const [transactions, total] = await Promise.all([
      this.prisma.walletTransaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.walletTransaction.count({ where }),
    ]);

    return { transactions, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async requestPayout(sellerId: string, amount: number, method: string) {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');

    const store = await this.prisma.store.findUnique({ where: { userId: sellerId } });
    if (!store) throw new NotFoundException('Store not found');

    const wallet = await this.ensureWallet(sellerId);
    if (wallet.balance < amount) throw new BadRequestException('Insufficient balance');

    const sellerProfile = await this.prisma.sellerProfile.findUnique({ where: { userId: sellerId } });
    let accountNumber: string | undefined;
    if (method === 'bank') accountNumber = sellerProfile?.bankAccountNumber || undefined;
    else if (method === 'bkash') accountNumber = sellerProfile?.bkashNumber || undefined;
    else if (method === 'nagad') accountNumber = sellerProfile?.nagadNumber || undefined;

    const fee = amount * 0.01;
    const netAmount = amount - fee;

    const payout = await this.prisma.sellerPayout.create({
      data: {
        sellerId: store.id,
        amount,
        fee,
        netAmount,
        method,
        accountNumber,
        status: 'PENDING',
      },
    });

    const balanceBefore = wallet.balance;
    const balanceAfter = balanceBefore - amount;

    await this.prisma.wallet.update({
      where: { userId: sellerId },
      data: { balance: balanceAfter },
    });

    await this.prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        userId: sellerId,
        type: 'PAYOUT',
        amount: -amount,
        fee,
        balanceBefore,
        balanceAfter,
        reference: payout.id,
        description: `Payout request via ${method}`,
        status: 'PENDING',
      },
    });

    return { payout, balance: balanceAfter, message: 'Payout request submitted' };
  }

  async processPayout(payoutId: string) {
    const payout = await this.prisma.sellerPayout.findUnique({ where: { id: payoutId } });
    if (!payout) throw new NotFoundException('Payout not found');
    if (payout.status !== 'PENDING') throw new BadRequestException('Payout already processed');

    return this.prisma.sellerPayout.update({
      where: { id: payoutId },
      data: { status: 'COMPLETED', processedAt: new Date() },
    });
  }
}
