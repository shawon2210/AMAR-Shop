'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate } from '@/types';
import { api } from '@/services/api';

interface PushNotification {
  id: string; title: string; message: string; target: string;
  sentCount: number; status: string; createdAt: string;
}

const defaultForm = { title: '', message: '', target: 'ALL' };

async function fetchPushNotifications(): Promise<PushNotification[]> {
  try { return await api.get<PushNotification[]>('/admin/push-notifications'); }
  catch {
    return [
      { id: '1', title: 'Flash Sale Live!', message: 'Up to 70% off on thousands of items. Shop now!', target: 'ALL', sentCount: 25000, status: 'sent', createdAt: '2026-07-23' },
      { id: '2', title: 'Order Delivered', message: 'Your order #ORD-1024 has been delivered. Rate your experience!', target: 'USERS', sentCount: 520, status: 'sent', createdAt: '2026-07-22' },
      { id: '3', title: 'New Seller Tips', message: 'Boost your sales with our new seller tools.', target: 'SELLERS', sentCount: 1500, status: 'sent', createdAt: '2026-07-21' },
      { id: '4', title: 'Weekend Offer', message: 'Special weekend discounts just for you!', target: 'ALL', sentCount: 0, status: 'draft', createdAt: '2026-07-20' },
      { id: '5', title: 'Payment Received', message: 'Your withdrawal request has been processed.', target: 'SELLERS', sentCount: 340, status: 'sent', createdAt: '2026-07-19' },
    ];
  }
}

export default function PushNotificationsPage() {
  const [data, setData] = useState<PushNotification[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSend, setShowSend] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const load = async () => {
    setLoading(true); setError(null);
    try { setData(await fetchPushNotifications()); } catch (e) { setError(getErrorMessage(e)); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const items = data || [];
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const paginated = items.slice((page - 1) * perPage, page * perPage);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return;
    setSubmitting(true);
    try {
      await api.post('/admin/push-notifications/send', form);
      setForm(defaultForm); setShowSend(false); load();
    } catch (err) { alert(getErrorMessage(err, 'Failed to send notification')); }
    finally { setSubmitting(false); }
  };

  const targetLabels: Record<string, string> = { ALL: 'All Users', USERS: 'Users', SELLERS: 'Sellers' };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Push Notifications</h1>
        <button onClick={() => setShowSend(!showSend)}
          className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">+ Send Notification</button>
      </div>

      {error && <AdminError message={error} onRetry={load} />}

      {showSend && (
        <form onSubmit={handleSend} className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">Send Push Notification</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm text-[#666] mb-1">Title *</label>
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-[#666] mb-1">Message *</label>
              <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                rows={4} className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none resize-none" required />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Target Audience</label>
              <select value={form.target} onChange={(e) => setForm((f) => ({ ...f, target: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none">
                <option value="ALL">All Users</option>
                <option value="USERS">Users Only</option>
                <option value="SELLERS">Sellers Only</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setShowSend(false)} className="px-4 py-2 text-sm text-[#666] hover:bg-[#f5f5f5] rounded-lg">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
              {submitting ? 'Sending...' : 'Send Now'}
            </button>
          </div>
        </form>
      )}

      {loading ? <AdminLoading /> : paginated.length === 0 ? <AdminEmpty message="No notifications found" /> : (
        <>
          <div className="hidden sm:block bg-white rounded-xl border border-[#eee] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                  <th className="p-3">Title</th>
                  <th className="p-3">Message</th>
                  <th className="p-3">Target</th>
                  <th className="p-3">Sent</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((n) => (
                  <tr key={n.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 font-medium text-[#333]">{n.title}</td>
                    <td className="p-3 text-[#666] max-w-[250px] truncate">{n.message}</td>
                    <td className="p-3 text-[#666] text-xs">{targetLabels[n.target] || n.target}</td>
                    <td className="p-3 text-[#666]">{n.sentCount.toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${n.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{n.status}</span>
                    </td>
                    <td className="p-3 text-[#888] text-xs">{formatDate(n.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sm:hidden space-y-3">
            {paginated.map((n) => (
              <div key={n.id} className="bg-white rounded-xl border border-[#eee] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#333]">{n.title}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${n.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{n.status}</span>
                </div>
                <p className="text-xs text-[#888] truncate">{n.message}</p>
                <div className="text-xs text-[#666] flex justify-between">
                  <span>{targetLabels[n.target] || n.target}</span>
                  <span>{n.sentCount.toLocaleString('en-IN')} sent</span>
                </div>
              </div>
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} total={items.length} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
