import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const requestId = uuidv4();
    const { method, url } = request;
    const start = Date.now();

    request.requestId = requestId;

    console.log(
      JSON.stringify({
        requestId,
        type: 'request',
        method,
        url,
        timestamp: new Date().toISOString(),
      }),
    );

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const duration = Date.now() - start;

        console.log(
          JSON.stringify({
            requestId,
            type: 'response',
            method,
            url,
            statusCode: response.statusCode,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString(),
          }),
        );
      }),
    );
  }
}
