'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate } from '@/types';
import { api } from '@/services/api';

interface Promotion {
  id: string; name: string; type: string; discount: string; minPurchase: number;
  startsAt: string; endsAt: string; isActive: boolean;
}

const defaultForm = { name: '', type: 'BUYXGETY', discount: '', minPurchase: '', startsAt: '', endsAt: '', isActive: true };

async function fetchPromotions(): Promise<Promotion[]> {
  try { return await api.get<Promotion[]>('/admin/promotions'); }
  catch {
    return [
      { id: '1', name: 'Buy 2 Get 1 Free', type: 'BUYXGETY', discount: '2x1', minPurchase: 0, startsAt: '2026-07-01', endsAt: '2026-08-31', isActive: true },
      { id: '2', name: 'Free Shipping Week', type: 'FREE_SHIPPING', discount: '100%', minPurchase: 500, startsAt: '2026-07-15', endsAt: '2026-07-22', isActive: true },
      { id: '3', name: 'Summer Bundle', type: 'BUNDLE', discount: '20%', minPurchase: 2000, startsAt: '2026-07-01', endsAt: '2026-09-30', isActive: true },
      { id: '4', name: 'Buy 3 Get 20% Off', type: 'BUYXGETY', discount: '3+20%', minPurchase: 0, startsAt: '2026-06-01', endsAt: '2026-07-15', isActive: false },
      { id: '5', name: 'Free Shipping Nationwide', type: 'FREE_SHIPPING', discount: '100%', minPurchase: 1000, startsAt: '2026-08-01', endsAt: '2026-08-15', isActive: true },
    ];
  }
}

export default function PromotionsPage() {
  const [data, setData] = useState<Promotion[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const load = async () => {
    setLoading(true); setError(null);
    try { setData(await fetchPromotions()); } catch (e) { setError(getErrorMessage(e)); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const items = data || [];
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const paginated = items.slice((page - 1) * perPage, page * perPage);

  const resetForm = () => { setForm(defaultForm); setEditId(null); setShowCreate(false); };

  const handleEdit = (p: Promotion) => {
    setEditId(p.id);
    setForm({ name: p.name, type: p.type, discount: p.discount, minPurchase: String(p.minPurchase), startsAt: p.startsAt, endsAt: p.endsAt, isActive: p.isActive });
    setShowCreate(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      const payload = { ...form, minPurchase: form.minPurchase || '0' };
      if (editId) { await api.put(`/admin/promotions/${editId}`, payload); }
      else { await api.post('/admin/promotions', payload); }
      resetForm(); load();
    } catch (err) { alert(getErrorMessage(err, 'Failed to save promotion')); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this promotion?')) return;
    try { await api.delete(`/admin/promotions/${id}`); load(); }
    catch (err) { alert(getErrorMessage(err, 'Failed to delete promotion')); }
  };

  const handleToggle = async (p: Promotion) => {
    try {
      await api.put(`/admin/promotions/${p.id}`, { isActive: !p.isActive });
      load();
    } catch (err) { alert(getErrorMessage(err, 'Failed to toggle promotion')); }
  };

  const typeLabels: Record<string, string> = { BUYXGETY: 'Buy X Get Y', FREE_SHIPPING: 'Free Shipping', BUNDLE: 'Bundle' };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Promotions</h1>
        <button onClick={() => { resetForm(); setShowCreate(true); }}
          className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">+ New Promotion</button>
      </div>

      {error && <AdminError message={error} onRetry={load} />}

      {showCreate && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">{editId ? 'Edit Promotion' : 'New Promotion'}</h2>
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
                <option value="BUYXGETY">Buy X Get Y</option>
                <option value="FREE_SHIPPING">Free Shipping</option>
                <option value="BUNDLE">Bundle</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Discount Value *</label>
              <input value={form.discount} onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="e.g. 2x1, 20%, 100%" required />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Min Purchase</label>
              <input type="number" value={form.minPurchase} onChange={(e) => setForm((f) => ({ ...f, minPurchase: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="0" />
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
              {submitting ? 'Saving...' : editId ? 'Update' : 'Create Promotion'}
            </button>
          </div>
        </form>
      )}

      {loading ? <AdminLoading /> : paginated.length === 0 ? <AdminEmpty message="No promotions found" /> : (
        <>
          <div className="hidden sm:block bg-white rounded-xl border border-[#eee] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                  <th className="p-3">Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Discount</th>
                  <th className="p-3">Min Purchase</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((p) => (
                  <tr key={p.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 font-medium text-[#333]">{p.name}</td>
                    <td className="p-3 text-[#666] text-xs">{typeLabels[p.type] || p.type}</td>
                    <td className="p-3 font-medium">{p.discount}</td>
                    <td className="p-3 text-[#666]">{p.minPurchase > 0 ? formatBDT(p.minPurchase) : '—'}</td>
                    <td className="p-3 text-[#888] text-xs">{formatDate(p.startsAt)} — {formatDate(p.endsAt)}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{p.isActive ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button onClick={() => handleToggle(p)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title={p.isActive ? 'Deactivate' : 'Activate'}>
                          <span className="material-symbols-outlined text-[18px] text-[#666]">{p.isActive ? 'toggle_on' : 'toggle_off'}</span>
                        </button>
                        <button onClick={() => handleEdit(p)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]">
                          <span className="material-symbols-outlined text-[18px] text-[#666]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]">
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
            {paginated.map((p) => (
              <div key={p.id} className="bg-white rounded-xl border border-[#eee] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#333]">{p.name}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{p.isActive ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="text-xs text-[#888] flex justify-between">
                  <span>{typeLabels[p.type] || p.type} · {p.discount}</span>
                  <span>{formatDate(p.startsAt)}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleToggle(p)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]">
                    <span className="material-symbols-outlined text-[18px] text-[#666]">{p.isActive ? 'toggle_on' : 'toggle_off'}</span>
                  </button>
                  <button onClick={() => handleEdit(p)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]">
                    <span className="material-symbols-outlined text-[18px] text-[#666]">edit</span>
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]">
                    <span className="material-symbols-outlined text-[18px] text-[#666]">delete</span>
                  </button>
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
