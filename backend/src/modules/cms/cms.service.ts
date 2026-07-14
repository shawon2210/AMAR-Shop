import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class CmsService {
  constructor(private prismaService: PrismaService) {}

  async getPages() {
    return this.prismaService.cMSPage.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        metaTitle: true,
        metaDesc: true,
        updatedAt: true,
      },
    });
  }

  async createPage(data: {
    title: string;
    slug?: string;
    content?: string;
    metaTitle?: string;
    metaDesc?: string;
  }) {
    const slug =
      data.slug ||
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    return this.prismaService.cMSPage.create({
      data: {
        title: data.title,
        slug,
        content: data.content,
        metaTitle: data.metaTitle,
        metaDesc: data.metaDesc,
      },
    });
  }

  async updatePage(
    id: string,
    data: {
      title?: string;
      content?: string;
      metaTitle?: string;
      metaDesc?: string;
      isActive?: boolean;
    },
  ) {
    const page = await this.prismaService.cMSPage.findUnique({ where: { id } });
    if (!page) throw new NotFoundException('Page not found');

    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle;
    if (data.metaDesc !== undefined) updateData.metaDesc = data.metaDesc;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    return this.prismaService.cMSPage.update({
      where: { id },
      data: updateData,
    });
  }

  async getBanners(position?: string) {
    const where: Record<string, unknown> = { isActive: true };
    if (position) where.position = position;

    return this.prismaService.banner.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createBanner(data: {
    title?: string;
    image: string;
    link?: string;
    position: string;
    sortOrder?: number;
    storeId?: string;
  }) {
    return this.prismaService.banner.create({
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

  async getAnnouncements() {
    const now = new Date();
    return this.prismaService.announcement.findMany({
      where: {
        isActive: true,
        OR: [{ expiresAt: { gte: now } }, { expiresAt: null }],
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
