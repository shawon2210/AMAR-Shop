'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate } from '@/types';
import { api } from '@/services/api';

interface RevenueStat {
  label: string; value: number; change: string; trend: 'up' | 'down'; icon: string;
}

interface RevenueEntry {
  date: string; revenue: number; orders: number;
}

interface RevenueData {
  totalRevenue: number;
  thisMonth: number;
  today: number;
  avgOrder: number;
  chart: RevenueEntry[];
}

async function fetchRevenue(): Promise<RevenueData> {
  try {
    return await api.get<RevenueData>('/admin/revenue');
  } catch { return { totalRevenue: 0, thisMonth: 0, today: 0, avgOrder: 0, chart: [] }; }
}

export default function RevenuePage() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  const load = async () => {
    setLoading(true); setError(null);
    try { setData(await fetchRevenue()); } catch (e) { setError(getErrorMessage(e)); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const chartData = data?.chart.slice(-days) || [];
  const maxRev = Math.max(...chartData.map((c) => c.revenue), 1);

  const stats: RevenueStat[] = [
    { label: 'Total Revenue', value: data?.totalRevenue || 0, change: '+18.7%', trend: 'up', icon: 'payments' },
    { label: 'This Month', value: data?.thisMonth || 0, change: '+12.5%', trend: 'up', icon: 'calendar_month' },
    { label: 'Today', value: data?.today || 0, change: '+5.2%', trend: 'up', icon: 'today' },
    { label: 'Avg Order', value: data?.avgOrder || 0, change: '+3.8%', trend: 'up', icon: 'shopping_cart' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Revenue</h1>
        <div className="flex gap-1 bg-white rounded-lg border border-[#eee] p-0.5">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${period === p ? 'bg-primary text-white' : 'text-[#666] hover:bg-[#f5f5f5]'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {error && <AdminError message={error} onRetry={load} />}

      {loading ? <AdminLoading /> : !data ? <AdminEmpty /> : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-[#eee] p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="material-symbols-outlined text-[#888]">{s.icon}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>{s.change}</span>
                </div>
                <p className="text-xs text-[#888]">{s.label}</p>
                <p className="text-xl font-bold text-[#222] mt-1">{formatBDT(s.value)}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-[#eee] p-5">
            <h2 className="text-base font-semibold text-[#222] mb-4">Revenue Trend</h2>
            <div className="flex items-end gap-[3px] h-48">
              {chartData.map((c, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className="w-full bg-primary/20 hover:bg-primary/40 rounded-t transition-colors relative group" style={{ height: `${(c.revenue / maxRev) * 100}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#222] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">{formatBDT(c.revenue)}</div>
                  </div>
                  {days <= 30 && <span className="text-[10px] text-[#888] mt-1 rotate-45 origin-left whitespace-nowrap">{new Date(c.date).getDate()}/{new Date(c.date).getMonth() + 1}</span>}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
