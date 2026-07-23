'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate } from '@/types';
import { api } from '@/services/api';

interface Campaign {
  id: string; name: string; type: string; budget: number; spend: number;
  impressions: number; clicks: number; status: string;
  startsAt: string; endsAt: string;
}

const tabs = ['Active', 'Scheduled', 'Ended'] as const;

const defaultForm = { name: '', type: 'DISPLAY', budget: '', startsAt: '', endsAt: '' };

async function fetchCampaigns(): Promise<Campaign[]> {
  try { return await api.get<Campaign[]>('/admin/campaigns'); }
  catch { return []; }
}

export default function CampaignsPage() {
  const [data, setData] = useState<Campaign[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('Active');
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const load = async () => {
    setLoading(true); setError(null);
    try { setData(await fetchCampaigns()); } catch (e) { setError(getErrorMessage(e)); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = activeTab === 'All' ? (data || []) : (data || []).filter((c) => c.status === activeTab.toLowerCase());
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const resetForm = () => { setForm(defaultForm); setEditId(null); setShowCreate(false); };

  const handleEdit = (c: Campaign) => {
    setEditId(c.id);
    setForm({ name: c.name, type: c.type, budget: String(c.budget), startsAt: c.startsAt, endsAt: c.endsAt });
    setShowCreate(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      const payload = { ...form, budget: form.budget || undefined };
      if (editId) { await api.put(`/admin/campaigns/${editId}`, payload); }
      else { await api.post('/admin/campaigns', payload); }
      resetForm(); load();
    } catch (err) { alert(getErrorMessage(err, 'Failed to save campaign')); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this campaign?')) return;
    try { await api.delete(`/admin/campaigns/${id}`); load(); }
    catch (err) { alert(getErrorMessage(err, 'Failed to delete campaign')); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Campaigns</h1>
        <button onClick={() => { resetForm(); setShowCreate(true); }}
          className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">+ New Campaign</button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[{ label: 'All', value: 'All' }, ...tabs.map((t) => ({ label: t, value: t }))].map((tab) => (
          <button key={tab.value} onClick={() => { setActiveTab(tab.value); setPage(1); }}
            className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${activeTab === tab.value ? 'bg-primary text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f5f5f5]'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {error && <AdminError message={error} onRetry={load} />}

      {showCreate && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">{editId ? 'Edit Campaign' : 'New Campaign'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm text-[#666] mb-1">Name *</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" required />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none">
                <option value="DISPLAY">Display</option>
                <option value="SOCIAL">Social Media</option>
                <option value="SEARCH">Search</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Budget</label>
              <input type="number" value={form.budget} onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Start Date</label>
              <input type="date" value={form.startsAt} onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">End Date</label>
              <input type="date" value={form.endsAt} onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-[#666] hover:bg-[#f5f5f5] rounded-lg">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
              {submitting ? 'Saving...' : editId ? 'Update' : 'Create Campaign'}
            </button>
          </div>
        </form>
      )}

      {loading ? <AdminLoading /> : paginated.length === 0 ? <AdminEmpty message="No campaigns found" /> : (
        <>
          <div className="hidden sm:block bg-white rounded-xl border border-[#eee] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                  <th className="p-3">Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Budget</th>
                  <th className="p-3">Spend</th>
                  <th className="p-3">Impressions</th>
                  <th className="p-3">Clicks</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((c) => (
                  <tr key={c.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 font-medium text-[#333]">{c.name}</td>
                    <td className="p-3 text-[#666]">{c.type}</td>
                    <td className="p-3">{formatBDT(c.budget)}</td>
                    <td className="p-3">{formatBDT(c.spend)}</td>
                    <td className="p-3 text-[#666]">{c.impressions.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-[#666]">{c.clicks.toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${c.status === 'active' ? 'bg-green-100 text-green-700' : c.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{c.status}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(c)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]">
                          <span className="material-symbols-outlined text-[18px] text-[#666]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]">
                          <span className="material-symbols-outlined text-[18px] text-[#666]">delete</span>
                        </button>
                      </div>
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
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${c.status === 'active' ? 'bg-green-100 text-green-700' : c.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{c.status}</span>
                </div>
                <div className="text-xs text-[#888] flex justify-between">
                  <span>{c.type} · {formatBDT(c.budget)} budget</span>
                  <span>{c.impressions.toLocaleString('en-IN')} impressions</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(c)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]">
                    <span className="material-symbols-outlined text-[18px] text-[#666]">edit</span>
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]">
                    <span className="material-symbols-outlined text-[18px] text-[#666]">delete</span>
                  </button>
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
