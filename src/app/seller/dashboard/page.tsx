'use client';

const monthlyRevenue = [
  { month: 'Jan', revenue: 85000, orders: 68, profit: 25500 },
  { month: 'Feb', revenue: 72000, orders: 55, profit: 21600 },
  { month: 'Mar', revenue: 102000, orders: 82, profit: 30600 },
  { month: 'Apr', revenue: 95000, orders: 78, profit: 28500 },
  { month: 'May', revenue: 112000, orders: 92, profit: 33600 },
  { month: 'Jun', revenue: 124000, orders: 102, profit: 37200 },
  { month: 'Jul', revenue: 116000, orders: 96, profit: 34800 },
  { month: 'Aug', revenue: 130000, orders: 106, profit: 39000 },
  { month: 'Sep', revenue: 144000, orders: 118, profit: 43200 },
  { month: 'Oct', revenue: 156000, orders: 128, profit: 46800 },
  { month: 'Nov', revenue: 184000, orders: 156, profit: 55200 },
  { month: 'Dec', revenue: 230000, orders: 190, profit: 69000 },
];

const weeklySales = [
  { day: 'Mon', sales: 18 },
  { day: 'Tue', sales: 24 },
  { day: 'Wed', sales: 15 },
  { day: 'Thu', sales: 29 },
  { day: 'Fri', sales: 22 },
  { day: 'Sat', sales: 35 },
  { day: 'Sun', sales: 27 },
];

const recentOrders = [
  { id: '#ORD-7821', customer: 'Rahim Mia', product: 'Smartphone X Pro', amount: '৳45,000', status: 'Delivered', date: '14 Jul 2026' },
  { id: '#ORD-7816', customer: 'Tahmina Akter', product: 'Winter Jacket', amount: '৳4,800', status: 'Processing', date: '13 Jul 2026' },
  { id: '#ORD-7808', customer: 'Shahidul Islam', product: 'Gaming Mouse', amount: '৳2,500', status: 'Shipped', date: '12 Jul 2026' },
  { id: '#ORD-7795', customer: 'Nusrat Jahan', product: 'Leather Wallet', amount: '৳950', status: 'Pending', date: '11 Jul 2026' },
  { id: '#ORD-7782', customer: 'Kamal Hossain', product: 'Bluetooth Speaker', amount: '৳1,800', status: 'Delivered', date: '10 Jul 2026' },
];

const topProducts = [
  { name: 'Smartphone X Pro', sales: 247, revenue: 11115000, stock: 45, growth: 28 },
  { name: 'Wireless Earbuds', sales: 189, revenue: 283500, stock: 120, growth: 35 },
  { name: 'Smart Watch', sales: 156, revenue: 2340000, stock: 38, growth: 18 },
  { name: 'Gaming Mouse', sales: 134, revenue: 201000, stock: 75, growth: 22 },
  { name: 'Laptop Stand', sales: 98, revenue: 147000, stock: 60, growth: 12 },
];

function formatBDT(v: number) {
  return `৳${Math.round(v).toLocaleString('en-IN')}`;
}

function RevenueLineChart() {
  const maxR = Math.max(...monthlyRevenue.map((m) => m.revenue), 1);
  const w = 700, h = 220;
  const pad = { t: 20, r: 20, b: 30, l: 55 };
  const cw = w - pad.l - pad.r;
  const ch = h - pad.t - pad.b;
  const n = monthlyRevenue.length;
  const stepX = cw / (n - 1);

  const revenuePts = monthlyRevenue.map((m, i) => ({
    x: pad.l + i * stepX, y: pad.t + ch - (m.revenue / maxR) * ch * 0.9,
  }));
  const profitPts = monthlyRevenue.map((m, i) => ({
    x: pad.l + i * stepX, y: pad.t + ch - (m.profit / maxR) * ch * 0.9,
  }));

  const revPath = revenuePts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const profitPath = profitPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  const yTicks = [0, 25, 50, 75, 100];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="sRevGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="sProfitGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
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
      <path d={revPath + ` L${revenuePts[revenuePts.length - 1].x},${pad.t + ch} L${revenuePts[0].x},${pad.t + ch} Z`} fill="url(#sRevGrad)" />
      <path d={revPath} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={profitPath} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 3" />
      {monthlyRevenue.map((m, i) => (
        <g key={i}>
          <circle cx={revenuePts[i].x} cy={revenuePts[i].y} r="3" fill="#2563eb" stroke="white" strokeWidth="2" />
          {i % 2 === 0 && (
            <text x={revenuePts[i].x} y={pad.t + ch + 16} textAnchor="middle" className="fill-[#94a3b8] text-[8px]">
              {m.month}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

function WeeklyBarChart() {
  const maxS = Math.max(...weeklySales.map((w) => w.sales), 1);
  const w = 500, h = 160;
  const pad = { t: 10, r: 10, b: 25, l: 10 };
  const cw = w - pad.l - pad.r;
  const ch = h - pad.t - pad.b;
  const n = weeklySales.length;
  const barW = Math.min(32, (cw / n) * 0.55);
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
            <text x={x + barW / 2} y={y - 4} textAnchor="middle" className="fill-[#64748b] text-[9px] font-medium">
              {d.sales}
            </text>
            <text x={x + barW / 2} y={pad.t + ch + 12} textAnchor="middle" className="fill-[#94a3b8] text-[8px]">
              {d.day}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function SellerDashboard() {
  const totalRevenue = monthlyRevenue.reduce((s, m) => s + m.revenue, 0);
  const totalOrders = monthlyRevenue.reduce((s, m) => s + m.orders, 0);
  const totalProfit = monthlyRevenue.reduce((s, m) => s + m.profit, 0);

  const stats = [
    { icon: 'payments', label: 'Total Revenue', value: formatBDT(totalRevenue), change: '+18.3%', trend: 'up' as const, color: 'bg-blue-500' },
    { icon: 'shopping_bag', label: 'Total Orders', value: totalOrders.toLocaleString(), change: '+12.7%', trend: 'up' as const, color: 'bg-emerald-500' },
    { icon: 'trending_up', label: 'Net Profit', value: formatBDT(totalProfit), change: '+22.1%', trend: 'up' as const, color: 'bg-amber-500' },
    { icon: 'star', label: 'Avg. Rating', value: '4.8 ★', change: '+0.2%', trend: 'up' as const, color: 'bg-purple-500' },
    { icon: 'inventory_2', label: 'Products', value: '156', change: '+12', trend: 'up' as const, color: 'bg-cyan-500' },
    { icon: 'favorite', label: 'Followers', value: '3,240', change: '+8.5%', trend: 'up' as const, color: 'bg-rose-500' },
  ];

  const profitData = [
    { label: 'Gross Revenue', value: formatBDT(totalRevenue), percent: 100 },
    { label: 'Product Cost', value: formatBDT(Math.round(totalRevenue * 0.55)), percent: 55 },
    { label: 'Shipping & Fees', value: formatBDT(Math.round(totalRevenue * 0.12)), percent: 12 },
    { label: 'Marketing', value: formatBDT(Math.round(totalRevenue * 0.08)), percent: 8 },
    { label: 'Net Profit', value: formatBDT(totalProfit), percent: 30 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-0.5">Welcome back! Here&apos;s your store performance overview.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-white rounded-xl border border-slate-200 px-4 py-2.5 shadow-sm">
          <span className="material-symbols-outlined text-[16px]">calendar_today</span>
          <span>2026 Annual</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-emerald-600 font-medium">Live</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200/70 p-4 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200 group">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color} shadow-sm`}>
                <span className="material-symbols-outlined text-white text-lg">{s.icon}</span>
              </div>
              <span className={`flex items-center gap-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                s.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                <span className="material-symbols-outlined text-[12px]">{s.trend === 'up' ? 'trending_up' : 'trending_down'}</span>
                {s.change}
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{s.label}</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5 tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Main Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-slate-900">Revenue &amp; Profit Trend</h2>
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
          <p className="text-[10px] text-slate-400 mb-3">Monthly revenue &amp; profit for 2026</p>
          <div className="h-[220px]">
            <RevenueLineChart />
          </div>
        </div>

        {/* Profit Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Profit Breakdown</h2>
            <div className="space-y-3">
              {profitData.map((p) => (
                <div key={p.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">{p.label}</span>
                    <span className={`font-semibold ${p.label === 'Net Profit' ? 'text-emerald-600' : 'text-slate-800'}`}>{p.value}</span>
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

          {/* Performance Score */}
          <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Performance Score</h2>
            <div className="flex flex-col items-center">
              <div className="relative w-28 h-28">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="#2563eb" strokeWidth="3" strokeDasharray={`88 ${100}`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">88</p>
                    <p className="text-[10px] text-slate-400">/100</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-2 w-full">
                {[
                  { label: 'On-time Delivery', value: 96, color: 'text-emerald-600' },
                  { label: 'Response Rate', value: 92, color: 'text-emerald-600' },
                  { label: 'Cancellation Rate', value: 3, color: 'text-amber-600' },
                  { label: 'Return Rate', value: 2, color: 'text-emerald-600' },
                ].map((m) => (
                  <div key={m.label} className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">{m.label}</span>
                    <span className={`font-medium ${m.color}`}>{m.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Sales */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-1">This Week</h2>
          <p className="text-[10px] text-slate-400 mb-2">Daily sales count</p>
          <div className="h-[160px]">
            <WeeklyBarChart />
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Top Products</h2>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 truncate">{p.name}</p>
                  <p className="text-[10px] text-slate-400">{p.sales} sold · {p.stock} in stock</p>
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
              { icon: 'add_box', label: 'Add Product', desc: 'Create a new listing', href: '/seller/products/add', color: 'text-primary bg-primary/5 hover:bg-primary/10' },
              { icon: 'receipt_long', label: 'View Orders', desc: 'Manage pending orders', href: '/seller/orders', color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' },
              { icon: 'edit', label: 'Edit Store', desc: 'Update store info', href: '/seller/store', color: 'text-amber-600 bg-amber-50 hover:bg-amber-100' },
              { icon: 'campaign', label: 'Launch Campaign', desc: 'Create a promotion', href: '/seller/campaigns', color: 'text-purple-600 bg-purple-50 hover:bg-purple-100' },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors group ${action.color}`}
              >
                <span className="material-symbols-outlined text-lg">{action.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-medium">{action.label}</p>
                  <p className="text-[10px] opacity-60">{action.desc}</p>
                </div>
                <span className="material-symbols-outlined ml-auto text-lg opacity-40">chevron_right</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">Recent Orders</h2>
          <a href="/seller/orders" className="text-[11px] font-medium text-primary hover:text-primary/80 transition-colors">
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
                <th className="px-5 py-3 font-medium hidden md:table-cell">Date</th>
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
                  <td className="px-5 py-3 text-[10px] text-slate-400 hidden md:table-cell">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}