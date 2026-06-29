'use client';

import { useState } from 'react';

const dateRanges = ['7d', '30d', '90d', 'Custom'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const topProducts = [
  { name: 'iPhone 15 Pro Max', sales: 234, revenue: '৳3,04,19,766', growth: '+12%' },
  { name: 'Nike Air Max 270', sales: 156, revenue: '৳26,51,844', growth: '+8%' },
  { name: 'Samsung Galaxy S24', sales: 189, revenue: '৳2,26,79,811', growth: '+15%' },
  { name: 'Casio G-Shock GA-2100', sales: 312, revenue: '৳26,51,688', growth: '+22%' },
  { name: 'MacBook Pro M3 Pro', sales: 67, revenue: '৳1,67,49,933', growth: '+5%' },
];

const categoryData = [
  { name: 'Electronics', revenue: '৳5,80,000', percent: 45 },
  { name: 'Fashion', revenue: '৳2,60,000', percent: 20 },
  { name: 'Home & Living', revenue: '৳1,95,000', percent: 15 },
  { name: 'Beauty', revenue: '৳1,30,000', percent: 10 },
  { name: 'Sports', revenue: '৳1,30,000', percent: 10 },
];

const trafficSources = [
  { source: 'Direct', visits: 12450, percent: 35 },
  { source: 'Social Media', visits: 8900, percent: 25 },
  { source: 'Search Engine', visits: 7120, percent: 20 },
  { source: 'Email', visits: 3560, percent: 10 },
  { source: 'Referral', visits: 3560, percent: 10 },
];

const monthlyRevenue = [28, 35, 22, 42, 38, 48, 52, 45, 58, 62, 55, 68];
const maxMonthly = Math.max(...monthlyRevenue);

export default function SellerAnalytics() {
  const [selectedRange, setSelectedRange] = useState('30d');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-on-surface">Analytics</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface-container-high rounded-lg p-1">
            {dateRanges.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRange(r)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  selectedRange === r ? 'bg-white text-on-surface shadow-sm font-medium' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-outline text-on-surface font-medium hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-lg">download</span>
            Report
          </button>
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '৳18,42,500', change: '+15.2%', icon: 'payments' },
          { label: 'Total Orders', value: '1,284', change: '+8.3%', icon: 'receipt_long' },
          { label: 'Conversion Rate', value: '3.42%', change: '+0.8%', icon: 'trending_up' },
          { label: 'Avg Order Value', value: '৳1,435', change: '+5.1%', icon: 'shopping_cart' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-4 border border-surface-container-high shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-on-surface-variant">{card.label}</span>
              <span className="material-symbols-outlined text-on-surface-variant">{card.icon}</span>
            </div>
            <p className="text-2xl font-bold text-on-surface">{card.value}</p>
            <p className="text-xs text-green-600 font-medium mt-1">{card.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-surface-container-high shadow-sm">
          <h3 className="font-semibold text-on-surface mb-4">Revenue Trend</h3>
          <div className="flex items-end gap-1.5 h-48">
            {monthlyRevenue.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-gradient-to-t from-primary/80 to-primary rounded-t-md transition-all duration-500"
                  style={{ height: `${(val / maxMonthly) * 100}%` }}
                />
                <span className="text-[10px] text-on-surface-variant mt-1">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-surface-container-high shadow-sm">
          <div className="p-4 border-b border-surface-container-high">
            <h3 className="font-semibold text-on-surface">Top Selling Products</h3>
          </div>
          <div className="divide-y divide-surface-container-high">
            {topProducts.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-xs font-bold text-on-surface-variant">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm text-on-surface font-medium">{p.name}</p>
                    <p className="text-xs text-on-surface-variant">{p.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-on-surface">{p.revenue}</p>
                  <p className="text-xs text-green-600">{p.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-xl p-5 border border-surface-container-high shadow-sm">
          <h3 className="font-semibold text-on-surface mb-4">Category Breakdown</h3>
          <div className="space-y-3">
            {categoryData.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-on-surface">{cat.name}</span>
                  <div className="text-right">
                    <span className="text-sm font-medium text-on-surface">{cat.revenue}</span>
                    <span className="text-xs text-on-surface-variant ml-2">{cat.percent}%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-surface-container-high rounded-full">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-xl p-5 border border-surface-container-high shadow-sm">
          <h3 className="font-semibold text-on-surface mb-4">Traffic Sources</h3>
          <div className="space-y-4">
            {trafficSources.map((t) => (
              <div key={t.source} className="flex items-center gap-4">
                <div className="w-24">
                  <span className="text-sm text-on-surface">{t.source}</span>
                </div>
                <div className="flex-1 h-2 bg-surface-container-high rounded-full">
                  <div
                    className="h-full rounded-full bg-tertiary"
                    style={{ width: `${t.percent}%` }}
                  />
                </div>
                <div className="text-right w-24">
                  <span className="text-sm font-medium text-on-surface">{t.visits.toLocaleString()}</span>
                  <span className="text-xs text-on-surface-variant ml-1">{t.percent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
