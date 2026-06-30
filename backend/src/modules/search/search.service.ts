import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  brand?: string;
  seller?: string;
  inStock?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  relevanceScore?: number;
}

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(
    query: string,
    filters: SearchFilters,
  ): Promise<SearchResult<any>> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'active',
    };

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { shortDescription: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (filters.category) {
      where.categoryId = filters.category;
    }

    if (filters.minPrice !== undefined) {
      where.price = { ...(where.price || {}), gte: filters.minPrice };
    }

    if (filters.maxPrice !== undefined) {
      where.price = { ...(where.price || {}), lte: filters.maxPrice };
    }

    if (filters.rating !== undefined) {
      where.rating = { gte: filters.rating };
    }

    if (filters.brand) {
      where.brand = { name: { contains: filters.brand, mode: 'insensitive' } };
    }

    if (filters.seller) {
      where.store = { name: { contains: filters.seller, mode: 'insensitive' } };
    }

    if (filters.inStock !== undefined) {
      where.inStock = filters.inStock;
    }

    let orderBy: any = { createdAt: 'desc' };
    switch (filters.sort) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'sold':
        orderBy = { soldCount: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          store: { select: { id: true, name: true, isOfficial: true } },
          brand: { select: { id: true, name: true } },
          category: { select: { id: true, name: true, slug: true } },
        },
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async autocomplete(query: string) {
    if (!query) return [];

    const products = await this.prisma.product.findMany({
      where: {
        status: 'active',
        name: { contains: query, mode: 'insensitive' },
      },
      select: { id: true, name: true, slug: true, price: true, images: true },
      take: 10,
      orderBy: { soldCount: 'desc' },
    });

    const popularSearches = await this.prisma.searchHistory.groupBy({
      by: ['query'],
      _count: { query: true },
      where: { query: { contains: query, mode: 'insensitive' } },
      orderBy: { _count: { query: 'desc' } },
      take: 5,
    });

    const suggestions = [
      ...products.map((p) => ({
        type: 'product' as const,
        id: p.id,
        text: p.name,
        slug: p.slug,
        price: p.price,
        image: p.images[0],
      })),
      ...popularSearches.map((s) => ({
        type: 'query' as const,
        text: s.query,
        count: s._count.query,
      })),
    ];

    return suggestions.slice(0, 10);
  }

  async getSuggestions(query: string) {
    if (!query) return [];

    const exact = await this.prisma.product.count({
      where: {
        name: { contains: query, mode: 'insensitive' },
        status: 'active',
      },
    });

    if (exact === 0) {
      const corrected = await this.prisma.product.findFirst({
        where: {
          status: 'active',
          name: {
            mode: 'insensitive',
            contains: query.replace(/[^a-zA-Z0-9 ]/g, ''),
          },
        },
        select: { name: true },
        orderBy: { soldCount: 'desc' },
      });

      if (corrected) {
        return [
          {
            type: 'correction' as const,
            original: query,
            suggestion: corrected.name,
          },
        ];
      }
    }

    return this.autocomplete(query);
  }

  async getPopularSearches(limit = 10) {
    const searches = await this.prisma.searchHistory.groupBy({
      by: ['query'],
      _count: { query: true },
      orderBy: { _count: { query: 'desc' } },
      take: limit,
    });

    return searches.map((s) => ({ query: s.query, count: s._count.query }));
  }

  async getTrendingProducts(limit = 20) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const products = await this.prisma.product.findMany({
      where: {
        status: 'active',
        OR: [
          { createdAt: { gte: sevenDaysAgo } },
          { updatedAt: { gte: sevenDaysAgo } },
        ],
      },
      include: {
        store: { select: { id: true, name: true, isOfficial: true } },
        brand: { select: { id: true, name: true } },
      },
      orderBy: [{ soldCount: 'desc' }, { reviewCount: 'desc' }],
      take: limit,
    });

    return products;
  }

  async getRecentlyViewed(userId: string, limit = 20) {
    const history = await this.prisma.browsingHistory.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            store: { select: { id: true, name: true, isOfficial: true } },
            brand: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const seen = new Set<string>();
    return history
      .filter((h) => {
        if (seen.has(h.productId)) return false;
        seen.add(h.productId);
        return true;
      })
      .map((h) => h.product);
  }

  async getPersonalizedFeed(userId: string, limit = 20) {
    const browsingHistory = await this.prisma.browsingHistory.findMany({
      where: { userId },
      include: { product: { select: { categoryId: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const categoryIds = [
      ...new Set(browsingHistory.map((b) => b.product.categoryId)),
    ];

    if (categoryIds.length === 0) {
      return this.getTrendingProducts(limit);
    }

    const products = await this.prisma.product.findMany({
      where: {
        status: 'active',
        categoryId: { in: categoryIds },
      },
      include: {
        store: { select: { id: true, name: true, isOfficial: true } },
        brand: { select: { id: true, name: true } },
      },
      orderBy: [{ rating: 'desc' }, { soldCount: 'desc' }],
      take: limit,
    });

    return products;
  }

  async indexProduct(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        store: { select: { id: true, name: true } },
        brand: true,
        category: true,
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    return { indexed: true, product };
  }

  removeFromIndex(productId: string) {
    return { removed: true, productId };
  }

  async logSearch(userId: string | null, query: string, resultsCount: number) {
    if (!userId) return;

    await this.prisma.searchHistory.create({
      data: {
        userId,
        query: query.toLowerCase().trim(),
        results: resultsCount,
      },
    });
  }

  async getFacetedFilters(categoryId?: string) {
    const where: any = { status: 'active' };
    if (categoryId) where.categoryId = categoryId;

    const [brandsResult, priceAggregation, ratingBuckets] = await Promise.all([
      this.prisma.product.groupBy({
        by: ['brandId'],
        where,
        _count: { brandId: true },
      }),
      this.prisma.product.aggregate({
        where,
        _min: { price: true },
        _max: { price: true },
      }),
      this.prisma.product.groupBy({
        by: ['rating'],
        where: { ...where, rating: { gte: 1 } },
        _count: { rating: true },
      }),
    ]);

    const brandIds = brandsResult
      .map((b) => b.brandId)
      .filter(Boolean) as string[];
    const brands =
      brandIds.length > 0
        ? await this.prisma.brand.findMany({
            where: { id: { in: brandIds } },
            select: { id: true, name: true },
          })
        : [];

    const brandFilters = brands.map((b) => {
      const count =
        brandsResult.find((br) => br.brandId === b.id)?._count.brandId || 0;
      return { id: b.id, name: b.name, count };
    });

    const priceRanges = [
      { label: 'Under ৳500', min: 0, max: 500 },
      { label: '৳500 - ৳1,000', min: 500, max: 1000 },
      { label: '৳1,000 - ৳5,000', min: 1000, max: 5000 },
      { label: '৳5,000 - ৳10,000', min: 5000, max: 10000 },
      { label: 'Over ৳10,000', min: 10000, max: undefined },
    ];

    const ratingFilters = [4, 3, 2, 1].map((r) => ({
      rating: r,
      label: `${r}+ Stars`,
      count: ratingBuckets
        .filter((b) => b.rating >= r)
        .reduce((sum, b) => sum + b._count.rating, 0),
    }));

    return {
      brands: brandFilters,
      priceRanges,
      ratings: ratingFilters,
      priceRange: {
        min: priceAggregation._min.price || 0,
        max: priceAggregation._max.price || 0,
      },
    };
  }
}
