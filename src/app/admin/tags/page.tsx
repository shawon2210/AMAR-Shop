'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate } from '@/types';
import { api } from '@/services/api';

interface Tag {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  isActive: boolean;
  createdAt: string;
}

interface TagResponse {
  tags: Tag[];
  total: number;
  page: number;
  totalPages: number;
}

const defaultForm = { name: '', slug: '' };

async function fetchTags(page: number, limit: number): Promise<TagResponse> {
  try {
    return await api.get<TagResponse>(`/admin/tags?page=${page}&limit=${limit}`);
  } catch {
    return { tags: [], total: 0, page, totalPages: 0 };
  }
}

export default function TagsPage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<TagResponse | null>(null);
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
      const res = await fetchTags(p, 20);
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
    if (!form.name.trim() || !form.slug.trim()) return;
    setSubmitting(true);
    try {
      if (editId) {
        await api.put(`/admin/tags/${editId}`, form);
      } else {
        await api.post('/admin/tags', form);
      }
      resetForm();
      load(page);
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to save tag'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (t: Tag) => {
    setEditId(t.id);
    setForm({ name: t.name, slug: t.slug });
    setShowForm(true);
  };

  const handleToggle = async (t: Tag) => {
    try {
      await api.patch(`/admin/tags/${t.id}`, { isActive: !t.isActive });
      load(page);
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to toggle tag'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tag?')) return;
    try {
      await api.delete(`/admin/tags/${id}`);
      load(page);
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to delete tag'));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Tags</h1>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">+ Add Tag</button>
      </div>

      {error && <AdminError message={error} onRetry={() => load(page)} />}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">{editId ? 'Edit Tag' : 'Add Tag'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#666] mb-1">Name *</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="Tag name" required />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Slug *</label>
              <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="tag-slug" required />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-[#666] hover:bg-[#f5f5f5] rounded-lg">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
              {submitting ? 'Saving...' : editId ? 'Update Tag' : 'Add Tag'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <AdminLoading />
      ) : !data || data.tags.length === 0 ? (
        <AdminEmpty message="No tags found" icon="sell" />
      ) : (
        <>
          <div className="hidden sm:block bg-white rounded-xl border border-[#eee] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                  <th className="p-3">Name</th>
                  <th className="p-3">Slug</th>
                  <th className="p-3">Products</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.tags.map((t) => (
                  <tr key={t.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 font-medium text-[#333]">{t.name}</td>
                    <td className="p-3 text-xs font-mono text-[#888]">{t.slug}</td>
                    <td className="p-3 text-[#666]">{t.productCount.toLocaleString()}</td>
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
                        <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Delete">
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
            {data.tags.map((t) => (
              <div key={t.id} className="bg-white rounded-xl border border-[#eee] p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333] text-sm">{t.name}</p>
                    <p className="text-xs text-[#888] font-mono">{t.slug}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${t.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {t.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#888]">{t.productCount.toLocaleString()} products</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => handleToggle(t)} className="flex-1 text-xs py-1.5 rounded-lg border border-[#ddd] hover:bg-[#f5f5f5]">{t.isActive ? 'Deactivate' : 'Activate'}</button>
                  <button onClick={() => handleEdit(t)} className="flex-1 text-xs py-1.5 rounded-lg border border-[#ddd] hover:bg-[#f5f5f5]">Edit</button>
                  <button onClick={() => handleDelete(t.id)} className="flex-1 text-xs py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">Delete</button>
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
