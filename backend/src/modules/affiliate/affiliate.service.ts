import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class AffiliateService {
  constructor(private prisma: PrismaService) {}

  async registerAffiliate(
    userId: string,
    details: { bio?: string; socialLinks?: string[]; promoMethods?: string[] },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const existing = await this.prisma.affiliateProfile.findUnique({
      where: { userId },
    });
    if (existing)
      throw new BadRequestException('Already registered as affiliate');

    const affiliate = await this.prisma.affiliateProfile.create({
      data: {
        userId,
        referralCode: this.generateReferralCode(user.name),
        bio: details.bio,
        socialLinks: details.socialLinks || [],
        promoMethods: details.promoMethods || [],
        status: 'PENDING',
      },
    });

    return { registered: true, affiliate };
  }

  private generateReferralCode(name: string): string {
    const prefix = name.slice(0, 3).toUpperCase();
    const suffix = uuidv4().slice(0, 6).toUpperCase();
    return `${prefix}${suffix}`;
  }

  async getAffiliateDashboard(affiliateId: string): Promise<{
    clicks: number;
    conversions: number;
    conversionRate: number;
    revenue: number;
    pendingCommission: number;
    paidCommission: number;
    topProducts: any[];
    recentClicks: any[];
  }> {
    const profile = await this.prisma.affiliateProfile.findUnique({
      where: { id: affiliateId },
    });
    if (!profile) throw new NotFoundException('Affiliate profile not found');

    const clicks = await this.prisma.affiliateClick.count({
      where: { affiliateId },
    });
    const conversions = await this.prisma.affiliateConversion.count({
      where: { affiliateId },
    });
    const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;

    const pendingCommission = await this.prisma.affiliateCommission.aggregate({
      where: { affiliateId, status: 'PENDING' },
      _sum: { amount: true },
    });

    const paidCommission = await this.prisma.affiliateCommission.aggregate({
      where: { affiliateId, status: 'PAID' },
      _sum: { amount: true },
    });

    const topProducts = await this.prisma.affiliateConversion.groupBy({
      by: ['productId'],
      where: { affiliateId },
      _count: { productId: true },
      _sum: { commission: true },
      orderBy: { _count: { productId: 'desc' } },
      take: 10,
    });

    const recentClicks = await this.prisma.affiliateClick.findMany({
      where: { affiliateId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return {
      clicks,
      conversions,
      conversionRate: Math.round(conversionRate * 100) / 100,
      revenue:
        (paidCommission._sum?.amount || 0) +
        (pendingCommission._sum?.amount || 0),
      pendingCommission: pendingCommission._sum?.amount || 0,
      paidCommission: paidCommission._sum?.amount || 0,
      topProducts,
      recentClicks,
    };
  }

  async generateTrackingLink(
    productId: string,
    affiliateId: string,
    campaign?: string,
  ): Promise<{ shortCode: string; url: string; deepLink: string }> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    const affiliate = await this.prisma.affiliateProfile.findUnique({
      where: { id: affiliateId },
    });
    if (!affiliate) throw new NotFoundException('Affiliate profile not found');

    const shortCode = uuidv4().slice(0, 8);
    const baseUrl = process.env.BASE_URL || 'https://amarshop.com';
    const url = `${baseUrl}/t/${shortCode}`;
    const deepLink = `amarshop://product/${productId}?ref=${affiliate.referralCode}`;

    await this.prisma.affiliateLink.create({
      data: {
        shortCode,
        affiliateId,
        productId,
        campaign,
        url,
        deepLink,
      },
    });

    return { shortCode, url, deepLink };
  }

  async recordClick(
    trackingId: string,
    metadata: {
      referrer?: string;
      device?: string;
      location?: string;
      ip?: string;
    },
  ) {
    const link = await this.prisma.affiliateLink.findUnique({
      where: { shortCode: trackingId },
    });
    if (!link) throw new NotFoundException('Invalid tracking link');

    const click = await this.prisma.affiliateClick.create({
      data: {
        affiliateId: link.affiliateId,
        linkId: link.id,
        productId: link.productId,
        referrer: metadata.referrer || 'direct',
        device: metadata.device || 'unknown',
        location: metadata.location || 'unknown',
        ip: metadata.ip || '0.0.0.0',
      },
    });

    return { tracked: true, clickId: click.id };
  }

  async recordConversion(orderId: string, trackingId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) throw new NotFoundException('Order not found');

    const click = await this.prisma.affiliateClick.findFirst({
      where: { link: { shortCode: trackingId } },
      include: { link: true },
    });
    if (!click) throw new NotFoundException('Invalid tracking reference');

    const commission = this.calculateCommission(order.total);
    const conversion = await this.prisma.affiliateConversion.create({
      data: {
        affiliateId: click.affiliateId,
        linkId: click.linkId,
        clickId: click.id,
        orderId: order.id,
        productId: click.productId,
        amount: order.total,
        commission: commission.amount,
        commissionRate: commission.rate,
      },
    });

    await this.prisma.affiliateCommission.create({
      data: {
        affiliateId: click.affiliateId,
        conversionId: conversion.id,
        amount: commission.amount,
        rate: commission.rate,
        status: 'PENDING',
      },
    });

    return { recorded: true, conversion, commission: commission.amount };
  }

  calculateCommission(amount: number): { amount: number; rate: number } {
    const rate = parseFloat(process.env.AFFILIATE_COMMISSION_RATE || '5.0');
    const commission = (amount * rate) / 100;
    return { amount: Math.round(commission * 100) / 100, rate };
  }

  async getAffiliatePayouts(
    affiliateId: string,
  ): Promise<{ payouts: any[]; totalPaid: number; pendingAmount: number }> {
    const payouts = await this.prisma.affiliatePayout.findMany({
      where: { affiliateId },
      orderBy: { createdAt: 'desc' },
    });

    const totalPaid = payouts
      .filter((p) => p.status === 'COMPLETED')
      .reduce((s, p) => s + p.amount, 0);
    const pendingAmount = payouts
      .filter((p) => p.status === 'PENDING')
      .reduce((s, p) => s + p.amount, 0);

    return { payouts, totalPaid, pendingAmount };
  }

  async requestPayout(
    affiliateId: string,
    amount: number,
  ): Promise<{ requested: boolean; payout: any }> {
    const pendingCommissions = await this.prisma.affiliateCommission.aggregate({
      where: { affiliateId, status: 'PENDING' },
      _sum: { amount: true },
    });

    const available = pendingCommissions._sum?.amount || 0;
    if (amount > available)
      throw new BadRequestException(
        `Insufficient balance. Available: ${available}`,
      );

    const payout = await this.prisma.affiliatePayout.create({
      data: {
        affiliateId,
        amount,
        fee: 0,
        netAmount: amount,
        status: 'PENDING',
      },
    });

    return { requested: true, payout };
  }

  async getTopAffiliates(dateRange: {
    start: string;
    end: string;
  }): Promise<any[]> {
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    end.setHours(23, 59, 59, 999);

    const affiliates = await this.prisma.affiliateConversion.groupBy({
      by: ['affiliateId'],
      where: { createdAt: { gte: start, lte: end } },
      _count: { id: true },
      _sum: { commission: true },
      orderBy: { _sum: { commission: 'desc' } },
      take: 50,
    });

    return affiliates;
  }

  async getAffiliateAnalytics(
    affiliateId: string,
    dateRange: { start: string; end: string },
  ): Promise<{
    clicksOverTime: any[];
    conversionsOverTime: any[];
    revenueOverTime: any[];
    byProduct: any[];
    byDevice: any[];
    byLocation: any[];
  }> {
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    end.setHours(23, 59, 59, 999);

    const clicks = await this.prisma.affiliateClick.findMany({
      where: { affiliateId, createdAt: { gte: start, lte: end } },
      orderBy: { createdAt: 'asc' },
    });

    const conversions = await this.prisma.affiliateConversion.findMany({
      where: { affiliateId, createdAt: { gte: start, lte: end } },
      orderBy: { createdAt: 'asc' },
    });

    const byProduct = await this.prisma.affiliateConversion.groupBy({
      by: ['productId'],
      where: { affiliateId, createdAt: { gte: start, lte: end } },
      _count: { id: true },
      _sum: { commission: true },
    });

    const byDevice = await this.prisma.affiliateClick.groupBy({
      by: ['device'],
      where: { affiliateId, createdAt: { gte: start, lte: end } },
      _count: { device: true },
    });

    const byLocation = await this.prisma.affiliateClick.groupBy({
      by: ['location'],
      where: { affiliateId, createdAt: { gte: start, lte: end } },
      _count: { location: true },
    });

    return {
      clicksOverTime: clicks,
      conversionsOverTime: conversions,
      revenueOverTime: conversions,
      byProduct,
      byDevice,
      byLocation,
    };
  }

  async createCampaign(
    affiliateId: string,
    data: {
      name: string;
      budget?: number;
      startDate?: string;
      endDate?: string;
      targetProducts?: string[];
    },
  ) {
    const campaign = await this.prisma.affiliateCampaign.create({
      data: {
        affiliateId,
        name: data.name,
        budget: data.budget,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        targetProducts: data.targetProducts || [],
        status: 'ACTIVE',
      },
    });

    return { created: true, campaign };
  }

  async getAvailableProducts(_affiliateId: string): Promise<any[]> {
    const products = await this.prisma.product.findMany({
      where: { status: 'active', inStock: true },
      take: 100,
      include: {
        store: { select: { name: true } },
        category: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return products.map((p) => ({
      ...p,
      commissionRate: parseFloat(
        process.env.AFFILIATE_COMMISSION_RATE || '5.0',
      ),
      estimatedCommission:
        Math.round(
          p.price *
            (parseFloat(process.env.AFFILIATE_COMMISSION_RATE || '5.0') / 100) *
            100,
        ) / 100,
    }));
  }

  async validateTracking(
    code: string,
  ): Promise<{ valid: boolean; link?: any }> {
    const link = await this.prisma.affiliateLink.findUnique({
      where: { shortCode: code },
      include: {
        affiliate: { include: { user: { select: { name: true } } } },
        product: { select: { name: true, slug: true } },
      },
    });

    if (!link || !link.isActive) return { valid: false };
    return { valid: true, link };
  }
}
