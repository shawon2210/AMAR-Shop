'use client';

import { useAdminData } from '@/lib/api/hooks';
import { fetchDashboard } from '@/lib/api/admin';

const statusColors: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Pending: 'bg-amber-100 text-amber-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const statusStyles: Record<string, string> = {
  delivered: 'bg-green-100 text-green-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  pending: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-red-100 text-red-700',
};

function formatBDT(amount: number): string {
  const num = Math.round(amount);
  if (num >= 10000000) return `৳${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `৳${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `৳${num.toLocaleString('en-IN')}`;
  return `৳${num}`;
}

function RevenueChart({ data }: { data: { date: string; revenue: number }[] }) {
  if (!data || data.length === 0) return <div className="h-48 flex items-center justify-center text-[#888] text-sm">No revenue data</div>;
  const max = Math.max(...data.map((d) => d.revenue), 1);
  const w = 600;
  const h = 200;
  const points = data
    .map((d, i) => `${(i / (data.length - 1)) * w},${h - (d.revenue / max) * h * 0.85 - 10}`)
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
      <polyline points={points} fill="none" stroke="#a63600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {[0, 7, 14, 21, 29].filter((i) => i < data.length).map((i) => (
        <text key={i} x={(i / Math.max(data.length - 1, 1)) * w} y={h - 4} textAnchor="middle" className="fill-[#999] text-[10px]">
          {data[i]?.date?.slice(5) || `Day ${i + 1}`}
        </text>
      ))}
    </svg>
  );
}

export default function AdminDashboard() {
  const { data, loading, error } = useAdminData(fetchDashboard);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 rounded-xl p-6 border border-red-200">
        <h2 className="font-semibold mb-1">Failed to load dashboard</h2>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    { label: 'Total Revenue', value: formatBDT(data.totalRevenue), icon: 'payments', change: 'Today', color: 'text-green-600' },
    { label: 'Total Orders', value: data.totalOrders.toLocaleString('en-IN'), icon: 'receipt_long', change: 'All time', color: 'text-blue-600' },
    { label: 'Total Users', value: data.totalUsers.toLocaleString('en-IN'), icon: 'group', change: 'Registered', color: 'text-green-600' },
    { label: 'Total Sellers', value: data.totalSellers.toLocaleString('en-IN'), icon: 'store', change: 'Active sellers', color: 'text-purple-600' },
    { label: 'Total Products', value: data.totalProducts.toLocaleString('en-IN'), icon: 'inventory_2', change: 'Listed', color: 'text-amber-600' },
  ];

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
          <RevenueChart data={data.revenueChart} />
        </div>

        <div className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div>
                <p className="text-sm font-medium text-amber-800">Pending Approvals</p>
                <p className="text-xs text-amber-600">{data.pendingSellerApprovals} sellers need KYC review</p>
              </div>
              <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">{data.pendingSellerApprovals}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <p className="text-sm font-medium text-blue-800">Product Moderation</p>
                <p className="text-xs text-blue-600">Low stock alerts</p>
              </div>
              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">{data.lowStockAlerts}</span>
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
            <a href="/admin/orders" className="text-sm text-primary font-medium hover:underline">View All</a>
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
                {(data.recentOrders as any[])?.slice(0, 10).map((o: any) => (
                  <tr key={o.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 font-medium text-[#333]">#{o.orderNumber || o.id.slice(-6)}</td>
                    <td className="p-3 text-[#555]">{o.user?.name || 'N/A'}</td>
                    <td className="p-3 font-medium">{formatBDT(o.total)}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[o.status?.toLowerCase()] || 'bg-gray-100 text-gray-700'}`}>
                        {o.status || 'N/A'}
                      </span>
                    </td>
                    <td className="p-3 text-[#888]">{o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</td>
                  </tr>
                ))}
                {(!data.recentOrders || (data.recentOrders as any[]).length === 0) && (
                  <tr><td colSpan={5} className="p-6 text-center text-[#888] text-sm">No recent orders</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#eee] p-5">
            <h2 className="text-lg font-semibold text-[#222] mb-4">Top Sellers</h2>
            <div className="space-y-3">
              {(data.recentOrders as any[])?.slice(0, 5).map((o: any, i: number) => (
                <div key={o.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#eee] flex items-center justify-center text-[10px] font-bold text-[#888]">{i + 1}</span>
                    <span className="text-sm text-[#444]">{o.user?.name || 'Store'}</span>
                  </div>
                  <span className="text-sm font-semibold">{formatBDT(o.total)}</span>
                </div>
              ))}
              {(!data.recentOrders || (data.recentOrders as any[]).length === 0) && (
                <p className="text-sm text-[#888] text-center py-4">No seller data</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#eee] p-5">
            <h2 className="text-lg font-semibold text-[#222] mb-4">System Health</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#666]">Server Status</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#333]">Online</span>
                  <span className="material-symbols-outlined text-green-500 text-[16px]">check_circle</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666]">Database</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#333]">Connected</span>
                  <span className="material-symbols-outlined text-green-500 text-[16px]">check_circle</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666]">Total Revenue</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#333]">{formatBDT(data.totalRevenue)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666]">Sellers Pending KYC</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#333]">{data.pendingSellerApprovals}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
