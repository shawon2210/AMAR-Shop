'use client';

import { useState } from 'react';
import { useAdminData } from '@/lib/api/hooks';
import { fetchTaxReport } from '@/lib/api/admin';

function formatBDT(v: number): string {
  return `৳${Math.round(v).toLocaleString('en-IN')}`;
}

export default function TaxReportPage() {
  const [quarter, setQuarter] = useState(String(Math.ceil((new Date().getMonth() + 1) / 3)));
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const { data, loading, error } = useAdminData(
    () => fetchTaxReport(quarter, year),
    [quarter, year],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Tax Reports</h1>
        <a href="/admin/finance" className="flex items-center gap-1.5 px-3 py-2 border border-[#ddd] text-[#666] rounded-lg text-sm font-medium hover:bg-[#f5f5f5]">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Finance
        </a>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-[#666]">Period:</span>
        <select value={quarter} onChange={(e) => setQuarter(e.target.value)}
          className="px-3 py-1.5 border border-[#ddd] rounded-lg text-sm bg-white">
          <option value="1">Q1 (Jan-Mar)</option>
          <option value="2">Q2 (Apr-Jun)</option>
          <option value="3">Q3 (Jul-Sep)</option>
          <option value="4">Q4 (Oct-Dec)</option>
        </select>
        <select value={year} onChange={(e) => setYear(e.target.value)}
          className="px-3 py-1.5 border border-[#ddd] rounded-lg text-sm bg-white">
          {[2024, 2025, 2026, 2027].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm border border-red-200">{error}</div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-[#eee] p-8 text-center text-[#888]">
          <span className="material-symbols-outlined animate-spin align-middle mr-2">progress_activity</span>Loading...
        </div>
      ) : !data ? (
        <div className="bg-white rounded-xl border border-[#eee] p-8 text-center text-[#888]">No tax data available</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-[#eee] p-5">
              <p className="text-sm text-[#888] mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-[#222]">{formatBDT(data.totalRevenue)}</p>
            </div>
            <div className="bg-white rounded-xl border border-[#eee] p-5">
              <p className="text-sm text-[#888] mb-1">VAT Collected ({data.vatRate}%)</p>
              <p className="text-2xl font-bold text-[#222]">{formatBDT(data.totalVat)}</p>
            </div>
            <div className="bg-white rounded-xl border border-[#eee] p-5">
              <p className="text-sm text-[#888] mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-[#222]">{data.totalOrders}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#eee] overflow-hidden">
            <div className="p-4 border-b border-[#eee] flex items-center justify-between">
              <h2 className="font-semibold text-[#222]">Monthly Breakdown</h2>
              <span className="text-xs text-[#888]">{data.period.from} - {data.period.to}</span>
            </div>
            {!data.monthly || data.monthly.length === 0 ? (
              <p className="p-8 text-center text-[#888]">No monthly data for this period</p>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden sm:block">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#eee] bg-[#fafafa]">
                        <th className="text-left py-3 px-4 text-[#888] font-medium">Month</th>
                        <th className="text-right py-3 px-4 text-[#888] font-medium">Revenue</th>
                        <th className="text-right py-3 px-4 text-[#888] font-medium">Taxable Amount</th>
                        <th className="text-right py-3 px-4 text-[#888] font-medium">VAT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.monthly.map((m: any, i: number) => (
                        <tr key={i} className="border-b border-[#eee]/50 hover:bg-[#fafafa]">
                          <td className="py-3 px-4 font-medium text-[#333]">{m.month}</td>
                          <td className="py-3 px-4 text-right">{formatBDT(m.revenue)}</td>
                          <td className="py-3 px-4 text-right">{formatBDT(m.taxable)}</td>
                          <td className="py-3 px-4 text-right font-semibold">{formatBDT(m.vat)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden p-3 space-y-2">
                  {data.monthly.map((m: any, i: number) => (
                    <div key={i} className="border border-[#eee] rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#333]">{m.month}</p>
                        <p className="text-xs text-[#888]">Revenue: {formatBDT(m.revenue)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#888]">Taxable: {formatBDT(m.taxable)}</p>
                        <p className="text-sm font-semibold text-[#333]">VAT: {formatBDT(m.vat)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
