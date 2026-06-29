import axios from 'axios';
import { performance } from 'perf_hooks';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4000';
const CONCURRENCY = 10;
const REQUESTS_PER_ENDPOINT = 100;

interface BenchmarkResult {
  endpoint: string;
  method: string;
  avgLatency: number;
  minLatency: number;
  maxLatency: number;
  p95Latency: number;
  p99Latency: number;
  successRate: number;
  throughput: number;
}

async function benchmarkEndpoint(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  body?: Record<string, unknown>,
): Promise<BenchmarkResult> {
  const latencies: number[] = [];
  let successes = 0;
  let failures = 0;

  const tasks = Array.from({ length: CONCURRENCY }, async () => {
    for (let i = 0; i < REQUESTS_PER_ENDPOINT / CONCURRENCY; i++) {
      const start = performance.now();
      try {
        const config = {
          timeout: 30000,
          headers: { 'Content-Type': 'application/json' },
        };

        let response;
        if (method === 'GET') {
          response = await axios.get(`${BASE_URL}${endpoint}`, config);
        } else if (method === 'POST') {
          response = await axios.post(`${BASE_URL}${endpoint}`, body, config);
        } else if (method === 'PUT') {
          response = await axios.put(`${BASE_URL}${endpoint}`, body, config);
        } else {
          response = await axios.delete(`${BASE_URL}${endpoint}`, config);
        }

        if (response.status < 500) successes++;
        else failures++;
      } catch {
        failures++;
      }

      const elapsed = performance.now() - start;
      latencies.push(elapsed);

      await new Promise((r) => setTimeout(r, Math.random() * 50));
    }
  });

  await Promise.all(tasks);

  latencies.sort((a, b) => a - b);
  const total = successes + failures;
  const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
  const min = latencies[0];
  const max = latencies[latencies.length - 1];
  const p95 = latencies[Math.floor(latencies.length * 0.95)];
  const p99 = latencies[Math.floor(latencies.length * 0.99)];
  const duration = latencies.reduce((a, b) => a + b, 0) / CONCURRENCY;
  const throughput = (total / duration) * 1000;

  return {
    endpoint,
    method,
    avgLatency: Math.round(avg * 100) / 100,
    minLatency: Math.round(min * 100) / 100,
    maxLatency: Math.round(max * 100) / 100,
    p95Latency: Math.round(p95 * 100) / 100,
    p99Latency: Math.round(p99 * 100) / 100,
    successRate: Math.round((successes / total) * 10000) / 100,
    throughput: Math.round(throughput * 100) / 100,
  };
}

async function runBenchmarks() {
  console.log('='.repeat(80));
  console.log('AmarShop API Benchmark');
  console.log(`Target: ${BASE_URL}`);
  console.log(`Concurrency: ${CONCURRENCY}, Requests/Endpoint: ${REQUESTS_PER_ENDPOINT}`);
  console.log('='.repeat(80));

  const endpoints = [
    { method: 'GET' as const, endpoint: '/api/products?page=1&limit=20' },
    { method: 'GET' as const, endpoint: '/api/categories' },
    { method: 'POST' as const, endpoint: '/api/auth/login', body: { phone: '01711111111', password: 'test123' } },
    { method: 'GET' as const, endpoint: '/api/orders?page=1&limit=10' },
    { method: 'GET' as const, endpoint: '/api/search?q=smartphone' },
    { method: 'GET' as const, endpoint: '/api/compliance/status' },
    { method: 'GET' as const, endpoint: '/api/affiliate/top?start=2026-01-01&end=2026-12-31' },
  ];

  const results: BenchmarkResult[] = [];

  for (const ep of endpoints) {
    console.log(`\nBenchmarking ${ep.method} ${ep.endpoint}...`);
    const result = await benchmarkEndpoint(ep.method, ep.endpoint, ep.body);
    results.push(result);

    console.log(`  Avg: ${result.avgLatency}ms | Min: ${result.minLatency}ms | Max: ${result.maxLatency}ms`);
    console.log(`  P95: ${result.p95Latency}ms | P99: ${result.p99Latency}ms`);
    console.log(`  Success: ${result.successRate}% | Throughput: ${result.throughput} req/s`);
  }

  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.table(results);

  const avgLatency = results.reduce((a, r) => a + r.avgLatency, 0) / results.length;
  const avgThroughput = results.reduce((a, r) => a + r.throughput, 0) / results.length;
  const avgSuccess = results.reduce((a, r) => a + r.successRate, 0) / results.length;

  console.log(`\nOverall Average Latency: ${Math.round(avgLatency * 100) / 100}ms`);
  console.log(`Overall Average Throughput: ${Math.round(avgThroughput * 100) / 100} req/s`);
  console.log(`Overall Success Rate: ${Math.round(avgSuccess * 100) / 100}%`);
}

runBenchmarks().catch(console.error);
