'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate, ORDER_STATUS_COLORS } from '@/types';
import { api } from '@/services/api';

interface SellerStat {
  id: string;
  seller: string;
  store: string;
  products: number;
  revenue: number;
  orders: number;
  rating: number;
}

interface SellerAnalytics {
  stats: { totalSellers: number; activeStores: number; avgRating: number; totalRevenue: number };
  data: SellerStat[];
  total: number;
}

async function fetchAnalytics(params: { search?: string }): Promise<SellerAnalytics> {
  try {
    const q = new URLSearchParams();
    if (params.search) q.set('search', params.search);
    return await api.get<SellerAnalytics>(`/admin/sellers/analytics?${q.toString()}`);
  } catch { return { stats: { totalSellers: 0, activeStores: 0, avgRating: 0, totalRevenue: 0 }, data: [], total: 0 }; }
}

export default function SellerAnalyticsPage() {
  const [search, setSearch] = useState('');
  const [data, setData] = useState<SellerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: { search?: string } = {};
      if (search) params.search = search;
      const res = await fetchAnalytics(params);
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [search]);

  const statCards = data ? [
    { label: 'Total Sellers', value: data.stats.totalSellers.toLocaleString(), icon: 'store', color: 'bg-blue-500' },
    { label: 'Active Stores', value: data.stats.activeStores.toLocaleString(), icon: 'check_circle', color: 'bg-green-500' },
    { label: 'Avg Rating', value: data.stats.avgRating.toFixed(1), icon: 'star', color: 'bg-amber-500' },
    { label: 'Total Revenue', value: formatBDT(data.stats.totalRevenue), icon: 'payments', color: 'bg-purple-500' },
  ] : [];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">Seller Analytics</h1>

      {error && <AdminError message={error} onRetry={fetchData} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading && !data ? Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#eee] p-5 animate-pulse">
            <div className="h-4 bg-[#eee] rounded w-20 mb-3" />
            <div className="h-6 bg-[#eee] rounded w-28" />
          </div>
        )) : statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-[#eee] p-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center`}>
                <span className="material-symbols-outlined text-white text-[20px]">{card.icon}</span>
              </div>
              <div>
                <p className="text-sm text-[#888]">{card.label}</p>
                <p className="text-xl font-bold text-[#222]">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 bg-white border border-[#ddd] rounded-lg px-3 py-2 w-full sm:w-64">
        <span className="material-symbols-outlined text-[#888] text-[20px]">search</span>
        <input type="text" placeholder="Search seller or store..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none text-sm flex-1" />
      </div>

      {loading ? <AdminLoading /> : !data || data.data.length === 0 ? (
        <AdminEmpty message="No sellers found" />
      ) : (
        <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                <th className="p-3">Seller</th>
                <th className="p-3">Store</th>
                <th className="p-3">Products</th>
                <th className="p-3">Revenue</th>
                <th className="p-3">Orders</th>
                <th className="p-3">Rating</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((s) => (
                <tr key={s.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                  <td className="p-3 font-medium text-[#333]">{s.seller}</td>
                  <td className="p-3 text-[#666]">{s.store}</td>
                  <td className="p-3 text-[#666]">{s.products}</td>
                  <td className="p-3 text-[#333] font-medium">{formatBDT(s.revenue)}</td>
                  <td className="p-3 text-[#666]">{s.orders}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-amber-400">star</span>
                      <span className="text-[#333] font-medium">{s.rating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
