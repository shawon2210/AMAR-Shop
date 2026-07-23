'use client';

import { useState } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate } from '@/types';
import { api } from '@/services/api';

interface TaxRule {
  id: string;
  name: string;
  rate: number;
  type: 'VAT' | 'GST' | 'SALES_TAX';
  region: string;
  isActive: boolean;
  createdAt: string;
}

interface TaxResponse {
  rules: TaxRule[];
  total: number;
  page: number;
  totalPages: number;
}

const typeBadge: Record<string, string> = {
  VAT: 'bg-purple-100 text-purple-700',
  GST: 'bg-blue-100 text-blue-700',
  SALES_TAX: 'bg-amber-100 text-amber-700',
};

const defaultForm: { name: string; rate: string; type: TaxRule['type']; region: string } = { name: '', rate: '', type: 'VAT', region: '' };

async function fetchTaxes(page: number, limit: number): Promise<TaxResponse> {
  try {
    return await api.get<TaxResponse>(`/admin/taxes?page=${page}&limit=${limit}`);
  } catch {
    const mock: TaxRule[] = [
      { id: 't1', name: 'Standard VAT', rate: 15, type: 'VAT', region: 'Bangladesh', isActive: true, createdAt: '2024-01-01T10:00:00Z' },
      { id: 't2', name: 'Reduced VAT', rate: 5, type: 'VAT', region: 'Bangladesh', isActive: true, createdAt: '2024-01-02T10:00:00Z' },
      { id: 't3', name: 'GST Standard', rate: 18, type: 'GST', region: 'India', isActive: true, createdAt: '2024-01-03T10:00:00Z' },
      { id: 't4', name: 'GST Reduced', rate: 12, type: 'GST', region: 'India', isActive: true, createdAt: '2024-01-04T10:00:00Z' },
      { id: 't5', name: 'Sales Tax CA', rate: 8.25, type: 'SALES_TAX', region: 'California, USA', isActive: false, createdAt: '2024-01-05T10:00:00Z' },
    ];
    const start = (page - 1) * limit;
    return { rules: mock.slice(start, start + limit), total: mock.length, page, totalPages: Math.ceil(mock.length / limit) };
  }
}

export default function TaxesPage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<TaxResponse | null>(null);
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
      const res = await fetchTaxes(p, 20);
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useState(() => { load(page); });

  const resetForm = () => { setForm(defaultForm); setEditId(null); setShowForm(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.rate || !form.region.trim()) return;
    setSubmitting(true);
    try {
      const payload = { ...form, rate: parseFloat(form.rate) };
      if (editId) {
        await api.put(`/admin/taxes/${editId}`, payload);
      } else {
        await api.post('/admin/taxes', payload);
      }
      resetForm();
      load(page);
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to save tax rule'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (t: TaxRule) => {
    setEditId(t.id);
    setForm({ name: t.name, rate: String(t.rate), type: t.type, region: t.region });
    setShowForm(true);
  };

  const handleToggle = async (t: TaxRule) => {
    try {
      await api.patch(`/admin/taxes/${t.id}`, { isActive: !t.isActive });
      load(page);
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to toggle tax rule'));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Tax Rules</h1>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">+ Add Tax Rule</button>
      </div>

      {error && <AdminError message={error} onRetry={() => load(page)} />}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">{editId ? 'Edit Tax Rule' : 'Add Tax Rule'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-[#666] mb-1">Name *</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="e.g. Standard VAT" required />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Rate (%) *</label>
              <input type="number" min="0" max="100" step="0.01" value={form.rate} onChange={(e) => setForm((f) => ({ ...f, rate: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="15" required />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as TaxRule['type'] }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none">
                <option value="VAT">VAT</option>
                <option value="GST">GST</option>
                <option value="SALES_TAX">Sales Tax</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Region *</label>
              <input value={form.region} onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="e.g. Bangladesh" required />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-[#666] hover:bg-[#f5f5f5] rounded-lg">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
              {submitting ? 'Saving...' : editId ? 'Update Rule' : 'Add Rule'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <AdminLoading />
      ) : !data || data.rules.length === 0 ? (
        <AdminEmpty message="No tax rules found" icon="receipt_long" />
      ) : (
        <>
          <div className="hidden sm:block bg-white rounded-xl border border-[#eee] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                  <th className="p-3">Name</th>
                  <th className="p-3">Rate</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Region</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.rules.map((t) => (
                  <tr key={t.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 font-medium text-[#333]">{t.name}</td>
                    <td className="p-3 font-semibold">{t.rate}%</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${typeBadge[t.type] || 'bg-gray-100 text-gray-700'}`}>{t.type.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="p-3 text-[#555]">{t.region}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${t.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {t.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button onClick={() => handleToggle(t)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Toggle">
                          <span className="material-symbols-outlined text-[18px] text-[#666]">{t.isActive ? 'toggle_on' : 'toggle_off'}</span>
                        </button>
                        <button onClick={() => handleEdit(t)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Edit">
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
            {data.rules.map((t) => (
              <div key={t.id} className="bg-white rounded-xl border border-[#eee] p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-[#333] text-sm">{t.name}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${t.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {t.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#666]">
                  <span className="font-semibold">{t.rate}%</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${typeBadge[t.type] || 'bg-gray-100 text-gray-700'}`}>{t.type.replace(/_/g, ' ')}</span>
                  <span>{t.region}</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => handleToggle(t)} className="flex-1 text-xs py-1.5 rounded-lg border border-[#ddd] hover:bg-[#f5f5f5]">{t.isActive ? 'Deactivate' : 'Activate'}</button>
                  <button onClick={() => handleEdit(t)} className="flex-1 text-xs py-1.5 rounded-lg border border-[#ddd] hover:bg-[#f5f5f5]">Edit</button>
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
