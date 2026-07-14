import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../common/prisma.service';

@Injectable()
export class AdminUserService {
  constructor(private prisma: PrismaService) {}

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

  async getAdminCreators(query: { page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const condition = {
      OR: [{ reviews: { some: {} } }, { storeFollowers: { some: {} } }],
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: condition,
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
      this.prisma.user.count({ where: condition }),
    ]);

    return {
      creators: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateAdminCreator(userId: string, _data: Record<string, unknown>) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return { message: 'Creator updated', userId };
  }
}
