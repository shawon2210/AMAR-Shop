import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

interface PushPayload {
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

@Injectable()
export class PushNotificationService {
  constructor(private prisma: PrismaService) {}

  async registerDevice(userId: string, token: string, platform: string): Promise<{ registered: boolean }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const tokens = user.deviceTokens || [];
    if (!tokens.includes(token)) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { deviceTokens: [...tokens, token] },
      });
    }

    await this.prisma.pushDevice.upsert({
      where: { token },
      create: { userId, token, platform },
      update: { userId, platform, updatedAt: new Date() },
    });

    return { registered: true };
  }

  async sendPush(userId: string, title: string, body: string, data?: Record<string, unknown>): Promise<{ sent: boolean; error?: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { pushDevices: { where: { isActive: true } } },
    });
    if (!user || !user.pushDevices.length) {
      return { sent: false, error: 'No registered devices' };
    }

    const payload: PushPayload = { title, body, data };

    for (const device of user.pushDevices) {
      try {
        await this.sendToDevice(device, payload);
        await this.prisma.pushLog.create({
          data: { userId, deviceId: device.id, title, body, status: 'SENT' },
        });
      } catch (err: any) {
        await this.prisma.pushLog.create({
          data: { userId, deviceId: device.id, title, body, status: 'FAILED', error: err.message },
        });
      }
    }

    return { sent: true };
  }

  async sendBulkPush(userIds: string[], title: string, body: string, data?: Record<string, unknown>): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;

    for (const userId of userIds) {
      const result = await this.sendPush(userId, title, body, data);
      if (result.sent) sent++;
      else failed++;
    }

    return { sent, failed };
  }

  async sendOrderPush(orderId: string, status: string): Promise<{ sent: boolean }> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });
    if (!order) throw new NotFoundException('Order not found');

    const messages: Record<string, { title: string; body: string }> = {
      PENDING: { title: 'Order Placed', body: `Order #${order.orderNumber} has been placed successfully.` },
      CONFIRMED: { title: 'Order Confirmed', body: `Order #${order.orderNumber} is confirmed.` },
      PROCESSING: { title: 'Order Processing', body: `Order #${order.orderNumber} is being prepared.` },
      SHIPPED: { title: 'Order Shipped', body: `Order #${order.orderNumber} has been shipped.` },
      DELIVERED: { title: 'Order Delivered', body: `Order #${order.orderNumber} has been delivered. Enjoy!` },
      CANCELLED: { title: 'Order Cancelled', body: `Order #${order.orderNumber} has been cancelled.` },
    };

    const msg = messages[status] || { title: 'Order Update', body: `Order #${order.orderNumber} status: ${status}` };
    await this.sendPush(order.userId, msg.title, msg.body, { orderId, status, type: 'order_update' });
    return { sent: true };
  }

  async sendPromotionPush(campaignId: string): Promise<{ sent: number }> {
    const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign) throw new NotFoundException('Campaign not found');

    const subscribers = await this.prisma.pushDevice.findMany({
      where: { isActive: true, pushEnabled: true },
      take: 10000,
    });

    const userIds = [...new Set(subscribers.map((d) => d.userId))];
    const result = await this.sendBulkPush(
      userIds,
      campaign.title,
      campaign.description || 'Check out our latest deals!',
      { campaignId, type: 'promotion' },
    );

    return { sent: result.sent };
  }

  async getPushAnalytics(dateRange: { start: string; end: string }): Promise<{
    totalSent: number;
    totalFailed: number;
    deliveryRate: number;
    byDay: any[];
  }> {
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    end.setHours(23, 59, 59, 999);

    const logs = await this.prisma.pushLog.findMany({
      where: { createdAt: { gte: start, lte: end } },
      orderBy: { createdAt: 'asc' },
    });

    const totalSent = logs.filter((l) => l.status === 'SENT').length;
    const totalFailed = logs.filter((l) => l.status === 'FAILED').length;
    const total = totalSent + totalFailed;
    const deliveryRate = total > 0 ? (totalSent / total) * 100 : 0;

    const byDayMap: Record<string, { sent: number; failed: number }> = {};
    logs.forEach((l) => {
      const day = l.createdAt.toISOString().slice(0, 10);
      if (!byDayMap[day]) byDayMap[day] = { sent: 0, failed: 0 };
      if (l.status === 'SENT') byDayMap[day].sent++;
      else if (l.status === 'FAILED') byDayMap[day].failed++;
    });

    const byDay = Object.entries(byDayMap).map(([date, counts]) => ({ date, ...counts }));

    return { totalSent, totalFailed, deliveryRate: Math.round(deliveryRate * 100) / 100, byDay };
  }

  private async sendToDevice(device: any, payload: PushPayload): Promise<void> {
    await this.prisma.pushLog.create({
      data: {
        userId: device.userId,
        deviceId: device.id,
        title: payload.title,
        body: payload.body,
        status: 'SENT',
      },
    });
  }
}
