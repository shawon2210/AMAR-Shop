import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import { PrismaService } from '../../common/prisma.service';

interface RateLimitTier {
  requestsPerHour: number;
  requestsPerMinute: number;
  concurrentLimit: number;
}

const TIER_LIMITS: Record<string, RateLimitTier> = {
  free: { requestsPerHour: 100, requestsPerMinute: 10, concurrentLimit: 5 },
  pro: { requestsPerHour: 10000, requestsPerMinute: 500, concurrentLimit: 50 },
  enterprise: {
    requestsPerHour: Infinity,
    requestsPerMinute: Infinity,
    concurrentLimit: Infinity,
  },
};

@Injectable()
export class DeveloperService {
  constructor(private prisma: PrismaService) {}

  hashKey(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex');
  }

  async createApiKey(name: string, userId: string, permissions: string[]) {
    const existing = await this.prisma.apiKey.findFirst({
      where: { userId, name },
    });
    if (existing)
      throw new ConflictException('API key with this name already exists');

    const rawKey = `amarshop_${uuidv4().replace(/-/g, '')}`;
    const hashedKey = this.hashKey(rawKey);

    const apiKey = await this.prisma.apiKey.create({
      data: {
        name,
        key: hashedKey,
        userId,
        permissions,
        lastUsedAt: null,
      },
    });

    return {
      id: apiKey.id,
      name: apiKey.name,
      key: rawKey,
      createdAt: apiKey.createdAt,
    };
  }

  async validateApiKey(key: string) {
    const hashedKey = this.hashKey(key);
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { key: hashedKey },
    });
    if (!apiKey) throw new UnauthorizedException('Invalid API key');
    if (!apiKey.isActive) throw new UnauthorizedException('API key is revoked');

    await this.prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    return {
      userId: apiKey.userId,
      permissions: apiKey.permissions,
      keyId: apiKey.id,
    };
  }

  async revokeApiKey(keyId: string, userId: string) {
    const key = await this.prisma.apiKey.findUnique({ where: { id: keyId } });
    if (!key) throw new NotFoundException('API key not found');
    if (key.userId !== userId) throw new UnauthorizedException('API key does not belong to this user');

    await this.prisma.apiKey.update({
      where: { id: keyId },
      data: { isActive: false, revokedAt: new Date() },
    });

    return { message: 'API key revoked' };
  }

  async getApiKeys(userId: string) {
    return this.prisma.apiKey.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        isActive: true,
        permissions: true,
        lastUsedAt: true,
        createdAt: true,
        revokedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUsageStats(keyId: string, userId: string, dateRange?: { start: Date; end: Date }) {
    const key = await this.prisma.apiKey.findUnique({ where: { id: keyId }, select: { userId: true } });
    if (!key) throw new NotFoundException('API key not found');
    if (key.userId !== userId) throw new UnauthorizedException('API key does not belong to this user');

    const where: any = { apiKeyId: keyId };
    if (dateRange) {
      where.createdAt = { gte: dateRange.start, lte: dateRange.end };
    }

    const logs = await this.prisma.apiUsageLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return {
      total: logs.length,
      byEndpoint: this.groupBy(logs, 'endpoint'),
      byStatus: this.groupBy(logs, 'status'),
      byDate: this.groupByDate(logs),
      logs,
    };
  }

  async logApiCall(
    keyId: string,
    endpoint: string,
    status: number,
    duration: number,
  ) {
    return this.prisma.apiUsageLog.create({
      data: { apiKeyId: keyId, endpoint, status, duration },
    });
  }

  async getWebhooks(storeId: string, userId: string) {
    const store = await this.prisma.store.findUnique({ where: { id: storeId }, select: { userId: true } });
    if (!store) throw new NotFoundException('Store not found');
    if (store.userId !== userId) throw new UnauthorizedException('Store does not belong to this user');

    return this.prisma.webhook.findMany({
      where: { storeId },
      include: { _count: { select: { logs: true } } },
    });
  }

  async registerWebhook(
    storeId: string,
    event: string,
    url: string,
    secret: string,
    userId: string,
  ) {
    const store = await this.prisma.store.findUnique({ where: { id: storeId }, select: { userId: true } });
    if (!store) throw new NotFoundException('Store not found');
    if (store.userId !== userId) throw new UnauthorizedException('Store does not belong to this user');

    return this.prisma.webhook.create({
      data: { storeId, event, url, secret },
    });
  }

  async deleteWebhook(webhookId: string, userId: string) {
    const webhook = await this.prisma.webhook.findUnique({ where: { id: webhookId } });
    if (!webhook) throw new NotFoundException('Webhook not found');

    const store = await this.prisma.store.findUnique({ where: { id: webhook.storeId }, select: { userId: true } });
    if (!store || store.userId !== userId) throw new UnauthorizedException('Webhook does not belong to this user');

    await this.prisma.webhook.delete({ where: { id: webhookId } });
    return { message: 'Webhook deleted' };
  }

  async triggerWebhook(event: string, payload: Record<string, unknown>) {
    const webhooks = await this.prisma.webhook.findMany({
      where: { event, isActive: true },
    });

    const results = await Promise.allSettled(
      webhooks.map(async (wh) => {
        const start = Date.now();
        try {
          const response = await fetch(wh.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Webhook-Secret': wh.secret,
              'X-Event-Type': event,
            },
            body: JSON.stringify(payload),
          });

          await this.prisma.webhookLog.create({
            data: {
              webhookId: wh.id,
              event,
              status: response.status,
              duration: Date.now() - start,
              responseBody: await response.text(),
            },
          });
        } catch (error) {
          await this.prisma.webhookLog.create({
            data: {
              webhookId: wh.id,
              event,
              status: 0,
              duration: Date.now() - start,
              responseBody: error.message,
            },
          });
        }
      }),
    );

    return { delivered: webhooks.length, results };
  }

  async getWebhookLogs(webhookId: string, userId: string) {
    const webhook = await this.prisma.webhook.findUnique({ where: { id: webhookId } });
    if (!webhook) throw new NotFoundException('Webhook not found');

    const store = await this.prisma.store.findUnique({ where: { id: webhook.storeId }, select: { userId: true } });
    if (!store || store.userId !== userId) throw new UnauthorizedException('Webhook does not belong to this user');

    return this.prisma.webhookLog.findMany({
      where: { webhookId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  getDeveloperLimits(plan: string): RateLimitTier {
    return TIER_LIMITS[plan] || TIER_LIMITS.free;
  }

  private groupBy(items: any[], key: string) {
    return items.reduce((acc, item) => {
      const k = item[key];
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});
  }

  private groupByDate(items: any[]) {
    return items.reduce((acc, item) => {
      const date = new Date(item.createdAt).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
  }
}
