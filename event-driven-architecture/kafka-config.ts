export const kafkaConfig = {
  clientId: 'amarshop',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  ssl: process.env.NODE_ENV === 'production',
  sasl: process.env.NODE_ENV === 'production' ? {
    mechanism: 'scram-sha-256' as const,
    username: process.env.KAFKA_USERNAME || '',
    password: process.env.KAFKA_PASSWORD || '',
  } : undefined,
  connectionTimeout: 10000,
  authenticationTimeout: 10000,
  reconnectionTimeout: 30000,
};

export const topics = {
  order: {
    topic: 'amarshop.order',
    partitions: 6,
    replicationFactor: 3,
    config: {
      'cleanup.policy': 'delete',
      'retention.ms': '604800000',
      'retention.bytes': '1073741824',
    },
  },
  payment: {
    topic: 'amarshop.payment',
    partitions: 6,
    replicationFactor: 3,
    config: {
      'cleanup.policy': 'compact,delete',
      'retention.ms': '2592000000',
    },
  },
  inventory: {
    topic: 'amarshop.inventory',
    partitions: 4,
    replicationFactor: 3,
    config: {
      'cleanup.policy': 'compact',
      'retention.ms': '2592000000',
    },
  },
  user: {
    topic: 'amarshop.user',
    partitions: 4,
    replicationFactor: 3,
  },
  seller: {
    topic: 'amarshop.seller',
    partitions: 4,
    replicationFactor: 3,
  },
  product: {
    topic: 'amarshop.product',
    partitions: 6,
    replicationFactor: 3,
  },
  fulfillment: {
    topic: 'amarshop.fulfillment',
    partitions: 6,
    replicationFactor: 3,
  },
  notification: {
    topic: 'amarshop.notification',
    partitions: 3,
    replicationFactor: 2,
  },
  analytics: {
    topic: 'amarshop.analytics',
    partitions: 6,
    replicationFactor: 2,
    config: {
      'retention.ms': '86400000',
    },
  },
  deadLetter: {
    topic: 'amarshop.dlq',
    partitions: 3,
    replicationFactor: 2,
    config: {
      'retention.ms': '2592000000',
    },
  },
};

export const consumerGroups = {
  orderService: 'amarshop-order-service',
  paymentService: 'amarshop-payment-service',
  inventoryService: 'amarshop-inventory-service',
  fulfillmentService: 'amarshop-fulfillment-service',
  notificationService: 'amarshop-notification-service',
  analyticsService: 'amarshop-analytics-service',
  searchService: 'amarshop-search-service',
  sellerService: 'amarshop-seller-service',
  walletService: 'amarshop-wallet-service',
  complianceService: 'amarshop-compliance-service',
  loyaltyService: 'amarshop-loyalty-service',
  cmsService: 'amarshop-cms-service',
};

export const producerConfig = {
  allowAutoTopicCreation: true,
  transactionTimeout: 30000,
  idempotent: true,
  maxInFlightRequests: 5,
  compression: 'gzip' as const,
};

export const consumerConfig = {
  sessionTimeout: 30000,
  heartbeatInterval: 3000,
  rebalanceTimeout: 60000,
  autoCommit: true,
  autoCommitInterval: 5000,
  maxBytesPerPartition: 1048576,
  minBytes: 1,
  maxBytes: 10485760,
  maxWaitTimeInMs: 5000,
  retry: {
    initialRetryTime: 100,
    retries: 10,
  },
};

export const schemaRegistryConfig = {
  host: process.env.SCHEMA_REGISTRY_URL || 'http://localhost:8081',
  basicAuth: {
    username: process.env.KAFKA_SCHEMA_REGISTRY_KEY || '',
    password: process.env.KAFKA_SCHEMA_REGISTRY_SECRET || '',
  },
};

export const deadLetterConfig = {
  maxRetries: 3,
  retryBackoffMs: 1000,
  topic: topics.deadLetter.topic,
};
