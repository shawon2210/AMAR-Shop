import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';

@Injectable()
export class AdminSupportService {
  constructor(private prisma: PrismaService) {}

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
        data: { supportTicketId: id, senderId, content, conversationId: '' },
        include: { sender: { select: { id: true, name: true, avatar: true } } },
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

    return this.prisma.supportTicket.update({
      where: { id },
      data: updateData,
    });
  }

  async getReviews(query: { page?: number; limit?: number; status?: string }) {
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
          product: {
            select: { id: true, name: true, slug: true, price: true },
          },
        },
      }),
      this.prisma.review.count({ where }),
    ]);
    return {
      reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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

    return this.prisma.review.update({
      where: { id: reviewId },
      data: updateData,
    });
  }

  async deleteReview(reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });
    if (!review) throw new NotFoundException('Review not found');
    await this.prisma.review.delete({ where: { id: reviewId } });
    return { message: 'Review deleted', reviewId };
  }
}
