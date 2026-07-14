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
        email: context.user.email,
        username: context.user.phone,
      });
    }
    if (context?.request) {
      scope.setExtra('request', context.request);
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
        email: context.user.email,
        username: context.user.phone,
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
  Sentry.setUser({ id: user.id, email: user.email, username: user.phone });
}

export function clearUserContext() {
  Sentry.setUser(null);
}
