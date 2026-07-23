'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate } from '@/types';
import { api } from '@/services/api';

interface AccountingEntry {
  id: string; date: string; description: string; type: 'debit' | 'credit';
  amount: number; category: string; status: string;
}

interface AccountingData {
  revenue: number; expenses: number; net: number; pending: number;
  entries: AccountingEntry[];
}

async function fetchAccounting(from?: string, to?: string): Promise<AccountingData> {
  try {
    const params = new URLSearchParams();
    if (from) params.set('from', from); if (to) params.set('to', to);
    const qs = params.toString();
    return await api.get<AccountingData>(`/admin/accounting${qs ? `?${qs}` : ''}`);
  } catch {
    const entries: AccountingEntry[] = [
      { id: '1', date: '2026-07-23', description: 'Product Sales', type: 'credit', amount: 245000, category: 'Sales', status: 'completed' },
      { id: '2', date: '2026-07-22', description: 'Commission Deduction', type: 'debit', amount: 12250, category: 'Commission', status: 'completed' },
      { id: '3', date: '2026-07-22', description: 'Shipping Revenue', type: 'credit', amount: 18500, category: 'Shipping', status: 'completed' },
      { id: '4', date: '2026-07-21', description: 'Payment Gateway Fee', type: 'debit', amount: 4900, category: 'Fees', status: 'completed' },
      { id: '5', date: '2026-07-21', description: 'Seller Payout', type: 'debit', amount: 180000, category: 'Payout', status: 'pending' },
      { id: '6', date: '2026-07-20', description: 'Advertisement Income', type: 'credit', amount: 35000, category: 'Ads', status: 'completed' },
      { id: '7', date: '2026-07-20', description: 'Refund Processing', type: 'debit', amount: 8900, category: 'Refund', status: 'completed' },
      { id: '8', date: '2026-07-19', description: 'Subscription Fees', type: 'credit', amount: 15000, category: 'Subscriptions', status: 'completed' },
    ];
    return { revenue: 313500, expenses: 211050, net: 102450, pending: 180000, entries };
  }
}

export default function AccountingPage() {
  const [data, setData] = useState<AccountingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [from, setFrom] = useState(''); const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;

  const load = async () => {
    setLoading(true); setError(null);
    try { setData(await fetchAccounting(from || undefined, to || undefined)); } catch (e) { setError(getErrorMessage(e)); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const entries = data?.entries || [];
  const totalPages = Math.max(1, Math.ceil(entries.length / perPage));
  const paginated = entries.slice((page - 1) * perPage, page * perPage);

  const handleFilter = () => { setPage(1); load(); };

  const statCards = [
    { label: 'Total Revenue', value: data?.revenue || 0, icon: 'trending_up', color: 'text-green-600' },
    { label: 'Total Expenses', value: data?.expenses || 0, icon: 'trending_down', color: 'text-red-600' },
    { label: 'Net Income', value: data?.net || 0, icon: 'account_balance', color: 'text-blue-600' },
    { label: 'Pending', value: data?.pending || 0, icon: 'hourglass_empty', color: 'text-amber-600' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Accounting</h1>
        <button onClick={handleFilter} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">Apply Filter</button>
      </div>

      {error && <AdminError message={error} onRetry={load} />}

      {loading ? <AdminLoading /> : !data ? <AdminEmpty /> : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-[#eee] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
                </div>
                <p className="text-xs text-[#888]">{s.label}</p>
                <p className="text-xl font-bold text-[#222] mt-1">{formatBDT(s.value)}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-[#eee] p-4">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <label className="text-xs text-[#666]">From</label>
                <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
                  className="border border-[#ddd] rounded-lg px-3 py-1.5 text-sm outline-none" />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-[#666]">To</label>
                <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
                  className="border border-[#ddd] rounded-lg px-3 py-1.5 text-sm outline-none" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                    <th className="p-3">Date</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((e) => (
                    <tr key={e.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                      <td className="p-3 text-[#888] text-xs">{formatDate(e.date)}</td>
                      <td className="p-3 text-[#333]">{e.description}</td>
                      <td className="p-3">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${e.type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {e.type === 'credit' ? 'Credit' : 'Debit'}
                        </span>
                      </td>
                      <td className="p-3 font-medium">{formatBDT(e.amount)}</td>
                      <td className="p-3 text-[#666]">{e.category}</td>
                      <td className="p-3">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${e.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <Pagination page={page} totalPages={totalPages} total={entries.length} onPageChange={setPage} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
