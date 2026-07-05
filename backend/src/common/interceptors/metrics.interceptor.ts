import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Counter, Histogram, Gauge } from 'prom-client';
import { register } from 'prom-client';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  private requestCounter: Counter;
  private requestDuration: Histogram;
  private activeRequests: Gauge;

  constructor() {
    this.requestCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'path', 'status'],
    });

    this.requestDuration = new Histogram({
      name: 'http_request_duration_ms',
      help: 'HTTP request duration in milliseconds',
      labelNames: ['method', 'path', 'status'],
      buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
    });

    this.activeRequests = new Gauge({
      name: 'http_active_requests',
      help: 'Number of active HTTP requests',
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, path } = request;
    const start = Date.now();

    this.activeRequests.inc();

    return next.handle().pipe(
      tap({
        next: () => {
          const status = context.switchToHttp().getResponse().statusCode;
          const duration = Date.now() - start;
          this.requestCounter.labels(method, path, String(status)).inc();
          this.requestDuration
            .labels(method, path, String(status))
            .observe(duration);
          this.activeRequests.dec();
        },
        error: () => {
          const status = 500;
          const duration = Date.now() - start;
          this.requestCounter.labels(method, path, String(status)).inc();
          this.requestDuration
            .labels(method, path, String(status))
            .observe(duration);
          this.activeRequests.dec();
        },
      }),
    );
  }
}

export { register };
