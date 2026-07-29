'use client';

const monthlyRevenue = [
  { month: 'Jan', revenue: 425000, profit: 128000, orders: 340 },
  { month: 'Feb', revenue: 380000, profit: 114000, orders: 310 },
  { month: 'Mar', revenue: 510000, profit: 153000, orders: 420 },
  { month: 'Apr', revenue: 475000, profit: 142000, orders: 390 },
  { month: 'May', revenue: 560000, profit: 168000, orders: 460 },
  { month: 'Jun', revenue: 620000, profit: 186000, orders: 510 },
  { month: 'Jul', revenue: 580000, profit: 174000, orders: 480 },
  { month: 'Aug', revenue: 650000, profit: 195000, orders: 530 },
  { month: 'Sep', revenue: 720000, profit: 216000, orders: 590 },
  { month: 'Oct', revenue: 780000, profit: 234000, orders: 640 },
  { month: 'Nov', revenue: 920000, profit: 276000, orders: 780 },
  { month: 'Dec', revenue: 1150000, profit: 345000, orders: 950 },
];

const weeklySales = [
  { day: 'Mon', sales: 45 },
  { day: 'Tue', sales: 52 },
  { day: 'Wed', sales: 38 },
  { day: 'Thu', sales: 61 },
  { day: 'Fri', sales: 48 },
  { day: 'Sat', sales: 73 },
  { day: 'Sun', sales: 55 },
];

const recentOrders = [
  { id: '#ORD-7821', customer: 'Rahim Mia', product: 'Smartphone X Pro', amount: '৳45,000', status: 'Delivered', time: '2 min ago' },
  { id: '#ORD-7820', customer: 'Fatima Begum', product: 'Cotton Saree - Red', amount: '৳3,200', status: 'Processing', time: '15 min ago' },
  { id: '#ORD-7819', customer: 'Kamal Hossain', product: 'Bluetooth Speaker', amount: '৳1,800', status: 'Shipped', time: '42 min ago' },
  { id: '#ORD-7818', customer: 'Nusrat Jahan', product: 'Leather Wallet', amount: '৳950', status: 'Pending', time: '1 hr ago' },
  { id: '#ORD-7817', customer: 'Shahidul Islam', product: 'Gaming Mouse', amount: '৳2,500', status: 'Delivered', time: '2 hr ago' },
  { id: '#ORD-7816', customer: 'Tahmina Akter', product: 'Winter Jacket', amount: '৳4,800', status: 'Processing', time: '3 hr ago' },
];

const topProducts = [
  { name: 'Smartphone X Pro', sales: 1247, revenue: 56115000, growth: 12 },
  { name: 'Cotton Saree - Red', sales: 892, revenue: 2854400, growth: 8 },
  { name: 'Wireless Earbuds', sales: 756, revenue: 1134000, growth: 15 },
  { name: 'Leather Handbag', sales: 543, revenue: 2715000, growth: 5 },
  { name: 'Smart Watch', sales: 489, revenue: 7335000, growth: 22 },
];

function RevenueLineChart() {
  const maxR = Math.max(...monthlyRevenue.map((m) => m.revenue), 1);
  const w = 700, h = 220;
  const pad = { t: 20, r: 20, b: 30, l: 50 };
  const cw = w - pad.l - pad.r;
  const ch = h - pad.t - pad.b;
  const n = monthlyRevenue.length;
  const stepX = cw / (n - 1);

  const points = monthlyRevenue.map((m, i) => ({
    x: pad.l + i * stepX,
    y: pad.t + ch - (m.revenue / maxR) * ch * 0.9,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x},${pad.t + ch} L${points[0].x},${pad.t + ch} Z`;

  const yTicks = [0, 25, 50, 75, 100];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
      </defs>
      {yTicks.map((t) => {
        const y = pad.t + ch - (t / 100) * ch * 0.9;
        return (
          <g key={t}>
            <line x1={pad.l} y1={y} x2={w - pad.r} y2={y} stroke="#e5e7eb" strokeWidth="1" />
            <text x={pad.l - 8} y={y + 3} textAnchor="end" className="fill-[#9ca3af] text-[9px]">
              {t === 0 ? '0' : `${(maxR * t / 100 / 100000).toFixed(t === 100 ? 0 : 1)}L`}
            </text>
          </g>
        );
      })}
      <path d={areaPath} fill="url(#revGrad)" />
      <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3" fill="#2563eb" stroke="white" strokeWidth="2" className="hover:r-[6] transition-all cursor-pointer" />
          <text x={p.x} y={pad.t + ch + 16} textAnchor="middle" className="fill-[#9ca3af] text-[8px]">
            {monthlyRevenue[i].month}
          </text>
        </g>
      ))}
    </svg>
  );
}

function WeeklyBarChart() {
  const maxS = Math.max(...weeklySales.map((w) => w.sales), 1);
  const w = 500, h = 180;
  const pad = { t: 10, r: 10, b: 30, l: 10 };
  const cw = w - pad.l - pad.r;
  const ch = h - pad.t - pad.b;
  const n = weeklySales.length;
  const barW = Math.min(36, (cw / n) * 0.55);
  const gap = (cw / n) * 0.45;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {weeklySales.map((d, i) => {
        const barH = (d.sales / maxS) * ch * 0.85;
        const x = pad.l + (i / n) * cw + gap / 2;
        const y = pad.t + ch - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx="4" className="fill-[#2563eb] hover:opacity-80 transition-opacity cursor-pointer" />
            <text x={x + barW / 2} y={y - 5} textAnchor="middle" className="fill-[#6b7280] text-[9px] font-medium">
              {d.sales}
            </text>
            <text x={x + barW / 2} y={pad.t + ch + 14} textAnchor="middle" className="fill-[#9ca3af] text-[8px]">
              {d.day.slice(0, 2)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function StatCard({ icon, label, value, change, trend, color }: {
  icon: string; label: string; value: string; change: string; trend: 'up' | 'down'; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 p-5 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color} shadow-sm`}>
          <span className="material-symbols-outlined text-white text-xl">{icon}</span>
        </div>
        <span className={`flex items-center gap-0.5 text-[11px] font-semibold px-2 py-1 rounded-full ${
          trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
        }`}>
          <span className="material-symbols-outlined text-[14px]">{trend === 'up' ? 'trending_up' : 'trending_down'}</span>
          {change}
        </span>
      </div>
      <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{value}</p>
    </div>
  );
}

function DonutChart() {
  const data = [
    { label: 'Electronics', value: 35, color: '#2563eb' },
    { label: 'Fashion', value: 25, color: '#8b5cf6' },
    { label: 'Home & Living', value: 20, color: '#06b6d4' },
    { label: 'Beauty', value: 12, color: '#f43f5e' },
    { label: 'Others', value: 8, color: '#f59e0b' },
  ];
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = 100, cy = 100, r = 70, ir = 50;
  let cumulative = 0;
  const slices = data.map((d) => {
    const startAngle = (cumulative / total) * 360;
    cumulative += d.value;
    const endAngle = (cumulative / total) * 360;
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    const ix1 = cx + ir * Math.cos(startRad);
    const iy1 = cy + ir * Math.sin(startRad);
    const ix2 = cx + ir * Math.cos(endRad);
    const iy2 = cy + ir * Math.sin(endRad);
    const path = [
      `M ${x1} ${y1}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${ix2} ${iy2}`,
      `A ${ir} ${ir} 0 ${largeArc} 0 ${ix1} ${iy1}`,
      'Z',
    ].join(' ');
    return { ...d, path };
  });

  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[200px] mx-auto">
      {slices.map((s, i) => (
        <path key={i} d={s.path} fill={s.color} opacity="0.9" className="hover:opacity-100 transition-opacity cursor-pointer" />
      ))}
      <text x={cx} y={cy - 4} textAnchor="middle" className="fill-[#1e293b] text-[20px] font-bold">
        {total}%
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" className="fill-[#94a3b8] text-[8px]">
        Categories
      </text>
    </svg>
  );
}

export default function AdminOverviewPage() {
  const stats = [
    { icon: 'payments', label: 'Total Revenue', value: '৳7,420,000', change: '+12.5%', trend: 'up' as const, color: 'bg-blue-500' },
    { icon: 'shopping_bag', label: 'Total Orders', value: '6,350', change: '+8.2%', trend: 'up' as const, color: 'bg-emerald-500' },
    { icon: 'group', label: 'Total Customers', value: '12,847', change: '+5.7%', trend: 'up' as const, color: 'bg-purple-500' },
    { icon: 'trending_up', label: 'Net Profit', value: '৳2,228,000', change: '+15.3%', trend: 'up' as const, color: 'bg-amber-500' },
    { icon: 'inventory_2', label: 'Products Listed', value: '3,421', change: '+3.1%', trend: 'up' as const, color: 'bg-cyan-500' },
    { icon: 'star', label: 'Avg. Rating', value: '4.7 ★', change: '+0.3%', trend: 'up' as const, color: 'bg-rose-500' },
  ];

  const profitStats = [
    { label: 'Gross Revenue', value: '৳7,420,000', percent: 100 },
    { label: 'Product Cost', value: '৳3,856,000', percent: 52 },
    { label: 'Shipping & Handling', value: '৳482,000', percent: 6.5 },
    { label: 'Marketing', value: '৳594,000', percent: 8 },
    { label: 'Platform Fee', value: '৳260,000', percent: 3.5 },
    { label: 'Net Profit', value: '৳2,228,000', percent: 30 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-sm text-slate-400 mt-0.5">Welcome back, Admin. Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-white rounded-xl border border-slate-200 px-4 py-2.5 shadow-sm">
          <span className="material-symbols-outlined text-[16px]">calendar_today</span>
          <span>Last 30 Days</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-emerald-600 font-medium">Live</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-slate-900">Revenue Trend</h2>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                Revenue
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                Profit
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">Monthly revenue &amp; profit performance for 2026</p>
          <div className="h-[220px]">
            <RevenueLineChart />
          </div>
        </div>

        {/* Profit Summary + Donut */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Profit Summary</h2>
            <div className="space-y-3">
              {profitStats.map((p) => (
                <div key={p.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">{p.label}</span>
                    <span className="font-semibold text-slate-800">{p.value}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        p.label === 'Net Profit' ? 'bg-emerald-500' : 'bg-blue-500/20'
                      }`}
                      style={{ width: `${p.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Category Distribution</h2>
            <DonutChart />
            <div className="grid grid-cols-2 gap-2 mt-3">
              {[
                { label: 'Electronics', color: '#2563eb', percent: 35 },
                { label: 'Fashion', color: '#8b5cf6', percent: 25 },
                { label: 'Home & Living', color: '#06b6d4', percent: 20 },
                { label: 'Beauty', color: '#f43f5e', percent: 12 },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-2 text-[10px]">
                  <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: c.color }} />
                  <span className="text-slate-500">{c.label}</span>
                  <span className="font-medium text-slate-700 ml-auto">{c.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Sales */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-1">Weekly Sales</h2>
          <p className="text-[11px] text-slate-400 mb-3">This week&apos;s daily sales count</p>
          <div className="h-[180px]">
            <WeeklyBarChart />
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Top Selling Products</h2>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 truncate">{p.name}</p>
                  <p className="text-[10px] text-slate-400">{p.sales.toLocaleString()} sold</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-800">{p.revenue >= 1000000 ? `৳${(p.revenue / 1000000).toFixed(1)}M` : `৳${(p.revenue / 1000).toFixed(0)}K`}</p>
                  <span className="text-[9px] text-emerald-600 font-medium">+{p.growth}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { icon: 'add_box', label: 'Add New Product', desc: 'List a new product to your store', href: '/admin/products/new' },
              { icon: 'local_offer', label: 'Create Campaign', desc: 'Launch a promotional campaign', href: '/admin/campaigns' },
              { icon: 'inventory', label: 'Manage Inventory', desc: 'Update stock levels', href: '/admin/inventory' },
              { icon: 'receipt_long', label: 'View All Orders', desc: 'Check pending and completed orders', href: '/admin/orders' },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                  {action.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-700 group-hover:text-primary transition-colors">{action.label}</p>
                  <p className="text-[10px] text-slate-400">{action.desc}</p>
                </div>
                <span className="material-symbols-outlined text-slate-300 ml-auto text-lg">chevron_right</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">Recent Orders</h2>
          <a href="/admin/orders" className="text-[11px] font-medium text-primary hover:text-primary/80 transition-colors">
            View All
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] text-slate-400 uppercase tracking-wider bg-slate-50/80">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium hidden sm:table-cell">Product</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium hidden md:table-cell">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 text-xs font-mono text-slate-500">{o.id}</td>
                  <td className="px-5 py-3 text-xs font-medium text-slate-700">{o.customer}</td>
                  <td className="px-5 py-3 text-xs text-slate-500 hidden sm:table-cell max-w-[160px] truncate">{o.product}</td>
                  <td className="px-5 py-3 text-xs font-semibold text-slate-800">{o.amount}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                      o.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                      o.status === 'Processing' ? 'bg-blue-50 text-blue-600' :
                      o.status === 'Shipped' ? 'bg-purple-50 text-purple-600' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[10px] text-slate-400 hidden md:table-cell">{o.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}