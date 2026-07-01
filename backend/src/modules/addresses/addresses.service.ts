import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class AddressesService {
  private prisma: PrismaService;

  constructor(private prismaService: PrismaService) {
    this.prisma = this.prismaService;
  }

  async findByUser(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });
  }

  async create(
    userId: string,
    data: {
      label?: string;
      fullName: string;
      phone: string;
      street: string;
      city: string;
      area?: string;
    },
  ) {
    const existingCount = await this.prisma.address.count({ where: { userId } });
    return this.prisma.address.create({
      data: {
        ...data,
        userId,
        isDefault: existingCount === 0,
      },
    });
  }
}
