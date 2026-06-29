import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const cartDuration = new Trend('cart_duration');
const errorRate = new Rate('error_rate');

export const options = {
  stages: [
    { duration: '30s', target: 5 },
    { duration: '1m', target: 25 },
    { duration: '30s', target: 50 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    cart_duration: ['p(95)<1500'],
    error_rate: ['rate<0.03'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000/api/v1';
const TOKEN = __ENV.AUTH_TOKEN || '';

export default function () {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${TOKEN}`,
  };

  const addRes = http.post(`${BASE_URL}/cart`, JSON.stringify({
    productId: `prod-${Math.floor(Math.random() * 100) + 1}`,
    quantity: Math.floor(Math.random() * 3) + 1,
  }), { headers, tags: { name: 'cart_add' } });

  cartDuration.add(addRes.timings.duration);
  errorRate.add(addRes.status !== 201);

  check(addRes, {
    'add to cart status is 201': (r) => r.status === 201,
    'add to cart response time < 1.5s': (r) => r.timings.duration < 1500,
  });

  const getRes = http.get(`${BASE_URL}/cart`, { headers, tags: { name: 'cart_get' } });

  check(getRes, {
    'get cart status is 200': (r) => r.status === 200,
  });

  sleep(Math.random() * 2 + 1);
}
