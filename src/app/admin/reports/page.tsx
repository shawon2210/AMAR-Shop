'use client';

import { useState, useMemo } from 'react';
import { useAdminData } from '@/lib/api/hooks';
import { fetchReport } from '@/lib/api/admin';
import type { ReportData, AdminProduct, SellerSummary } from '@/types';
import { getErrorMessage } from '@/lib/error-helper';

function formatBDT(v: number): string {
  return `৳${Math.round(v).toLocaleString('en-IN')}`;
}

function SalesChart({ data }: { data: { date: string; revenue: number }[] }) {
  if (!data || data.length === 0) return <div className="h-48 flex items-center justify-center text-[#888] text-sm">No data</div>;
  const max = Math.max(...data.map((d) => d.revenue), 1);
  const w = 600, h = 200;
  const n = data.length;
  const barW = Math.max(4, (w / n) * 0.6);
  const gap = (w / n) * 0.4;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-48">
      {data.map((d, i) => {
        const barH = (d.revenue / max) * h * 0.85;
        const x = (i / n) * w + gap / 2;
        const y = h - barH - 10;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx="3" fill="#a63600" opacity="0.8" />
            {d.revenue > 0 && (
              <text x={x + barW / 2} y={y - 4} textAnchor="middle" className="fill-[#888] text-[8px]">
                {d.revenue >= 1000 ? `${(d.revenue / 1000).toFixed(0)}k` : d.revenue}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function getDefaultRange() {
  const to = new Date();
  const from = new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
  return {
    from: from.toISOString().split('T')[0],
    to: to.toISOString().split('T')[0],
  };
}

export default function ReportsPage() {
  const [tab, setTab] = useState('sales');
  const range = getDefaultRange();
  const [from, setFrom] = useState(range.from);
  const [to, setTo] = useState(range.to);
  const [queryFrom, setQueryFrom] = useState(range.from);
  const [queryTo, setQueryTo] = useState(range.to);

  const { data: rawData, loading, error } = useAdminData(
    () => fetchReport(tab, { from: queryFrom, to: queryTo }),
    [tab, queryFrom, queryTo],
  );
  const data = (rawData ?? {}) as ReportData;

  const salesData = useMemo(() => {
    if (tab === 'sales') {
      const orders = (data.orders || []) as Record<string, unknown>[];
      const grouped: Record<string, number> = {};
      orders.forEach((o) => {
        const createdAt = o.createdAt as string | undefined;
        const paidAt = o.paidAt as string | undefined;
        const total = o.total as number | undefined;
        const day = createdAt?.split('T')[0] || paidAt?.split('T')[0];
        if (day && total) grouped[day] = (grouped[day] || 0) + total;
      });
      return Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, revenue]) => ({ date, revenue }));
    }
    return [];
  }, [tab, data]);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">Reports</h1>

      <div className="flex gap-2 flex-wrap">
        {['sales', 'products', 'sellers'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors capitalize ${tab === t ? 'bg-primary text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f5f5f5]'}`}>
            {t} Report
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm border border-red-200">{error}</div>
      )}

      {tab === 'sales' && (
        <div className="space-y-6">
          {loading ? (
            <div className="bg-white rounded-xl border border-[#eee] p-8 text-center text-[#888]">
              <span className="material-symbols-outlined animate-spin align-middle mr-2">progress_activity</span>Loading...
            </div>
          ) : data ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Total Sales', value: formatBDT(data.totalSales || 0) },
                  { label: 'Order Count', value: (data.totalOrders || 0).toLocaleString() },
                  { label: 'Avg Order Value', value: formatBDT(data.avgOrderValue || 0) },
                  { label: 'Period Orders', value: (data.orders?.length || 0).toLocaleString() },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-xl p-4 border border-[#eee]">
                    <p className="text-2xl font-bold text-[#222]">{s.value}</p>
                    <p className="text-sm text-[#888] mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div>
                  <label className="block text-xs text-[#888] mb-1">From</label>
                  <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
                    className="border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-[#888] mb-1">To</label>
                  <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
                    className="border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
                </div>
                <button onClick={() => { setQueryFrom(from); setQueryTo(to); }}
                  className="mt-5 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">Apply</button>
              </div>

              <div className="bg-white rounded-xl border border-[#eee] p-5">
                <h2 className="text-lg font-semibold text-[#222] mb-4">Sales Trend (Daily)</h2>
                {salesData.length > 0 ? (
                  <SalesChart data={salesData} />
                ) : (
                  <p className="text-sm text-[#888] text-center py-8">No sales data for this period</p>
                )}
              </div>
            </>
          ) : null}
        </div>
      )}

      {tab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-[#eee] p-5">
            <h2 className="text-lg font-semibold text-[#222] mb-4">Product Summary</h2>
            {loading ? (
              <p className="text-sm text-[#888]">
                <span className="material-symbols-outlined animate-spin align-middle mr-2">progress_activity</span>Loading...
              </p>
            ) : data ? (
              <>
                <div className="flex justify-between py-2 border-b border-[#eee]">
                  <span className="text-[#888]">Total Products</span>
                  <span className="font-semibold">{data.totalProducts || 0}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#eee]">
                  <span className="text-[#888]">Total Units Sold</span>
                  <span className="font-semibold">{(data.totalSold || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#888]">Period</span>
                  <span className="text-sm text-[#666]">{data.period?.from?.split('T')[0]} - {data.period?.to?.split('T')[0]}</span>
                </div>

                <h3 className="text-sm font-semibold text-[#333] mt-6 mb-3">Top Products</h3>
                <div className="space-y-3">
                  {(data.products || []).slice(0, 10).map((p: AdminProduct, i: number) => (
                    <div key={p.id || i} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#eee] flex items-center justify-center text-[10px] font-bold text-[#888]">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#333] truncate">{p.name || p.title || 'Unknown'}</p>
                        <p className="text-xs text-[#888]">{p.soldCount || 0} sold</p>
                      </div>
                      <p className="text-sm font-semibold">{p.price ? formatBDT(p.price) : '—'}</p>
                    </div>
                  ))}
                  {(!data.products || data.products.length === 0) && (
                    <p className="text-sm text-[#888] text-center py-4">No products found</p>
                  )}
                </div>
              </>
            ) : null}
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#eee] p-5">
              <h2 className="text-lg font-semibold text-[#222] mb-4">Filter by Date</h2>
              <div className="flex gap-2">
                <input type="date" value={from} onChange={(e) => setQueryFrom(e.target.value)}
                  className="flex-1 border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
                <input type="date" value={to} onChange={(e) => setQueryTo(e.target.value)}
                  className="flex-1 border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
              </div>
              <button onClick={() => { setQueryFrom(from); setQueryTo(to); }}
                className="mt-3 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 w-full">Apply</button>
            </div>
          </div>
        </div>
      )}

      {tab === 'sellers' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-[#eee] p-5">
            <h2 className="text-lg font-semibold text-[#222] mb-4">Sellers Summary</h2>
            {loading ? (
              <p className="text-sm text-[#888]">
                <span className="material-symbols-outlined animate-spin align-middle mr-2">progress_activity</span>Loading...
              </p>
            ) : data ? (
              <>
                <div className="flex justify-between py-2 border-b border-[#eee]">
                  <span className="text-[#888]">Total Sellers</span>
                  <span className="font-semibold">{data.totalSellers || 0}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#888]">Period</span>
                  <span className="text-sm text-[#666]">{data.period?.from?.split('T')[0]} - {data.period?.to?.split('T')[0]}</span>
                </div>

                <h3 className="text-sm font-semibold text-[#333] mt-6 mb-3">Sellers Registered</h3>
                <div className="space-y-3">
                  {(data.sellers || []).slice(0, 10).map((s: SellerSummary, i: number) => (
                    <div key={s.id || i} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#eee] flex items-center justify-center text-[10px] font-bold text-[#888]">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#333] truncate">{s.name || s.store?.name || 'Unknown'}</p>
                        <p className="text-xs text-[#888]">{s.sellerProfile?.totalOrders || 0} orders</p>
                      </div>
                      <p className="text-sm font-semibold">{s.sellerProfile?.totalRevenue ? formatBDT(s.sellerProfile.totalRevenue) : '—'}</p>
                    </div>
                  ))}
                  {(!data.sellers || data.sellers.length === 0) && (
                    <p className="text-sm text-[#888] text-center py-4">No sellers found</p>
                  )}
                </div>
              </>
            ) : null}
          </div>
          <div className="bg-white rounded-xl border border-[#eee] p-5">
            <h2 className="text-lg font-semibold text-[#222] mb-4">Filter by Date</h2>
            <div className="flex gap-2">
              <input type="date" value={from} onChange={(e) => setQueryFrom(e.target.value)}
                className="flex-1 border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
              <input type="date" value={to} onChange={(e) => setQueryTo(e.target.value)}
                className="flex-1 border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <button onClick={() => { setQueryFrom(from); setQueryTo(to); }}
              className="mt-3 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 w-full">Apply</button>
          </div>
        </div>
      )}
    </div>
  );
}
