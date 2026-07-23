'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate } from '@/types';
import { api } from '@/services/api';

interface Payout {
  id: string; seller: string; amount: number; method: string;
  accountNo: string; status: string; date: string; note?: string;
}

const tabs = ['All', 'Pending', 'Completed', 'Failed'] as const;

async function fetchPayouts(): Promise<Payout[]> {
  try {
    return await api.get<Payout[]>('/admin/payouts');
  } catch {
    return [
      { id: '1', seller: 'TechZone BD', amount: 45000, method: 'bkash', accountNo: '017******1234', status: 'pending', date: '2026-07-23' },
      { id: '2', seller: 'Fashion Hub', amount: 78200, method: 'nagad', accountNo: '018******5678', status: 'completed', date: '2026-07-22' },
      { id: '3', seller: 'Gadget World', amount: 32000, method: 'bank', accountNo: 'DBBL****1234', status: 'pending', date: '2026-07-22' },
      { id: '4', seller: 'Home Decor Ltd', amount: 156000, method: 'bkash', accountNo: '019******9012', status: 'completed', date: '2026-07-21' },
      { id: '5', seller: 'Book Nook', amount: 12500, method: 'nagad', accountNo: '016******3456', status: 'failed', date: '2026-07-20' },
      { id: '6', seller: 'Sports Club', amount: 67000, method: 'bank', accountNo: 'IBBL****5678', status: 'completed', date: '2026-07-19' },
      { id: '7', seller: 'Organic Foods', amount: 28000, method: 'bkash', accountNo: '017******7890', status: 'pending', date: '2026-07-19' },
      { id: '8', seller: 'Kids Corner', amount: 94000, method: 'nagad', accountNo: '018******2345', status: 'completed', date: '2026-07-18' },
    ];
  }
}

const statusStyles: Record<string, string> = {
  completed: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  failed: 'bg-red-100 text-red-700',
};

const methodIcons: Record<string, string> = { bkash: 'smartphone', nagad: 'smartphone', bank: 'account_balance' };

export default function PayoutsPage() {
  const [data, setData] = useState<Payout[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [page, setPage] = useState(1);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const perPage = 10;

  const load = async () => {
    setLoading(true); setError(null);
    try { setData(await fetchPayouts()); } catch (e) { setError(getErrorMessage(e)); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = activeTab === 'All' ? (data || []) : (data || []).filter((p) => p.status === activeTab.toLowerCase());
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleProcess = async (id: string) => {
    if (!confirm('Process this payout? This action cannot be undone.')) return;
    setConfirmId(id);
    try {
      await api.post(`/admin/payouts/${id}/process`);
      load();
    } catch (e) { alert(getErrorMessage(e, 'Failed to process payout')); }
    finally { setConfirmId(null); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Payouts</h1>
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }}
            className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${activeTab === tab ? 'bg-primary text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f5f5f5]'}`}>
            {tab}
          </button>
        ))}
      </div>

      {error && <AdminError message={error} onRetry={load} />}

      {loading ? <AdminLoading /> : filtered.length === 0 ? <AdminEmpty message="No payouts found" /> : (
        <>
          <div className="hidden sm:block bg-white rounded-xl border border-[#eee] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                  <th className="p-3">Payout ID</th>
                  <th className="p-3">Seller</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((p) => (
                  <tr key={p.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 font-mono text-xs text-[#888]">#{p.id.padStart(4, '0')}</td>
                    <td className="p-3 font-medium text-[#333]">{p.seller}</td>
                    <td className="p-3 font-medium">{formatBDT(p.amount)}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-[#888]">{methodIcons[p.method] || 'payments'}</span>
                        <span className="text-[#666] capitalize">{p.method}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[p.status] || 'bg-gray-100 text-gray-600'}`}>{p.status}</span>
                    </td>
                    <td className="p-3 text-[#888] text-xs">{formatDate(p.date)}</td>
                    <td className="p-3">
                      {p.status === 'pending' && (
                        <button onClick={() => handleProcess(p.id)} disabled={confirmId === p.id}
                          className="px-3 py-1 text-xs font-medium bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
                          {confirmId === p.id ? 'Processing...' : 'Process'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sm:hidden space-y-3">
            {paginated.map((p) => (
              <div key={p.id} className="bg-white rounded-xl border border-[#eee] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#333]">{p.seller}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[p.status] || 'bg-gray-100 text-gray-600'}`}>{p.status}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-[#222]">{formatBDT(p.amount)}</span>
                  <span className="text-[#888] capitalize">{p.method} · {formatDate(p.date)}</span>
                </div>
                {p.status === 'pending' && (
                  <button onClick={() => handleProcess(p.id)} disabled={confirmId === p.id}
                    className="w-full mt-2 px-3 py-1.5 text-xs font-medium bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
                    {confirmId === p.id ? 'Processing...' : 'Process Payout'}
                  </button>
                )}
              </div>
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} total={filtered.length} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
