import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class AddressesService {
  constructor(private prismaService: PrismaService) {}

  async findByUser(userId: string) {
    return this.prismaService.address.findMany({
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
    const existingCount = await this.prismaService.address.count({
      where: { userId },
    });
    return this.prismaService.address.create({
      data: {
        ...data,
        userId,
        isDefault: existingCount === 0,
      },
    });
  }
}
