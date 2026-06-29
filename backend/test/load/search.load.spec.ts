import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const searchDuration = new Trend('search_duration');
const errorRate = new Rate('error_rate');

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 100 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    search_duration: ['p(95)<2000'],
    error_rate: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000/api/v1';

const searchTerms = [
  'smartphone', 'laptop', 't-shirt', 'shoes', 'watch',
  'headphones', 'camera', 'tablet', 'book', 'toy',
];

export default function () {
  const term = searchTerms[Math.floor(Math.random() * searchTerms.length)];
  const page = Math.floor(Math.random() * 5) + 1;

  const res = http.get(`${BASE_URL}/products?search=${term}&page=${page}&limit=20`, {
    tags: { name: 'search' },
  });

  searchDuration.add(res.timings.duration);
  errorRate.add(res.status !== 200);

  check(res, {
    'search status is 200': (r) => r.status === 200,
    'search response has data': (r) => {
      try { return JSON.parse(r.body).data !== undefined; }
      catch { return false; }
    },
    'search response time < 2s': (r) => r.timings.duration < 2000,
  });

  sleep(Math.random() * 3 + 1);
}
