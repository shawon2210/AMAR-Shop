'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate, ORDER_STATUS_COLORS } from '@/types';
import { api } from '@/services/api';

interface Refund {
  id: string;
  refundNumber: string;
  orderNumber: string;
  customer: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
  reason?: string;
}

interface RefundsResponse {
  data: Refund[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

async function fetchRefunds(params: { page: number; limit: number; status?: string }): Promise<RefundsResponse> {
  try {
    const q = new URLSearchParams();
    q.set('page', String(params.page));
    q.set('limit', String(params.limit));
    if (params.status) q.set('status', params.status);
    return await api.get<RefundsResponse>(`/admin/refunds?${q.toString()}`);
  } catch {
    return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
  }
}

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
};

export default function RefundsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [data, setData] = useState<RefundsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Refund | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: { page: number; limit: number; status?: string } = { page, limit: 10 };
      if (statusFilter !== 'all') params.status = statusFilter;
      const res = await fetchRefunds(params);
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, statusFilter]);

  const handleProcess = async (id: string) => {
    try {
      await api.post(`/admin/refunds/${id}/process`, {});
      fetchData();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">Refunds</h1>

      {error && <AdminError message={error} onRetry={fetchData} />}

      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'completed', 'failed'].map((tab) => (
          <button key={tab} onClick={() => { setStatusFilter(tab); setPage(1); }}
            className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${statusFilter === tab ? 'bg-primary text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f5f5f5]'}`}>
            {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <AdminLoading /> : !data || data.data.length === 0 ? (
        <AdminEmpty message="No refunds found" />
      ) : (
        <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                <th className="p-3">Refund ID</th>
                <th className="p-3">Order #</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Method</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((r) => (
                <tr key={r.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                  <td className="p-3 font-medium text-[#333]">{r.refundNumber}</td>
                  <td className="p-3 text-[#666]">#{r.orderNumber}</td>
                  <td className="p-3 text-[#333]">{r.customer}</td>
                  <td className="p-3 text-[#333]">{formatBDT(r.amount)}</td>
                  <td className="p-3 text-[#666]">{r.method}</td>
                  <td className="p-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[r.status] || 'bg-gray-100 text-gray-700'}`}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-3 text-[#888] text-xs">{formatDate(r.createdAt)}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button onClick={() => setSelected(r)}
                        className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="View details">
                        <span className="material-symbols-outlined text-[18px] text-[#666]">visibility</span>
                      </button>
                      {r.status === 'pending' && (
                        <button onClick={() => handleProcess(r.id)}
                          className="text-xs bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600">Process</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && data.totalPages > 1 && (
        <Pagination page={page} totalPages={data.totalPages} total={data.total} onPageChange={setPage} />
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[#222]">Refund Details</h2>
              <button onClick={() => setSelected(null)} className="p-1 hover:bg-[#f5f5f5] rounded-lg">
                <span className="material-symbols-outlined text-[#888]">close</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-[#888] text-xs">Refund ID</p><p className="text-[#333] font-medium">{selected.refundNumber}</p></div>
              <div><p className="text-[#888] text-xs">Order #</p><p className="text-[#333]">#{selected.orderNumber}</p></div>
              <div><p className="text-[#888] text-xs">Customer</p><p className="text-[#333]">{selected.customer}</p></div>
              <div><p className="text-[#888] text-xs">Amount</p><p className="text-[#333]">{formatBDT(selected.amount)}</p></div>
              <div><p className="text-[#888] text-xs">Method</p><p className="text-[#333]">{selected.method}</p></div>
              <div><p className="text-[#888] text-xs">Status</p>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[selected.status] || 'bg-gray-100 text-gray-700'}`}>
                  {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
                </span>
              </div>
              <div className="col-span-2"><p className="text-[#888] text-xs">Date</p><p className="text-[#333]">{formatDate(selected.createdAt)}</p></div>
              {selected.reason && <div className="col-span-2"><p className="text-[#888] text-xs">Reason</p><p className="text-[#333]">{selected.reason}</p></div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
