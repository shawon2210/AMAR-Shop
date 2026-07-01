'use client';

import { useState } from 'react';
import { useAdminData } from '@/lib/api/hooks';
import { fetchFlashSales, createFlashSale, updateFlashSale, deleteFlashSale } from '@/lib/api/admin';
import type { FlashSaleCampaign } from '@/lib/api/admin';

const statusStyles: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  DRAFT: 'bg-blue-100 text-blue-700',
  ENDED: 'bg-gray-100 text-gray-700',
};

const tabs = ['ACTIVE', 'DRAFT', 'ENDED'] as const;

const defaultForm = {
  title: '', banner: '', description: '', discount: '', maxProducts: '',
  startsAt: '', endsAt: '',
};

function formatDate(d: string): string {
  return new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatBDT(v: number): string {
  return `৳${v.toLocaleString('en-IN')}`;
}

export default function FlashSalesPage() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  const { data, loading, error, refetch } = useAdminData(fetchFlashSales);

  const filtered = activeTab === 'all' ? (data || []) : (data || []).filter((c) => c.status === activeTab);

  const resetForm = () => { setForm(defaultForm); setEditId(null); setShowCreate(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        banner: form.banner || undefined,
        description: form.description || undefined,
        discount: form.discount || undefined,
        maxProducts: form.maxProducts || undefined,
        startsAt: form.startsAt,
        endsAt: form.endsAt,
      };
      if (editId) {
        await updateFlashSale(editId, payload);
      } else {
        await createFlashSale(payload);
      }
      resetForm();
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to save flash sale');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (c: FlashSaleCampaign) => {
    setEditId(c.id);
    setForm({
      title: c.title,
      banner: c.banner || '',
      description: (c as any).description || '',
      discount: c.discount?.toString() || '',
      maxProducts: (c as any).maxProducts?.toString() || '',
      startsAt: c.startsAt ? new Date(c.startsAt).toISOString().slice(0, 16) : '',
      endsAt: c.endsAt ? new Date(c.endsAt).toISOString().slice(0, 16) : '',
    });
    setShowCreate(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this flash sale campaign?')) return;
    try {
      await deleteFlashSale(id);
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to delete campaign');
    }
  };

  const campaignRevenue = (c: FlashSaleCampaign): number => {
    return c.products?.reduce((sum, p) => sum + (p.sold * p.flashSalePrice), 0) || 0;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Flash Sales</h1>
        <button onClick={() => { resetForm(); setShowCreate(!showCreate); }} className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">
          + New Flash Sale
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[{ label: 'All', value: 'all' }, ...tabs.map((t) => ({ label: t.charAt(0) + t.slice(1).toLowerCase(), value: t }))].map((tab) => (
          <button key={tab.value} onClick={() => setActiveTab(tab.value)}
            className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === tab.value ? 'bg-primary text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f5f5f5]'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm border border-red-200">{error}</div>
      )}

      {showCreate && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">{editId ? 'Edit Flash Sale' : 'Create Flash Sale'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm text-[#666] mb-1">Title *</label>
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="e.g. Eid Mega Sale" required />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Banner Image URL</label>
              <input value={form.banner} onChange={(e) => setForm((f) => ({ ...f, banner: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Discount (%)</label>
              <input type="number" value={form.discount} onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="20" />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Start Date & Time</label>
              <input type="datetime-local" value={form.startsAt} onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">End Date & Time</label>
              <input type="datetime-local" value={form.endsAt} onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-[#666] mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2} className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none resize-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-[#666] hover:bg-[#f5f5f5] rounded-lg">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
              {submitting ? 'Saving...' : editId ? 'Update' : 'Create Flash Sale'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-[#eee] p-8 text-center text-[#888]">
          <span className="material-symbols-outlined animate-spin align-middle mr-2">progress_activity</span>Loading...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#eee] p-8 text-center text-[#888]">No flash sales found</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-[#eee] p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-[#f0f0f0] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#888] text-3xl">local_fire_department</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#222]">{c.title}</h3>
                    <p className="text-xs text-[#888]">{formatDate(c.startsAt)} → {formatDate(c.endsAt)}</p>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full inline-block mt-1 ${statusStyles[c.status] || 'bg-gray-100 text-gray-700'}`}>
                      {c.status?.charAt(0) + c.status?.slice(1).toLowerCase() || 'Draft'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="font-semibold text-[#333]">{formatBDT(c.discount || 0)}</p>
                    <p className="text-xs text-[#888]">Discount</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-[#333]">{c.products?.reduce((s, p) => s + p.sold, 0) || 0}</p>
                    <p className="text-xs text-[#888]">Items Sold</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-[#333]">{c.products?.length || 0}</p>
                    <p className="text-xs text-[#888]">Products</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(c)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Edit">
                      <span className="material-symbols-outlined text-[18px] text-[#666]">edit</span>
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Delete">
                      <span className="material-symbols-outlined text-[18px] text-[#666]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
