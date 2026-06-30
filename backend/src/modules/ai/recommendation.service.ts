import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

interface Interaction {
  userId: string;
  productId: string;
  action: 'view' | 'add_to_cart' | 'purchase' | 'wishlist';
  timestamp: Date;
  weight: number;
}

interface UserFactors {
  userId: string;
  factors: number[];
  bias: number;
}

interface ProductFactors {
  productId: string;
  factors: number[];
  bias: number;
}

@Injectable()
export class RecommendationService {
  private readonly logger = new Logger(RecommendationService.name);
  private readonly latentFactors = 20;
  private readonly learningRate = 0.01;
  private readonly regularization = 0.02;
  private readonly iterations = 50;

  private userFactorsMap = new Map<string, UserFactors>();
  private productFactorsMap = new Map<string, ProductFactors>();
  private interactionCache = new Map<string, Interaction[]>();
  private modelTrained = false;

  constructor(private prisma: PrismaService) {}

  async getPersonalizedFeed(userId: string, limit = 20): Promise<any[]> {
    try {
      const recentInteractions = await this.getUserInteractions(userId, 50);

      if (recentInteractions.length === 0) {
        return this.getColdStartRecommendations(limit);
      }

      const purchasedIds = recentInteractions
        .filter((i) => i.action === 'purchase')
        .map((i) => i.productId);
      const viewedCategoryIds = await this.getViewedCategoryIds(userId);

      const candidates = await this.prisma.product.findMany({
        where: {
          status: 'active',
          id: { notIn: purchasedIds },
          ...(viewedCategoryIds.length > 0
            ? { categoryId: { in: viewedCategoryIds } }
            : {}),
        },
        include: {
          store: { select: { id: true, name: true, isOfficial: true } },
          brand: { select: { id: true, name: true } },
          category: { select: { id: true, name: true } },
        },
        orderBy: [{ rating: 'desc' }, { soldCount: 'desc' }],
        take: limit * 3,
      });

      const scored = candidates.map((product) => {
        const collabScore = this.predictRating(userId, product.id);
        const popularScore =
          (product.soldCount / 1000) * 0.3 + (product.rating / 5) * 0.7;
        const freshness =
          (new Date(product.createdAt).getTime() - Date.now() + 30 * 86400000) /
          (30 * 86400000);
        const hybridScore =
          collabScore * 0.5 + popularScore * 0.3 + Math.max(0, freshness) * 0.2;
        return { ...product, _score: hybridScore };
      });

      scored.sort((a, b) => b._score - a._score);
      return scored.slice(0, limit);
    } catch (error) {
      this.logger.error(`Personalized feed failed: ${error}`);
      return this.getColdStartRecommendations(limit);
    }
  }

  async getFrequentlyBoughtTogether(
    productId: string,
    limit = 6,
  ): Promise<any[]> {
    const ordersWithProduct = await this.prisma.orderItem.findMany({
      where: { productId },
      select: { orderId: true },
      take: 100,
    });

    const orderIds = [...new Set(ordersWithProduct.map((o) => o.orderId))];
    if (orderIds.length === 0) return [];

    const coOccurrences = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        orderId: { in: orderIds },
        productId: { not: productId },
      },
      _count: { productId: true },
      orderBy: { _count: { productId: 'desc' } },
      take: limit,
    });

    const productIds = coOccurrences.map((c) => c.productId);
    if (productIds.length === 0) return [];

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        store: { select: { id: true, name: true, isOfficial: true } },
        brand: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
      },
    });

    return productIds
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean);
  }

  async getCrossSellItems(productId: string, limit = 6): Promise<any[]> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true, price: true },
    });
    if (!product) return [];

    const crossSellProducts = await this.prisma.product.findMany({
      where: {
        status: 'active',
        categoryId: product.categoryId,
        id: { not: productId },
        price: { lte: product.price * 0.5 },
      },
      include: {
        store: { select: { id: true, name: true, isOfficial: true } },
        brand: { select: { id: true, name: true } },
      },
      orderBy: [{ soldCount: 'desc' }, { rating: 'desc' }],
      take: limit,
    });

    return crossSellProducts;
  }

  async getUpsellItems(productId: string, limit = 6): Promise<any[]> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true, price: true },
    });
    if (!product) return [];

    const upsellProducts = await this.prisma.product.findMany({
      where: {
        status: 'active',
        categoryId: product.categoryId,
        id: { not: productId },
        price: { gte: product.price * 1.3, lte: product.price * 3 },
      },
      include: {
        store: { select: { id: true, name: true, isOfficial: true } },
        brand: { select: { id: true, name: true } },
      },
      orderBy: [{ rating: 'desc' }, { soldCount: 'desc' }],
      take: limit,
    });

    return upsellProducts;
  }

  async getSimilarUsers(userId: string, limit = 10): Promise<string[]> {
    const userInteractions = await this.getUserInteractions(userId, 100);
    const userProductSet = new Set(userInteractions.map((i) => i.productId));
    if (userProductSet.size === 0) return [];

    const allUsers = await this.prisma.userActivity.groupBy({
      by: ['userId'],
      where: {
        userId: { not: userId },
        action: { in: ['VIEW_PRODUCT', 'ADD_TO_CART', 'PURCHASE'] },
      },
      _count: { userId: true },
      orderBy: { _count: { userId: 'desc' } },
      take: 100,
    });

    const similarities: Array<{ userId: string; score: number }> = [];
    for (const { userId: otherId } of allUsers) {
      const otherInteractions = await this.getUserInteractions(otherId, 50);
      const otherProductSet = new Set(
        otherInteractions.map((i) => i.productId),
      );
      const intersection = new Set(
        [...userProductSet].filter((x) => otherProductSet.has(x)),
      );
      const union = new Set([...userProductSet, ...otherProductSet]);
      const jaccard = union.size > 0 ? intersection.size / union.size : 0;
      if (jaccard > 0.1) {
        similarities.push({ userId: otherId, score: jaccard });
      }
    }

    return similarities
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((s) => s.userId);
  }

  async getColdStartRecommendations(limit = 20): Promise<any[]> {
    return this.prisma.product.findMany({
      where: { status: 'active' },
      include: {
        store: { select: { id: true, name: true, isOfficial: true } },
        brand: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
      },
      orderBy: [{ soldCount: 'desc' }, { rating: 'desc' }],
      take: limit,
    });
  }

  async trackInteraction(
    userId: string,
    productId: string,
    action: Interaction['action'],
  ): Promise<void> {
    const weightMap: Record<string, number> = {
      view: 0.1,
      add_to_cart: 0.5,
      wishlist: 0.6,
      purchase: 1.0,
    };

    await this.prisma.userActivity.create({
      data: {
        userId,
        action: action.toUpperCase() as any,
        metadata: { productId, weight: weightMap[action] || 0.1 },
      },
    });

    const cacheKey = `${userId}:interactions`;
    const cached = this.interactionCache.get(cacheKey);
    if (cached) {
      cached.push({
        userId,
        productId,
        action,
        timestamp: new Date(),
        weight: weightMap[action] || 0.1,
      });
    }
  }

  private async getUserInteractions(
    userId: string,
    limit = 100,
  ): Promise<Interaction[]> {
    const cacheKey = `${userId}:interactions`;
    const cached = this.interactionCache.get(cacheKey);
    if (cached) return cached.slice(0, limit);

    const activities = await this.prisma.userActivity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const interactions: Interaction[] = activities
      .map((a) => ({
        userId,
        productId: (a.metadata as any)?.productId || '',
        action:
          a.action === 'VIEW_PRODUCT'
            ? 'view'
            : a.action === 'ADD_TO_CART'
              ? 'add_to_cart'
              : a.action === 'PURCHASE'
                ? 'purchase'
                : 'wishlist',
        timestamp: a.createdAt,
        weight: (a.metadata as any)?.weight || 0.1,
      }))
      .filter((i) => i.productId) as Interaction[];

    this.interactionCache.set(cacheKey, interactions);
    return interactions;
  }

  private async getViewedCategoryIds(userId: string): Promise<string[]> {
    const history = await this.prisma.browsingHistory.findMany({
      where: { userId },
      select: { product: { select: { categoryId: true } } },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    return [...new Set(history.map((h) => h.product.categoryId))];
  }

  private predictRating(userId: string, productId: string): number {
    let userFactors = this.userFactorsMap.get(userId);
    let productFactors = this.productFactorsMap.get(productId);

    if (!userFactors) {
      userFactors = {
        userId,
        factors: Array.from(
          { length: this.latentFactors },
          () => (Math.random() - 0.5) * 0.1,
        ),
        bias: 0,
      };
      this.userFactorsMap.set(userId, userFactors);
    }

    if (!productFactors) {
      productFactors = {
        productId,
        factors: Array.from(
          { length: this.latentFactors },
          () => (Math.random() - 0.5) * 0.1,
        ),
        bias: 3.0,
      };
      this.productFactorsMap.set(productId, productFactors);
    }

    let prediction = 3.0 + userFactors.bias + productFactors.bias;
    for (let f = 0; f < this.latentFactors; f++) {
      prediction += userFactors.factors[f] * productFactors.factors[f];
    }

    return Math.max(1, Math.min(5, prediction));
  }
}
