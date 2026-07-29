'use client';

import { useState } from 'react';

const salesTrend = [
  { date: '01 Jul', revenue: 142000, orders: 18 },
  { date: '02 Jul', revenue: 98000, orders: 12 },
  { date: '03 Jul', revenue: 165000, orders: 22 },
  { date: '04 Jul', revenue: 121000, orders: 15 },
  { date: '05 Jul', revenue: 188000, orders: 25 },
  { date: '06 Jul', revenue: 210000, orders: 30 },
  { date: '07 Jul', revenue: 156000, orders: 20 },
  { date: '08 Jul', revenue: 134000, orders: 17 },
  { date: '09 Jul', revenue: 172000, orders: 23 },
  { date: '10 Jul', revenue: 195000, orders: 26 },
  { date: '11 Jul', revenue: 148000, orders: 19 },
  { date: '12 Jul', revenue: 201000, orders: 28 },
  { date: '13 Jul', revenue: 225000, orders: 32 },
  { date: '14 Jul', revenue: 167000, orders: 21 },
];

const allProducts = [
  { name: 'Smartphone X Pro', sold: 1247, revenue: 56115000, stock: 340, category: 'Electronics' },
  { name: 'Cotton Saree - Red', sold: 892, revenue: 2854400, stock: 520, category: 'Fashion' },
  { name: 'Wireless Earbuds Pro', sold: 756, revenue: 1134000, stock: 210, category: 'Electronics' },
  { name: 'Premium Leather Bag', sold: 543, revenue: 2715000, stock: 85, category: 'Fashion' },
  { name: 'Smart Watch Series 5', sold: 489, revenue: 7335000, stock: 120, category: 'Electronics' },
  { name: 'Home Decor Lamp', sold: 412, revenue: 618000, stock: 200, category: 'Home & Living' },
  { name: 'Organic Face Cream', sold: 378, revenue: 453600, stock: 310, category: 'Beauty' },
  { name: 'Running Shoes', sold: 345, revenue: 1035000, stock: 95, category: 'Sports' },
  { name: 'Laptop Stand', sold: 312, revenue: 468000, stock: 180, category: 'Electronics' },
  { name: 'Silk Bed Sheet Set', sold: 298, revenue: 894000, stock: 65, category: 'Home & Living' },
];

const allSellers = [
  { name: 'TechZone BD', store: 'techzone-bd', products: 156, revenue: '৳1,240,000', orders: 820, rating: 4.8, status: 'Active' as const },
  { name: 'Fashion Hub', store: 'fashion-hub', products: 340, revenue: '৳890,000', orders: 650, rating: 4.6, status: 'Active' as const },
  { name: 'HomeCraft Ltd', store: 'homecraft', products: 210, revenue: '৳675,000', orders: 430, rating: 4.7, status: 'Active' as const },
  { name: 'BeautyGlow', store: 'beauty-glow', products: 180, revenue: '৳520,000', orders: 380, rating: 4.5, status: 'Active' as const },
  { name: 'Gadget World', store: 'gadget-world', products: 95, revenue: '৳410,000', orders: 290, rating: 4.4, status: 'Active' as const },
  { name: 'Fresh Bazar', store: 'fresh-bazar', products: 60, revenue: '৳180,000', orders: 150, rating: 4.2, status: 'Inactive' as const },
];

function SalesTrendChart() {
  const maxR = Math.max(...salesTrend.map((d) => d.revenue), 1);
  const w = 750, h = 220;
  const pad = { t: 10, r: 10, b: 30, l: 55 };
  const cw = w - pad.l - pad.r;
  const ch = h - pad.t - pad.b;
  const n = salesTrend.length;
  const barW = Math.min(28, (cw / n) * 0.55);
  const gap = (cw / n) * 0.45;

  const yTicks = [0, 25, 50, 75, 100];
  const maxVal = maxR;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="salesBarGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      {yTicks.map((t) => {
        const y = pad.t + ch - (t / 100) * ch * 0.85;
        return (
          <g key={t}>
            <line x1={pad.l} y1={y} x2={w - pad.r} y2={y} stroke="#f1f5f9" strokeWidth="1" />
            <text x={pad.l - 8} y={y + 3} textAnchor="end" className="fill-[#94a3b8] text-[8px]">
              {t === 0 ? '0' : `৳${(maxVal * t / 100 / 1000).toFixed(0)}K`}
            </text>
          </g>
        );
      })}
      {salesTrend.map((d, i) => {
        const barH = (d.revenue / maxR) * ch * 0.85;
        const x = pad.l + (i / n) * cw + gap / 2;
        const y = pad.t + ch - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx="3" fill="url(#salesBarGrad)" opacity="0.85" className="hover:opacity-100 transition-opacity cursor-pointer" />
            {d.revenue >= (maxR * 0.7) && (
              <text x={x + barW / 2} y={y - 4} textAnchor="middle" className="fill-[#64748b] text-[7px] font-medium">
                ৳{(d.revenue / 1000).toFixed(0)}K
              </text>
            )}
            {i % 2 === 0 && (
              <text x={x + barW / 2} y={pad.t + ch + 14} textAnchor="middle" className="fill-[#94a3b8] text-[7px]">
                {d.date}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function formatBDT(v: number) {
  return `৳${Math.round(v).toLocaleString('en-IN')}`;
}

export default function ReportsPage() {
  const [tab, setTab] = useState('sales');
  const [from, setFrom] = useState('2026-07-01');
  const [to, setTo] = useState('2026-07-14');
  const [queryFrom, setQueryFrom] = useState('2026-07-01');
  const [queryTo, setQueryTo] = useState('2026-07-14');

  const totalSales = salesTrend.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = salesTrend.reduce((s, d) => s + d.orders, 0);
  const avgOrder = totalOrders > 0 ? totalSales / totalOrders : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <p className="text-sm text-slate-400 mt-0.5">Generate and analyze business performance reports</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'sales', label: 'Sales Report', icon: 'trending_up' },
          { key: 'products', label: 'Product Report', icon: 'inventory_2' },
          { key: 'sellers', label: 'Seller Report', icon: 'storefront' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-medium transition-all ${
              tab === t.key
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Sales Tab */}
      {tab === 'sales' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Sales', value: formatBDT(totalSales), change: '+12.5%', icon: 'payments', color: 'bg-blue-500' },
              { label: 'Order Count', value: totalOrders.toLocaleString(), change: '+8.3%', icon: 'shopping_bag', color: 'bg-emerald-500' },
              { label: 'Avg Order Value', value: formatBDT(Math.round(avgOrder)), change: '+4.1%', icon: 'receipt_long', color: 'bg-purple-500' },
              { label: 'Daily Average', value: formatBDT(Math.round(totalSales / salesTrend.length)), change: '+6.7%', icon: 'calendar_view_day', color: 'bg-amber-500' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-200/70 p-5 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color} shadow-sm`}>
                    <span className="material-symbols-outlined text-white text-lg">{s.icon}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {s.change}
                  </span>
                </div>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{s.label}</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Date Range */}
          <div className="bg-white rounded-2xl border border-slate-200/70 p-4 shadow-sm">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-lg">calendar_today</span>
                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:border-primary/50"
                />
              </div>
              <span className="text-slate-300">—</span>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:border-primary/50"
              />
              <button
                onClick={() => { setQueryFrom(from); setQueryTo(to); }}
                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Daily Sales Trend */}
          <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-slate-900">Daily Sales Trend</h2>
              <span className="text-[10px] text-slate-400">
                {queryFrom} — {queryTo}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mb-3">Daily revenue in BDT for the selected period</p>
            <div className="h-[220px]">
              <SalesTrendChart />
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {tab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900">Top Products</h2>
              <p className="text-[10px] text-slate-400 mt-0.5">Ranked by units sold</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] text-slate-400 uppercase tracking-wider bg-slate-50/80">
                    <th className="px-5 py-3 font-medium">#</th>
                    <th className="px-5 py-3 font-medium">Product</th>
                    <th className="px-5 py-3 font-medium hidden md:table-cell">Category</th>
                    <th className="px-5 py-3 font-medium text-right">Sold</th>
                    <th className="px-5 py-3 font-medium text-right">Revenue</th>
                    <th className="px-5 py-3 font-medium text-right hidden sm:table-cell">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {allProducts.map((p, i) => (
                    <tr key={p.name} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3 text-xs text-slate-400">{i + 1}</td>
                      <td className="px-5 py-3">
                        <p className="text-xs font-medium text-slate-700">{p.name}</p>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{p.category}</span>
                      </td>
                      <td className="px-5 py-3 text-xs font-semibold text-slate-700 text-right">{p.sold.toLocaleString()}</td>
                      <td className="px-5 py-3 text-xs font-semibold text-slate-800 text-right">
                        {p.revenue >= 1000000 ? `৳${(p.revenue / 1000000).toFixed(1)}M` : `৳${(p.revenue / 1000).toFixed(0)}K`}
                      </td>
                      <td className="px-5 py-3 text-xs text-right hidden sm:table-cell">
                        <span className={`${p.stock < 100 ? 'text-rose-600 font-medium' : 'text-slate-500'}`}>{p.stock}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Category Summary</h2>
              {(() => {
                const catSummary = allProducts.reduce((acc, p) => {
                  if (!acc[p.category]) acc[p.category] = { products: 0, sold: 0, revenue: 0 };
                  acc[p.category].products++;
                  acc[p.category].sold += p.sold;
                  acc[p.category].revenue += p.revenue;
                  return acc;
                }, {} as Record<string, { products: number; sold: number; revenue: number }>);
                const maxSold = Math.max(...Object.values(catSummary).map((c) => c.sold), 1);
                return Object.entries(catSummary).map(([cat, data]) => (
                  <div key={cat} className="mb-3 last:mb-0">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">{cat}</span>
                      <span className="text-slate-400">{data.sold.toLocaleString()} sold</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-400" style={{ width: `${(data.sold / maxSold) * 100}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{data.products} products · {data.revenue >= 1000000 ? `৳${(data.revenue / 1000000).toFixed(1)}M` : `৳${(data.revenue / 1000).toFixed(0)}K`}</p>
                  </div>
                ));
              })()}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Date Filter</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">From</label>
                  <input type="date" value={queryFrom} onChange={(e) => setQueryFrom(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:border-primary/50" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">To</label>
                  <input type="date" value={queryTo} onChange={(e) => setQueryTo(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:border-primary/50" />
                </div>
                <button onClick={() => { setQueryFrom(from); setQueryTo(to); }}
                  className="w-full px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sellers Tab */}
      {tab === 'sellers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900">All Sellers</h2>
              <p className="text-[10px] text-slate-400 mt-0.5">{allSellers.length} registered sellers</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] text-slate-400 uppercase tracking-wider bg-slate-50/80">
                    <th className="px-5 py-3 font-medium">Seller</th>
                    <th className="px-5 py-3 font-medium hidden md:table-cell">Store</th>
                    <th className="px-5 py-3 font-medium text-right">Products</th>
                    <th className="px-5 py-3 font-medium text-right">Orders</th>
                    <th className="px-5 py-3 font-medium text-right hidden sm:table-cell">Revenue</th>
                    <th className="px-5 py-3 font-medium text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {allSellers.map((s) => (
                    <tr key={s.name} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                            {s.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-700">{s.name}</p>
                            <p className="text-[10px] text-slate-400">★ {s.rating}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-500 font-mono hidden md:table-cell">{s.store}</td>
                      <td className="px-5 py-3 text-xs font-semibold text-slate-700 text-right">{s.products}</td>
                      <td className="px-5 py-3 text-xs font-semibold text-slate-700 text-right">{s.orders.toLocaleString()}</td>
                      <td className="px-5 py-3 text-xs font-semibold text-slate-800 text-right hidden sm:table-cell">{s.revenue}</td>
                      <td className="px-5 py-3 text-center">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          s.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Seller Stats</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
                  <p className="text-[10px] text-blue-500 font-medium uppercase tracking-wider">Total Sellers</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{allSellers.length}</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50">
                  <p className="text-[10px] text-emerald-500 font-medium uppercase tracking-wider">Active Stores</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{allSellers.filter((s) => s.status === 'Active').length}</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50">
                  <p className="text-[10px] text-amber-500 font-medium uppercase tracking-wider">Total Products</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{allSellers.reduce((s, x) => s + x.products, 0).toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50">
                  <p className="text-[10px] text-purple-500 font-medium uppercase tracking-wider">Combined Revenue</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">৳3.9M</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Date Filter</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">From</label>
                  <input type="date" value={queryFrom} onChange={(e) => setQueryFrom(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:border-primary/50" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">To</label>
                  <input type="date" value={queryTo} onChange={(e) => setQueryTo(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:border-primary/50" />
                </div>
                <button onClick={() => { setQueryFrom(from); setQueryTo(to); }}
                  className="w-full px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}