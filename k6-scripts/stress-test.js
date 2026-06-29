import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const apiLatency = new Trend('api_latency');

export const options = {
  stages: [
    { duration: '2m', target: 50 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 500 },
    { duration: '5m', target: 500 },
    { duration: '3m', target: 0 },
  ],
  thresholds: {
    errors: ['rate<0.10'],
    api_latency: ['p(95)<5000'],
    http_req_duration: ['p(99)<10000'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000/api/v1';

const endpoints = [
  () => http.get(`${BASE_URL}/products?page=1&limit=20`),
  () => http.get(`${BASE_URL}/products?search=laptop&page=1&limit=20`),
  () => http.get(`${BASE_URL}/categories`),
  () => http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    phone: '01712345678', password: 'test123',
  }), { headers: { 'Content-Type': 'application/json' } }),
];

export default function () {
  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];

  const res = endpoint();
  apiLatency.add(res.timings.duration);
  errorRate.add(res.status >= 400);

  check(res, {
    'status is 2xx': (r) => r.status >= 200 && r.status < 300,
    'response time < 5s': (r) => r.timings.duration < 5000,
  });

  sleep(Math.random() * 2);
}
