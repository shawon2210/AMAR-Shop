import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class ProductsService {
  private prisma: any;

  constructor(private prismaService: PrismaService) {
    this.prisma = this.prismaService.client;
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    category?: string;
    search?: string;
    flashSale?: boolean;
    sort?: string;
  }) {
    const { skip = 0, take = 20, category, search, flashSale, sort } = params;
    const where: Record<string, unknown> = {};

    if (category) {
      where.category = { slug: category };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (flashSale) {
      where.isFlashSale = true;
    }

    let orderBy: Record<string, string> = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'rating') orderBy = { rating: 'desc' };
    if (sort === 'sales') orderBy = { soldPercent: 'desc' };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          category: true,
          store: { select: { id: true, name: true, isOfficial: true } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { products, total, skip, take };
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        store: { select: { id: true, name: true, isOfficial: true } },
        reviews: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        store: { select: { id: true, name: true, isOfficial: true } },
      },
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async getRelated(productId: string, take = 6) {
    const product = await this.findById(productId);
    return this.prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: productId },
        inStock: true,
      },
      take,
      orderBy: { rating: 'desc' },
      include: {
        category: true,
        store: { select: { id: true, name: true, isOfficial: true } },
      },
    });
  }

  async getFlashSales() {
    return this.prisma.product.findMany({
      where: {
        isFlashSale: true,
        inStock: true,
      },
      include: {
        category: true,
        store: { select: { id: true, name: true, isOfficial: true } },
      },
      orderBy: { soldPercent: 'desc' },
    });
  }
}
