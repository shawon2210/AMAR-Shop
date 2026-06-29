'use client';


const stats = [
  { label: 'Total Revenue', value: '৳4,52,80,490', icon: 'payments', change: '+12.5%', color: 'text-green-600' },
  { label: 'Total Orders', value: '24,890', icon: 'receipt_long', change: '+8.2%', color: 'text-green-600' },
  { label: 'Total Users', value: '1,42,567', icon: 'group', change: '+5.7%', color: 'text-green-600' },
  { label: 'Total Sellers', value: '3,420', icon: 'store', change: '+3.1%', color: 'text-green-600' },
  { label: 'Total Products', value: '1,28,934', icon: 'inventory_2', change: '+9.4%', color: 'text-green-600' },
];

const recentOrders = [
  { id: '#ORD-28471', customer: 'Rahima Begum', amount: '৳2,450', status: 'Delivered', date: '28 Jun 2026' },
  { id: '#ORD-28472', customer: 'Karim Hossain', amount: '৳5,200', status: 'Processing', date: '28 Jun 2026' },
  { id: '#ORD-28473', customer: 'Fatima Akhter', amount: '৳890', status: 'Shipped', date: '27 Jun 2026' },
  { id: '#ORD-28474', customer: 'Nurul Islam', amount: '৳12,400', status: 'Pending', date: '27 Jun 2026' },
  { id: '#ORD-28475', customer: 'Sharmin Sultana', amount: '৳3,600', status: 'Delivered', date: '26 Jun 2026' },
  { id: '#ORD-28476', customer: 'Jahid Hasan', amount: '৳8,750', status: 'Cancelled', date: '26 Jun 2026' },
  { id: '#ORD-28477', customer: 'Morshed Alam', amount: '৳1,200', status: 'Delivered', date: '25 Jun 2026' },
  { id: '#ORD-28478', customer: 'Parvin Akhter', amount: '৳15,000', status: 'Processing', date: '25 Jun 2026' },
  { id: '#ORD-28479', customer: 'Shahidul Islam', amount: '৳4,300', status: 'Shipped', date: '24 Jun 2026' },
  { id: '#ORD-28480', customer: 'Taslima Nasrin', amount: '৳980', status: 'Pending', date: '24 Jun 2026' },
];

const statusColors: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Pending: 'bg-amber-100 text-amber-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const revenueData = [
  28000, 32000, 27000, 35000, 29000, 38000, 41000, 36000, 42000, 39000,
  45000, 41000, 48000, 44000, 52000, 49000, 55000, 51000, 58000, 54000,
  61000, 57000, 64000, 59000, 67000, 62000, 70000, 66000, 73000, 69000,
];

function RevenueChart() {
  const max = Math.max(...revenueData);
  const w = 600;
  const h = 200;
  const points = revenueData
    .map((v, i) => `${(i / (revenueData.length - 1)) * w},${h - (v / max) * h * 0.85 - 10}`)
    .join(' ');
  const area = `M0,${h} ${points} ${w},${h}Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-48">
      <defs>
        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a63600" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#a63600" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#revGrad)" />
      <polyline
        points={points}
        fill="none"
        stroke="#a63600"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {[0, 7, 14, 21, 29].map((i) => (
        <text
          key={i}
          x={(i / 29) * w}
          y={h - 4}
          textAnchor="middle"
          className="fill-[#999] text-[10px]"
        >
          {`Day ${i + 1}`}
        </text>
      ))}
    </svg>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#222]">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-[#eee]">
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-[#888]">{s.icon}</span>
              <span className={`text-xs font-semibold ${s.color}`}>{s.change}</span>
            </div>
            <p className="text-2xl font-bold text-[#222]">{s.value}</p>
            <p className="text-sm text-[#888] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">Revenue (Last 30 Days)</h2>
          <RevenueChart />
        </div>

        <div className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div>
                <p className="text-sm font-medium text-amber-800">Pending Approvals</p>
                <p className="text-xs text-amber-600">12 sellers need KYC review</p>
              </div>
              <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">12</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <p className="text-sm font-medium text-blue-800">Product Moderation</p>
                <p className="text-xs text-blue-600">48 products pending review</p>
              </div>
              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">48</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="text-sm font-medium text-green-800">System Health</p>
                <p className="text-xs text-green-600">All systems operational</p>
              </div>
              <span className="material-symbols-outlined text-green-500 text-xl">check_circle</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#eee]">
          <div className="p-5 border-b border-[#eee] flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#222]">Recent Orders</h2>
            <button className="text-sm text-primary font-medium hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888] text-xs uppercase tracking-wider border-b border-[#eee]">
                  <th className="p-3">ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 font-medium text-[#333]">{o.id}</td>
                    <td className="p-3 text-[#555]">{o.customer}</td>
                    <td className="p-3 font-medium">{o.amount}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusColors[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3 text-[#888]">{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#eee] p-5">
            <h2 className="text-lg font-semibold text-[#222] mb-4">Top Sellers</h2>
            <div className="space-y-3">
              {[
                { name: 'TechHaven BD', revenue: '৳28,40,000' },
                { name: 'Fashion Hub', revenue: '৳21,60,000' },
                { name: 'Gadget Pro', revenue: '৳18,90,000' },
                { name: 'Home Decor Ltd', revenue: '৳15,20,000' },
                { name: 'Book Nook', revenue: '৳12,70,000' },
              ].map((s, i) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#eee] flex items-center justify-center text-[10px] font-bold text-[#888]">
                      {i + 1}
                    </span>
                    <span className="text-sm text-[#444]">{s.name}</span>
                  </div>
                  <span className="text-sm font-semibold">{s.revenue}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#eee] p-5">
            <h2 className="text-lg font-semibold text-[#222] mb-4">System Health</h2>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Server Uptime', value: '99.98%', good: true },
                { label: 'API Response', value: '142ms', good: true },
                { label: 'Database', value: 'Connected', good: true },
                { label: 'Redis Cache', value: 'Operational', good: true },
                { label: 'CDN', value: 'Active', good: true },
              ].map((h) => (
                <div key={h.label} className="flex items-center justify-between">
                  <span className="text-[#666]">{h.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#333]">{h.value}</span>
                    {h.good && <span className="material-symbols-outlined text-green-500 text-[16px]">check_circle</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
