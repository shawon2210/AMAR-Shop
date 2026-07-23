'use client';

import { useState } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate } from '@/types';
import { api } from '@/services/api';

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  isActive: boolean;
  createdAt: string;
}

interface CollectionResponse {
  collections: Collection[];
  total: number;
  page: number;
  totalPages: number;
}

const defaultForm = { name: '', slug: '', description: '', image: '' };

async function fetchCollections(page: number, limit: number): Promise<CollectionResponse> {
  try {
    return await api.get<CollectionResponse>(`/admin/collections?page=${page}&limit=${limit}`);
  } catch {
    const mock: Collection[] = [
      { id: 'c1', name: 'Summer Collection', slug: 'summer-collection', description: 'Light and breezy summer essentials', image: 'https://picsum.photos/seed/summer/400/300', productCount: 45, isActive: true, createdAt: '2024-01-01T10:00:00Z' },
      { id: 'c2', name: 'Winter Essentials', slug: 'winter-essentials', description: 'Stay warm with our winter picks', image: 'https://picsum.photos/seed/winter/400/300', productCount: 32, isActive: true, createdAt: '2024-01-02T10:00:00Z' },
      { id: 'c3', name: 'Eid Collection', slug: 'eid-collection', description: 'Special Eid offers', image: 'https://picsum.photos/seed/eid/400/300', productCount: 78, isActive: true, createdAt: '2024-01-03T10:00:00Z' },
      { id: 'c4', name: 'Tech Deals', slug: 'tech-deals', description: 'Best tech gadgets at great prices', image: 'https://picsum.photos/seed/tech/400/300', productCount: 56, isActive: true, createdAt: '2024-01-04T10:00:00Z' },
      { id: 'c5', name: 'Home Decor', slug: 'home-decor', description: 'Beautiful home decoration items', image: 'https://picsum.photos/seed/home/400/300', productCount: 23, isActive: false, createdAt: '2024-01-05T10:00:00Z' },
      { id: 'c6', name: 'Sports Gear', slug: 'sports-gear', description: 'Everything for your active lifestyle', image: 'https://picsum.photos/seed/sports/400/300', productCount: 67, isActive: true, createdAt: '2024-01-06T10:00:00Z' },
    ];
    const start = (page - 1) * limit;
    return { collections: mock.slice(start, start + limit), total: mock.length, page, totalPages: Math.ceil(mock.length / limit) };
  }
}

export default function CollectionsPage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<CollectionResponse | null>(null);
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
      const res = await fetchCollections(p, 20);
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
      if (editId) {
        await api.put(`/admin/collections/${editId}`, form);
      } else {
        await api.post('/admin/collections', form);
      }
      resetForm();
      load(page);
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to save collection'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (c: Collection) => {
    setEditId(c.id);
    setForm({ name: c.name, slug: c.slug, description: c.description, image: c.image });
    setShowForm(true);
  };

  const handleToggle = async (c: Collection) => {
    try {
      await api.patch(`/admin/collections/${c.id}`, { isActive: !c.isActive });
      load(page);
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to toggle collection'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this collection?')) return;
    try {
      await api.delete(`/admin/collections/${id}`);
      load(page);
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to delete collection'));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Collections</h1>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">+ Add Collection</button>
      </div>

      {error && <AdminError message={error} onRetry={() => load(page)} />}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">{editId ? 'Edit Collection' : 'Add Collection'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#666] mb-1">Name *</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="Collection name" required />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Slug *</label>
              <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="collection-slug" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-[#666] mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none resize-none" rows={3} placeholder="Collection description" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-[#666] mb-1">Image URL</label>
              <input value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="https://..." />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-[#666] hover:bg-[#f5f5f5] rounded-lg">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
              {submitting ? 'Saving...' : editId ? 'Update Collection' : 'Add Collection'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <AdminLoading />
      ) : !data || data.collections.length === 0 ? (
        <AdminEmpty message="No collections found" icon="collections_bookmark" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.collections.map((c) => (
              <div key={c.id} className="bg-white rounded-xl border border-[#eee] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-40 bg-gradient-to-br from-[#f0f0f0] to-[#e0e0e0] flex items-center justify-center overflow-hidden">
                  {c.image ? (
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-[#888] text-4xl">collections_bookmark</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#222] truncate">{c.name}</h3>
                      {c.description && <p className="text-xs text-[#888] mt-0.5 line-clamp-2">{c.description}</p>}
                    </div>
                    <button onClick={() => handleToggle(c)} className="shrink-0 p-1 rounded-lg hover:bg-[#f5f5f5]" title="Toggle">
                      <span className={`material-symbols-outlined text-[20px] ${c.isActive ? 'text-green-600' : 'text-[#888]'}`}>
                        {c.isActive ? 'toggle_on' : 'toggle_off'}
                      </span>
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mt-3 text-xs text-[#888]">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                      {c.productCount.toLocaleString()} products
                    </span>
                    <span>{formatDate(c.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#eee]">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <div className="flex-1" />
                    <button onClick={() => handleEdit(c)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Edit">
                      <span className="material-symbols-outlined text-[18px] text-[#666]">edit</span>
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Delete">
                      <span className="material-symbols-outlined text-[18px] text-[#666]">delete</span>
                    </button>
                  </div>
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
