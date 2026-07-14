import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';

@Injectable()
export class AdminMarketingService {
  constructor(private prisma: PrismaService) {}

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

  async createFlashSale(data: {
    title: string;
    description?: string;
    banner?: string;
    status?: string;
    startsAt: string;
    endsAt: string;
    discount?: number;
    maxProducts?: number;
  }) {
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

  async updateFlashSale(
    campaignId: string,
    data: {
      title?: string;
      description?: string;
      banner?: string;
      status?: string;
      startsAt?: string;
      endsAt?: string;
      discount?: number;
      maxProducts?: number;
    },
  ) {
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
          data.discount !== undefined
            ? parseFloat(String(data.discount))
            : undefined,
        maxProducts:
          data.maxProducts !== undefined
            ? parseInt(String(data.maxProducts))
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
    data: {
      productId: string;
      salePrice?: number;
      discount?: number;
      quantity?: number;
    },
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

  async getBanners() {
    return this.prisma.banner.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async createBanner(data: {
    title: string;
    image: string;
    link?: string;
    position?: string;
    sortOrder?: number;
    storeId?: string;
  }) {
    return this.prisma.banner.create({
      data: {
        title: data.title,
        image: data.image,
        link: data.link,
        position: data.position || 'HOME_TOP',
        sortOrder: data.sortOrder || 0,
        storeId: data.storeId,
      },
    });
  }

  async updateBanner(
    bannerId: string,
    data: {
      title?: string;
      image?: string;
      link?: string;
      position?: string;
      sortOrder?: number;
      isActive?: boolean;
    },
  ) {
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
          data.sortOrder !== undefined
            ? parseInt(String(data.sortOrder))
            : undefined,
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

  async createCoupon(data: {
    code: string;
    type: string;
    value: number;
    minPurchase?: number;
    maxUses?: number;
    maxPerUser?: number;
    isActive?: boolean;
    startsAt?: string;
    expiresAt?: string;
  }) {
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

  async updateCoupon(
    couponId: string,
    data: {
      code?: string;
      type?: string;
      value?: number;
      minPurchase?: number;
      maxUses?: number;
      maxPerUser?: number;
      isActive?: boolean;
      startsAt?: string;
      expiresAt?: string;
    },
  ) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id: couponId },
    });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return this.prisma.coupon.update({
      where: { id: couponId },
      data: {
        code: data.code,
        type: data.type,
        value:
          data.value !== undefined ? parseFloat(String(data.value)) : undefined,
        minPurchase:
          data.minPurchase !== undefined
            ? parseFloat(String(data.minPurchase))
            : undefined,
        maxUses:
          data.maxUses !== undefined
            ? parseInt(String(data.maxUses))
            : undefined,
        maxPerUser:
          data.maxPerUser !== undefined
            ? parseInt(String(data.maxPerUser))
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

  async getCMSPages() {
    return this.prisma.cMSPage.findMany({ orderBy: { createdAt: 'desc' } });
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

  async updateCMSPage(
    pageId: string,
    data: {
      title?: string;
      slug?: string;
      content?: string;
      metaTitle?: string;
      metaDesc?: string;
      isActive?: boolean;
    },
  ) {
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

  async updateAnnouncement(
    announcementId: string,
    data: {
      title?: string;
      message?: string;
      type?: string;
      isActive?: boolean;
      expiresAt?: string;
    },
  ) {
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
}
