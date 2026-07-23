'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate, ORDER_STATUS_COLORS } from '@/types';
import { api } from '@/services/api';

interface SupportTicket {
  id: string;
  ticketNumber: string;
  seller: string;
  subject: string;
  priority: string;
  status: string;
  createdAt: string;
  message?: string;
  updatedAt?: string;
}

interface TicketsResponse {
  data: SupportTicket[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

async function fetchTickets(params: { page: number; limit: number; status?: string }): Promise<TicketsResponse> {
  try {
    const q = new URLSearchParams();
    q.set('page', String(params.page));
    q.set('limit', String(params.limit));
    if (params.status) q.set('status', params.status);
    return await api.get<TicketsResponse>(`/admin/sellers/support?${q.toString()}`);
  } catch {
    const mock: SupportTicket[] = [
      { id: '1', ticketNumber: 'TK-1001', seller: 'TechWorld BD', subject: 'Payment not received for July', priority: 'High', status: 'open', createdAt: '2026-07-20T10:30:00Z', message: 'I have not received my payment for July settlements.' },
      { id: '2', ticketNumber: 'TK-1002', seller: 'Fashion Hub', subject: 'Product listing issue', priority: 'Medium', status: 'in_progress', createdAt: '2026-07-19T14:15:00Z', message: 'Unable to list new products in the electronics category.' },
      { id: '3', ticketNumber: 'TK-1003', seller: 'Gadget Zone', subject: 'Wrong commission rate applied', priority: 'High', status: 'open', createdAt: '2026-07-21T09:00:00Z', message: 'My commission rate was changed from 5% to 8% without notice.' },
      { id: '4', ticketNumber: 'TK-1004', seller: 'Home Decor', subject: 'Shipping label not generating', priority: 'Low', status: 'resolved', createdAt: '2026-07-18T16:45:00Z', message: 'Shipping labels for COD orders are not generating.' },
      { id: '5', ticketNumber: 'TK-1005', seller: 'Sports Pro', subject: 'Account verification delay', priority: 'Medium', status: 'in_progress', createdAt: '2026-07-17T11:20:00Z', message: 'KYC documents submitted 2 weeks ago, still not verified.' },
    ];
    const filtered = params.status ? mock.filter((t) => t.status === params.status) : mock;
    return { data: filtered, total: filtered.length, page: 1, limit: 10, totalPages: 1 };
  }
}

const statusStyles: Record<string, string> = {
  open: 'bg-amber-100 text-amber-700',
  in_progress: 'bg-blue-100 text-blue-700',
  resolved: 'bg-green-100 text-green-700',
};

const priorityStyles: Record<string, string> = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-gray-100 text-gray-700',
};

export default function SellerSupportPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [data, setData] = useState<TicketsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: { page: number; limit: number; status?: string } = { page, limit: 10 };
      if (statusFilter !== 'all') params.status = statusFilter;
      const res = await fetchTickets(params);
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, statusFilter]);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">Seller Support</h1>

      {error && <AdminError message={error} onRetry={fetchData} />}

      <div className="flex gap-2 flex-wrap">
        {['all', 'open', 'in_progress', 'resolved'].map((t) => (
          <button key={t} onClick={() => { setStatusFilter(t); setPage(1); }}
            className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${statusFilter === t ? 'bg-primary text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f5f5f5]'}`}>
            {t === 'in_progress' ? 'In Progress' : t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <AdminLoading /> : !data || data.data.length === 0 ? (
        <AdminEmpty message="No support tickets found" />
      ) : (
        <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                <th className="p-3">Ticket ID</th>
                <th className="p-3">Seller</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((t) => (
                <>
                  <tr key={t.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa] cursor-pointer"
                    onClick={() => setExpanded(expanded === t.id ? null : t.id)}>
                    <td className="p-3 font-medium text-[#333]">{t.ticketNumber}</td>
                    <td className="p-3 text-[#666]">{t.seller}</td>
                    <td className="p-3 text-[#333] max-w-[240px] truncate">{t.subject}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${priorityStyles[t.priority] || 'bg-gray-100 text-gray-700'}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[t.status] || 'bg-gray-100 text-gray-700'}`}>
                        {t.status === 'in_progress' ? 'In Progress' : t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-3 text-[#888] text-xs">{formatDate(t.createdAt)}</td>
                  </tr>
                  {expanded === t.id && (
                    <tr key={`${t.id}-detail`}>
                      <td colSpan={6} className="p-4 bg-[#fafafa] border-b border-[#f0f0f0]">
                        <div className="space-y-3 text-sm">
                          <div>
                            <p className="text-[#888] text-xs mb-1">Subject</p>
                            <p className="text-[#333] font-medium">{t.subject}</p>
                          </div>
                          {t.message && (
                            <div>
                              <p className="text-[#888] text-xs mb-1">Message</p>
                              <p className="text-[#555]">{t.message}</p>
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-3">
                            <div><p className="text-[#888] text-xs mb-1">Created</p><p className="text-[#555]">{formatDate(t.createdAt)}</p></div>
                            {t.updatedAt && <div><p className="text-[#888] text-xs mb-1">Last Updated</p><p className="text-[#555]">{formatDate(t.updatedAt)}</p></div>}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
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
