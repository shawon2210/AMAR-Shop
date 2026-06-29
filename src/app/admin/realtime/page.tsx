'use client';

import { useState, useEffect } from 'react';

function randomMetric() {
  return {
    activeUsers: Math.floor(Math.random() * 150) + 50,
    ordersPerMin: Math.floor(Math.random() * 20) + 5,
    revenueToday: Math.floor(Math.random() * 500000) + 200000,
    systemHealth: 99.8,
    apiLatency: Math.floor(Math.random() * 200) + 50,
    errorRate: 0.12,
  };
}

export default function RealtimePage() {
  const [metrics, setMetrics] = useState(randomMetric);

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, user: 'Rahim M.', action: 'placed order', target: '#ORD-1245', time: 'Just now', amount: '৳1,250' },
    { id: 2, user: 'Karim H.', action: 'signed up', target: '', time: '1m ago', amount: '' },
    { id: 3, user: 'Fatima B.', action: 'added to cart', target: 'Samsung Galaxy S25', time: '2m ago', amount: '৳89,999' },
    { id: 4, user: 'Nadia K.', action: 'completed payment', target: '#ORD-1243', time: '3m ago', amount: '৳2,450' },
    { id: 5, user: 'Hasan A.', action: 'submitted review', target: 'iPhone 16 Pro', time: '4m ago', amount: '' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
        ordersPerMin: Math.floor(Math.random() * 20) + 5,
        revenueToday: prev.revenueToday + Math.floor(Math.random() * 5000),
        systemHealth: 99.7 + Math.random() * 0.3,
        apiLatency: Math.floor(Math.random() * 200) + 50,
        errorRate: Math.random() * 0.5,
      }));

      if (Math.random() > 0.7) {
        setRecentActivity(prev => [
          { id: Date.now(), user: ['Rahim', 'Karim', 'Fatima', 'Nadia', 'Hasan'][Math.floor(Math.random() * 5)], action: ['placed order', 'signed up', 'added to cart', 'completed payment'][Math.floor(Math.random() * 4)], target: `#ORD-${Math.floor(Math.random() * 9999)}`, time: 'Just now', amount: `৳${Math.floor(Math.random() * 100000)}` },
          ...prev.slice(0, 9),
        ]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md text-on-surface">Real-Time Dashboard</h1>
          <p className="text-body-sm text-on-surface-variant mt-1">Live metrics updating every 3 seconds</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-body-sm text-green-600 font-medium">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="bg-surface rounded-xl border border-outline-variant p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-blue-500">people</span>
            <p className="text-label-bold text-on-surface-variant uppercase">Active Users</p>
          </div>
          <p className="text-display-lg-mobile text-on-surface font-bold">{metrics.activeUsers}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-green-500 text-[16px]">trending_up</span>
            <span className="text-label-bold text-green-600">+12% vs yesterday</span>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-outline-variant p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-amber-500">shopping_cart</span>
            <p className="text-label-bold text-on-surface-variant uppercase">Orders / Min</p>
          </div>
          <p className="text-display-lg-mobile text-on-surface font-bold">{metrics.ordersPerMin}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-green-500 text-[16px]">trending_up</span>
            <span className="text-label-bold text-green-600">+5% today</span>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-outline-variant p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-green-500">payments</span>
            <p className="text-label-bold text-on-surface-variant uppercase">Revenue Today</p>
          </div>
          <p className="text-display-lg-mobile text-on-surface font-bold">৳{metrics.revenueToday.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-green-500 text-[16px]">trending_up</span>
            <span className="text-label-bold text-green-600">+8%</span>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-outline-variant p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-green-500">monitor_heart</span>
            <p className="text-label-bold text-on-surface-variant uppercase">System Health</p>
          </div>
          <p className="text-display-lg-mobile text-green-600 font-bold">{metrics.systemHealth.toFixed(1)}%</p>
          <div className="h-1.5 bg-surface-container-highest rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: `${metrics.systemHealth}%` }} />
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-outline-variant p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-blue-500">speed</span>
            <p className="text-label-bold text-on-surface-variant uppercase">API Latency</p>
          </div>
          <p className={`text-display-lg-mobile font-bold ${metrics.apiLatency > 150 ? 'text-error' : metrics.apiLatency > 100 ? 'text-amber-600' : 'text-green-600'}`}>
            {metrics.apiLatency}ms
          </p>
        </div>

        <div className="bg-surface rounded-xl border border-outline-variant p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-error">error</span>
            <p className="text-label-bold text-on-surface-variant uppercase">Error Rate</p>
          </div>
          <p className={`text-display-lg-mobile font-bold ${metrics.errorRate > 0.3 ? 'text-error' : 'text-green-600'}`}>
            {metrics.errorRate.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant p-5">
        <h2 className="text-title-sm text-on-surface font-semibold mb-4">Live Activity Feed</h2>
        <div className="space-y-0">
          {recentActivity.map((a) => (
            <div key={a.id} className="flex items-center gap-3 py-2.5 border-b border-outline-variant/30 last:border-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px] text-primary">person</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body-sm text-on-surface">
                  <span className="font-semibold">{a.user}</span>
                  {' '}{a.action}{' '}
                  {a.target && <span className="text-primary">{a.target}</span>}
                </p>
              </div>
              <div className="text-right shrink-0">
                {a.amount && <p className="text-body-sm font-semibold text-on-surface">{a.amount}</p>}
                <p className="text-label-bold text-on-surface-variant">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant p-5">
        <h2 className="text-title-sm text-on-surface font-semibold mb-4">Orders Per Minute (Last 30 min)</h2>
        <div className="flex items-end gap-1 h-32">
          {Array.from({ length: 30 }, (_, i) => {
            const height = 10 + (i * 7919 % 41) / 41 * 50;
            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className={`w-full rounded-t ${i === 29 ? 'bg-primary' : 'bg-primary/30'}`}
                  style={{ height: `${height}px` }} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
