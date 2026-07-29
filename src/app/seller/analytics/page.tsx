'use client';

import { useState } from 'react';

const monthlyData = [
  { month: 'Jan', revenue: 85000, orders: 68, visitors: 4200, conversion: 3.2 },
  { month: 'Feb', revenue: 72000, orders: 55, visitors: 3800, conversion: 2.9 },
  { month: 'Mar', revenue: 102000, orders: 82, visitors: 5100, conversion: 3.5 },
  { month: 'Apr', revenue: 95000, orders: 78, visitors: 4900, conversion: 3.4 },
  { month: 'May', revenue: 112000, orders: 92, visitors: 5600, conversion: 3.8 },
  { month: 'Jun', revenue: 124000, orders: 102, visitors: 6200, conversion: 3.6 },
  { month: 'Jul', revenue: 116000, orders: 96, visitors: 5900, conversion: 3.7 },
  { month: 'Aug', revenue: 130000, orders: 106, visitors: 6500, conversion: 3.9 },
  { month: 'Sep', revenue: 144000, orders: 118, visitors: 7100, conversion: 4.1 },
  { month: 'Oct', revenue: 156000, orders: 128, visitors: 7800, conversion: 4.3 },
  { month: 'Nov', revenue: 184000, orders: 156, visitors: 8900, conversion: 4.6 },
  { month: 'Dec', revenue: 230000, orders: 190, visitors: 10200, conversion: 4.8 },
];

const categoryData = [
  { name: 'Electronics', revenue: 785000, orders: 520, growth: 28 },
  { name: 'Accessories', revenue: 342000, orders: 410, growth: 35 },
  { name: 'Gadgets', revenue: 286000, orders: 230, growth: 18 },
  { name: 'Others', revenue: 127000, orders: 195, growth: 12 },
];

const topProducts = [
  { name: 'Smartphone X Pro', sold: 247, revenue: 11115000, views: 12400, conversion: 3.8 },
  { name: 'Wireless Earbuds', sold: 189, revenue: 283500, views: 8900, conversion: 4.2 },
  { name: 'Smart Watch Series 3', sold: 156, revenue: 2340000, views: 7200, conversion: 3.5 },
  { name: 'Gaming Mouse', sold: 134, revenue: 201000, views: 6500, conversion: 3.1 },
  { name: 'Laptop Stand Pro', sold: 98, revenue: 147000, views: 4800, conversion: 2.9 },
  { name: 'USB-C Hub 7-in-1', sold: 87, revenue: 104400, views: 4200, conversion: 3.3 },
];

const orderStatuses = [
  { status: 'Delivered', count: 845, color: '#10b981' },
  { status: 'Processing', count: 180, color: '#3b82f6' },
  { status: 'Shipped', count: 125, color: '#8b5cf6' },
  { status: 'Pending', count: 95, color: '#f59e0b' },
  { status: 'Cancelled', count: 35, color: '#ef4444' },
];

function RevenueChart() {
  const [range, setRange] = useState<'7' | '30' | '90'>('30');
  const maxR = Math.max(...monthlyData.map((m) => m.revenue), 1);
  const w = 700, h = 220;
  const pad = { t: 20, r: 20, b: 30, l: 55 };
  const cw = w - pad.l - pad.r;
  const ch = h - pad.t - pad.b;
  const n = monthlyData.length;
  const stepX = cw / (n - 1);

  const pts = monthlyData.map((m, i) => ({
    x: pad.l + i * stepX, y: pad.t + ch - (m.revenue / maxR) * ch * 0.9,
  }));
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  const yTicks = [0, 25, 50, 75, 100];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-0.5">
          {(['7', '30', '90'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                range === r ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {r}d
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            Revenue
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            Orders
          </span>
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="saRevGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        {yTicks.map((t) => {
          const y = pad.t + ch - (t / 100) * ch * 0.9;
          return (
            <g key={t}>
              <line x1={pad.l} y1={y} x2={w - pad.r} y2={y} stroke="#f1f5f9" strokeWidth="1" />
              <text x={pad.l - 8} y={y + 3} textAnchor="end" className="fill-[#94a3b8] text-[9px]">
                {t === 0 ? '0' : `৳${(maxR * t / 100 / 1000).toFixed(0)}K`}
              </text>
            </g>
          );
        })}
        <path d={path + ` L${pts[pts.length - 1].x},${pad.t + ch} L${pts[0].x},${pad.t + ch} Z`} fill="url(#saRevGrad)" />
        <path d={path} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {monthlyData.map((m, i) => (
          <g key={i}>
            <circle cx={pts[i].x} cy={pts[i].y} r="3" fill="#2563eb" stroke="white" strokeWidth="2" />
            {i % 2 === 0 && (
              <text x={pts[i].x} y={pad.t + ch + 16} textAnchor="middle" className="fill-[#94a3b8] text-[8px]">
                {m.month}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

function CategoryBarChart() {
  const maxR = Math.max(...categoryData.map((c) => c.revenue), 1);
  const total = categoryData.reduce((s, c) => s + c.revenue, 0);

  return (
    <div className="space-y-3">
      {categoryData.map((c) => (
        <div key={c.name}>
          <div className="flex items-center justify-between text-xs mb-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700">{c.name}</span>
              <span className="text-[10px] text-emerald-600 font-medium">+{c.growth}%</span>
            </div>
            <span className="text-slate-500">{c.orders} orders</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-400" style={{ width: `${(c.revenue / total) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ data, cx, cy, r, ir }: {
  data: { label: string; value: number; color: string }[];
  cx?: number; cy?: number; r?: number; ir?: number;
}) {
  const _cx = cx || 100, _cy = cy || 100, _r = r || 80, _ir = ir || 55;
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  const slices = data.map((d) => {
    const startAngle = (cumulative / total) * 360;
    cumulative += d.value;
    const endAngle = (cumulative / total) * 360;
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;
    const x1 = _cx + _r * Math.cos(startRad);
    const y1 = _cy + _r * Math.sin(startRad);
    const x2 = _cx + _r * Math.cos(endRad);
    const y2 = _cy + _r * Math.sin(endRad);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    const ix1 = _cx + _ir * Math.cos(startRad);
    const iy1 = _cy + _ir * Math.sin(startRad);
    const ix2 = _cx + _ir * Math.cos(endRad);
    const iy2 = _cy + _ir * Math.sin(endRad);
    const path = [`M ${x1} ${y1}`, `A ${_r} ${_r} 0 ${largeArc} 1 ${x2} ${y2}`, `L ${ix2} ${iy2}`, `A ${_ir} ${_ir} 0 ${largeArc} 0 ${ix1} ${iy1}`, 'Z'].join(' ');
    return { ...d, path };
  });

  return (
    <svg viewBox={`0 0 ${_cx * 2} ${_cy * 2}`} className="w-full max-w-[180px] mx-auto">
      {slices.map((s, i) => (
        <path key={i} d={s.path} fill={s.color} opacity="0.85" className="hover:opacity-100 transition-opacity cursor-pointer" />
      ))}
      <text x={_cx} y={_cy - 3} textAnchor="middle" className="fill-[#1e293b] text-[16px] font-bold">
        {total.toLocaleString()}
      </text>
      <text x={_cx} y={_cy + 10} textAnchor="middle" className="fill-[#94a3b8] text-[8px]">
        Orders
      </text>
    </svg>
  );
}

export default function SellerAnalytics() {
  const [selectedRange, setSelectedRange] = useState('30d');

  const totalRevenue = monthlyData.reduce((s, m) => s + m.revenue, 0);
  const totalOrders = monthlyData.reduce((s, m) => s + m.orders, 0);
  const totalVisitors = monthlyData.reduce((s, m) => s + m.visitors, 0);
  const avgConversion = +(monthlyData.reduce((s, m) => s + m.conversion, 0) / monthlyData.length).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-sm text-slate-400 mt-0.5">Track your store&apos;s performance metrics</p>
        </div>
        <button className="flex items-center gap-1.5 text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
          <span className="material-symbols-outlined text-lg">download</span>
          Export Report
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: 'trending_up', label: 'Revenue', value: `৳${totalRevenue.toLocaleString('en-IN')}`, change: '+18.3%', color: 'bg-blue-500' },
          { icon: 'shopping_bag', label: 'Orders', value: totalOrders.toLocaleString(), change: '+15.2%', color: 'bg-emerald-500' },
          { icon: 'visibility', label: 'Page Views', value: totalVisitors.toLocaleString(), change: '+22.7%', color: 'bg-purple-500' },
          { icon: 'conversion_path', label: 'Conversion', value: `${avgConversion}%`, change: '+8.1%', color: 'bg-amber-500' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200/70 p-4 hover:shadow-lg hover:shadow-slate-200/50 transition-all">
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

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Revenue Trend</h2>
        <div className="h-[220px]">
          <RevenueChart />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Category Performance</h2>
          <CategoryBarChart />
          <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-100">
            {categoryData.map((c) => (
              <div key={c.name} className="text-center">
                <p className="text-[9px] text-slate-400 truncate">{c.name}</p>
                <p className="text-xs font-bold text-slate-700">{c.revenue >= 100000 ? `৳${(c.revenue / 1000).toFixed(0)}K` : `৳${c.revenue}`}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Order Status</h2>
          <div className="flex flex-col items-center">
            <DonutChart data={orderStatuses.map((o) => ({ label: o.status, value: o.count, color: o.color }))} />
            <div className="grid grid-cols-3 gap-x-3 gap-y-1.5 mt-3 w-full">
              {orderStatuses.map((o) => (
                <div key={o.status} className="flex items-center gap-1.5 text-[10px]">
                  <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: o.color }} />
                  <span className="text-slate-500">{o.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sales Summary */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Sales Summary</h2>
          <div className="space-y-3">
            {[
              { label: 'Total Orders', value: totalOrders.toLocaleString(), color: 'text-slate-900' },
              { label: 'Total Revenue', value: `৳${totalRevenue.toLocaleString('en-IN')}`, color: 'text-slate-900' },
              { label: 'Conversion Rate', value: `${avgConversion}%`, color: 'text-emerald-600' },
              { label: 'Avg Order Value', value: `৳${Math.round(totalRevenue / totalOrders).toLocaleString('en-IN')}`, color: 'text-slate-900' },
              { label: 'Page Views', value: totalVisitors.toLocaleString(), color: 'text-slate-900' },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <span className="text-xs text-slate-500">{s.label}</span>
                <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">Top Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] text-slate-400 uppercase tracking-wider bg-slate-50/80">
                <th className="px-5 py-3 font-medium">#</th>
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium text-right">Sold</th>
                <th className="px-5 py-3 font-medium text-right hidden md:table-cell">Views</th>
                <th className="px-5 py-3 font-medium text-right">Revenue</th>
                <th className="px-5 py-3 font-medium text-right hidden sm:table-cell">Conversion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {topProducts.map((p, i) => (
                <tr key={p.name} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 text-xs text-slate-400">{i + 1}</td>
                  <td className="px-5 py-3">
                    <p className="text-xs font-medium text-slate-700">{p.name}</p>
                  </td>
                  <td className="px-5 py-3 text-xs font-semibold text-slate-700 text-right">{p.sold}</td>
                  <td className="px-5 py-3 text-xs text-slate-500 text-right hidden md:table-cell">{p.views.toLocaleString()}</td>
                  <td className="px-5 py-3 text-xs font-semibold text-slate-800 text-right">
                    {p.revenue >= 1000000 ? `৳${(p.revenue / 1000000).toFixed(1)}M` : `৳${(p.revenue / 1000).toFixed(0)}K`}
                  </td>
                  <td className="px-5 py-3 text-xs text-right hidden sm:table-cell">
                    <span className="text-emerald-600 font-medium">{p.conversion}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}