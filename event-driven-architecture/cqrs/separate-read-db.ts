import { kafkaConfig, topics, consumerGroups } from '../kafka-config';

interface ReadModelSyncConfig {
  sourceTopic: string;
  consumerGroup: string;
  tableName: string;
  projection: (event: any) => any;
  batchSize: number;
  syncInterval: number;
}

export const readModelSyncConfigs: ReadModelSyncConfig[] = [
  {
    sourceTopic: topics.order.topic,
    consumerGroup: consumerGroups.orderService,
    tableName: 'order_read_model',
    projection: (event) => ({
      id: event.streamId,
      type: event.type,
      data: event.data,
      version: event.metadata.version,
      timestamp: event.metadata.timestamp,
      processedAt: new Date(),
    }),
    batchSize: 100,
    syncInterval: 5000,
  },
  {
    sourceTopic: topics.payment.topic,
    consumerGroup: consumerGroups.paymentService,
    tableName: 'payment_read_model',
    projection: (event) => ({
      id: event.streamId,
      type: event.type,
      data: event.data,
      version: event.metadata.version,
      timestamp: event.metadata.timestamp,
    }),
    batchSize: 100,
    syncInterval: 5000,
  },
  {
    sourceTopic: topics.inventory.topic,
    consumerGroup: consumerGroups.inventoryService,
    tableName: 'inventory_read_model',
    projection: (event) => ({
      id: event.streamId,
      type: event.type,
      data: event.data,
      version: event.metadata.version,
    }),
    batchSize: 50,
    syncInterval: 3000,
  },
  {
    sourceTopic: topics.user.topic,
    consumerGroup: consumerGroups.complianceService,
    tableName: 'user_read_model',
    projection: (event) => ({
      id: event.streamId,
      type: event.type,
      data: event.data,
    }),
    batchSize: 100,
    syncInterval: 10000,
  },
  {
    sourceTopic: topics.seller.topic,
    consumerGroup: consumerGroups.sellerService,
    tableName: 'seller_read_model',
    projection: (event) => ({
      id: event.streamId,
      type: event.type,
      data: event.data,
    }),
    batchSize: 50,
    syncInterval: 5000,
  },
  {
    sourceTopic: topics.product.topic,
    consumerGroup: consumerGroups.searchService,
    tableName: 'product_read_model',
    projection: (event) => ({
      id: event.streamId,
      type: event.type,
      data: event.data,
    }),
    batchSize: 100,
    syncInterval: 5000,
  },
];

export const kafkaConfigForReadSync = {
  ...kafkaConfig,
  clientId: 'amarshop-read-sync',
};

export class ReadModelSyncService {
  private configs: ReadModelSyncConfig[] = readModelSyncConfigs;

  async startAll(): Promise<void> {
    for (const config of this.configs) {
      await this.startSync(config);
    }
  }

  private async startSync(config: ReadModelSyncConfig): Promise<void> {
    setInterval(async () => {
      try {
        await this.syncEvents(config);
      } catch (error) {
        console.error(`Read model sync failed for ${config.tableName}:`, error);
      }
    }, config.syncInterval);
  }

  private async syncEvents(config: ReadModelSyncConfig): Promise<void> {
    // Consume events from Kafka topic, project to read model, batch insert to read DB
  }

  async stopAll(): Promise<void> {
    // Cleanup
  }
}
