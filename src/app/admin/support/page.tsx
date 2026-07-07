'use client';

import { useState, useCallback } from 'react';
import { useAdminData, useAdminPage } from '@/lib/api/hooks';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import {
  fetchSupportTickets,
  fetchSupportTicket,
  replyToSupportTicket,
  updateSupportTicket,
  type SupportTicket,
} from '@/lib/api/admin';
import { getErrorMessage } from '@/lib/error-helper';

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(d: string): string {
  return new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const priorityStyles: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-700',
  MEDIUM: 'bg-blue-100 text-blue-700',
  HIGH: 'bg-orange-100 text-orange-700',
  URGENT: 'bg-red-100 text-red-700',
};

const statusStyles: Record<string, string> = {
  OPEN: 'bg-green-100 text-green-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  RESOLVED: 'bg-gray-100 text-gray-700',
  CLOSED: 'bg-gray-100 text-gray-500',
};

export default function SupportPage() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const { data: listData, loading, error, refetch, page, setPage } = useAdminPage(
    ({ page, limit }) => fetchSupportTickets({
      page,
      limit,
      status: statusFilter === 'ALL' ? undefined : statusFilter,
    }),
    [statusFilter],
  );

  const { data: ticket, loading: loadingTicket, refetch: refetchTicket } = useAdminData(
    () => (selectedId ? fetchSupportTicket(selectedId) : Promise.resolve(null as unknown as SupportTicket)),
    [selectedId],
  );

  const stats = {
    open: listData?.tickets?.filter((t) => t.status === 'OPEN').length || 0,
    inProgress: listData?.tickets?.filter((t) => t.status === 'IN_PROGRESS').length || 0,
    resolved: listData?.tickets?.filter((t) => t.status === 'RESOLVED').length || 0,
  };

  const handleSendReply = useCallback(async () => {
    if (!selectedId || !replyText.trim()) return;
    try {
      await replyToSupportTicket(selectedId, replyText.trim());
      setReplyText('');
      refetchTicket();
      refetch();
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to send reply'));
    }
  }, [selectedId, replyText, refetchTicket, refetch]);

  const handleStatusChange = useCallback(async (status: string) => {
    if (!selectedId) return;
    try {
      await updateSupportTicket(selectedId, { status });
      refetchTicket();
      refetch();
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to update ticket'));
    }
  }, [selectedId, refetchTicket, refetch]);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">Support Tickets</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#eee]">
          <p className="text-2xl font-bold text-green-600">{stats.open}</p>
          <p className="text-sm text-[#888] mt-1">Open Tickets</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#eee]">
          <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
          <p className="text-sm text-[#888] mt-1">In Progress</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#eee]">
          <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
          <p className="text-sm text-[#888] mt-1">Resolved</p>
        </div>
      </div>

      {error && <AdminError message={error} onRetry={refetch} />}

      <div className="flex gap-2 flex-wrap">
        {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((t) => (
          <button key={t} onClick={() => { setStatusFilter(t); setPage(1); }}
            className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${statusFilter === t ? 'bg-primary text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f5f5f5]'}`}>
            {t === 'ALL' ? 'All' : t.charAt(0) + t.slice(1).toLowerCase().replace('_', ' ')}
          </button>
        ))}
      </div>

      {selectedId && ticket ? (
        <div className="bg-white rounded-xl border border-[#eee]">
          <div className="p-5 border-b border-[#eee] flex items-center justify-between">
            <div>
              <button onClick={() => setSelectedId(null)} className="text-sm text-primary hover:underline mb-1">&larr; Back to Tickets</button>
              <h2 className="text-lg font-semibold text-[#222]">{ticket.subject}</h2>
              <p className="text-sm text-[#888]">{ticket.id.slice(-8)} by {ticket.user?.name || 'Unknown'}</p>
            </div>
            <div className="flex items-center gap-2">
              {ticket.status !== 'CLOSED' && (
                <select value={ticket.status} onChange={(e) => handleStatusChange(e.target.value)}
                  className="border border-[#ddd] rounded-lg px-3 py-1.5 text-sm outline-none bg-white">
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              )}
              {ticket.category && (
                <span className="text-xs bg-[#f5f5f5] text-[#666] px-2 py-1 rounded-md">{ticket.category}</span>
              )}
            </div>
          </div>

          {ticket.description && (
            <div className="px-5 py-3 border-b border-[#eee] bg-[#fafafa]">
              <p className="text-sm text-[#555]">{ticket.description}</p>
            </div>
          )}

          <div className="p-5 space-y-4 max-h-[400px] overflow-y-auto">
            {loadingTicket ? (
              <div className="text-center text-[#888] py-4">
                <span className="material-symbols-outlined animate-spin align-middle mr-2">progress_activity</span>Loading...
              </div>
            ) : !ticket.messages || ticket.messages.length === 0 ? (
              <p className="text-sm text-[#888] text-center py-4">No messages yet. Write a reply below.</p>
            ) : (
              ticket.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.user?.name === 'Admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-lg text-sm ${msg.user?.name === 'Admin' ? 'bg-primary text-white' : 'bg-[#f5f5f5] text-[#333]'}`}>
                    <p className="text-xs font-semibold mb-1 opacity-70">{msg.user?.name || 'Unknown'}</p>
                    <p>{msg.content}</p>
                    <p className="text-xs mt-1 opacity-60">{formatDateTime(msg.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {ticket.status !== 'CLOSED' && (
            <div className="p-5 border-t border-[#eee]">
              <div className="flex gap-3">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  rows={2}
                  className="flex-1 border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none resize-none"
                />
                <button onClick={handleSendReply} disabled={!replyText.trim()}
                  className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 self-end disabled:opacity-50">Send</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {loading ? (
            <AdminLoading />
          ) : !listData?.tickets || listData.tickets.length === 0 ? (
            <AdminEmpty message="No tickets found" />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden sm:block bg-white rounded-xl border border-[#eee] overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                      <th className="p-3">ID</th>
                      <th className="p-3">User</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Priority</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listData.tickets.map((t) => (
                      <tr key={t.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa] cursor-pointer" onClick={() => setSelectedId(t.id)}>
                        <td className="p-3 font-mono text-xs font-medium text-[#333]">{t.id.slice(-8)}</td>
                        <td className="p-3 text-[#555]">{t.user?.name || 'Unknown'}</td>
                        <td className="p-3 text-[#444] max-w-[200px] truncate">{t.subject}</td>
                        <td className="p-3 text-[#666]">{t.category || '—'}</td>
                        <td className="p-3"><span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${priorityStyles[t.priority] || 'bg-gray-100 text-gray-700'}`}>{t.priority}</span></td>
                        <td className="p-3"><span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[t.status] || 'bg-gray-100 text-gray-700'}`}>{t.status === 'IN_PROGRESS' ? 'In Progress' : t.status.charAt(0) + t.status.slice(1).toLowerCase()}</span></td>
                        <td className="p-3 text-[#888] text-xs">{formatDate(t.createdAt)}</td>
                        <td className="p-3"><span className="material-symbols-outlined text-[18px] text-[#666] cursor-pointer">visibility</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="sm:hidden space-y-3">
                {listData.tickets.map((t) => (
                  <div key={t.id} onClick={() => setSelectedId(t.id)} className="bg-white rounded-xl border border-[#eee] p-3 space-y-2 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-medium text-[#333]">#{t.id.slice(-8)}</span>
                      <div className="flex gap-1">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${priorityStyles[t.priority] || 'bg-gray-100 text-gray-700'}`}>{t.priority}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${statusStyles[t.status] || 'bg-gray-100 text-gray-700'}`}>{t.status === 'IN_PROGRESS' ? 'In Progress' : t.status.charAt(0) + t.status.slice(1).toLowerCase()}</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-[#333]">{t.subject}</p>
                    <div className="flex items-center justify-between text-xs text-[#888]">
                      <span>{t.user?.name || 'Unknown'} {t.category ? `· ${t.category}` : ''}</span>
                      <span>{formatDate(t.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {listData && listData.totalPages > 1 && (
            <Pagination page={page} totalPages={listData.totalPages} total={listData.total} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}
