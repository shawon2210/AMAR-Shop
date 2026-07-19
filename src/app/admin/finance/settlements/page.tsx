'use client';

import { useState } from 'react';
import { useAdminPage } from '@/lib/api/hooks';
import { fetchSettlements, processSettlement } from '@/lib/api/admin';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';

function formatBDT(v: number): string {
  return `৳${Math.round(v).toLocaleString('en-IN')}`;
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

const statusStyles: Record<string, string> = {
  COMPLETED: 'bg-green-100 text-green-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  PENDING: 'bg-amber-100 text-amber-700',
  FAILED: 'bg-red-100 text-red-700',
};

export default function SettlementsPage() {
  const { data, loading, error, refetch, page, setPage } = useAdminPage(
    ({ page, limit }) => fetchSettlements({ page, limit }),
    [],
  );

  const handleProcess = async (id: string, status: string) => {
    try {
      await processSettlement(id, { status });
      refetch();
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to process settlement'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Settlement Management</h1>
        <a href="/admin/finance" className="flex items-center gap-1.5 px-3 py-2 border border-[#ddd] text-[#666] rounded-lg text-sm font-medium hover:bg-[#f5f5f5]">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Finance
        </a>
      </div>

      {error && <AdminError message={error} onRetry={refetch} />}

      {loading ? (
        <AdminLoading />
      ) : !data || data.settlements.length === 0 ? (
        <AdminEmpty message="No settlements found" />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block bg-white rounded-xl border border-[#eee] overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#eee] bg-[#fafafa]">
                  <th className="text-left py-3 px-4 text-[#888] font-medium whitespace-nowrap">Settlement #</th>
                  <th className="text-left py-3 px-4 text-[#888] font-medium whitespace-nowrap">Seller</th>
                  <th className="text-left py-3 px-4 text-[#888] font-medium whitespace-nowrap hidden lg:table-cell">Period</th>
                  <th className="text-right py-3 px-4 text-[#888] font-medium whitespace-nowrap">Gross</th>
                  <th className="text-right py-3 px-4 text-[#888] font-medium whitespace-nowrap">Commission</th>
                  <th className="text-right py-3 px-4 text-[#888] font-medium whitespace-nowrap">Net</th>
                  <th className="text-left py-3 px-4 text-[#888] font-medium whitespace-nowrap">Status</th>
                  <th className="text-left py-3 px-4 text-[#888] font-medium whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.settlements.map((s) => (
                  <tr key={s.id} className="border-b border-[#eee]/50 hover:bg-[#fafafa]">
                    <td className="py-3 px-4 font-medium text-[#333] whitespace-nowrap">{s.settlementNumber}</td>
                    <td className="py-3 px-4 text-[#555] whitespace-nowrap">{s.seller?.name || 'N/A'}</td>
                    <td className="py-3 px-4 text-[#666] whitespace-nowrap hidden lg:table-cell">{formatDate(s.periodStart)} - {formatDate(s.periodEnd)}</td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">{formatBDT(s.grossAmount)}</td>
                    <td className="py-3 px-4 text-right text-red-500 whitespace-nowrap">-{formatBDT(s.commission)}</td>
                    <td className="py-3 px-4 text-right font-semibold whitespace-nowrap">{formatBDT(s.netAmount)}</td>
                    <td className="py-3 px-4 whitespace-nowrap"><span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[s.status] || 'bg-gray-100 text-gray-700'}`}>{s.status}</span></td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {s.status === 'PENDING' && <button onClick={() => handleProcess(s.id, 'PROCESSING')} className="text-xs bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600">Process</button>}
                      {s.status === 'PROCESSING' && <button onClick={() => handleProcess(s.id, 'COMPLETED')} className="text-xs bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600">Complete</button>}
                      {(s.status === 'COMPLETED' || s.status === 'FAILED') && <span className="text-xs text-[#888]">Done</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {data.settlements.map((s) => (
              <div key={s.id} className="bg-white rounded-xl border border-[#eee] p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-[#333]">{s.settlementNumber}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${statusStyles[s.status] || 'bg-gray-100 text-gray-700'}`}>{s.status}</span>
                </div>
                <div className="text-xs text-[#666]">
                  <span>{s.seller?.name || 'N/A'} · {formatDate(s.periodStart)} - {formatDate(s.periodEnd)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#888]">Gross: {formatBDT(s.grossAmount)}</span>
                    <span className="text-red-500 ml-2">-{formatBDT(s.commission)}</span>
                  </div>
                  <span className="font-semibold text-[#333]">{formatBDT(s.netAmount)}</span>
                </div>
                <div className="flex gap-2 pt-1">
                  {s.status === 'PENDING' && <button onClick={() => handleProcess(s.id, 'PROCESSING')} className="flex-1 text-xs bg-blue-500 text-white py-1.5 rounded-md font-medium hover:bg-blue-600">Process</button>}
                  {s.status === 'PROCESSING' && <button onClick={() => handleProcess(s.id, 'COMPLETED')} className="flex-1 text-xs bg-green-500 text-white py-1.5 rounded-md font-medium hover:bg-green-600">Complete</button>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {data && data.totalPages > 1 && (
        <Pagination page={page} totalPages={data.totalPages} total={data.total} onPageChange={setPage} />
      )}
    </div>
  );
}
