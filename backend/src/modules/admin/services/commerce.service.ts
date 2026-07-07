import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';

@Injectable()
export class AdminCommerceService {
  constructor(private prisma: PrismaService) {}

  async getProducts(query: { page?: number; limit?: number; status?: string; search?: string; category?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};

    if (query.status) where.status = query.status;
    if (query.category) where.categoryId = query.category;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' as const } },
        { description: { contains: query.search, mode: 'insensitive' as const } },
      ];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { id: true, name: true } },
          store: { select: { id: true, name: true } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { products, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async createProduct(data: {
    slug: string; name: string; description?: string; price: number; originalPrice?: number;
    images?: string[]; stockCount: number; categoryId: string; storeId: string; status?: string;
  }) {
    const slug = data.slug ||
      data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' +
      Math.random().toString(36).substring(2, 8);

    return this.prisma.product.create({
      data: {
        name: data.name, slug,
        description: data.description || '',
        price: parseFloat(String(data.price)),
        originalPrice: data.originalPrice ? parseFloat(String(data.originalPrice)) : undefined,
        images: data.images || [],
        stockCount: parseInt(String(data.stockCount)) || 0,
        categoryId: data.categoryId,
        storeId: data.storeId,
        status: data.status || 'active',
      },
    });
  }

  async updateProduct(productId: string, data: {
    name?: string; description?: string; price?: number; stockCount?: number;
    images?: string[]; status?: string; categoryId?: string;
  }) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        description: data.description,
        price: data.price !== undefined ? parseFloat(String(data.price)) : undefined,
        stockCount: data.stockCount !== undefined ? parseInt(String(data.stockCount)) : undefined,
        images: data.images,
        status: data.status,
        categoryId: data.categoryId,
      },
    });
  }

  async deleteProduct(productId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
    await this.prisma.product.delete({ where: { id: productId } });
    return { message: 'Product deleted', productId };
  }

  async approveProduct(productId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
    return this.prisma.product.update({ where: { id: productId }, data: { status: 'active' } });
  }

  async rejectProduct(productId: string, reason: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
    return this.prisma.product.update({ where: { id: productId }, data: { status: 'rejected', rejectReason: reason } });
  }

  async getCategories() {
    return this.prisma.category.findMany({
      include: { _count: { select: { products: true } }, parent: { select: { id: true, name: true } } },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createCategory(data: { slug?: string; name: string; bnName?: string; icon?: string; description?: string; image?: string; parentId?: string; sortOrder?: number }) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return this.prisma.category.create({
      data: {
        name: data.name, bnName: data.bnName, slug, icon: data.icon,
        description: data.description, image: data.image,
        parentId: data.parentId, sortOrder: data.sortOrder || 0,
      },
    });
  }

  async updateCategory(categoryId: string, data: {
    name?: string; bnName?: string; slug?: string; icon?: string;
    description?: string; image?: string; parentId?: string | null; sortOrder?: number;
  }) {
    const cat = await this.prisma.category.findUnique({ where: { id: categoryId } });
    if (!cat) throw new NotFoundException('Category not found');
    return this.prisma.category.update({ where: { id: categoryId }, data });
  }

  async deleteCategory(categoryId: string) {
    const cat = await this.prisma.category.findUnique({ where: { id: categoryId } });
    if (!cat) throw new NotFoundException('Category not found');
    await this.prisma.category.delete({ where: { id: categoryId } });
    return { message: 'Category deleted', categoryId };
  }

  async getOrders(query: { page?: number; limit?: number; status?: string; from?: string; to?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};

    if (query.status) where.status = query.status;
    if (query.from || query.to) {
      const createdAt: Record<string, Date> = {};
      if (query.from) createdAt.gte = new Date(query.from);
      if (query.to) createdAt.lte = new Date(query.to);
      where.createdAt = createdAt;
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, phone: true } },
          items: { include: { product: { select: { id: true, name: true, images: true } } } },
          address: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateOrderStatus(orderId: string, status: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    return this.prisma.order.update({ where: { id: orderId }, data: { status: status as any } });
  }

  async addOrderNote(orderId: string, note: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    const previous = order.note || '';
    const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const updated = previous ? `${previous}\n[${timestamp}] ${note}` : `[${timestamp}] ${note}`;
    return this.prisma.order.update({ where: { id: orderId }, data: { note: updated } });
  }

  async getPayments(query: { page?: number; limit?: number; status?: string; from?: string; to?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};

    if (query.status) where.status = query.status;
    if (query.from || query.to) {
      const createdAt: Record<string, Date> = {};
      if (query.from) createdAt.gte = new Date(query.from);
      if (query.to) createdAt.lte = new Date(query.to);
      where.createdAt = createdAt;
    }

    const [payments, total] = await Promise.all([
      this.prisma.paymentTransaction.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          order: { select: { id: true, orderNumber: true } },
          user: { select: { id: true, name: true } },
        },
      }),
      this.prisma.paymentTransaction.count({ where }),
    ]);

    return { payments, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
