import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Queue, QueueEvents, Job, Worker } from 'bullmq';
import { realtimeConfig } from './realtime.config';
import { PrismaService } from '../../common/prisma.service';

export interface OrderJobData {
  orderId: string;
  action: 'process' | 'ship' | 'deliver' | 'cancel' | 'refund';
  userId: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationJobData {
  userId: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export interface EmailJobData {
  to: string;
  subject: string;
  template: string;
  context: Record<string, unknown>;
}

export interface AnalyticsJobData {
  event: string;
  userId?: string;
  properties: Record<string, unknown>;
  timestamp: Date;
}

export interface PayoutJobData {
  sellerId: string;
  amount: number;
  method: string;
  accountNumber?: string;
}

export interface InventorySyncJobData {
  productId: string;
  warehouseId: string;
  quantity: number;
  type: 'add' | 'remove' | 'reserve' | 'release';
  reference?: string;
}

export interface SearchIndexJobData {
  productId: string;
  action: 'index' | 'update' | 'remove';
}

@Injectable()
export class BullQueueService implements OnModuleDestroy {
  private readonly logger = new Logger(BullQueueService.name);

  public readonly orderQueue: Queue<OrderJobData>;
  public readonly notificationQueue: Queue<NotificationJobData>;
  public readonly emailQueue: Queue<EmailJobData>;
  public readonly smsQueue: Queue<any>;
  public readonly inventorySyncQueue: Queue<InventorySyncJobData>;
  public readonly searchIndexQueue: Queue<SearchIndexJobData>;
  public readonly analyticsQueue: Queue<AnalyticsJobData>;
  public readonly payoutQueue: Queue<PayoutJobData>;

  public readonly orderQueueEvents: QueueEvents;
  public readonly notificationQueueEvents: QueueEvents;
  public readonly analyticsQueueEvents: QueueEvents;

  private readonly workers: Worker[] = [];
  private prisma: PrismaService;

  constructor(private prismaService: PrismaService) {
    this.prisma = this.prismaService;
    const connection = {
      host: realtimeConfig.redis.host,
      port: realtimeConfig.redis.port,
      password: realtimeConfig.redis.password,
    };

    this.orderQueue = new Queue<OrderJobData>('order-processing', {
      connection,
      defaultJobOptions: realtimeConfig.bull.defaultJobOptions,
    });
    this.notificationQueue = new Queue<NotificationJobData>('notification', {
      connection,
      defaultJobOptions: realtimeConfig.bull.defaultJobOptions,
    });
    this.emailQueue = new Queue<EmailJobData>('email', {
      connection,
      defaultJobOptions: realtimeConfig.bull.defaultJobOptions,
    });
    this.smsQueue = new Queue<any>('sms', {
      connection,
      defaultJobOptions: realtimeConfig.bull.defaultJobOptions,
    });
    this.inventorySyncQueue = new Queue<InventorySyncJobData>(
      'inventory-sync',
      { connection, defaultJobOptions: realtimeConfig.bull.defaultJobOptions },
    );
    this.searchIndexQueue = new Queue<SearchIndexJobData>('search-index', {
      connection,
      defaultJobOptions: realtimeConfig.bull.defaultJobOptions,
    });
    this.analyticsQueue = new Queue<AnalyticsJobData>('analytics', {
      connection,
      defaultJobOptions: realtimeConfig.bull.defaultJobOptions,
    });
    this.payoutQueue = new Queue<PayoutJobData>('payout', {
      connection,
      defaultJobOptions: realtimeConfig.bull.defaultJobOptions,
    });

    this.orderQueueEvents = new QueueEvents('order-processing', { connection });
    this.notificationQueueEvents = new QueueEvents('notification', {
      connection,
    });
    this.analyticsQueueEvents = new QueueEvents('analytics', { connection });

    this.registerQueueEventHandlers();
    this.registerConsumers();
  }

  async addOrderJob(data: OrderJobData, delay = 0): Promise<Job<OrderJobData>> {
    return this.orderQueue.add(data.action, data, { delay });
  }

  async addNotificationJob(
    data: NotificationJobData,
    delay = 0,
  ): Promise<Job<NotificationJobData>> {
    return this.notificationQueue.add(data.type, data, { delay });
  }

  async addEmailJob(data: EmailJobData, delay = 0): Promise<Job<EmailJobData>> {
    return this.emailQueue.add(data.template, data, { delay });
  }

  async addAnalyticsJob(
    data: AnalyticsJobData,
    delay = 0,
  ): Promise<Job<AnalyticsJobData>> {
    return this.analyticsQueue.add(data.event, data, { delay });
  }

  async addInventorySyncJob(
    data: InventorySyncJobData,
  ): Promise<Job<InventorySyncJobData>> {
    return this.inventorySyncQueue.add(data.type, data);
  }

  async addSearchIndexJob(
    data: SearchIndexJobData,
  ): Promise<Job<SearchIndexJobData>> {
    return this.searchIndexQueue.add(data.action, data);
  }

  async addPayoutJob(data: PayoutJobData): Promise<Job<PayoutJobData>> {
    return this.payoutQueue.add(data.method, data);
  }

  private registerConsumers(): void {
    const connection = {
      host: realtimeConfig.redis.host,
      port: realtimeConfig.redis.port,
      password: realtimeConfig.redis.password,
    };

    const orderWorker = new Worker<OrderJobData>(
      'order-processing',
      async (job) => {
        this.logger.log(
          `Processing order job: ${job.id} - ${job.data.action} for order ${job.data.orderId}`,
        );
        switch (job.data.action) {
          case 'process':
            await this.handleOrderProcessing(job.data);
            break;
          case 'ship':
            this.handleOrderShipping(job.data);
            break;
          case 'deliver':
            await this.handleOrderDelivery(job.data);
            break;
          case 'cancel':
            await this.handleOrderCancellation(job.data);
            break;
        }
      },
      { connection, concurrency: 5 },
    );

    const inventoryWorker = new Worker<InventorySyncJobData>(
      'inventory-sync',
      async (job) => {
        this.logger.log(
          `Syncing inventory: ${job.data.productId} - ${job.data.type}`,
        );
        await this.handleInventorySync(job.data);
      },
      { connection, concurrency: 5 },
    );

    this.workers.push(orderWorker, inventoryWorker);
  }

  private async handleOrderProcessing(data: OrderJobData): Promise<void> {
    await this.prisma.order.update({
      where: { id: data.orderId },
      data: { status: 'CONFIRMED' },
    });
  }

  private handleOrderShipping(data: OrderJobData): void {
    this.logger.debug(`Shipping order ${data.orderId}`);
  }

  private async handleOrderDelivery(data: OrderJobData): Promise<void> {
    await this.prisma.order.update({
      where: { id: data.orderId },
      data: { status: 'DELIVERED', paymentStatus: true, paidAt: new Date() },
    });
  }

  private async handleOrderCancellation(data: OrderJobData): Promise<void> {
    await this.prisma.order.update({
      where: { id: data.orderId },
      data: { status: 'CANCELLED' },
    });
  }

  private async handleInventorySync(data: InventorySyncJobData): Promise<void> {
    const inventory = await this.prisma.inventory.findFirst({
      where: { productId: data.productId, warehouseId: data.warehouseId },
    });
    if (!inventory) return;

    let newQuantity = inventory.quantity;
    switch (data.type) {
      case 'add':
        newQuantity += data.quantity;
        break;
      case 'remove':
        newQuantity = Math.max(0, newQuantity - data.quantity);
        break;
      case 'reserve':
        newQuantity = Math.max(0, newQuantity - data.quantity);
        break;
      case 'release':
        newQuantity += data.quantity;
        break;
    }

    await this.prisma.inventory.update({
      where: { id: inventory.id },
      data: { quantity: newQuantity },
    });
  }

  private registerQueueEventHandlers(): void {
    this.orderQueueEvents.on('completed', ({ jobId }) => {
      this.logger.debug(`Order queue job ${jobId} completed`);
    });
    this.orderQueueEvents.on('failed', ({ jobId, failedReason }) => {
      this.logger.error(`Order queue job ${jobId} failed: ${failedReason}`);
    });
    this.notificationQueueEvents.on('completed', ({ jobId }) => {
      this.logger.debug(`Notification queue job ${jobId} completed`);
    });
    this.analyticsQueueEvents.on('completed', ({ jobId }) => {
      this.logger.debug(`Analytics queue job ${jobId} completed`);
    });
  }

  async getQueueMetrics() {
    const queues = [
      { name: 'order-processing', queue: this.orderQueue },
      { name: 'notification', queue: this.notificationQueue },
      { name: 'email', queue: this.emailQueue },
      { name: 'inventory-sync', queue: this.inventorySyncQueue },
      { name: 'search-index', queue: this.searchIndexQueue },
      { name: 'analytics', queue: this.analyticsQueue },
      { name: 'payout', queue: this.payoutQueue },
    ];

    const metrics = await Promise.all(
      queues.map(async ({ name, queue }) => {
        const [waiting, active, completed, failed, delayed] = await Promise.all(
          [
            queue.getWaitingCount(),
            queue.getActiveCount(),
            queue.getCompletedCount(),
            queue.getFailedCount(),
            queue.getDelayedCount(),
          ],
        );
        return { name, waiting, active, completed, failed, delayed };
      }),
    );

    return metrics;
  }

  async onModuleDestroy(): Promise<void> {
    await Promise.all([
      this.orderQueue.close(),
      this.notificationQueue.close(),
      this.emailQueue.close(),
      this.smsQueue.close(),
      this.inventorySyncQueue.close(),
      this.searchIndexQueue.close(),
      this.analyticsQueue.close(),
      this.payoutQueue.close(),
    ]);
    await Promise.all(this.workers.map((w) => w.close()));
  }
}
