import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import { describe, it, expect } from '@jest/globals';

const { eachLike, like, integer, string } = MatchersV3;

const provider = new PactV3({
  consumer: 'amarshop-frontend',
  provider: 'amarshop-api',
});

describe('Product API Contract', () => {
  it('should return a list of products', async () => {
    provider
      .uponReceiving('a request for all products')
      .withRequest({
        method: 'GET',
        path: '/api/v1/products',
        query: { page: '1', limit: '20' },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          data: eachLike({
            id: string(),
            name: string(),
            slug: string(),
            price: like(25000),
            images: eachLike(string()),
            rating: like(4.5),
            inStock: boolean(),
            category: { id: string(), name: string() },
          }),
          meta: {
            total: integer(),
            page: integer(),
            limit: integer(),
            totalPages: integer(),
          },
        },
      });

    return provider.executeTest(async (mockServer) => {
      const res = await fetch(`${mockServer.url}/api/v1/products?page=1&limit=20`);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('meta');
      expect(Array.isArray(body.data)).toBe(true);
    });
  });

  it('should return a single product', async () => {
    provider
      .uponReceiving('a request for a specific product')
      .withRequest({
        method: 'GET',
        path: '/api/v1/products/test-product-1',
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          id: string(),
          name: string(),
          slug: string(),
          description: string(),
          price: like(25000),
          images: eachLike(string()),
          rating: like(4.5),
          reviewCount: integer(),
          inStock: boolean(),
          stockCount: integer(),
          category: { id: string(), name: string() },
          store: { id: string(), name: string() },
        },
      });

    return provider.executeTest(async (mockServer) => {
      const res = await fetch(`${mockServer.url}/api/v1/products/test-product-1`);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('name');
    });
  });

  it('should return 404 for non-existent product', async () => {
    provider
      .uponReceiving('a request for a non-existent product')
      .withRequest({
        method: 'GET',
        path: '/api/v1/products/non-existent-product',
      })
      .willRespondWith({ status: 404 });

    return provider.executeTest(async (mockServer) => {
      const res = await fetch(`${mockServer.url}/api/v1/products/non-existent-product`);
      expect(res.status).toBe(404);
    });
  });
});

function boolean() {
  return expect.stringMatching(/true|false/);
}
