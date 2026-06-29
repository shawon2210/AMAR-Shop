import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const checkoutDuration = new Trend('checkout_duration');
const errorRate = new Rate('error_rate');

export const options = {
  stages: [
    { duration: '30s', target: 3 },
    { duration: '1m', target: 15 },
    { duration: '30s', target: 30 },
    { duration: '1m', target: 30 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    checkout_duration: ['p(95)<5000'],
    error_rate: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000/api/v1';
const TOKEN = __ENV.AUTH_TOKEN || '';

export default function () {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${TOKEN}`,
  };

  const orderPayload = {
    addressId: `addr-${Math.floor(Math.random() * 5) + 1}`,
    paymentMethod: 'COD',
    note: 'Load test order',
  };

  const res = http.post(`${BASE_URL}/orders`, JSON.stringify(orderPayload), {
    headers,
    tags: { name: 'checkout' },
  });

  checkoutDuration.add(res.timings.duration);
  errorRate.add(res.status !== 201);

  check(res, {
    'checkout status is 201': (r) => r.status === 201,
    'checkout has order number': (r) => {
      try { return JSON.parse(r.body).orderNumber !== undefined; }
      catch { return false; }
    },
    'checkout response time < 5s': (r) => r.timings.duration < 5000,
  });

  sleep(Math.random() * 5 + 3);
}
