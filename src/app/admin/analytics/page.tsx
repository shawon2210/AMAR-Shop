'use client';

const monthlyStats = [
  { month: 'Jan', revenue: 425000, orders: 340, visitors: 28500, conversion: 3.2 },
  { month: 'Feb', revenue: 380000, orders: 310, visitors: 26200, conversion: 3.0 },
  { month: 'Mar', revenue: 510000, orders: 420, visitors: 32100, conversion: 3.5 },
  { month: 'Apr', revenue: 475000, orders: 390, visitors: 30800, conversion: 3.3 },
  { month: 'May', revenue: 560000, orders: 460, visitors: 35400, conversion: 3.6 },
  { month: 'Jun', revenue: 620000, orders: 510, visitors: 38900, conversion: 3.8 },
  { month: 'Jul', revenue: 580000, orders: 480, visitors: 37100, conversion: 3.7 },
  { month: 'Aug', revenue: 650000, orders: 530, visitors: 40200, conversion: 3.9 },
  { month: 'Sep', revenue: 720000, orders: 590, visitors: 44500, conversion: 4.1 },
  { month: 'Oct', revenue: 780000, orders: 640, visitors: 48200, conversion: 4.2 },
  { month: 'Nov', revenue: 920000, orders: 780, visitors: 56100, conversion: 4.5 },
  { month: 'Dec', revenue: 1150000, orders: 950, visitors: 68200, conversion: 4.8 },
];

const categoryPerformances = [
  { name: 'Electronics', revenue: 2597000, orders: 1850, growth: 18 },
  { name: 'Fashion', revenue: 1855000, orders: 2240, growth: 12 },
  { name: 'Home & Living', revenue: 1484000, orders: 980, growth: 8 },
  { name: 'Beauty & Care', revenue: 890000, orders: 1260, growth: 22 },
  { name: 'Sports', revenue: 593000, orders: 520, growth: 15 },
];

const orderStatuses = [
  { status: 'Delivered', count: 4230, color: '#10b981' },
  { status: 'Processing', count: 890, color: '#3b82f6' },
  { status: 'Pending', count: 450, color: '#f59e0b' },
  { status: 'Shipped', count: 620, color: '#8b5cf6' },
  { status: 'Cancelled', count: 160, color: '#ef4444' },
];

const topSellers = [
  { name: 'TechZone BD', revenue: '৳1,240,000', orders: 820, rating: 4.8, products: 156 },
  { name: 'Fashion Hub', revenue: '৳890,000', orders: 650, rating: 4.6, products: 340 },
  { name: 'HomeCraft Ltd', revenue: '৳675,000', orders: 430, rating: 4.7, products: 210 },
  { name: 'BeautyGlow', revenue: '৳520,000', orders: 380, rating: 4.5, products: 180 },
  { name: 'Gadget World', revenue: '৳410,000', orders: 290, rating: 4.4, products: 95 },
];

const geoData = [
  { city: 'Dhaka', orders: 2850, percent: 32 },
  { city: 'Chattogram', orders: 1420, percent: 16 },
  { city: 'Khulna', orders: 980, percent: 11 },
  { city: 'Rajshahi', orders: 760, percent: 9 },
  { city: 'Sylhet', orders: 540, percent: 6 },
  { city: 'Others', orders: 2260, percent: 26 },
];

function RevenueChart() {
  const maxR = Math.max(...monthlyStats.map((m) => m.revenue), 1);
  const w = 700, h = 240;
  const pad = { t: 20, r: 20, b: 32, l: 55 };
  const cw = w - pad.l - pad.r;
  const ch = h - pad.t - pad.b;
  const n = monthlyStats.length;
  const stepX = cw / (n - 1);

  const revenuePts = monthlyStats.map((m, i) => ({
    x: pad.l + i * stepX, y: pad.t + ch - (m.revenue / maxR) * ch * 0.9,
  }));
  const visitorPts = monthlyStats.map((m, i) => {
    const maxV = Math.max(...monthlyStats.map((x) => x.visitors), 1);
    return {
      x: pad.l + i * stepX, y: pad.t + ch - (m.visitors / maxV) * ch * 0.9,
    };
  });

  const revPath = revenuePts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const visPath = visitorPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  const yTicks = [0, 25, 50, 75, 100];
  const maxVal = maxR;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
      </defs>
      {yTicks.map((t) => {
        const y = pad.t + ch - (t / 100) * ch * 0.9;
        return (
          <g key={t}>
            <line x1={pad.l} y1={y} x2={w - pad.r} y2={y} stroke="#f1f5f9" strokeWidth="1" />
            <text x={pad.l - 8} y={y + 3} textAnchor="end" className="fill-[#94a3b8] text-[9px]">
              {t === 0 ? '৳0' : `৳${(maxVal * t / 100 / 100000).toFixed(t === 100 ? 0 : 1)}L`}
            </text>
          </g>
        );
      })}
      <path d={revPath} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={visPath} fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 3" />
      {revenuePts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3" fill="#2563eb" stroke="white" strokeWidth="2" />
          <text x={p.x} y={pad.t + ch + 16} textAnchor="middle" className="fill-[#94a3b8] text-[8px]">
            {monthlyStats[i].month}
          </text>
        </g>
      ))}
    </svg>
  );
}

function CategoryBarChart() {
  const maxR = Math.max(...categoryPerformances.map((c) => c.revenue), 1);
  const w = 550, h = 220;
  const pad = { t: 10, r: 100, b: 10, l: 10 };
  const cw = w - pad.l - pad.r;
  const ch = h - pad.t - pad.b;
  const barH = Math.min(28, (ch / categoryPerformances.length) * 0.65);
  const gap = (ch / categoryPerformances.length) * 0.35;
  const total = categoryPerformances.reduce((s, c) => s + c.revenue, 0);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {categoryPerformances.map((c, i) => {
        const barW = (c.revenue / maxR) * cw * 0.85;
        const y = pad.t + i * (barH + gap) + gap / 2;
        const percent = ((c.revenue / total) * 100).toFixed(0);
        return (
          <g key={i}>
            <rect x={pad.l} y={y} width={barW} height={barH} rx="4" className="fill-[#2563eb] hover:opacity-80 transition-opacity" />
            <text x={pad.l + 8} y={y + barH / 2 + 1} className="fill-white text-[9px] font-medium">
              {c.name}
            </text>
            <text x={pad.l + barW + 8} y={y + barH / 2 + 1} className="fill-[#64748b] text-[9px]">
              {percent}%
            </text>
          </g>
        );
      })}
    </svg>
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
    <svg viewBox={`0 0 ${_cx * 2} ${_cy * 2}`} className="w-full max-w-[200px] mx-auto">
      {slices.map((s, i) => (
        <path key={i} d={s.path} fill={s.color} opacity="0.85" className="hover:opacity-100 transition-opacity cursor-pointer" />
      ))}
      <text x={_cx} y={_cy - 4} textAnchor="middle" className="fill-[#1e293b] text-[18px] font-bold">
        {total.toLocaleString()}
      </text>
      <text x={_cx} y={_cy + 12} textAnchor="middle" className="fill-[#94a3b8] text-[8px]">
        Total Orders
      </text>
    </svg>
  );
}

function GeoHorizontalBar() {
  const maxOrders = Math.max(...geoData.map((g) => g.orders), 1);
  return (
    <div className="space-y-2.5">
      {geoData.map((g) => (
        <div key={g.city}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-600 font-medium">{g.city}</span>
            <span className="text-slate-400">{g.orders.toLocaleString()} ({g.percent}%)</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${(g.orders / maxOrders) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const statCards = [
    { icon: 'trending_up', label: 'Total Revenue', value: '৳7,420,000', change: '+12.5%', color: 'bg-blue-500' },
    { icon: 'shopping_bag', label: 'Orders', value: '6,350', change: '+8.2%', color: 'bg-emerald-500' },
    { icon: 'group', label: 'Visitors', value: '47,210', change: '+15.1%', color: 'bg-purple-500' },
    { icon: 'conversion_path', label: 'Conversion Rate', value: '3.8%', change: '+6.3%', color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-400 mt-0.5">Comprehensive performance metrics and insights</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200/70 p-5 hover:shadow-lg hover:shadow-slate-200/50 transition-all">
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
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-semibold text-slate-900">Revenue &amp; Visitors</h2>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              Revenue
            </span>
            <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              Visitors
            </span>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 mb-3">Monthly revenue in BDT and visitor trend for 2026</p>
        <div className="h-[240px]">
          <RevenueChart />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Donut */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Order Status Distribution</h2>
          <div className="flex flex-col items-center">
            <DonutChart data={orderStatuses.map((o) => ({ label: o.status, value: o.count, color: o.color }))} />
            <div className="grid grid-cols-3 gap-x-4 gap-y-2 mt-3 w-full max-w-[260px]">
              {orderStatuses.map((o) => (
                <div key={o.status} className="flex items-center gap-1.5 text-[10px]">
                  <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: o.color }} />
                  <span className="text-slate-500 truncate">{o.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-1">Category Performance</h2>
          <p className="text-[10px] text-slate-400 mb-2">Revenue breakdown by category</p>
          <div className="h-[220px]">
            <CategoryBarChart />
          </div>
          <div className="grid grid-cols-3 gap-3 mt-2 pt-3 border-t border-slate-100">
            {categoryPerformances.map((c) => (
              <div key={c.name} className="text-center">
                <p className="text-[9px] text-slate-400 truncate">{c.name}</p>
                <p className="text-xs font-semibold text-slate-800">{c.orders}</p>
                <span className="text-[9px] text-emerald-600">+{c.growth}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Sellers */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Top Sellers</h2>
          <div className="space-y-3">
            {topSellers.map((s, i) => (
              <div key={s.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 truncate">{s.name}</p>
                  <p className="text-[10px] text-slate-400">{s.orders} orders · ★ {s.rating}</p>
                </div>
                <p className="text-xs font-semibold text-slate-800">{s.revenue}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Orders by Region</h2>
          <GeoHorizontalBar />
        </div>

        {/* Monthly Conversion */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Monthly Conversion Rate</h2>
          <div className="space-y-2">
            {monthlyStats.slice(-6).map((m) => (
              <div key={m.month} className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-500 w-8">{m.month}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                    style={{ width: `${(m.conversion / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-700 w-10 text-right">{m.conversion}%</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Average Conversion</span>
              <span className="font-bold text-slate-800">3.8%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}