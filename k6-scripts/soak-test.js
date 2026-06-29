import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const apiLatency = new Trend('api_latency');

export const options = {
  vus: 50,
  duration: '1h',
  thresholds: {
    errors: ['rate<0.05'],
    api_latency: ['p(95)<3000', 'p(99)<8000'],
    http_req_duration: ['avg<1000'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000/api/v1';

export default function () {
  const res = http.get(`${BASE_URL}/products?page=1&limit=20`);

  apiLatency.add(res.timings.duration);
  errorRate.add(res.status !== 200);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 3s': (r) => r.timings.duration < 3000,
  });

  const healthRes = http.get(`${BASE_URL}/health`);

  check(healthRes, {
    'health endpoint OK': (r) => r.status === 200,
  });

  sleep(Math.random() * 3 + 2);
}
