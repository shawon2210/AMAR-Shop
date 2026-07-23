'use client';

import { useState } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate } from '@/types';
import { api } from '@/services/api';

interface AttributeValue {
  id: string;
  value: string;
  meta?: string;
}

interface ProductAttribute {
  id: string;
  name: string;
  type: 'SELECT' | 'COLOR' | 'TEXT';
  values: AttributeValue[];
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

interface AttributeResponse {
  attributes: ProductAttribute[];
  total: number;
  page: number;
  totalPages: number;
}

const typeBadge: Record<string, string> = {
  SELECT: 'bg-blue-100 text-blue-700',
  COLOR: 'bg-pink-100 text-pink-700',
  TEXT: 'bg-gray-100 text-gray-700',
};

const defaultForm: { name: string; type: ProductAttribute['type']; valuesStr: string; sortOrder: string } = { name: '', type: 'SELECT', valuesStr: '', sortOrder: '0' };

async function fetchAttributes(page: number, limit: number): Promise<AttributeResponse> {
  try {
    return await api.get<AttributeResponse>(`/admin/attributes?page=${page}&limit=${limit}`);
  } catch {
    const mock: ProductAttribute[] = [
      { id: 'a1', name: 'Size', type: 'SELECT', values: [{ id: 'v1', value: 'S' }, { id: 'v2', value: 'M' }, { id: 'v3', value: 'L' }, { id: 'v4', value: 'XL' }], sortOrder: 1, isActive: true, createdAt: '2024-01-01T10:00:00Z' },
      { id: 'a2', name: 'Color', type: 'COLOR', values: [{ id: 'v5', value: 'Red', meta: '#FF0000' }, { id: 'v6', value: 'Blue', meta: '#0000FF' }, { id: 'v7', value: 'Green', meta: '#00FF00' }], sortOrder: 2, isActive: true, createdAt: '2024-01-02T10:00:00Z' },
      { id: 'a3', name: 'Storage', type: 'SELECT', values: [{ id: 'v8', value: '64GB' }, { id: 'v9', value: '128GB' }, { id: 'v10', value: '256GB' }], sortOrder: 3, isActive: true, createdAt: '2024-01-03T10:00:00Z' },
      { id: 'a4', name: 'RAM', type: 'SELECT', values: [{ id: 'v11', value: '4GB' }, { id: 'v12', value: '6GB' }, { id: 'v13', value: '8GB' }], sortOrder: 4, isActive: true, createdAt: '2024-01-04T10:00:00Z' },
      { id: 'a5', name: 'Material', type: 'TEXT', values: [{ id: 'v14', value: 'Cotton' }, { id: 'v15', value: 'Polyester' }], sortOrder: 5, isActive: false, createdAt: '2024-01-05T10:00:00Z' },
    ];
    const start = (page - 1) * limit;
    return { attributes: mock.slice(start, start + limit), total: mock.length, page, totalPages: Math.ceil(mock.length / limit) };
  }
}

export default function AttributesPage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<AttributeResponse | null>(null);
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
      const res = await fetchAttributes(p, 20);
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
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      const values = form.valuesStr.split('\n').map((v) => v.trim()).filter(Boolean).map((v) => ({ value: v }));
      const payload = { name: form.name, type: form.type, values, sortOrder: parseInt(form.sortOrder) };
      if (editId) {
        await api.put(`/admin/attributes/${editId}`, payload);
      } else {
        await api.post('/admin/attributes', payload);
      }
      resetForm();
      load(page);
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to save attribute'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (a: ProductAttribute) => {
    setEditId(a.id);
    setForm({ name: a.name, type: a.type, valuesStr: a.values.map((v) => v.meta ? `${v.value}|${v.meta}` : v.value).join('\n'), sortOrder: String(a.sortOrder) });
    setShowForm(true);
  };

  const handleToggle = async (a: ProductAttribute) => {
    try {
      await api.patch(`/admin/attributes/${a.id}`, { isActive: !a.isActive });
      load(page);
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to toggle attribute'));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Attributes</h1>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">+ Add Attribute</button>
      </div>

      {error && <AdminError message={error} onRetry={() => load(page)} />}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">{editId ? 'Edit Attribute' : 'Add Attribute'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-[#666] mb-1">Name *</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="e.g. Size" required />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ProductAttribute['type'] }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none">
                <option value="SELECT">Select</option>
                <option value="COLOR">Color</option>
                <option value="TEXT">Text</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Sort Order</label>
              <input type="number" min="0" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm text-[#666] mb-1">Values (one per line — for colors use: value|#hex)</label>
              <textarea value={form.valuesStr} onChange={(e) => setForm((f) => ({ ...f, valuesStr: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none resize-none" rows={4} placeholder={`S\nM\nL\nXL`} />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-[#666] hover:bg-[#f5f5f5] rounded-lg">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
              {submitting ? 'Saving...' : editId ? 'Update Attribute' : 'Add Attribute'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <AdminLoading />
      ) : !data || data.attributes.length === 0 ? (
        <AdminEmpty message="No attributes found" icon="list_alt" />
      ) : (
        <>
          <div className="hidden sm:block bg-white rounded-xl border border-[#eee] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                  <th className="p-3">Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Values</th>
                  <th className="p-3">Sort Order</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.attributes.map((a) => (
                  <tr key={a.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 font-medium text-[#333]">{a.name}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${typeBadge[a.type]}`}>{a.type}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1 flex-wrap max-w-xs">
                        {a.values.slice(0, 5).map((v) => (
                          a.type === 'COLOR' && v.meta ? (
                            <span key={v.id} className="flex items-center gap-1 text-[11px] bg-[#f0f0f0] text-[#666] px-2 py-0.5 rounded-full">
                              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: v.meta }} />
                              {v.value}
                            </span>
                          ) : (
                            <span key={v.id} className="text-[11px] bg-[#f0f0f0] text-[#666] px-2 py-0.5 rounded-full">{v.value}</span>
                          )
                        ))}
                        {a.values.length > 5 && <span className="text-[11px] text-[#888]">+{a.values.length - 5}</span>}
                      </div>
                    </td>
                    <td className="p-3 text-[#666]">#{a.sortOrder}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${a.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {a.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button onClick={() => handleToggle(a)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Toggle">
                          <span className="material-symbols-outlined text-[18px] text-[#666]">{a.isActive ? 'toggle_on' : 'toggle_off'}</span>
                        </button>
                        <button onClick={() => handleEdit(a)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Edit">
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
            {data.attributes.map((a) => (
              <div key={a.id} className="bg-white rounded-xl border border-[#eee] p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-[#333] text-sm">{a.name}</p>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${typeBadge[a.type]}`}>{a.type}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${a.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {a.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {a.values.slice(0, 8).map((v) => (
                    a.type === 'COLOR' && v.meta ? (
                      <span key={v.id} className="flex items-center gap-1 text-[10px] bg-[#f0f0f0] text-[#666] px-2 py-0.5 rounded-full">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: v.meta }} />
                        {v.value}
                      </span>
                    ) : (
                      <span key={v.id} className="text-[10px] bg-[#f0f0f0] text-[#666] px-2 py-0.5 rounded-full">{v.value}</span>
                    )
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-[#888]">
                  <span>Sort: #{a.sortOrder} · {a.values.length} values</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => handleToggle(a)} className="flex-1 text-xs py-1.5 rounded-lg border border-[#ddd] hover:bg-[#f5f5f5]">{a.isActive ? 'Deactivate' : 'Activate'}</button>
                  <button onClick={() => handleEdit(a)} className="flex-1 text-xs py-1.5 rounded-lg border border-[#ddd] hover:bg-[#f5f5f5]">Edit</button>
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
