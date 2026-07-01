import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalSellers,
      totalProducts,
      totalOrders,
      revenueAgg,
      recentOrders,
      pendingSellers,
      lowStockProducts,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isSeller: true } }),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: true },
      }),
      this.prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, avatar: true } },
          items: {
            take: 3,
            include: { product: { select: { name: true, images: true } } },
          },
        },
      }),
      this.prisma.sellerProfile.findMany({
        where: { isKycVerified: false, kycSubmittedAt: { not: null } },
        include: {
          user: { select: { id: true, name: true, phone: true, email: true } },
        },
      }),
      this.prisma.product.count({
        where: { stockCount: { lte: 10 }, inStock: true },
      }),
    ]);

    const revenueData = await this.prisma.order.findMany({
      where: { paymentStatus: true, paidAt: { gte: thirtyDaysAgo } },
      select: { total: true, paidAt: true },
      orderBy: { paidAt: 'asc' },
    });

    const revenueChart: { date: string; revenue: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayRevenue = revenueData
        .filter(
          (r) => r.paidAt && r.paidAt.toISOString().split('T')[0] === dateStr,
        )
        .reduce((sum, r) => sum + r.total, 0);
      revenueChart.push({ date: dateStr, revenue: dayRevenue });
    }

    return {
      totalUsers,
      totalSellers,
      totalProducts,
      totalOrders,
      totalRevenue: revenueAgg._sum.total || 0,
      revenueChart,
      recentOrders,
      pendingSellerApprovals: pendingSellers,
      lowStockAlerts: lowStockProducts,
    };
  }

  async getUsers(query: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' as const } },
        { phone: { contains: query.search } },
        { email: { contains: query.search, mode: 'insensitive' as const } },
      ];
    }
    if (query.role) where.role = query.role;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isSeller: true,
          isActive: true,
          isVerified: true,
          createdAt: true,
          lastLoginAt: true,
          avatar: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateUser(
    userId: string,
    data: { isActive?: boolean; role?: string; isVerified?: boolean },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id: userId },
      data: data as any,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        isVerified: true,
      },
    });
  }

  async getSellers(query: {
    page?: number;
    limit?: number;
    search?: string;
    kycStatus?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = { isSeller: true };

    if (query.kycStatus === 'verified')
      where.sellerProfile = { isKycVerified: true };
    if (query.kycStatus === 'pending')
      where.sellerProfile = {
        isKycVerified: false,
        kycSubmittedAt: { not: null },
      };
    if (query.kycStatus === 'none') where.sellerProfile = null;

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' as const } },
        { phone: { contains: query.search } },
        {
          store: {
            name: { contains: query.search, mode: 'insensitive' as const },
          },
        },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          isActive: true,
          createdAt: true,
          store: {
            select: {
              id: true,
              name: true,
              slug: true,
              isActive: true,
              followerCount: true,
              rating: true,
            },
          },
          sellerProfile: {
            select: {
              id: true,
              isKycVerified: true,
              kycSubmittedAt: true,
              kycVerifiedAt: true,
              kycRejectedReason: true,
              level: true,
              performanceScore: true,
              totalOrders: true,
              totalRevenue: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      sellers: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async approveSeller(sellerId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: sellerId },
      include: { sellerProfile: true, store: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.sellerProfile)
      throw new BadRequestException('User has no seller profile');

    await this.prisma.sellerProfile.update({
      where: { userId: sellerId },
      data: {
        isKycVerified: true,
        kycVerifiedAt: new Date(),
        kycRejectedReason: null,
      },
    });

    if (user.store) {
      await this.prisma.store.update({
        where: { id: user.store.id },
        data: { isActive: true },
      });
    }

    return { message: 'Seller approved successfully', sellerId };
  }

  async rejectSeller(sellerId: string, reason: string) {
    if (!reason) throw new BadRequestException('Rejection reason is required');

    const user = await this.prisma.user.findUnique({
      where: { id: sellerId },
      include: { sellerProfile: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.sellerProfile)
      throw new BadRequestException('User has no seller profile');

    await this.prisma.sellerProfile.update({
      where: { userId: sellerId },
      data: { isKycVerified: false, kycRejectedReason: reason },
    });

    return { message: 'Seller rejected', sellerId, reason };
  }

  async getProducts(query: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    category?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};

    if (query.status) where.status = query.status;
    if (query.category) where.categoryId = query.category;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' as const } },
        {
          description: { contains: query.search, mode: 'insensitive' as const },
        },
      ];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { id: true, name: true } },
          store: { select: { id: true, name: true } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async approveProduct(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    return this.prisma.product.update({
      where: { id: productId },
      data: { status: 'active' },
    });
  }

  async rejectProduct(productId: string, reason: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    return this.prisma.product.update({
      where: { id: productId },
      data: { status: 'rejected', rejectReason: reason },
    });
  }

  async getOrders(query: {
    page?: number;
    limit?: number;
    status?: string;
    from?: string;
    to?: string;
  }) {
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
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, phone: true } },
          items: {
            include: {
              product: { select: { id: true, name: true, images: true } },
            },
          },
          address: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getPayments(query: {
    page?: number;
    limit?: number;
    status?: string;
    from?: string;
    to?: string;
  }) {
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
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          order: { select: { id: true, orderNumber: true } },
          user: { select: { id: true, name: true } },
        },
      }),
      this.prisma.paymentTransaction.count({ where }),
    ]);

    return {
      payments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getFlashSales() {
    return this.prisma.campaign.findMany({
      where: { type: 'FLASH_SALE' },
      orderBy: { createdAt: 'desc' },
      include: {
        store: { select: { id: true, name: true } },
        products: {
          include: {
            product: {
              select: { id: true, name: true, images: true, price: true },
            },
          },
        },
      },
    });
  }

  async createFlashSale(data: any) {
    return this.prisma.campaign.create({
      data: {
        title: data.title,
        slug:
          data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') +
          '-' +
          Math.random().toString(36).substring(2, 8),
        type: 'FLASH_SALE',
        description: data.description,
        banner: data.banner,
        status: data.status || 'DRAFT',
        startsAt: new Date(data.startsAt),
        endsAt: new Date(data.endsAt),
        discount: data.discount,
        maxProducts: data.maxProducts,
      },
    });
  }

  async getCategories() {
    return this.prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
        parent: { select: { id: true, name: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createCategory(data: any) {
    const slug =
      data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return this.prisma.category.create({
      data: {
        name: data.name,
        bnName: data.bnName,
        slug,
        icon: data.icon,
        description: data.description,
        image: data.image,
        parentId: data.parentId,
        sortOrder: data.sortOrder || 0,
      },
    });
  }

  async getBanners() {
    return this.prisma.banner.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async createBanner(data: any) {
    return this.prisma.banner.create({
      data: {
        title: data.title,
        image: data.image,
        link: data.link,
        position: data.position,
        sortOrder: data.sortOrder || 0,
        storeId: data.storeId,
      },
    });
  }

  async getCoupons(query: {
    page?: number;
    limit?: number;
    isActive?: boolean;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};
    if (query.isActive !== undefined) where.isActive = query.isActive;

    const [coupons, total] = await Promise.all([
      this.prisma.coupon.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.coupon.count({ where }),
    ]);

    return {
      coupons,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createCoupon(data: any) {
    return this.prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        type: data.type,
        value: data.value,
        minPurchase: data.minPurchase || 0,
        maxUses: data.maxUses,
        maxPerUser: data.maxPerUser || 1,
        isActive: data.isActive !== false,
        startsAt: data.startsAt ? new Date(data.startsAt) : undefined,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      },
    });
  }

  async getAnalytics() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [revenueData, orderData, userData, topCategories, topSellers] =
      await Promise.all([
        this.prisma.order.findMany({
          where: { paymentStatus: true, paidAt: { gte: thirtyDaysAgo } },
          select: { total: true, paidAt: true },
        }),
        this.prisma.order.groupBy({ by: ['status'], _count: { id: true } }),
        this.prisma.user.groupBy({ by: ['role'], _count: { id: true } }),
        this.prisma.product.groupBy({
          by: ['categoryId'],
          _count: { id: true },
          _sum: { soldCount: true },
          orderBy: { _sum: { soldCount: 'desc' } },
          take: 10,
        }),
        this.prisma.store.findMany({
          orderBy: { rating: 'desc' },
          take: 10,
          select: {
            id: true,
            name: true,
            followerCount: true,
            rating: true,
            _count: { select: { products: true } },
          },
        }),
      ]);

    const revenueChart: { date: string; revenue: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayRevenue = revenueData
        .filter(
          (r) => r.paidAt && r.paidAt.toISOString().split('T')[0] === dateStr,
        )
        .reduce((sum, r) => sum + r.total, 0);
      revenueChart.push({ date: dateStr, revenue: dayRevenue });
    }

    const topCategoriesWithNames = await Promise.all(
      topCategories.map(async (c) => {
        const cat = await this.prisma.category.findUnique({
          where: { id: c.categoryId },
        });
        return {
          categoryId: c.categoryId,
          categoryName: cat?.name || 'Unknown',
          productCount: c._count.id,
          totalSold: c._sum.soldCount || 0,
        };
      }),
    );

    return {
      revenueChart,
      orderStats: orderData,
      userStats: userData,
      topCategories: topCategoriesWithNames,
      topSellers,
    };
  }

  async getReports(type: string, query: { from?: string; to?: string }) {
    const from = query.from ? new Date(query.from) : new Date(0);
    const to = query.to ? new Date(query.to) : new Date();

    if (type === 'sales') {
      const orders = await this.prisma.order.findMany({
        where: { createdAt: { gte: from, lte: to } },
        include: { items: true },
      });
      const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
      const totalOrders = orders.length;
      const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

      return {
        totalSales,
        totalOrders,
        avgOrderValue,
        orders,
        period: { from, to },
      };
    }

    if (type === 'sellers') {
      const sellers = await this.prisma.user.findMany({
        where: { isSeller: true, createdAt: { gte: from, lte: to } },
        include: {
          store: {
            select: {
              id: true,
              name: true,
              followerCount: true,
              rating: true,
              _count: { select: { products: true } },
            },
          },
          sellerProfile: {
            select: {
              totalOrders: true,
              totalRevenue: true,
              performanceScore: true,
            },
          },
        },
      });

      return { totalSellers: sellers.length, sellers, period: { from, to } };
    }

    if (type === 'products') {
      const products = await this.prisma.product.findMany({
        where: { createdAt: { gte: from, lte: to } },
        orderBy: { soldCount: 'desc' },
        include: {
          category: { select: { id: true, name: true } },
          store: { select: { id: true, name: true } },
        },
      });

      const totalProducts = products.length;
      const totalSold = products.reduce((sum, p) => sum + p.soldCount, 0);

      return { totalProducts, totalSold, products, period: { from, to } };
    }

    throw new BadRequestException(
      'Invalid report type. Use: sales, sellers, products',
    );
  }

  async updateSettings(data: any) {
    const results: Record<string, unknown> = {};
    if (data.commissionRate !== undefined) {
      await this.prisma.store.updateMany({
        data: {
          commission: data.commissionRate,
          commissionRate: data.commissionRate,
        },
      });
      results.commissionRate = data.commissionRate;
    }
    return { message: 'Settings updated', ...results };
  }

  // ─── Product CRUD ──────────────────────────────────────

  async updateProduct(productId: string, data: any) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        description: data.description,
        price: data.price !== undefined ? parseFloat(data.price) : undefined,
        stockCount:
          data.stockCount !== undefined
            ? parseInt(data.stockCount)
            : undefined,
        images: data.images,
        status: data.status,
        categoryId: data.categoryId,
      },
    });
  }

  async createProduct(data: any) {
    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') +
        '-' +
        Math.random().toString(36).substring(2, 8);

    return this.prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description || '',
        price: parseFloat(data.price),
        originalPrice: data.originalPrice
          ? parseFloat(data.originalPrice)
          : undefined,
        images: data.images || [],
        stockCount: parseInt(data.stockCount) || 0,
        categoryId: data.categoryId,
        storeId: data.storeId,
        status: data.status || 'active',
      },
    });
  }

  async deleteProduct(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    await this.prisma.product.delete({ where: { id: productId } });
    return { message: 'Product deleted', productId };
  }

  // ─── Order Status ──────────────────────────────────────

  async updateOrderStatus(orderId: string, status: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
    });
  }

  async addOrderNote(orderId: string, note: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');

    const previous = order.note || '';
    const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const updated = previous
      ? `${previous}\n[${timestamp}] ${note}`
      : `[${timestamp}] ${note}`;

    return this.prisma.order.update({
      where: { id: orderId },
      data: { note: updated },
    });
  }

  // ─── Seller Management ─────────────────────────────────

  async updateSeller(
    sellerId: string,
    data: {
      commission?: number;
      commissionRate?: number;
    },
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: sellerId },
      include: { store: true },
    });
    if (!user) throw new NotFoundException('User not found');

    if (user.store && data.commissionRate !== undefined) {
      await this.prisma.store.update({
        where: { id: user.store.id },
        data: {
          commissionRate: data.commissionRate,
          commission: data.commissionRate,
        },
      });
    }

    return { message: 'Seller updated', sellerId };
  }

  async toggleStoreStatus(sellerId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: sellerId },
      include: { store: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.store) throw new BadRequestException('User has no store');

    const store = await this.prisma.store.update({
      where: { id: user.store.id },
      data: { isActive: !user.store.isActive },
    });

    return {
      message: `Store ${store.isActive ? 'activated' : 'suspended'}`,
      isActive: store.isActive,
    };
  }

  // ─── Admin User Creation ───────────────────────────────

  async createAdminUser(data: {
    name: string;
    phone: string;
    password: string;
    email?: string;
  }) {
    const existing = await this.prisma.user.findUnique({
      where: { phone: data.phone },
    });
    if (existing) throw new BadRequestException('Phone number already exists');

    const hashedPassword = await bcrypt.hash(data.password, 12);

    return this.prisma.user.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        password: hashedPassword,
        role: 'ADMIN',
        isVerified: true,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async getSupportTickets(query: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};

    if (query.status) where.status = query.status;
    if (query.priority) where.priority = query.priority;

    const [tickets, total] = await Promise.all([
      this.prisma.supportTicket.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, phone: true, avatar: true } },
        },
      }),
      this.prisma.supportTicket.count({ where }),
    ]);

    return {
      tickets,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getSupportTicket(id: string) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, phone: true, avatar: true } },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: { select: { id: true, name: true, avatar: true } },
          },
        },
      },
    });
    if (!ticket) throw new NotFoundException('Support ticket not found');
    return ticket;
  }

  async replyToTicket(id: string, senderId: string, content: string) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
    });
    if (!ticket) throw new NotFoundException('Support ticket not found');

    const [message] = await Promise.all([
      this.prisma.message.create({
        data: {
          supportTicketId: id,
          senderId,
          content,
          conversationId: '', // placeholder; not used for support replies
        },
        include: {
          sender: { select: { id: true, name: true, avatar: true } },
        },
      }),
      this.prisma.supportTicket.update({
        where: { id },
        data: { status: 'IN_PROGRESS' as const },
      }),
    ]);
    return { ...message, user: message.sender };
  }

  async updateSupportTicket(
    id: string,
    data: { status?: string; priority?: string; assignedTo?: string },
  ) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
    });
    if (!ticket) throw new NotFoundException('Support ticket not found');

    const updateData: Record<string, unknown> = {};
    if (data.status) updateData.status = data.status;
    if (data.priority) updateData.priority = data.priority;
    if (data.assignedTo !== undefined) updateData.assignedTo = data.assignedTo;

    return this.prisma.supportTicket.update({ where: { id }, data: updateData });
  }

  // ─── Categories ────────────────────────────────────────

  async updateCategory(
    categoryId: string,
    data: {
      name?: string;
      bnName?: string;
      slug?: string;
      icon?: string;
      description?: string;
      image?: string;
      parentId?: string | null;
      sortOrder?: number;
    },
  ) {
    const cat = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!cat) throw new NotFoundException('Category not found');
    return this.prisma.category.update({ where: { id: categoryId }, data });
  }

  async deleteCategory(categoryId: string) {
    const cat = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!cat) throw new NotFoundException('Category not found');
    await this.prisma.category.delete({ where: { id: categoryId } });
    return { message: 'Category deleted', categoryId };
  }

  // ─── Coupons ──────────────────────────────────────────

  async updateCoupon(couponId: string, data: any) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id: couponId },
    });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return this.prisma.coupon.update({
      where: { id: couponId },
      data: {
        code: data.code,
        type: data.type,
        value: data.value !== undefined ? parseFloat(data.value) : undefined,
        minPurchase:
          data.minPurchase !== undefined
            ? parseFloat(data.minPurchase)
            : undefined,
        maxUses:
          data.maxUses !== undefined ? parseInt(data.maxUses) : undefined,
        maxPerUser:
          data.maxPerUser !== undefined
            ? parseInt(data.maxPerUser)
            : undefined,
        isActive: data.isActive,
        startsAt: data.startsAt ? new Date(data.startsAt) : undefined,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      },
    });
  }

  async deleteCoupon(couponId: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id: couponId },
    });
    if (!coupon) throw new NotFoundException('Coupon not found');
    await this.prisma.coupon.delete({ where: { id: couponId } });
    return { message: 'Coupon deleted', couponId };
  }

  // ─── Banners ──────────────────────────────────────────

  async updateBanner(bannerId: string, data: any) {
    const banner = await this.prisma.banner.findUnique({
      where: { id: bannerId },
    });
    if (!banner) throw new NotFoundException('Banner not found');
    return this.prisma.banner.update({
      where: { id: bannerId },
      data: {
        title: data.title,
        image: data.image,
        link: data.link,
        position: data.position,
        sortOrder:
          data.sortOrder !== undefined ? parseInt(data.sortOrder) : undefined,
        isActive: data.isActive,
      },
    });
  }

  async deleteBanner(bannerId: string) {
    const banner = await this.prisma.banner.findUnique({
      where: { id: bannerId },
    });
    if (!banner) throw new NotFoundException('Banner not found');
    await this.prisma.banner.delete({ where: { id: bannerId } });
    return { message: 'Banner deleted', bannerId };
  }

  // ─── Flash Sales ──────────────────────────────────────

  async updateFlashSale(campaignId: string, data: any) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');
    return this.prisma.campaign.update({
      where: { id: campaignId },
      data: {
        title: data.title,
        description: data.description,
        banner: data.banner,
        status: data.status,
        startsAt: data.startsAt ? new Date(data.startsAt) : undefined,
        endsAt: data.endsAt ? new Date(data.endsAt) : undefined,
        discount:
          data.discount !== undefined ? parseFloat(data.discount) : undefined,
        maxProducts:
          data.maxProducts !== undefined
            ? parseInt(data.maxProducts)
            : undefined,
      },
    });
  }

  async deleteFlashSale(campaignId: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');
    await this.prisma.campaign.delete({ where: { id: campaignId } });
    return { message: 'Campaign deleted', campaignId };
  }

  async addCampaignProduct(
    campaignId: string,
    data: { productId: string; salePrice?: number; discount?: number; quantity?: number },
  ) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');

    return this.prisma.campaignProduct.create({
      data: {
        campaignId,
        productId: data.productId,
        salePrice: data.salePrice,
        discount: data.discount,
        quantity: data.quantity || 0,
      },
    });
  }

  // ─── CMS Pages ────────────────────────────────────────

  async getCMSPages() {
    return this.prisma.cMSPage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createCMSPage(data: {
    title: string;
    slug?: string;
    content?: string;
    metaTitle?: string;
    metaDesc?: string;
    createdBy?: string;
  }) {
    const slug =
      data.slug ||
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') +
        '-' +
        Math.random().toString(36).substring(2, 6);

    return this.prisma.cMSPage.create({
      data: {
        title: data.title,
        slug,
        content: data.content,
        metaTitle: data.metaTitle,
        metaDesc: data.metaDesc,
        createdBy: data.createdBy,
      },
    });
  }

  async updateCMSPage(pageId: string, data: any) {
    const page = await this.prisma.cMSPage.findUnique({
      where: { id: pageId },
    });
    if (!page) throw new NotFoundException('CMS page not found');
    return this.prisma.cMSPage.update({
      where: { id: pageId },
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        metaTitle: data.metaTitle,
        metaDesc: data.metaDesc,
        isActive: data.isActive,
      },
    });
  }

  async deleteCMSPage(pageId: string) {
    const page = await this.prisma.cMSPage.findUnique({
      where: { id: pageId },
    });
    if (!page) throw new NotFoundException('CMS page not found');
    await this.prisma.cMSPage.delete({ where: { id: pageId } });
    return { message: 'CMS page deleted', pageId };
  }

  // ─── Announcements ────────────────────────────────────

  async getAnnouncements() {
    return this.prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAnnouncement(data: {
    title: string;
    message: string;
    type?: string;
    expiresAt?: string;
  }) {
    return this.prisma.announcement.create({
      data: {
        title: data.title,
        message: data.message,
        type: data.type || 'INFO',
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      },
    });
  }

  async updateAnnouncement(announcementId: string, data: any) {
    const ann = await this.prisma.announcement.findUnique({
      where: { id: announcementId },
    });
    if (!ann) throw new NotFoundException('Announcement not found');
    return this.prisma.announcement.update({
      where: { id: announcementId },
      data: {
        title: data.title,
        message: data.message,
        type: data.type,
        isActive: data.isActive,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      },
    });
  }

  async deleteAnnouncement(announcementId: string) {
    const ann = await this.prisma.announcement.findUnique({
      where: { id: announcementId },
    });
    if (!ann) throw new NotFoundException('Announcement not found');
    await this.prisma.announcement.delete({ where: { id: announcementId } });
    return { message: 'Announcement deleted', announcementId };
  }

  // ─── Phase 3: Finance Dashboard ────────────────────────

  async getFinanceDashboard() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalRevenue, pendingSettlements, commissions, settlements] =
      await Promise.all([
        this.prisma.order.aggregate({
          _sum: { total: true },
          where: { paymentStatus: true },
        }),
        this.prisma.sellerSettlement.aggregate({
          _sum: { netAmount: true },
          where: { status: 'PENDING' },
        }),
        this.prisma.commission.aggregate({
          _sum: { amount: true },
        }),
        this.prisma.sellerSettlement.findMany({
          where: { status: { in: ['PENDING', 'PROCESSING'] } },
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            seller: { select: { id: true, name: true } },
          },
        }),
      ]);

    return {
      totalRevenue: totalRevenue._sum.total || 0,
      pendingSettlementAmount: pendingSettlements._sum.netAmount || 0,
      totalCommission: commissions._sum.amount || 0,
      netCashFlow:
        (totalRevenue._sum.total || 0) - (pendingSettlements._sum.netAmount || 0),
      pendingSettlements: settlements,
    };
  }

  // ─── Phase 3: Settlements ──────────────────────────────

  async getSettlements(query: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;

    const [settlements, total] = await Promise.all([
      this.prisma.sellerSettlement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          seller: { select: { id: true, name: true } },
        },
      }),
      this.prisma.sellerSettlement.count({ where }),
    ]);

    return {
      settlements,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async generateSettlement(data: {
    sellerId: string;
    periodStart: string;
    periodEnd: string;
  }) {
    const store = await this.prisma.store.findUnique({
      where: { id: data.sellerId },
    });
    if (!store) throw new NotFoundException('Store not found');

    // Fetch paid orders for this seller in the period
    const orders = await this.prisma.order.findMany({
      where: {
        paymentStatus: true,
        paidAt: {
          gte: new Date(data.periodStart),
          lte: new Date(data.periodEnd),
        },
        items: {
          some: {
            product: { storeId: data.sellerId },
          },
        },
      },
      include: {
        items: {
          where: { product: { storeId: data.sellerId } },
          include: { product: { select: { id: true, name: true } } },
        },
      },
    });

    let grossAmount = 0;
    let totalCommission = 0;

    const items: Array<{
      orderId: string;
      amount: number;
      commission: number;
      fee: number;
      netAmount: number;
    }> = [];

    for (const order of orders) {
      const orderTotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
      const commission = orderTotal * ((store.commissionRate || 5) / 100);
      const fee = 0;
      const net = orderTotal - commission - fee;

      grossAmount += orderTotal;
      totalCommission += commission;

      items.push({
        orderId: order.id,
        amount: orderTotal,
        commission,
        fee,
        netAmount: net,
      });
    }

    const netAmount = grossAmount - totalCommission;

    const settlement = await this.prisma.sellerSettlement.create({
      data: {
        settlementNumber: `STL-${Date.now().toString(36).toUpperCase()}`,
        sellerId: data.sellerId,
        periodStart: new Date(data.periodStart),
        periodEnd: new Date(data.periodEnd),
        grossAmount,
        commission: totalCommission,
        fee: 0,
        netAmount,
        status: 'PENDING',
        items: {
          create: items,
        },
      },
      include: { items: true, seller: { select: { id: true, name: true } } },
    });

    return settlement;
  }

  async processSettlement(settlementId: string, data: { status: string }) {
    const settlement = await this.prisma.sellerSettlement.findUnique({
      where: { id: settlementId },
    });
    if (!settlement) throw new NotFoundException('Settlement not found');

    return this.prisma.sellerSettlement.update({
      where: { id: settlementId },
      data: {
        status: data.status,
        processedAt: data.status === 'COMPLETED' ? new Date() : undefined,
      },
    });
  }

  // ─── Phase 3: Invoices ─────────────────────────────────

  async getInvoices(query: { page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [invoices, total] = await Promise.all([
      this.prisma.invoice.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          seller: { select: { id: true, name: true } },
          order: { select: { id: true, orderNumber: true } },
          items: {
            include: { product: { select: { id: true, name: true } } },
          },
        },
      }),
      this.prisma.invoice.count(),
    ]);

    return { invoices, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async createInvoice(data: {
    orderId: string;
    sellerId: string;
    subtotal: number;
    tax?: number;
    discount?: number;
    total: number;
    dueDate?: string;
    notes?: string;
  }) {
    const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`;
    return this.prisma.invoice.create({
      data: {
        invoiceNumber,
        orderId: data.orderId,
        sellerId: data.sellerId,
        subtotal: data.subtotal,
        tax: data.tax || 0,
        discount: data.discount || 0,
        total: data.total,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        notes: data.notes,
      },
      include: {
        seller: { select: { id: true, name: true } },
        order: { select: { id: true, orderNumber: true } },
      },
    });
  }

  async updateInvoice(invoiceId: string, data: any) {
    const inv = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
    });
    if (!inv) throw new NotFoundException('Invoice not found');

    return this.prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: data.status,
        paidAt: data.status === 'PAID' ? new Date() : undefined,
        notes: data.notes,
      },
    });
  }

  // ─── Phase 3: Tax Reports ─────────────────────────────

  async getTaxReport(quarter: string, year: string) {
    const q = parseInt(quarter);
    const y = parseInt(year);
    const startMonth = (q - 1) * 3;
    const from = new Date(y, startMonth, 1);
    const to = new Date(y, startMonth + 3, 0, 23, 59, 59);

    const orders = await this.prisma.order.findMany({
      where: {
        paymentStatus: true,
        paidAt: { gte: from, lte: to },
      },
      select: { total: true, paidAt: true },
    });

    const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
    const vatRate = 15;
    const totalVat = Math.round(totalRevenue * (vatRate / 100));
    const totalOrders = orders.length;

    // Monthly breakdown
    const monthlyData: Array<{
      month: string;
      revenue: number;
      taxable: number;
      vat: number;
    }> = [];

    for (let m = 0; m < 3; m++) {
      const monthStart = new Date(y, startMonth + m, 1);
      const monthEnd = new Date(y, startMonth + m + 1, 0, 23, 59, 59);
      const monthOrders = orders.filter(
        (o) => o.paidAt && o.paidAt >= monthStart && o.paidAt <= monthEnd,
      );
      const monthRevenue = monthOrders.reduce((s, o) => s + o.total, 0);
      monthlyData.push({
        month: monthStart.toLocaleString('default', { month: 'long' }),
        revenue: monthRevenue,
        taxable: monthRevenue,
        vat: Math.round(monthRevenue * (vatRate / 100)),
      });
    }

    return {
      quarter: q,
      year: y,
      totalRevenue,
      vatRate,
      totalVat,
      totalOrders,
      monthly: monthlyData,
      period: { from, to },
    };
  }

  // ─── Phase 3: Escrow & Credit Notes ───────────────────

  async getEscrowTransactions(query: { page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.prisma.escrowTransaction.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { order: { select: { id: true, orderNumber: true, total: true } } },
      }),
      this.prisma.escrowTransaction.count(),
    ]);

    return { transactions, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getCreditNotes() {
    return this.prisma.creditNote.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        order: { select: { id: true, orderNumber: true, total: true } },
        returnRequest: { select: { id: true, reason: true } },
      },
    });
  }

  // ─── Phase 3: Commission Rules (list) ─────────────────

  async getCommissions(query: { page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [commissions, total] = await Promise.all([
      this.prisma.commission.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          seller: { select: { id: true, name: true } },
          order: { select: { id: true, orderNumber: true } },
        },
      }),
      this.prisma.commission.count(),
    ]);

    return { commissions, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // ─── Phase 4: Reviews ─────────────────────────────────

  async getReviews(query: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, avatar: true } },
          product: { select: { id: true, name: true, slug: true, price: true } },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    return { reviews, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateReview(
    reviewId: string,
    data: { status?: string; reported?: boolean },
  ) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });
    if (!review) throw new NotFoundException('Review not found');

    const updateData: Record<string, unknown> = {};
    if (data.status) updateData.status = data.status;
    if (data.reported !== undefined) updateData.reported = data.reported;

    return this.prisma.review.update({ where: { id: reviewId }, data: updateData });
  }

  async deleteReview(reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });
    if (!review) throw new NotFoundException('Review not found');
    await this.prisma.review.delete({ where: { id: reviewId } });
    return { message: 'Review deleted', reviewId };
  }

  // ─── Phase 4: Affiliates (admin) ──────────────────────

  async getAdminAffiliates(query: { page?: number; limit?: number; status?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;

    const [affiliates, total] = await Promise.all([
      this.prisma.affiliateProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
          _count: { select: { clicks: true, conversions: true, commissions: true } },
        },
      }),
      this.prisma.affiliateProfile.count({ where }),
    ]);

    return { affiliates, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateAdminAffiliate(
    affiliateId: string,
    data: { status?: string },
  ) {
    const profile = await this.prisma.affiliateProfile.findUnique({
      where: { id: affiliateId },
    });
    if (!profile) throw new NotFoundException('Affiliate not found');
    if (data.status) {
      await this.prisma.affiliateProfile.update({
        where: { id: affiliateId },
        data: { status: data.status },
      });
    }
    return { message: 'Affiliate updated', affiliateId };
  }

  // ─── Phase 4: Creators (admin) ────────────────────────

  async getAdminCreators(query: { page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    // Users who have written reviews or have store follows
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          OR: [
            { reviews: { some: {} } },
            { storeFollowers: { some: {} } },
          ],
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatar: true,
          createdAt: true,
          _count: { select: { reviews: true, storeFollowers: true } },
        },
      }),
      this.prisma.user.count({
        where: {
          OR: [
            { reviews: { some: {} } },
            { storeFollowers: { some: {} } },
          ],
        },
      }),
    ]);

    return { creators: users, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateAdminCreator(userId: string, _data: Record<string, unknown>) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return { message: 'Creator acknowledged', userId };
  }

  // ─── Phase 4: Compliance ──────────────────────────────

  async getComplianceDashboard() {
    const now = new Date();
    const totalSellers = await this.prisma.user.count({ where: { isSeller: true } });
    const kycVerified = await this.prisma.sellerProfile.count({
      where: { isKycVerified: true },
    });
    const pendingVerification = await this.prisma.sellerProfile.count({
      where: { isKycVerified: false },
    });
    const flaggedProducts = await this.prisma.product.count({
      where: { inStock: false },
    });
    const openDisputes = await this.prisma.dispute.count();
    const returnRequests = await this.prisma.returnRequest.count();
    const recentReports = await this.prisma.review.count({
      where: { reported: true, status: 'PENDING' },
    });

    return {
      totalSellers,
      kycVerified,
      pendingVerification,
      flaggedProducts,
      openDisputes,
      returnRequests,
      recentReports,
      lastUpdated: now.toISOString(),
    };
  }
}
