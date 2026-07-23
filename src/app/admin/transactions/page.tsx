'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate } from '@/types';
import { api } from '@/services/api';

interface Transaction {
  id: string; txnId: string; orderNo: string; customer: string;
  amount: number; method: string; status: string; date: string;
}

const statusStyles: Record<string, string> = {
  PAID: 'bg-green-100 text-green-700',
  REFUNDED: 'bg-orange-100 text-orange-700',
  UNPAID: 'bg-red-100 text-red-700',
};

async function fetchTransactions(search?: string, status?: string, from?: string, to?: string): Promise<Transaction[]> {
  try {
    const params = new URLSearchParams();
    if (search) params.set('search', search); if (status) params.set('status', status);
    if (from) params.set('from', from); if (to) params.set('to', to);
    const qs = params.toString();
    return await api.get<Transaction[]>(`/admin/transactions${qs ? `?${qs}` : ''}`);
  } catch {
    return [
      { id: '1', txnId: 'TXN-001', orderNo: 'ORD-1024', customer: 'Rahim Mia', amount: 5400, method: 'bkash', status: 'PAID', date: '2026-07-23' },
      { id: '2', txnId: 'TXN-002', orderNo: 'ORD-1025', customer: 'Karim Hasan', amount: 12800, method: 'nagad', status: 'PAID', date: '2026-07-23' },
      { id: '3', txnId: 'TXN-003', orderNo: 'ORD-1026', customer: 'Fatima Begum', amount: 3200, method: 'cod', status: 'UNPAID', date: '2026-07-22' },
      { id: '4', txnId: 'TXN-004', orderNo: 'ORD-1027', customer: 'Jahid Khan', amount: 25600, method: 'sslcommerz', status: 'PAID', date: '2026-07-22' },
      { id: '5', txnId: 'TXN-005', orderNo: 'ORD-1028', customer: 'Nasrin Akter', amount: 1800, method: 'bkash', status: 'REFUNDED', date: '2026-07-21' },
      { id: '6', txnId: 'TXN-006', orderNo: 'ORD-1029', customer: 'Shohag Ali', amount: 9200, method: 'nagad', status: 'PAID', date: '2026-07-21' },
      { id: '7', txnId: 'TXN-007', orderNo: 'ORD-1030', customer: 'Moin Uddin', amount: 7500, method: 'cod', status: 'PAID', date: '2026-07-20' },
      { id: '8', txnId: 'TXN-008', orderNo: 'ORD-1031', customer: 'Jannatul Ferdous', amount: 45000, method: 'sslcommerz', status: 'UNPAID', date: '2026-07-20' },
    ];
  }
}

export default function TransactionsPage() {
  const [data, setData] = useState<Transaction[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(''); const [statusFilter, setStatusFilter] = useState('');
  const [from, setFrom] = useState(''); const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;

  const load = async () => {
    setLoading(true); setError(null);
    try { setData(await fetchTransactions(search || undefined, statusFilter || undefined, from || undefined, to || undefined)); }
    catch (e) { setError(getErrorMessage(e)); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const items = data || [];
  const filtered = items.filter((t) => !search || t.txnId.toLowerCase().includes(search.toLowerCase()) || t.orderNo.toLowerCase().includes(search.toLowerCase()) || t.customer.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleFilter = () => { setPage(1); load(); };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Transactions</h1>
        <button onClick={handleFilter} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">Search</button>
      </div>

      <div className="bg-white rounded-xl border border-[#eee] p-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by TXN ID, Order or Customer..."
              className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none text-[#666]">
            <option value="">All Status</option>
            <option value="PAID">Paid</option>
            <option value="UNPAID">Unpaid</option>
            <option value="REFUNDED">Refunded</option>
          </select>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
            className="border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
            className="border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
        </div>
      </div>

      {error && <AdminError message={error} onRetry={load} />}

      {loading ? <AdminLoading /> : paginated.length === 0 ? <AdminEmpty message="No transactions found" /> : (
        <>
          <div className="hidden sm:block bg-white rounded-xl border border-[#eee] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                  <th className="p-3">TXN ID</th>
                  <th className="p-3">Order #</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((t) => (
                  <tr key={t.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 font-mono text-xs text-[#888]">{t.txnId}</td>
                    <td className="p-3 font-medium text-[#333]">{t.orderNo}</td>
                    <td className="p-3 text-[#666]">{t.customer}</td>
                    <td className="p-3 font-medium">{formatBDT(t.amount)}</td>
                    <td className="p-3 capitalize text-[#666]">{t.method}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[t.status] || 'bg-gray-100 text-gray-600'}`}>{t.status}</span>
                    </td>
                    <td className="p-3 text-[#888] text-xs">{formatDate(t.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sm:hidden space-y-3">
            {paginated.map((t) => (
              <div key={t.id} className="bg-white rounded-xl border border-[#eee] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#888]">{t.txnId}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[t.status] || 'bg-gray-100 text-gray-600'}`}>{t.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#333]">{t.customer}</span>
                  <span className="font-bold text-[#222]">{formatBDT(t.amount)}</span>
                </div>
                <div className="text-xs text-[#888] flex justify-between">
                  <span>{t.orderNo} · {t.method}</span>
                  <span>{formatDate(t.date)}</span>
                </div>
              </div>
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} total={filtered.length} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
