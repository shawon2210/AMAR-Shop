import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import {
  MetricsInterceptor,
  register,
} from './common/interceptors/metrics.interceptor';
import { TracingInterceptor } from './common/interceptors/tracing.interceptor';
import { setupObservability } from './observability/opentelemetry';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const t0 = Date.now();
  require('fs').appendFileSync('/tmp/amarshop-trace.log', `[1] start ${t0}\n`);
  setupObservability();
  require('fs').appendFileSync('/tmp/amarshop-trace.log', `[2] observability ready ${Date.now()-t0}ms\n`);

  const t1 = Date.now();
  require('fs').appendFileSync('/tmp/amarshop-trace.log', `[3] creating app...\n`);
  const app = await NestFactory.create(AppModule);
  require('fs').appendFileSync('/tmp/amarshop-trace.log', `[4] app created ${Date.now()-t1}ms\n`);

  // Validate critical environment variables at startup
  const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  }

  // Security headers with Helmet
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", 'https://apis.google.com'],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://fonts.googleapis.com',
          ],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
          connectSrc: [
            "'self'",
            'https://api.amarshop.com',
            'https://amarshop-api.vercel.app',
          ],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: { policy: 'same-origin' },
      crossOriginResourcePolicy: { policy: 'same-origin' },
      dnsPrefetchControl: { allow: false },
      frameguard: { action: 'deny' },
      hidePoweredBy: true,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      ieNoOpen: true,
      noSniff: true,
      originAgentCluster: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      xssFilter: true,
    }),
  );

  // Cookie parser for HTTP-only cookies
  app.use(cookieParser(process.env.COOKIE_SECRET));

  // Enable CORS for frontend
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
    : process.env.NODE_ENV === 'production'
      ? ['https://amarshop.vercel.app']
      : ['http://localhost:3000'];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-CSRF-Token',
    ],
    exposedHeaders: ['X-CSRF-Token'],
    maxAge: 86400,
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global interceptors
  app.useGlobalInterceptors(new TracingInterceptor(), new MetricsInterceptor());

  // Metrics endpoint for Prometheus
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log('🚀 AmarShop API running on http://localhost:' + port);
}

void bootstrap();
