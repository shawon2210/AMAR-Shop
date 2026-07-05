import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { trace, SpanStatusCode } from '@opentelemetry/api';

@Injectable()
export class TracingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, path } = request;
    const tracer = trace.getTracer('amarshop-tracer');

    return tracer.startActiveSpan(`${method} ${path}`, (span) => {
      span.setAttribute('http.method', method);
      span.setAttribute('http.path', path);
      if (request.user) span.setAttribute('user.id', request.user.id);

      const start = Date.now();

      return next.handle().pipe(
        tap({
          next: () => {
            const response = context.switchToHttp().getResponse();
            span.setAttribute('http.status_code', response.statusCode);
            span.setAttribute('http.duration_ms', Date.now() - start);
            span.setStatus({ code: SpanStatusCode.OK });
            span.end();
          },
          error: (error) => {
            span.setAttribute('http.error', error.message);
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: error.message,
            });
            span.end();
          },
        }),
      );
    });
  }
}
