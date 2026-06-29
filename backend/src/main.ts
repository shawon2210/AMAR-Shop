import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { MetricsInterceptor, register } from './common/interceptors/metrics.interceptor';
import { TracingInterceptor } from './common/interceptors/tracing.interceptor';
import { setupObservability } from './observability/opentelemetry';

async function bootstrap() {
  setupObservability();

  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'https://amarshop.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
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

  // Global prefix
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 AmarShop API running on http://localhost:${port}/api/v1`);
}

bootstrap();
