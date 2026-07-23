'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate, ORDER_STATUS_COLORS } from '@/types';
import { api } from '@/services/api';

interface WithdrawRequest {
  id: string;
  seller: string;
  amount: number;
  method: string;
  account: string;
  status: string;
  createdAt: string;
  note?: string;
}

interface WithdrawResponse {
  data: WithdrawRequest[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

async function fetchWithdrawals(params: { page: number; limit: number; status?: string }): Promise<WithdrawResponse> {
  try {
    const q = new URLSearchParams();
    q.set('page', String(params.page));
    q.set('limit', String(params.limit));
    if (params.status) q.set('status', params.status);
    return await api.get<WithdrawResponse>(`/admin/sellers/withdrawals?${q.toString()}`);
  } catch {
    return { data: [], total: 0, page: params.page, limit: params.limit, totalPages: 1 };
  }
}

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function WithdrawRequestsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [data, setData] = useState<WithdrawResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: { page: number; limit: number; status?: string } = { page, limit: 10 };
      if (statusFilter !== 'all') params.status = statusFilter;
      const res = await fetchWithdrawals(params);
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, statusFilter]);

  const handleAction = async () => {
    if (!confirmAction) return;
    try {
      await api.post(`/admin/sellers/withdrawals/${confirmAction.id}/${confirmAction.action}`, {});
      setConfirmAction(null);
      fetchData();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">Withdrawal Requests</h1>

      {error && <AdminError message={error} onRetry={fetchData} />}

      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'approved', 'rejected'].map((t) => (
          <button key={t} onClick={() => { setStatusFilter(t); setPage(1); }}
            className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${statusFilter === t ? 'bg-primary text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f5f5f5]'}`}>
            {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <AdminLoading /> : !data || data.data.length === 0 ? (
        <AdminEmpty message="No withdrawal requests found" />
      ) : (
        <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                <th className="p-3">Seller</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Method</th>
                <th className="p-3">Account</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((w) => (
                <tr key={w.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                  <td className="p-3 font-medium text-[#333]">{w.seller}</td>
                  <td className="p-3 text-[#333] font-medium">{formatBDT(w.amount)}</td>
                  <td className="p-3 text-[#666]">{w.method}</td>
                  <td className="p-3 text-[#666] font-mono">{w.account}</td>
                  <td className="p-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[w.status] || 'bg-gray-100 text-gray-700'}`}>
                      {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-3 text-[#888] text-xs">{formatDate(w.createdAt)}</td>
                  <td className="p-3">
                    {w.status === 'pending' && (
                      <div className="flex gap-1">
                        <button onClick={() => setConfirmAction({ id: w.id, action: 'approve' })}
                          className="text-xs bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600">Approve</button>
                        <button onClick={() => setConfirmAction({ id: w.id, action: 'reject' })}
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600">Reject</button>
                      </div>
                    )}
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

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setConfirmAction(null)}>
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-semibold text-[#222]">Confirm {confirmAction.action === 'approve' ? 'Approval' : 'Rejection'}</h2>
            <p className="text-sm text-[#666]">Are you sure you want to <strong>{confirmAction.action}</strong> this withdrawal request?</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmAction(null)}
                className="px-4 py-2 text-sm text-[#666] border border-[#ddd] rounded-lg hover:bg-[#f5f5f5]">Cancel</button>
              <button onClick={handleAction}
                className={`px-4 py-2 text-sm text-white rounded-lg ${confirmAction.action === 'approve' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}>
                {confirmAction.action === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
