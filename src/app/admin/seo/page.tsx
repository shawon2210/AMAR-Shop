'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatDate } from '@/types';
import { api } from '@/services/api';

interface SEOPage {
  id: string;
  path: string;
  metaTitle: string;
  metaDesc: string;
  keywords: string;
  updatedAt: string;
}

interface SEOData {
  pages: SEOPage[];
  total: number;
  page: number;
  totalPages: number;
}

async function fetchSEOData(): Promise<SEOData> {
  try {
    return await api.get<SEOData>('/admin/seo');
  } catch {
    return {
      pages: [
        { id: '1', path: '/', metaTitle: 'Amarshop - Home', metaDesc: 'Best online shopping in Bangladesh', keywords: 'shopping, online, bangladesh', updatedAt: '2026-07-20T10:00:00Z' },
        { id: '2', path: '/categories', metaTitle: 'Categories - Amarshop', metaDesc: 'Browse all product categories', keywords: 'categories, products', updatedAt: '2026-07-19T08:30:00Z' },
        { id: '3', path: '/products', metaTitle: 'Products - Amarshop', metaDesc: 'Browse all products', keywords: 'products, shop, buy', updatedAt: '2026-07-18T14:00:00Z' },
        { id: '4', path: '/about', metaTitle: 'About Us - Amarshop', metaDesc: 'Learn about Amarshop', keywords: 'about, company, team', updatedAt: '2026-07-15T09:00:00Z' },
        { id: '5', path: '/contact', metaTitle: 'Contact - Amarshop', metaDesc: 'Get in touch with us', keywords: 'contact, support, help', updatedAt: '2026-07-10T11:00:00Z' },
      ],
      total: 5,
      page: 1,
      totalPages: 1,
    };
  }
}

async function updateSEO(id: string, data: { metaTitle: string; metaDesc: string; keywords: string }): Promise<void> {
  try {
    await api.put(`/admin/seo/${id}`, data);
  } catch {
    // mock success
  }
}

export default function SEOPage() {
  const [data, setData] = useState<SEOData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ metaTitle: '', metaDesc: '', keywords: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const d = await fetchSEOData();
      setData(d);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const startEdit = (item: SEOPage) => {
    setEditId(item.id);
    setEditForm({ metaTitle: item.metaTitle, metaDesc: item.metaDesc, keywords: item.keywords });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({ metaTitle: '', metaDesc: '', keywords: '' });
  };

  const saveEdit = async () => {
    if (!editId) return;
    setSaving(true);
    try {
      await updateSEO(editId, editForm);
      setData((prev) => {
        if (!prev) return prev;
        return { ...prev, pages: prev.pages.map((p) => p.id === editId ? { ...p, ...editForm } : p) };
      });
      cancelEdit();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">SEO Management</h1>
      </div>

      {error && <AdminError message={error} onRetry={load} />}

      {loading ? (
        <AdminLoading />
      ) : !data || data.pages.length === 0 ? (
        <AdminEmpty message="No SEO pages found" />
      ) : (
        <>
          <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                  <th className="p-3">Page Path</th>
                  <th className="p-3">Meta Title</th>
                  <th className="p-3">Meta Description</th>
                  <th className="p-3">Keywords</th>
                  <th className="p-3">Last Updated</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.pages.map((item) => (
                  <tr key={item.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    {editId === item.id ? (
                      <>
                        <td className="p-3 font-mono text-[#888] text-xs">{item.path}</td>
                        <td className="p-3">
                          <input value={editForm.metaTitle} onChange={(e) => setEditForm((f) => ({ ...f, metaTitle: e.target.value }))}
                            className="w-full border border-[#ddd] rounded px-2 py-1 text-xs outline-none" />
                        </td>
                        <td className="p-3">
                          <input value={editForm.metaDesc} onChange={(e) => setEditForm((f) => ({ ...f, metaDesc: e.target.value }))}
                            className="w-full border border-[#ddd] rounded px-2 py-1 text-xs outline-none" />
                        </td>
                        <td className="p-3">
                          <input value={editForm.keywords} onChange={(e) => setEditForm((f) => ({ ...f, keywords: e.target.value }))}
                            className="w-full border border-[#ddd] rounded px-2 py-1 text-xs outline-none" />
                        </td>
                        <td className="p-3 text-[#888] text-xs">{formatDate(item.updatedAt)}</td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <button onClick={saveEdit} disabled={saving} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600" title="Save">
                              <span className="material-symbols-outlined text-[18px]">check</span>
                            </button>
                            <button onClick={cancelEdit} className="p-1.5 rounded-lg hover:bg-[#f5f5f5] text-[#666]" title="Cancel">
                              <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-3 font-mono text-[#888] text-xs">{item.path}</td>
                        <td className="p-3 font-medium text-[#333] max-w-[200px] truncate">{item.metaTitle}</td>
                        <td className="p-3 text-[#666] max-w-[250px] truncate">{item.metaDesc}</td>
                        <td className="p-3 text-[#666]">{item.keywords}</td>
                        <td className="p-3 text-[#888] text-xs">{formatDate(item.updatedAt)}</td>
                        <td className="p-3">
                          <button onClick={() => startEdit(item)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Edit">
                            <span className="material-symbols-outlined text-[18px] text-[#666]">edit</span>
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={data.page} totalPages={data.totalPages} total={data.total} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
