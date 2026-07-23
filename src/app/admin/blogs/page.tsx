'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatDate } from '@/types';
import { api } from '@/services/api';

interface BlogPost {
  id: string;
  title: string;
  author: string;
  category: string;
  status: 'Published' | 'Draft';
  views: number;
  image: string;
  content: string;
  createdAt: string;
}

interface BlogData {
  posts: BlogPost[];
  total: number;
  page: number;
  totalPages: number;
}

const defaultForm = { title: '', author: '', category: '', status: 'Draft' as 'Published' | 'Draft', image: '', content: '' };
const categories = ['Fashion', 'Tech', 'Lifestyle', 'Food', 'Travel'];

async function fetchBlogs(): Promise<BlogData> {
  try {
    return await api.get<BlogData>('/admin/blogs');
  } catch {
    return {
      posts: [
        { id: '1', title: 'Summer Fashion Trends 2026', author: 'Rahim Khan', category: 'Fashion', status: 'Published', views: 1240, image: '', content: 'Summer fashion content...', createdAt: '2026-07-20T10:00:00Z' },
        { id: '2', title: 'Top Gadgets of the Year', author: 'Sadia Islam', category: 'Tech', status: 'Published', views: 980, image: '', content: 'Gadget review content...', createdAt: '2026-07-18T08:30:00Z' },
        { id: '3', title: 'Healthy Eating Tips', author: 'Farzana Ahmed', category: 'Lifestyle', status: 'Draft', views: 0, image: '', content: 'Draft content...', createdAt: '2026-07-15T14:00:00Z' },
        { id: '4', title: 'Traditional Bangladeshi Cuisine', author: 'Shamim Hasan', category: 'Food', status: 'Published', views: 1560, image: '', content: 'Food content...', createdAt: '2026-07-12T09:00:00Z' },
      ],
      total: 4,
      page: 1,
      totalPages: 1,
    };
  }
}

export default function BlogsPage() {
  const [data, setData] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const d = await fetchBlogs();
      setData(d);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm(defaultForm); setEditId(null); };

  const openCreate = () => { resetForm(); setShowModal(true); };

  const openEdit = (post: BlogPost) => {
    setEditId(post.id);
    setForm({ title: post.title, author: post.author, category: post.category, status: post.status, image: post.image, content: post.content });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) return;
    setSubmitting(true);
    try {
      if (editId) {
        await api.put(`/admin/blogs/${editId}`, form);
        setData((prev) => prev ? { ...prev, posts: prev.posts.map((p) => p.id === editId ? { ...p, ...form } : p) } : prev);
      } else {
        const newPost: BlogPost = { id: String(Date.now()), ...form, views: 0, createdAt: new Date().toISOString() };
        setData((prev) => prev ? { ...prev, posts: [newPost, ...prev.posts], total: prev.total + 1 } : prev);
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to save blog post'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    try {
      await api.delete(`/admin/blogs/${id}`);
      setData((prev) => prev ? { ...prev, posts: prev.posts.filter((p) => p.id !== id), total: prev.total - 1 } : prev);
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to delete blog post'));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Blog Posts</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">+ New Post</button>
      </div>

      {error && <AdminError message={error} onRetry={load} />}

      {showModal && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">{editId ? 'Edit Post' : 'New Blog Post'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm text-[#666] mb-1">Title *</label>
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" required />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Author *</label>
              <input value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" required />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none">
                <option value="">Select</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as 'Published' | 'Draft' }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none">
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Image URL</label>
              <input value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-[#666] mb-1">Content</label>
              <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none min-h-[120px]" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 text-sm text-[#666] hover:bg-[#f5f5f5] rounded-lg">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
              {submitting ? 'Saving...' : editId ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <AdminLoading />
      ) : !data || data.posts.length === 0 ? (
        <AdminEmpty message="No blog posts found" />
      ) : (
        <>
          <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                  <th className="p-3">Title</th>
                  <th className="p-3">Author</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Views</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.posts.map((post) => (
                  <tr key={post.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 font-medium text-[#333] max-w-[200px] truncate">{post.title}</td>
                    <td className="p-3 text-[#666]">{post.author}</td>
                    <td className="p-3"><span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{post.category}</span></td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${post.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{post.status}</span>
                    </td>
                    <td className="p-3 text-[#666]">{post.views.toLocaleString()}</td>
                    <td className="p-3 text-[#888] text-xs">{formatDate(post.createdAt)}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(post)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Edit">
                          <span className="material-symbols-outlined text-[18px] text-[#666]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(post.id)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Delete">
                          <span className="material-symbols-outlined text-[18px] text-[#666]">delete</span>
                        </button>
                      </div>
                    </td>
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
