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
        .query({ skip: 0, take: 10 })
        .expect(200);

      expect(res.body).toHaveProperty('products');
      expect(res.body).toHaveProperty('total');
      expect(Array.isArray(res.body.products)).toBe(true);
    });

    it('should filter by category', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/products')
        .query({ category: 'electronics' })
        .expect(200);

      expect(res.body).toHaveProperty('products');
      expect(res.body).toHaveProperty('total');
      expect(Array.isArray(res.body.products)).toBe(true);
    });

    it('should search products', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/products')
        .query({ search: 'smartphone' })
        .expect(200);

      expect(res.body).toHaveProperty('products');
      expect(res.body).toHaveProperty('total');
      expect(Array.isArray(res.body.products)).toBe(true);
    });
  });

  describe('GET /api/v1/products/:id', () => {
    it('should return a single product', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/products/cmr3pzr9o000774iiknhsyo0k')
        .expect(200);

      expect(res.body).toHaveProperty('id');
    });

    it('should return 404 for non-existent product', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/products/non-existent-product-xyz')
        .expect(404);
    });
  });
});
