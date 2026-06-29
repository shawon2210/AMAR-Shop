import { Injectable, Logger } from '@nestjs/common';
import { SearchService, SearchFilters } from './search.service';
import { EmbeddingsService } from '../ai/embeddings.service';
import { AIService } from '../ai/ai.service';
import { PrismaService } from '../../common/prisma.service';
import {
  HybridSearchResult,
  SearchIntent,
  AutocompleteSuggestion,
  LearningToRankSignal,
  SearchHeatmapDataPoint,
} from './interfaces/search-types.interface';

@Injectable()
export class EnhancedSearchService {
  private readonly logger = new Logger(EnhancedSearchService.name);
  private readonly ltrSignals: LearningToRankSignal[] = [];

  constructor(
    private readonly searchService: SearchService,
    private readonly embeddingsService: EmbeddingsService,
    private readonly aiService: AIService,
    private readonly prisma: PrismaService,
  ) {}

  async vectorSearch(query: string, filters: SearchFilters): Promise<any> {
    try {
      const embedding = await this.embeddingsService.generateEmbedding(query);
      const similar = await this.embeddingsService.searchSimilar(
        embedding.vector,
        50,
      );
      const productIds = similar.map((s) => s.id);

      if (productIds.length === 0) {
        return this.searchService.search(query, filters);
      }

      const candidates = await this.prisma.product.findMany({
        where: {
          id: { in: productIds },
          status: 'active',
          ...this.buildFilterWhere(filters),
        },
        include: {
          store: { select: { id: true, name: true, isOfficial: true } },
          brand: { select: { id: true, name: true } },
          category: { select: { id: true, name: true, slug: true } },
        },
      });

      const scored = candidates.map((product) => {
        const similarity = similar.find((s) => s.id === product.id);
        return {
          ...product,
          _vectorScore: similarity?.score || 0,
        };
      });

      scored.sort((a, b) => b._vectorScore - a._vectorScore);

      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const start = (page - 1) * limit;
      const paged = scored.slice(start, start + limit);

      return {
        items: paged,
        total: scored.length,
        page,
        limit,
        totalPages: Math.ceil(scored.length / limit),
        searchType: 'vector',
      };
    } catch (error) {
      this.logger.error(
        `Vector search failed, falling back to text search: ${error}`,
      );
      return this.searchService.search(query, filters);
    }
  }

  async hybridSearch(query: string, filters: SearchFilters): Promise<any> {
    try {
      const textResults = await this.searchService.search(query, filters);
      const vectorResults = await this.vectorSearch(query, filters);

      const textMap = new Map<string, { score: number; index: number }>();
      (textResults.items || []).forEach((item: any, index: number) => {
        textMap.set(item.id, {
          score: 1 - (index / Math.max(textResults.items.length, 1)) * 0.5,
          index,
        });
      });

      const vectorMap = new Map<string, number>();
      (vectorResults.items || []).forEach((item: any) => {
        vectorMap.set(item.id, item._vectorScore || 0);
      });

      const allIds = new Set([...textMap.keys(), ...vectorMap.keys()]);
      const combined: HybridSearchResult[] = [];

      for (const id of allIds) {
        const textInfo = textMap.get(id);
        const vectorScore = vectorMap.get(id) || 0;
        const textScore = textInfo?.score || 0;
        const textWeight = query ? 0.4 : 0;
        const vectorWeight = query ? 0.6 : 0;
        const finalScore = textScore * textWeight + vectorScore * vectorWeight;

        const product =
          (textResults.items || []).find((p: any) => p.id === id) ||
          (vectorResults.items || []).find((p: any) => p.id === id);

        if (product) {
          combined.push({
            textScore,
            vectorScore,
            finalScore,
            product,
          });
        }
      }

      combined.sort((a, b) => b.finalScore - a.finalScore);

      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const start = (page - 1) * limit;
      const paged = combined.slice(start, start + limit);

      return {
        items: paged.map((h) => h.product),
        total: combined.length,
        page,
        limit,
        totalPages: Math.ceil(combined.length / limit),
        searchType: 'hybrid',
      };
    } catch (error) {
      this.logger.error(`Hybrid search failed, falling back: ${error}`);
      return this.searchService.search(query, filters);
    }
  }

  async imageSearch(imageUrl: string): Promise<any[]> {
    this.logger.log(`Image search requested: ${imageUrl}`);
    return this.searchService.getTrendingProducts(20);
  }

  async voiceSearch(audioBuffer: Buffer): Promise<any> {
    this.logger.log('Voice search requested - text extraction not available');
    return { transcript: '', results: [] };
  }

  async personalizedSearch(
    userId: string,
    query: string,
    filters: SearchFilters,
  ): Promise<any> {
    const baseResults = await this.hybridSearch(query, filters);

    if (!userId || !baseResults.items?.length) return baseResults;

    try {
      const history = await this.prisma.browsingHistory.findMany({
        where: { userId },
        select: { product: { select: { categoryId: true, id: true } } },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });

      const viewedCategoryIds = new Set(
        history.map((h) => h.product.categoryId),
      );
      const viewedProductIds = new Set(history.map((h) => h.product.id));

      const scored = baseResults.items.map((product: any) => {
        let boost = 0;
        if (viewedCategoryIds.has(product.categoryId)) boost += 0.15;
        if (viewedProductIds.has(product.id)) boost += 0.1;
        return { ...product, _personalizationScore: boost };
      });

      scored.sort(
        (a: any, b: any) => b._personalizationScore - a._personalizationScore,
      );

      return { ...baseResults, items: scored, searchType: 'personalized' };
    } catch {
      return baseResults;
    }
  }

  collectLtrSignal(signal: LearningToRankSignal): void {
    this.ltrSignals.push({
      ...signal,
      features: {
        position: 1 - signal.position / 100,
        clicked: signal.clicked ? 1 : 0,
        dwellTimeNormalized: Math.min(signal.dwellTimeMs / 30000, 1),
        ...signal.features,
      },
    });

    if (this.ltrSignals.length > 10000) {
      this.ltrSignals.splice(0, 1000);
    }
  }

  async getSearchIntents(query: string): Promise<SearchIntent> {
    const queryLower = query.toLowerCase();
    const intent: SearchIntent = {
      primary: 'product',
      attributes: {},
      confidence: 0.5,
    };

    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true },
    });

    for (const cat of categories) {
      if (
        queryLower.includes(cat.name.toLowerCase()) ||
        queryLower.includes(cat.slug.toLowerCase())
      ) {
        intent.categoryIntent = cat.id;
        intent.confidence = 0.8;
        break;
      }
    }

    const brands = await this.prisma.brand.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
    });

    for (const brand of brands) {
      if (queryLower.includes(brand.name.toLowerCase())) {
        intent.brandIntent = brand.id;
        intent.confidence = Math.max(intent.confidence, 0.7);
        break;
      }
    }

    if (
      /\b(budget|cheap|under|affordable|luxury|premium|expensive)\b/.test(
        queryLower,
      )
    ) {
      if (/budget|cheap|under|affordable/.test(queryLower)) {
        intent.priceIntent = 'budget';
      } else {
        intent.priceIntent = 'premium';
      }
      intent.confidence = Math.max(intent.confidence, 0.6);
    }

    return intent;
  }

  async getSearchHeatmapData(dateRange: {
    start: string;
    end: string;
  }): Promise<SearchHeatmapDataPoint[]> {
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    const searches = await this.prisma.searchHistory.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      select: { query: true, createdAt: true },
    });

    const heatmap = new Map<string, Map<number, number>>();
    for (const s of searches) {
      const dateKey = s.createdAt.toISOString().split('T')[0];
      const hour = s.createdAt.getHours();
      if (!heatmap.has(dateKey)) heatmap.set(dateKey, new Map());
      const hourMap = heatmap.get(dateKey)!;
      hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
    }

    const result: SearchHeatmapDataPoint[] = [];
    for (const [date, hours] of heatmap) {
      for (const [hour, count] of hours) {
        result.push({ date, hour, query: '_total', count });
      }
    }

    return result.sort(
      (a, b) => a.date.localeCompare(b.date) || a.hour - b.hour,
    );
  }

  async autoCompleteWithAI(query: string): Promise<AutocompleteSuggestion[]> {
    if (!query || query.length < 2) return [];

    const baseSuggestions = await this.searchService.autocomplete(query);
    const suggestions: AutocompleteSuggestion[] = baseSuggestions.map(
      (s: any) => ({
        text: s.text || s.name || '',
        type: s.type === 'product' ? 'product' : 'query',
        score: s.count ? Math.min(s.count / 100, 1) : 0.5,
        metadata: s.slug
          ? { slug: s.slug, price: s.price, image: s.image }
          : undefined,
      }),
    );

    if (suggestions.length < 5) {
      try {
        const aiSuggestions = await this.aiService.semanticMatch(query, []);
        suggestions.push({
          text: `${query} products`,
          type: 'ai-enhanced',
          score: 0.3,
        });
      } catch {}
    }

    return suggestions.slice(0, 8);
  }

  private buildFilterWhere(filters: SearchFilters): Record<string, any> {
    const where: Record<string, any> = {};
    if (filters.category) where.categoryId = filters.category;
    if (filters.minPrice !== undefined)
      where.price = { ...(where.price || {}), gte: filters.minPrice };
    if (filters.maxPrice !== undefined)
      where.price = { ...(where.price || {}), lte: filters.maxPrice };
    if (filters.rating !== undefined) where.rating = { gte: filters.rating };
    if (filters.inStock !== undefined) where.inStock = filters.inStock;
    return where;
  }
}
