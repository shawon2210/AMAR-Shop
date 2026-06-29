import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';

interface TierConfig {
  limit: number;
  windowMs: number;
  label: string;
}

const TIERS: Record<string, TierConfig> = {
  free: { limit: 100, windowMs: 3600000, label: 'Free' },
  pro: { limit: 10000, windowMs: 3600000, label: 'Pro' },
  enterprise: { limit: Infinity, windowMs: 3600000, label: 'Enterprise' },
};

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  private store = new Map<string, { count: number; resetAt: number }>();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const key = request.apiKeyId || request.ip || 'unknown';
    const tier = (request.user?.plan as string) || 'free';
    const config = TIERS[tier] || TIERS.free;

    if (config.limit === Infinity) return next.handle();

    const now = Date.now();
    const entry = this.store.get(key);

    if (entry && now < entry.resetAt) {
      if (entry.count >= config.limit) {
        const response = context.switchToHttp().getResponse();
        response.setHeader(
          'Retry-After',
          Math.ceil((entry.resetAt - now) / 1000),
        );
        response.setHeader('X-RateLimit-Limit', config.limit);
        response.setHeader('X-RateLimit-Remaining', 0);
        response.setHeader(
          'X-RateLimit-Reset',
          Math.ceil(entry.resetAt / 1000),
        );
        throw new HttpException(
          {
            message: 'Rate limit exceeded',
            tier: config.label,
            limit: config.limit,
            resetAt: entry.resetAt,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      entry.count++;
    } else {
      this.store.set(key, { count: 1, resetAt: now + config.windowMs });
    }

    const response = context.switchToHttp().getResponse();
    const currentEntry = this.store.get(key);
    response.setHeader('X-RateLimit-Limit', config.limit);
    response.setHeader(
      'X-RateLimit-Remaining',
      Math.max(0, config.limit - currentEntry!.count),
    );
    response.setHeader(
      'X-RateLimit-Reset',
      Math.ceil(currentEntry!.resetAt / 1000),
    );

    return next.handle();
  }
}
