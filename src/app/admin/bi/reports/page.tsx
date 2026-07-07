'use client';

import { useState } from 'react';
import { useAdminData } from '@/lib/api/hooks';
import { fetchReport } from '@/lib/api/admin';
import type { ReportData, AdminProduct, SellerSummary } from '@/types';
import { getErrorMessage } from '@/lib/error-helper';

function formatBDT(v: number): string {
  return `৳${v.toLocaleString('en-IN')}`;
}

export default function ReportsPage() {
  const [reportType, setReportType] = useState('sales');
  const [from, setFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [to, setTo] = useState(() => new Date().toISOString().split('T')[0]);
  const [queryParams, setQueryParams] = useState({ type: 'sales', from: '', to: '' });

  const { data: rawData, loading, error } = useAdminData(
    () => queryParams.from ? fetchReport(queryParams.type, { from: queryParams.from, to: queryParams.to }) : Promise.resolve(null),
    [queryParams],
  );
  const data = (rawData ?? {}) as ReportData;

  const handleGenerate = () => {
    setQueryParams({ type: reportType, from, to });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Custom Reports</h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm border border-red-200">{error}</div>
      )}

      <div className="bg-white rounded-xl border border-[#eee] p-5 space-y-4">
        <h2 className="font-semibold text-[#222]">Build Report</h2>

        <div>
          <label className="block text-sm text-[#666] mb-1">Report Type</label>
          <div className="flex gap-2 flex-wrap">
            {['sales', 'products', 'sellers'].map((t) => (
              <button key={t} onClick={() => setReportType(t)}
                className={`text-sm px-4 py-1.5 rounded-lg font-medium capitalize transition-colors ${reportType === t ? 'bg-primary text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f5f5f5]'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[#666] mb-1">From</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
              className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
          </div>
          <div>
            <label className="block text-sm text-[#666] mb-1">To</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
              className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <button onClick={handleGenerate} disabled={!from || !to}
            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 disabled:opacity-50">
            <span className="material-symbols-outlined text-[18px] align-middle mr-1">download</span>
            Generate
          </button>
        </div>
      </div>

      {loading && (
        <div className="bg-white rounded-xl border border-[#eee] p-8 text-center text-[#888]">
          <span className="material-symbols-outlined animate-spin align-middle mr-2">progress_activity</span>
          Generating report...
        </div>
      )}

      {data && !loading && queryParams.from && (
        <div className="space-y-4">
          {reportType === 'sales' && (
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
          )}

          {reportType === 'products' && (
            <div className="bg-white rounded-xl border border-[#eee] p-5">
              <h3 className="font-semibold text-[#222] mb-3">Top Products</h3>
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
            </div>
          )}

          {reportType === 'sellers' && (
            <div className="bg-white rounded-xl border border-[#eee] p-5">
              <h3 className="font-semibold text-[#222] mb-3">Top Sellers</h3>
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}