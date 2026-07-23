'use client';

import { useState } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate } from '@/types';
import { api } from '@/services/api';

interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  productCount: number;
  isActive: boolean;
  createdAt: string;
}

interface BrandsResponse {
  brands: Brand[];
  total: number;
  page: number;
  totalPages: number;
}

const defaultForm = { name: '', slug: '', description: '', logo: '' };

async function fetchBrands(page: number, limit: number): Promise<BrandsResponse> {
  try {
    return await api.get<BrandsResponse>(`/admin/brands?page=${page}&limit=${limit}`);
  } catch {
    const mock: Brand[] = [
      { id: 'b1', name: 'Apple', slug: 'apple', description: 'Premium electronics', logo: 'https://logo.clearbit.com/apple.com', productCount: 120, isActive: true, createdAt: '2024-01-01T10:00:00Z' },
      { id: 'b2', name: 'Samsung', slug: 'samsung', description: 'Consumer electronics', logo: 'https://logo.clearbit.com/samsung.com', productCount: 340, isActive: true, createdAt: '2024-01-02T10:00:00Z' },
      { id: 'b3', name: 'Sony', slug: 'sony', description: 'Entertainment & electronics', logo: 'https://logo.clearbit.com/sony.com', productCount: 200, isActive: true, createdAt: '2024-01-03T10:00:00Z' },
      { id: 'b4', name: 'Nike', slug: 'nike', description: 'Sportswear & footwear', logo: 'https://logo.clearbit.com/nike.com', productCount: 450, isActive: true, createdAt: '2024-01-04T10:00:00Z' },
      { id: 'b5', name: 'Adidas', slug: 'adidas', description: 'Sportswear brand', logo: 'https://logo.clearbit.com/adidas.com', productCount: 280, isActive: false, createdAt: '2024-01-05T10:00:00Z' },
    ];
    const start = (page - 1) * limit;
    const paged = mock.slice(start, start + limit);
    return { brands: paged, total: mock.length, page, totalPages: Math.ceil(mock.length / limit) };
  }
}

export default function BrandsPage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<BrandsResponse | null>(null);
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
      const res = await fetchBrands(p, 20);
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
    if (!form.name.trim() || !form.slug.trim()) return;
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (editId) {
        await api.put(`/admin/brands/${editId}`, payload);
      } else {
        await api.post('/admin/brands', payload);
      }
      resetForm();
      load(page);
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to save brand'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (b: Brand) => {
    setEditId(b.id);
    setForm({ name: b.name, slug: b.slug, description: b.description, logo: b.logo });
    setShowForm(true);
  };

  const handleToggle = async (b: Brand) => {
    try {
      await api.patch(`/admin/brands/${b.id}`, { isActive: !b.isActive });
      load(page);
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to toggle brand'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this brand?')) return;
    try {
      await api.delete(`/admin/brands/${id}`);
      load(page);
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to delete brand'));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Brands</h1>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">+ Add Brand</button>
      </div>

      {error && <AdminError message={error} onRetry={() => load(page)} />}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">{editId ? 'Edit Brand' : 'Add New Brand'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#666] mb-1">Name *</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="Brand name" required />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Slug *</label>
              <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="brand-slug" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-[#666] mb-1">Logo URL</label>
              <input value={form.logo} onChange={(e) => setForm((f) => ({ ...f, logo: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="https://logo.clearbit.com/..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-[#666] mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none resize-none" rows={3} placeholder="Brand description" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-[#666] hover:bg-[#f5f5f5] rounded-lg">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
              {submitting ? 'Saving...' : editId ? 'Update Brand' : 'Add Brand'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <AdminLoading />
      ) : !data || data.brands.length === 0 ? (
        <AdminEmpty message="No brands found" icon="brand_awareness" />
      ) : (
        <>
          <div className="hidden sm:block bg-white rounded-xl border border-[#eee] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                  <th className="p-3">Name</th>
                  <th className="p-3">Logo</th>
                  <th className="p-3">Slug</th>
                  <th className="p-3">Products</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.brands.map((b) => (
                  <tr key={b.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-[#333]">{b.name}</p>
                        <p className="text-xs text-[#888] mt-0.5">{b.description}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      {b.logo ? (
                        <img src={b.logo} alt={b.name} className="w-10 h-10 rounded-lg object-contain bg-[#f5f5f5]" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[#f0f0f0] flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#888] text-[20px]">image</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-xs font-mono text-[#888]">{b.slug}</td>
                    <td className="p-3 text-[#666]">{b.productCount.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${b.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {b.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button onClick={() => handleToggle(b)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Toggle">
                          <span className="material-symbols-outlined text-[18px] text-[#666]">{b.isActive ? 'toggle_on' : 'toggle_off'}</span>
                        </button>
                        <button onClick={() => handleEdit(b)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Edit">
                          <span className="material-symbols-outlined text-[18px] text-[#666]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(b.id)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Delete">
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
            {data.brands.map((b) => (
              <div key={b.id} className="bg-white rounded-xl border border-[#eee] p-3 space-y-2">
                <div className="flex items-center gap-3">
                  {b.logo ? (
                    <img src={b.logo} alt={b.name} className="w-10 h-10 rounded-lg object-contain bg-[#f5f5f5]" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-[#f0f0f0] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#888] text-[20px]">image</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-[#333] text-sm">{b.name}</p>
                    <p className="text-xs text-[#888]">{b.slug} · {b.productCount} products</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${b.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {b.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => handleToggle(b)} className="flex-1 text-xs py-1.5 rounded-lg border border-[#ddd] hover:bg-[#f5f5f5]">{b.isActive ? 'Deactivate' : 'Activate'}</button>
                  <button onClick={() => handleEdit(b)} className="flex-1 text-xs py-1.5 rounded-lg border border-[#ddd] hover:bg-[#f5f5f5]">Edit</button>
                  <button onClick={() => handleDelete(b.id)} className="flex-1 text-xs py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">Delete</button>
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
