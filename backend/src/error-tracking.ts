import * as Sentry from '@sentry/node';
import { HttpException } from '@nestjs/common';

interface ErrorContext {
  user?: { id: string; email?: string; phone?: string };
  request?: { method: string; url: string; headers?: Record<string, string> };
  environment?: string;
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
}

export function captureError(
  error: Error | HttpException,
  context?: ErrorContext,
) {
  Sentry.withScope((scope) => {
    if (context?.user) {
      scope.setUser({
        id: context.user.id,
      });
    }
    if (context?.request && context?.request?.headers) {
      const safeHeaders = { ...context.request.headers };
      delete safeHeaders['authorization'];
      delete safeHeaders['cookie'];
      delete safeHeaders['x-api-key'];
      scope.setExtra('request', { ...context.request, headers: safeHeaders });
    }
    if (context?.environment) {
      scope.setTag('environment', context.environment);
    }
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) =>
        scope.setTag(key, value),
      );
    }
    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) =>
        scope.setExtra(key, value),
      );
    }

    if (error instanceof HttpException) {
      scope.setExtra('statusCode', error.getStatus());
      scope.setExtra('response', error.getResponse());
    }

    Sentry.captureException(error);
  });
}

export function captureMessage(message: string, context?: ErrorContext) {
  Sentry.withScope((scope) => {
    if (context?.user) {
      scope.setUser({
        id: context.user.id,
      });
    }
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) =>
        scope.setTag(key, value),
      );
    }
    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) =>
        scope.setExtra(key, value),
      );
    }
    Sentry.captureMessage(message);
  });
}

export function setUserContext(user: {
  id: string;
  email?: string;
  phone?: string;
}) {
  Sentry.setUser({ id: user.id });
}

export function clearUserContext() {
  Sentry.setUser(null);
}
