'use client';

import { useState } from 'react';
import { useAdminPage } from '@/lib/api/hooks';
import { fetchCommissions } from '@/lib/api/admin';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate, ORDER_STATUS_COLORS } from '@/types';

function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

const statusStyles: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  PAID: 'bg-green-100 text-green-700',
};

export default function CommissionsPage() {
  const [statusFilter, setStatusFilter] = useState('ALL');

  const { data, loading, error, refetch, page, setPage } = useAdminPage(
    ({ page, limit }) => fetchCommissions({ page, limit }),
    [],
  );

  const filtered = data?.commissions?.filter((c) => statusFilter === 'ALL' || c.status === statusFilter) ?? [];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">Commissions</h1>

      {error && <AdminError message={error} onRetry={refetch} />}

      <div className="flex gap-2 flex-wrap">
        {['ALL', 'PENDING', 'PAID'].map((t) => (
          <button key={t} onClick={() => { setStatusFilter(t); setPage(1); }}
            className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${statusFilter === t ? 'bg-primary text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f5f5f5]'}`}>
            {t === 'ALL' ? 'All' : t.charAt(0) + t.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? <AdminLoading /> : filtered.length === 0 ? (
        <AdminEmpty message="No commission entries found" />
      ) : (
        <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                <th className="p-3">Seller</th>
                <th className="p-3">Order #</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Rate %</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                  <td className="p-3 font-medium text-[#333]">{c.seller?.name || '—'}</td>
                  <td className="p-3 text-[#666]">#{c.order?.orderNumber || '—'}</td>
                  <td className="p-3 text-[#333]">{formatBDT(c.amount)}</td>
                  <td className="p-3 text-[#666]">{c.rate}%</td>
                  <td className="p-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[c.status] || 'bg-gray-100 text-gray-700'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3 text-[#888] text-xs">{fmtDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && data.totalPages > 1 && (
        <Pagination page={page} totalPages={data.totalPages} total={data.total} onPageChange={setPage} />
      )}
    </div>
  );
}
