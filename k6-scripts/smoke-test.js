import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  vus: 5,
  duration: '1m',
  thresholds: {
    errors: ['rate<0.01'],
    http_req_duration: ['p(95)<2000'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000/api/v1';

export default function () {
  group('Product Flow', () => {
    const productsRes = http.get(`${BASE_URL}/products?page=1&limit=10`);
    check(productsRes, { 'products status 200': (r) => r.status === 200 });
    errorRate.add(productsRes.status !== 200);
    sleep(1);

    const searchRes = http.get(`${BASE_URL}/products?search=smartphone`);
    check(searchRes, { 'search status 200': (r) => r.status === 200 });
    sleep(1);
  });

  group('Auth Flow', () => {
    const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
      phone: '01712345678',
      password: 'test123',
    }), { headers: { 'Content-Type': 'application/json' } });
    check(loginRes, { 'login status 200': (r) => r.status === 200 });
    errorRate.add(loginRes.status !== 200);
    sleep(1);
  });

  group('Health Check', () => {
    const healthRes = http.get(`${BASE_URL}/health`);
    check(healthRes, { 'health status 200': (r) => r.status === 200 });
  });
}
