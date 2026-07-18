import { Controller, Get, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class DependencyChecker {
  constructor(private prismaService: PrismaService) {}

  async checkDatabase() {
    try {
      await this.prismaService.$queryRaw`SELECT 1`;
      return { status: 'up', latency: 0 } as const;
    } catch {
      return { status: 'down' } as const;
    }
  }

  async checkRedis() {
    try {
      if (
        typeof globalThis.__redis_client__ !== 'undefined' &&
        globalThis.__redis_client__?.ping
      ) {
        await globalThis.__redis_client__.ping();
        return { status: 'up', latency: 0 } as const;
      }
      return { status: 'not_configured' } as const;
    } catch {
      return { status: 'down' } as const;
    }
  }
}

@Controller('health')
export class HealthController {
  constructor(
    private prismaService: PrismaService,
    private checker: DependencyChecker,
  ) {}

  @Get()
  async check() {
    const db = await this.checker.checkDatabase();
    const redis = await this.checker.checkRedis();
    const allUp =
      db.status === 'up' &&
      (redis.status === 'up' || redis.status === 'not_configured');

    return {
      status: allUp ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get('readiness')
  async readiness() {
    const db = await this.checker.checkDatabase();
    return {
      status: db.status === 'up' ? 'ready' : 'not_ready',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('liveness')
  liveness() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('dependencies')
  async dependencies() {
    const db = await this.checker.checkDatabase();
    const redis = await this.checker.checkRedis();

    return {
      database: db,
      redis: redis,
      timestamp: new Date().toISOString(),
    };
  }
}
