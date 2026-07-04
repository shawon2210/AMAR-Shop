import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require("supertest");
import { AppModule } from '../../src/app.module';

describe('Products (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/v1/products', () => {
    it('should return paginated products', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/products')
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('meta');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter by category', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/products')
        .query({ categoryId: 'cat-1' })
        .expect(200);

      expect(res.body).toHaveProperty('data');
    });

    it('should search products', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/products')
        .query({ search: 'smartphone' })
        .expect(200);

      expect(res.body).toHaveProperty('data');
    });
  });

  describe('GET /api/v1/products/:slug', () => {
    it('should return a single product', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/products/samsung-galaxy-s24-ultra')
        .expect(200);

      expect(res.body).toHaveProperty('id');
    });

    it('should return 404 for non-existent product', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/products/non-existent-product-xyz')
        .expect(404);
    });
  });

  describe('GET /api/v1/products/category/:slug', () => {
    it('should return products by category', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/products/category/electronics')
        .expect(200);

      expect(res.body).toHaveProperty('data');
    });
  });
});
