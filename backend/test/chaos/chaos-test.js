import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('chaos_errors');

export const options = {
  vus: 10,
  duration: '5m',
  thresholds: {
    chaos_errors: ['rate<0.50'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000/api/v1';

export default function () {
  group('Database Disconnection Scenario', () => {
    const res = http.get(`${BASE_URL}/products`);
    check(res, {
      'graceful degradation on DB failure': (r) => {
        if (r.status === 200) return true;
        if (r.status === 503) return true;
        return false;
      },
    });
    errorRate.add(res.status >= 500);
    sleep(2);
  });

  group('Redis Failure Fallback', () => {
    const res = http.get(`${BASE_URL}/products?cache=false`);
    check(res, {
      'falls back without cache': (r) => r.status === 200,
    });
    sleep(1);
  });

  group('Service Degradation Behavior', () => {
    const slowEndpoint = http.get(`${BASE_URL}/products?delay=5000`, { timeout: 10000 });
    check(slowEndpoint, {
      'handles slow responses gracefully': (r) => {
        if (r.status === 200) return true;
        if (r.status === 504) return true;
        return false;
      },
    });
    sleep(3);
  });

  group('Error Recovery Validation', () => {
    const firstRes = http.get(`${BASE_URL}/products?simulate_error=true`);
    sleep(2);
    const secondRes = http.get(`${BASE_URL}/products`);
    check(secondRes, {
      'recovers after error': (r) => r.status === 200,
    });
    sleep(1);
  });
}
