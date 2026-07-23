'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate } from '@/types';
import { api } from '@/services/api';
import { fetchAnalytics } from '@/lib/api/admin';
import type { AdminAnalytics, AnalyticsTopCategory, AnalyticsTopSeller } from '@/types';

interface AggregatedStats {
  totalUsers: number; totalOrders: number; totalRevenue: number; totalSellers: number;
}

async function fetchStats(): Promise<AggregatedStats> {
  try {
    return await api.get<AggregatedStats>('/admin/analytics/stats');
  } catch {
    return { totalUsers: 0, totalOrders: 0, totalRevenue: 0, totalSellers: 0 };
  }
}

const statusColors: Record<string, string> = {
  DELIVERED: 'bg-green-100 text-green-700', PROCESSING: 'bg-blue-100 text-blue-700',
  PENDING: 'bg-amber-100 text-amber-700', CANCELLED: 'bg-red-100 text-red-700',
  SHIPPED: 'bg-purple-100 text-purple-700', REFUNDED: 'bg-orange-100 text-orange-700',
};

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AggregatedStats | null>(null);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const [s, a] = await Promise.all([fetchStats(), fetchAnalytics()]);
      setStats(s); setAnalytics(a);
    } catch (e) { setError(getErrorMessage(e)); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const revChart = analytics?.revenueChart || [];
  const maxRev = Math.max(...revChart.map((r) => r.revenue), 1);
  const topCats = analytics?.topCategories || [];
  const topSellers = analytics?.topSellers || [];
  const orderStats = analytics?.orderStats || [];

  const catsPage = topCats.slice((page - 1) * perPage, page * perPage);
  const catsTotalPages = Math.max(1, Math.ceil(topCats.length / perPage));

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: 'group', color: 'text-blue-600' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: 'receipt_long', color: 'text-green-600' },
    { label: 'Total Revenue', value: stats?.totalRevenue || 0, icon: 'payments', color: 'text-emerald-600' },
    { label: 'Total Sellers', value: stats?.totalSellers || 0, icon: 'store', color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">Analytics</h1>

      {error && <AdminError message={error} onRetry={load} />}

      {loading ? <AdminLoading /> : !analytics ? <AdminEmpty /> : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-[#eee] p-5">
                <span className={`material-symbols-outlined ${s.color} mb-2 block`}>{s.icon}</span>
                <p className="text-xs text-[#888]">{s.label}</p>
                <p className="text-xl font-bold text-[#222] mt-1">{typeof s.value === 'number' && s.label === 'Total Revenue' ? formatBDT(s.value) : typeof s.value === 'number' ? s.value.toLocaleString('en-IN') : s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white rounded-xl border border-[#eee] p-5">
              <h2 className="text-base font-semibold text-[#222] mb-4">Revenue (30 days)</h2>
              <div className="flex items-end gap-[3px] h-40">
                {revChart.map((r, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div className="w-full bg-primary/20 hover:bg-primary/40 rounded-t transition-colors relative group" style={{ height: `${(r.revenue / maxRev) * 100}%` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#222] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">{formatBDT(r.revenue)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-white rounded-xl border border-[#eee] p-5">
                <h2 className="text-base font-semibold text-[#222] mb-4">Order Status</h2>
                <div className="space-y-3">
                  {orderStats.map((o) => {
                    const totalOrders = orderStats.reduce((s, x) => s + x._count.id, 0);
                    const pct = totalOrders > 0 ? Math.round((o._count.id / totalOrders) * 100) : 0;
                    return (
                      <div key={o.status}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-[#666]">{o.status}</span>
                          <span className="font-medium text-[#333]">{o._count.id} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${(statusColors[o.status] || 'bg-gray-300').split(' ')[0]}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#eee] p-5">
                <h2 className="text-base font-semibold text-[#222] mb-4">Top Sellers</h2>
                <div className="space-y-3">
                  {topSellers.slice(0, 5).map((s) => (
                    <div key={s.id} className="flex items-center justify-between">
                      <span className="text-sm text-[#333]">{s.name}</span>
                      <div className="text-right">
                        <p className="text-xs text-[#888]">{s._count.products} products</p>
                        <p className="text-xs text-[#888]">{'★'.repeat(Math.round(s.rating))}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
            <div className="p-4 border-b border-[#eee]">
              <h2 className="text-base font-semibold text-[#222]">Top Categories</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                  <th className="p-3">Category</th>
                  <th className="p-3">Products</th>
                  <th className="p-3">Total Sold</th>
                  <th className="p-3">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {catsPage.map((c, i) => (
                  <tr key={c.categoryId} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 font-medium text-[#333]">{c.categoryName}</td>
                    <td className="p-3 text-[#666]">{c.productCount}</td>
                    <td className="p-3 text-[#666]">{c.totalSold}</td>
                    <td className="p-3">{c.productCount > 0 ? `${Math.round((c.totalSold / c.productCount) * 100)}%` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4">
              <Pagination page={page} totalPages={catsTotalPages} total={topCats.length} onPageChange={setPage} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
