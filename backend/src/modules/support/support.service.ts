import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class SupportService {
  private prisma: PrismaService;

  constructor(private prismaService: PrismaService) {
    this.prisma = this.prismaService;
  }

  async createTicket(
    userId: string,
    data: {
      subject: string;
      description: string;
      category?: string;
      priority?: string;
    },
  ) {
    return this.prisma.supportTicket.create({
      data: {
        userId,
        subject: data.subject,
        description: data.description,
        category: data.category,
        priority: data.priority || 'MEDIUM',
        status: 'OPEN',
      },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });
  }

  async getTickets(
    userId: string,
    query: { page?: number; limit?: number; status?: string },
  ) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = { userId };
    if (query.status) where.status = query.status;

    const [tickets, total] = await Promise.all([
      this.prisma.supportTicket.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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

  async getAllTickets(query: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    category?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};

    if (query.status) where.status = query.status;
    if (query.priority) where.priority = query.priority;
    if (query.category) where.category = query.category;

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

  async replyTicket(
    ticketId: string,
    userId: string,
    message: { content: string; attachments?: string[] },
  ) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id: ticketId },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    if (ticket.status === 'CLOSED') {
      await this.prisma.supportTicket.update({
        where: { id: ticketId },
        data: { status: 'IN_PROGRESS' },
      });
    }

    return this.prisma.message.create({
      data: {
        conversationId: ticketId,
        senderId: userId,
        content: message.content,
        attachments: message.attachments || [],
      },
    });
  }

  async closeTicket(ticketId: string) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id: ticketId },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    return this.prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status: 'CLOSED' },
    });
  }

  async getFAQs(category?: string) {
    const where: Record<string, unknown> = { isActive: true };
    if (category) where.category = category;

    return this.prisma.fAQ.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getStats() {
    const [open, inProgress, resolved, closed, total] = await Promise.all([
      this.prisma.supportTicket.count({ where: { status: 'OPEN' } }),
      this.prisma.supportTicket.count({ where: { status: 'IN_PROGRESS' } }),
      this.prisma.supportTicket.count({ where: { status: 'RESOLVED' } }),
      this.prisma.supportTicket.count({ where: { status: 'CLOSED' } }),
      this.prisma.supportTicket.count(),
    ]);

    return {
      total,
      open,
      inProgress,
      resolved,
      closed,
      resolutionRate:
        total > 0
          ? Number((((resolved + closed) / total) * 100).toFixed(1))
          : 0,
    };
  }
}
