'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useAdminData } from '@/lib/api/hooks';
import { fetchDashboard } from '@/lib/api/admin';
import type { RecentOrder } from '@/types';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/data-table';

function formatBDT(amount: number): string {
  const num = Math.round(amount);
  if (num >= 10000000) return `৳${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `৳${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `৳${num.toLocaleString('en-IN')}`;
  return `৳${num}`;
}

function RevenueChart({ data }: { data: { date: string; revenue: number }[] }) {
  if (!data || data.length === 0) {
    return <div className="h-48 flex items-center justify-center text-[#888] text-sm">No revenue data</div>;
  }
  const max = Math.max(...data.map(d => d.revenue), 1);
  const w = 600;
  const h = 200;
  const points = data
    .map((d, i) => `${(i / (data.length - 1)) * w},${h - (d.revenue / max) * h * 0.85 - 10}`)
    .join(' ');
  const area = `M0,${h} ${points} ${w},${h}Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-44 sm:h-48" preserveAspectRatio="xMidYMid meet">
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
      {[0, 7, 14, 21, 29].filter(i => i < data.length).map(i => (
        <text
          key={i}
          x={(i / Math.max(data.length - 1, 1)) * w}
          y={h - 4}
          textAnchor="middle"
          className="fill-[#999] text-[10px]"
        >
          {data[i]?.date?.slice(5) || `Day ${i + 1}`}
        </text>
      ))}
    </svg>
  );
}

export default function AdminDashboard() {
  const { data, loading, error } = useAdminData(fetchDashboard);

  const stats = useMemo(() => {
    if (!data) return [];
    return [
      { label: 'Total Revenue', value: formatBDT(data.totalRevenue), change: 'Today', color: 'text-green-600' },
      { label: 'Total Orders', value: data.totalOrders.toLocaleString('en-IN'), change: 'All time', color: 'text-blue-600' },
      { label: 'Total Users', value: data.totalUsers.toLocaleString('en-IN'), change: 'Registered', color: 'text-violet-600' },
      { label: 'Total Sellers', value: data.totalSellers.toLocaleString('en-IN'), change: 'Active sellers', color: 'text-orange-600' },
      { label: 'Total Products', value: data.totalProducts.toLocaleString('en-IN'), change: 'Listed', color: 'text-cyan-600' },
    ];
  }, [data]);

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

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back, Admin"
        actions={
          <div className="flex items-center gap-2 text-xs text-[#888]">
            <span className="material-symbols-outlined text-base">calendar_today</span>
            <span>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        {stats.map(s => (
          <StatCard key={s.label} variant="gradient" label={s.label} value={s.value} trend={s.change} color={s.color} />
        ))}
      </div>

      {/* Chart + Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-6">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-[#eee] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-[#222]">Revenue (Last 30 Days)</h2>
            <select className="text-xs border border-[#ddd] rounded-lg px-2 py-1 bg-transparent text-[#666] outline-none">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Quarter</option>
            </select>
          </div>
          <RevenueChart data={data.revenueChart} />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-[#eee] p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-semibold text-[#222] mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/admin/sellers"
              className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200 hover:border-amber-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-amber-700 text-lg">verified</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-800">Pending Approvals</p>
                  <p className="text-xs text-amber-600 mt-0.5">sellers need KYC review</p>
                </div>
              </div>
              <span className="bg-amber-500 text-white text-xs font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center">
                {data.pendingSellerApprovals}
              </span>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200 hover:border-blue-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-blue-700 text-lg">inventory</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">Low Stock Alerts</p>
                  <p className="text-xs text-blue-600 mt-0.5">products need restocking</p>
                </div>
              </div>
              <span className="bg-blue-500 text-white text-xs font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center">
                {data.lowStockAlerts}
              </span>
            </Link>

            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200 hover:border-green-300 transition-all">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-green-700 text-lg">check_circle</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">System Health</p>
                  <p className="text-xs text-green-600 mt-0.5">All systems operational</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-green-500 text-xl">check_circle</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders + Top Sellers */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-[#eee] overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#eee] flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold text-[#222]">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs sm:text-sm text-primary font-medium hover:underline">
              View All
            </Link>
          </div>

          <div className="p-4">
            <DataTable<RecentOrder>
              columns={[
                {
                  key: 'order',
                  header: 'Order',
                  render: (o) => (
                    <Link href={`/admin/orders/${o.id}`} className="font-medium text-[#333] hover:text-primary transition-colors">
                      #{o.orderNumber || o.id.slice(-6)}
                    </Link>
                  ),
                },
                { key: 'customer', header: 'Customer', render: (o) => <span className="text-[#555]">{o.user?.name || 'N/A'}</span> },
                { key: 'amount', header: 'Amount', render: (o) => <span className="font-medium">{formatBDT(o.total)}</span> },
                {
                  key: 'status',
                  header: 'Status',
                  render: (o) => <StatusBadge status={o.status || 'N/A'} />,
                },
                {
                  key: 'date',
                  header: 'Date',
                  render: (o) => (
                    <span className="text-[#888] text-xs">
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                        : 'N/A'}
                    </span>
                  ),
                  hideOnMobile: true,
                },
              ]}
              data={data.recentOrders?.slice(0, 10)}
              loading={false}
              emptyMessage="No recent orders"
              mobileCard={(o) => (
                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Link href={`/admin/orders/${o.id}`} className="font-medium text-sm text-primary">
                      #{o.orderNumber || o.id.slice(-6)}
                    </Link>
                    <StatusBadge status={o.status || 'N/A'} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#666]">
                    <span>{o.user?.name || 'N/A'}</span>
                    <span>{formatBDT(o.total)}</span>
                  </div>
                  <div className="text-[10px] text-[#999]">
                    {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : ''}
                  </div>
                </div>
              )}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5 sm:space-y-6">
          {/* Top Sellers */}
          <div className="bg-white rounded-xl border border-[#eee] p-4 sm:p-5">
            <h2 className="text-base sm:text-lg font-semibold text-[#222] mb-4">Top Sellers</h2>
            <div className="space-y-3">
              {data.recentOrders?.slice(0, 5).map((o: RecentOrder, i: number) => (
                <div key={o.id} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-gray-100 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-[#f5f5f5] text-[#999]'}`}>
                      {i + 1}
                    </span>
                    <span className="text-sm text-[#444]">{o.user?.name || 'Store'}</span>
                  </div>
                  <span className="text-sm font-semibold text-[#333]">{formatBDT(o.total)}</span>
                </div>
              ))}
              {(!data.recentOrders || data.recentOrders.length === 0) && (
                <p className="text-sm text-[#888] text-center py-4">No seller data</p>
              )}
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-xl border border-[#eee] p-4 sm:p-5">
            <h2 className="text-base sm:text-lg font-semibold text-[#222] mb-4">System Health</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-green-50">
                <span className="text-[#555] flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-500 text-lg">dns</span>
                  Server
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-green-700">Online</span>
                  <span className="material-symbols-outlined text-green-500 text-base">check_circle</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-green-50">
                <span className="text-[#555] flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-500 text-lg">storage</span>
                  Database
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-green-700">Connected</span>
                  <span className="material-symbols-outlined text-green-500 text-base">check_circle</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-50">
                <span className="text-[#555] flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-500 text-lg">payments</span>
                  Total Revenue
                </span>
                <span className="font-semibold text-[#333]">{formatBDT(data.totalRevenue)}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50">
                <span className="text-[#555] flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500 text-lg">verified</span>
                  Pending KYC
                </span>
                <span className="font-semibold text-amber-700">{data.pendingSellerApprovals}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
