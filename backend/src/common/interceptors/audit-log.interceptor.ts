import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly prisma: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, path, body } = request;
    const user = request.user;

    if (!user || user.role !== 'admin') {
      return next.handle();
    }

    return next.handle().pipe(
      tap(() => {
        this.prisma.adminLog.create({
          data: {
            userId: user.id,
            method,
            path,
            body: body ? JSON.stringify(body) : null,
            createdAt: new Date(),
          },
        }).catch(() => {});
      }),
    );
  }
}
