'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate } from '@/types';
import { api } from '@/services/api';

interface EmailCampaign {
  id: string; name: string; subject: string; recipients: number;
  sent: number; opened: number; clicked: number; status: string; createdAt: string;
}

const defaultForm = { name: '', subject: '', content: '', scheduleDate: '' };

async function fetchEmailCampaigns(): Promise<EmailCampaign[]> {
  try { return await api.get<EmailCampaign[]>('/admin/email-campaigns'); }
  catch { return []; }
}

export default function EmailCampaignsPage() {
  const [data, setData] = useState<EmailCampaign[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const load = async () => {
    setLoading(true); setError(null);
    try { setData(await fetchEmailCampaigns()); } catch (e) { setError(getErrorMessage(e)); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const items = data || [];
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const paginated = items.slice((page - 1) * perPage, page * perPage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.subject.trim()) return;
    setSubmitting(true);
    try {
      await api.post('/admin/email-campaigns', { ...form, scheduleDate: form.scheduleDate || undefined });
      setForm(defaultForm); setShowCreate(false); load();
    } catch (err) { alert(getErrorMessage(err, 'Failed to create campaign')); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this campaign?')) return;
    try { await api.delete(`/admin/email-campaigns/${id}`); load(); }
    catch (err) { alert(getErrorMessage(err, 'Failed to delete campaign')); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Email Campaigns</h1>
        <button onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">+ New Campaign</button>
      </div>

      {error && <AdminError message={error} onRetry={load} />}

      {showCreate && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">Create Email Campaign</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#666] mb-1">Campaign Name *</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" required />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Subject Line *</label>
              <input value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-[#666] mb-1">Email Content (HTML)</label>
              <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                rows={5} className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none resize-none font-mono" />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Schedule Date</label>
              <input type="datetime-local" value={form.scheduleDate} onChange={(e) => setForm((f) => ({ ...f, scheduleDate: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-[#666] hover:bg-[#f5f5f5] rounded-lg">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
              {submitting ? 'Creating...' : 'Create Campaign'}
            </button>
          </div>
        </form>
      )}

      {loading ? <AdminLoading /> : paginated.length === 0 ? <AdminEmpty message="No email campaigns found" /> : (
        <>
          <div className="hidden sm:block bg-white rounded-xl border border-[#eee] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                  <th className="p-3">Name</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Recipients</th>
                  <th className="p-3">Sent</th>
                  <th className="p-3">Opened</th>
                  <th className="p-3">Clicked</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((c) => (
                  <tr key={c.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 font-medium text-[#333]">{c.name}</td>
                    <td className="p-3 text-[#666] max-w-[200px] truncate">{c.subject}</td>
                    <td className="p-3 text-[#666]">{c.recipients.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-[#666]">{c.sent.toLocaleString('en-IN')}</td>
                    <td className="p-3">{c.opened.toLocaleString('en-IN')} {c.sent > 0 ? <span className="text-[#888] text-xs">({Math.round((c.opened / c.sent) * 100)}%)</span> : ''}</td>
                    <td className="p-3">{c.clicked.toLocaleString('en-IN')} {c.opened > 0 ? <span className="text-[#888] text-xs">({Math.round((c.clicked / c.opened) * 100)}%)</span> : ''}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${c.status === 'completed' ? 'bg-green-100 text-green-700' : c.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{c.status}</span>
                    </td>
                    <td className="p-3">
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]">
                        <span className="material-symbols-outlined text-[18px] text-[#666]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sm:hidden space-y-3">
            {paginated.map((c) => (
              <div key={c.id} className="bg-white rounded-xl border border-[#eee] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#333]">{c.name}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${c.status === 'completed' ? 'bg-green-100 text-green-700' : c.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{c.status}</span>
                </div>
                <p className="text-xs text-[#888] truncate">{c.subject}</p>
                <div className="text-xs text-[#666] flex justify-between">
                  <span>{c.sent.toLocaleString('en-IN')} sent</span>
                  <span>{c.opened.toLocaleString('en-IN')} opened</span>
                  <span>{c.clicked.toLocaleString('en-IN')} clicked</span>
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
