import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class CategoriesService {
  private prisma: PrismaService;

  constructor(private prismaService: PrismaService) {
    this.prisma = this.prismaService;
  }

  async findAll() {
    return this.prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: true,
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.category.findUnique({
      where: { slug },
      include: {
        children: true,
        _count: { select: { products: true } },
      },
    });
  }

  async getProductsByCategory(slug: string) {
    const category = await this.findBySlug(slug);
    if (!category) return null;
    return { category };
  }
}
