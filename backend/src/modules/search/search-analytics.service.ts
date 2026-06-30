import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class SearchAnalyticsService {
  private readonly logger = new Logger(SearchAnalyticsService.name);

  constructor(private prisma: PrismaService) {}

  async logSearch(
    query: string,
    userId: string | null,
    resultsCount: number,
  ): Promise<string> {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    if (userId) {
      await this.prisma.searchHistory.create({
        data: {
          userId,
          query: query.toLowerCase().trim(),
          results: resultsCount,
        },
      });
    }

    return sessionId;
  }

  logClick(searchSessionId: string, productId: string, position: number): void {
    this.logger.debug(
      `Click logged: search=${searchSessionId} product=${productId} pos=${position}`,
    );
  }

  async getPopularSearches(
    timeframe: 'today' | 'week' | 'month' | 'all' = 'week',
    limit = 20,
  ): Promise<Array<{ query: string; count: number }>> {
    const dateFilter: Record<string, Date | undefined> = {};
    const now = new Date();

    switch (timeframe) {
      case 'today':
        dateFilter.gte = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );
        break;
      case 'week':
        dateFilter.gte = new Date(now.getTime() - 7 * 86400000);
        break;
      case 'month':
        dateFilter.gte = new Date(now.getTime() - 30 * 86400000);
        break;
    }

    const searches = await this.prisma.searchHistory.groupBy({
      by: ['query'],
      _count: { query: true },
      where:
        Object.keys(dateFilter).length > 0
          ? { createdAt: dateFilter as any }
          : undefined,
      orderBy: { _count: { query: 'desc' } },
      take: limit,
    });

    return searches.map((s) => ({ query: s.query, count: s._count.query }));
  }

  async getZeroResultSearches(
    limit = 50,
  ): Promise<Array<{ query: string; count: number; lastSearched: Date }>> {
    const searches = await this.prisma.searchHistory.groupBy({
      by: ['query'],
      where: { results: 0 },
      _count: { query: true },
      _max: { createdAt: true },
      orderBy: { _count: { query: 'desc' } },
      take: limit,
    });

    return searches.map((s) => ({
      query: s.query,
      count: s._count.query,
      lastSearched: s._max.createdAt || new Date(),
    }));
  }

  async getSearchConversionRate(): Promise<{
    total: number;
    withPurchase: number;
    rate: number;
  }> {
    const searches = await this.prisma.searchHistory.count();
    const buyers = await this.prisma.userActivity.groupBy({
      by: ['userId'],
      where: { action: 'PURCHASE' },
      _count: { userId: true },
    });

    return {
      total: searches,
      withPurchase: buyers.length,
      rate: searches > 0 ? buyers.length / searches : 0,
    };
  }

  async getTopSearchCategories(
    limit = 10,
  ): Promise<Array<{ category: string; count: number }>> {
    const recentSearches = await this.prisma.searchHistory.findMany({
      where: { query: { not: '' } },
      orderBy: { createdAt: 'desc' },
      take: 1000,
    });

    const categoryKeywords: Record<string, string[]> = {
      Electronics: [
        'phone',
        'laptop',
        'camera',
        'tv',
        'tablet',
        'headphone',
        'charger',
      ],
      Fashion: ['shirt', 'dress', 'shoe', 'watch', 'bag', 'jewelry', 'fashion'],
      'Home & Kitchen': ['furniture', 'kitchen', 'home', 'decor', 'appliance'],
      Beauty: ['beauty', 'cosmetic', 'skin care', 'hair', 'perfume'],
      Sports: ['sport', 'gym', 'fitness', 'cycle', 'football'],
    };

    const categoryCounts: Record<string, number> = {};
    for (const search of recentSearches) {
      for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some((k) => search.query.toLowerCase().includes(k))) {
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        }
      }
    }

    return Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([category, count]) => ({ category, count }));
  }

  async getSearchTrends(
    days = 30,
  ): Promise<Array<{ date: string; total: number; unique: number }>> {
    const startDate = new Date(Date.now() - days * 86400000);

    const searches = await this.prisma.searchHistory.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true, userId: true },
    });

    const dailyStats = new Map<string, { total: number; users: Set<string> }>();
    for (const s of searches) {
      const dateKey = s.createdAt.toISOString().split('T')[0];
      if (!dailyStats.has(dateKey)) {
        dailyStats.set(dateKey, { total: 0, users: new Set() });
      }
      const stat = dailyStats.get(dateKey)!;
      stat.total++;
      if (s.userId) stat.users.add(s.userId);
    }

    return Array.from(dailyStats.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, stat]) => ({
        date,
        total: stat.total,
        unique: stat.users.size,
      }));
  }
}
