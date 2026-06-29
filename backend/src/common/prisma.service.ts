import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, PrismaClientOptions } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private prisma: PrismaClient;

  constructor(private configService: ConfigService) {
    const databaseUrl = this.configService.get('DATABASE_URL');
    
    // Prisma 7 requires proper constructor options
    this.prisma = new PrismaClient({
      datasources: {
        db: { url: databaseUrl }
      }
    } as PrismaClientOptions);
  }

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  // Helper method to access the Prisma client
  get client(): PrismaClient {
    return this.prisma;
  }
}
