export interface RealtimeConfig {
  redis: {
    host: string;
    port: number;
    password?: string;
  };
  bull: {
    defaultJobOptions: {
      attempts: number;
      backoff: { type: 'exponential'; delay: number };
      removeOnComplete: boolean;
      removeOnFail: boolean;
    };
  };
  rateLimit: {
    windowMs: number;
    maxConnections: number;
    maxEventsPerMinute: number;
  };
  jwtSecret: string;
}

export const realtimeConfig: RealtimeConfig = {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },
  bull: {
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: false,
      removeOnFail: false,
    },
  },
  rateLimit: {
    windowMs: 60000,
    maxConnections: 1000,
    maxEventsPerMinute: 120,
  },
  get jwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error(
        'JWT_SECRET environment variable is required for realtime config',
      );
    }
    return secret;
  },
};
