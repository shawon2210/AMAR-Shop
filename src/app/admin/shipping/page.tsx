'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate } from '@/types';
import { api } from '@/services/api';

interface ShippingMethod {
  id: string;
  name: string;
  zone: string;
  type: 'FLAT' | 'FREE' | 'PER_KG';
  rate: number;
  minOrder: number;
  estimatedDays: string;
  isActive: boolean;
  createdAt: string;
}

interface ShippingResponse {
  methods: ShippingMethod[];
  total: number;
  page: number;
  totalPages: number;
}

const typeBadge: Record<string, string> = {
  FLAT: 'bg-blue-100 text-blue-700',
  FREE: 'bg-green-100 text-green-700',
  PER_KG: 'bg-amber-100 text-amber-700',
};

const defaultForm: { name: string; zone: string; type: ShippingMethod['type']; rate: string; minOrder: string; estimatedDays: string } = { name: '', zone: '', type: 'FLAT', rate: '', minOrder: '0', estimatedDays: '' };

async function fetchShipping(page: number, limit: number): Promise<ShippingResponse> {
  try {
    return await api.get<ShippingResponse>(`/admin/shipping?page=${page}&limit=${limit}`);
  } catch {
    return { methods: [], total: 0, page, totalPages: 0 };
  }
}

export default function ShippingPage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ShippingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  const load = async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchShipping(p, 20);
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(page); }, [page]);

  const resetForm = () => { setForm(defaultForm); setEditId(null); setShowForm(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.zone.trim()) return;
    setSubmitting(true);
    try {
      const payload = { ...form, rate: parseFloat(form.rate), minOrder: parseFloat(form.minOrder) };
      if (editId) {
        await api.put(`/admin/shipping/${editId}`, payload);
      } else {
        await api.post('/admin/shipping', payload);
      }
      resetForm();
      load(page);
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to save shipping method'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (m: ShippingMethod) => {
    setEditId(m.id);
    setForm({ name: m.name, zone: m.zone, type: m.type, rate: String(m.rate), minOrder: String(m.minOrder), estimatedDays: m.estimatedDays });
    setShowForm(true);
  };

  const handleToggle = async (m: ShippingMethod) => {
    try {
      await api.patch(`/admin/shipping/${m.id}`, { isActive: !m.isActive });
      load(page);
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to toggle shipping method'));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Shipping Methods</h1>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">+ Add Method</button>
      </div>

      {error && <AdminError message={error} onRetry={() => load(page)} />}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">{editId ? 'Edit Shipping Method' : 'Add Shipping Method'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-[#666] mb-1">Name *</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="Method name" required />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Zone *</label>
              <input value={form.zone} onChange={(e) => setForm((f) => ({ ...f, zone: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="e.g. Dhaka City" required />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ShippingMethod['type'] }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none">
                <option value="FLAT">Flat Rate</option>
                <option value="FREE">Free Shipping</option>
                <option value="PER_KG">Per KG</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Rate (৳)</label>
              <input type="number" min="0" step="0.01" value={form.rate} onChange={(e) => setForm((f) => ({ ...f, rate: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="60" />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Min Order (৳)</label>
              <input type="number" min="0" value={form.minOrder} onChange={(e) => setForm((f) => ({ ...f, minOrder: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Est. Delivery</label>
              <input value={form.estimatedDays} onChange={(e) => setForm((f) => ({ ...f, estimatedDays: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="e.g. 1-3 days" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-[#666] hover:bg-[#f5f5f5] rounded-lg">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
              {submitting ? 'Saving...' : editId ? 'Update' : 'Add Method'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <AdminLoading />
      ) : !data || data.methods.length === 0 ? (
        <AdminEmpty message="No shipping methods found" icon="local_shipping" />
      ) : (
        <>
          <div className="hidden sm:block bg-white rounded-xl border border-[#eee] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                  <th className="p-3">Name</th>
                  <th className="p-3">Zone</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Rate</th>
                  <th className="p-3">Min Order</th>
                  <th className="p-3">Est. Delivery</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.methods.map((m) => (
                  <tr key={m.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 font-medium text-[#333]">{m.name}</td>
                    <td className="p-3 text-[#555]">{m.zone}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${typeBadge[m.type]}`}>{m.type.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="p-3 font-medium">{m.type === 'FREE' ? 'Free' : formatBDT(m.rate)}{m.type === 'PER_KG' ? '/kg' : ''}</td>
                    <td className="p-3 text-[#666]}">{m.minOrder > 0 ? formatBDT(m.minOrder) : '—'}</td>
                    <td className="p-3 text-xs text-[#888]">{m.estimatedDays || '—'}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${m.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {m.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button onClick={() => handleToggle(m)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Toggle">
                          <span className="material-symbols-outlined text-[18px] text-[#666]">{m.isActive ? 'toggle_on' : 'toggle_off'}</span>
                        </button>
                        <button onClick={() => handleEdit(m)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Edit">
                          <span className="material-symbols-outlined text-[18px] text-[#666]">edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sm:hidden space-y-3">
            {data.methods.map((m) => (
              <div key={m.id} className="bg-white rounded-xl border border-[#eee] p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-[#333] text-sm">{m.name}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${m.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {m.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#666]">
                  <span>{m.zone}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${typeBadge[m.type]}`}>{m.type.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{m.type === 'FREE' ? 'Free' : formatBDT(m.rate)}{m.type === 'PER_KG' ? '/kg' : ''}</span>
                  <span className="text-[#888]">Min: {m.minOrder > 0 ? formatBDT(m.minOrder) : '—'}</span>
                  <span className="text-[#888]">{m.estimatedDays || '—'}</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => handleToggle(m)} className="flex-1 text-xs py-1.5 rounded-lg border border-[#ddd] hover:bg-[#f5f5f5]">{m.isActive ? 'Deactivate' : 'Activate'}</button>
                  <button onClick={() => handleEdit(m)} className="flex-1 text-xs py-1.5 rounded-lg border border-[#ddd] hover:bg-[#f5f5f5]">Edit</button>
                </div>
              </div>
            ))}
          </div>

          {data && <Pagination page={page} totalPages={data.totalPages} total={data.total} onPageChange={(p) => { setPage(p); load(p); }} />}
        </>
      )}
    </div>
  );
}
