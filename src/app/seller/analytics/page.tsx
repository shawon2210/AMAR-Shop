'use client';

import { useState } from 'react';
import { useSellerAnalytics } from '@/services/seller';

const dateRanges = ['7d', '30d', '90d'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function SellerAnalytics() {
  const [selectedRange, setSelectedRange] = useState('30d');

  const days = selectedRange === '7d' ? 7 : selectedRange === '90d' ? 90 : 30;
  const from = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];
  const to = new Date().toISOString().split('T')[0];

  const { data, isLoading, error } = useSellerAnalytics(from, to);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-on-surface-variant">Loading analytics...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <span className="material-symbols-outlined text-4xl text-error mb-2">error</span>
        <p className="text-on-surface-variant">Failed to load analytics</p>
      </div>
    );
  }

  const { salesChart, topProducts, categoryBreakdown, totalViews, totalOrders, conversion } = data;
  const totalRevenue = salesChart.reduce((sum, d) => sum + d.revenue, 0);
  const maxMonthly = Math.max(...salesChart.map((d) => d.revenue), 1);

  const overviewCards = [
    { label: 'Total Revenue', value: `৳${totalRevenue.toLocaleString('en-IN')}`, icon: 'payments' },
    { label: 'Total Orders', value: totalOrders.toLocaleString(), icon: 'receipt_long' },
    { label: 'Conversion Rate', value: `${conversion.toFixed(2)}%`, icon: 'trending_up' },
    { label: 'Total Views', value: totalViews.toLocaleString(), icon: 'visibility' },
  ];

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
        {overviewCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-4 border border-surface-container-high shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-on-surface-variant">{card.label}</span>
              <span className="material-symbols-outlined text-on-surface-variant">{card.icon}</span>
            </div>
            <p className="text-2xl font-bold text-on-surface">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-surface-container-high shadow-sm">
          <h3 className="font-semibold text-on-surface mb-4">Revenue Trend</h3>
          {salesChart.length === 0 ? (
            <p className="text-sm text-on-surface-variant text-center py-10">No revenue data for this period</p>
          ) : (
            <div className="flex items-end gap-1.5 h-48">
              {salesChart.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-gradient-to-t from-primary/80 to-primary rounded-t-md transition-all duration-500"
                    style={{ height: `${(val.revenue / maxMonthly) * 100}%` }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-surface-container-high shadow-sm">
          <div className="p-4 border-b border-surface-container-high">
            <h3 className="font-semibold text-on-surface">Top Selling Products</h3>
          </div>
          <div className="divide-y divide-surface-container-high">
            {topProducts.length === 0 ? (
              <div className="p-4 text-center text-sm text-on-surface-variant">No product data yet</div>
            ) : (
              topProducts.slice(0, 5).map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-xs font-bold text-on-surface-variant">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm text-on-surface font-medium">{p.name}</p>
                      <p className="text-xs text-on-surface-variant">{p.soldCount} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-on-surface">৳{p.revenue.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-xl p-5 border border-surface-container-high shadow-sm">
          <h3 className="font-semibold text-on-surface mb-4">Category Breakdown</h3>
          {categoryBreakdown.length === 0 ? (
            <p className="text-sm text-on-surface-variant text-center py-4">No category data yet</p>
          ) : (
            <div className="space-y-3">
              {categoryBreakdown.map((cat) => (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-on-surface">{cat.category}</span>
                    <div className="text-right">
                      <span className="text-sm font-medium text-on-surface">৳{cat.revenue.toLocaleString('en-IN')}</span>
                      <span className="text-xs text-on-surface-variant ml-2">{Math.round((cat.revenue / totalRevenue) * 100)}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(cat.revenue / totalRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sales Summary */}
        <div className="bg-white rounded-xl p-5 border border-surface-container-high shadow-sm">
          <h3 className="font-semibold text-on-surface mb-4">Sales Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
              <span className="text-sm text-on-surface">Total Orders</span>
              <span className="text-lg font-bold text-on-surface">{totalOrders.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
              <span className="text-sm text-on-surface">Total Revenue</span>
              <span className="text-lg font-bold text-on-surface">৳{totalRevenue.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
              <span className="text-sm text-on-surface">Conversion Rate</span>
              <span className="text-lg font-bold text-green-600">{conversion.toFixed(2)}%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
              <span className="text-sm text-on-surface">Page Views</span>
              <span className="text-lg font-bold text-on-surface">{totalViews.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
