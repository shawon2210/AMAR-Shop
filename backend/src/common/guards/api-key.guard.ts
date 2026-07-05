import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DeveloperService } from '../../modules/developer/developer.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private rateLimitStore = new Map<
    string,
    { count: number; resetAt: number }
  >();

  constructor(
    private reflector: Reflector,
    private developerService: DeveloperService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('Missing X-API-Key header');
    }

    try {
      const validation = await this.developerService.validateApiKey(apiKey);
      request.user = {
        ...request.user,
        userId: validation.userId,
        permissions: validation.permissions,
      };
      request.apiKeyId = validation.keyId;

      const now = Date.now();
      const entry = this.rateLimitStore.get(validation.keyId);

      if (entry && now < entry.resetAt) {
        if (entry.count >= 100) {
          const response = context.switchToHttp().getResponse();
          response.setHeader(
            'Retry-After',
            Math.ceil((entry.resetAt - now) / 1000),
          );
          throw new HttpException(
            'Rate limit exceeded',
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }
        entry.count++;
      } else {
        this.rateLimitStore.set(validation.keyId, {
          count: 1,
          resetAt: now + 3600000,
        });
      }

      const { method, path } = request;
      this.developerService
        .logApiCall(validation.keyId, `${method} ${path}`, 200, 0)
        .catch(() => {});

      return true;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new UnauthorizedException('Invalid API key');
    }
  }
}
