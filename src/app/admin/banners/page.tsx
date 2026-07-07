'use client';

import { useState } from 'react';
import { useAdminData } from '@/lib/api/hooks';
import { fetchBanners, createBanner, updateBanner, deleteBanner } from '@/lib/api/admin';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import type { AdminBanner } from '@/types';
import { getErrorMessage } from '@/lib/error-helper';

const positionColors: Record<string, string> = {
  HOME_TOP: 'bg-purple-100 text-purple-700',
  HOME_MIDDLE: 'bg-blue-100 text-blue-700',
  HOME_BOTTOM: 'bg-green-100 text-green-700',
};

const defaultForm = { title: '', image: '', link: '', position: 'HOME_TOP', sortOrder: '1' };

export default function BannersPage() {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  const { data, loading, error, refetch } = useAdminData(fetchBanners);

  const resetForm = () => { setForm(defaultForm); setEditId(null); setShowForm(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.image.trim()) return;
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        image: form.image,
        link: form.link || undefined,
        position: form.position,
        sortOrder: parseInt(form.sortOrder),
      };
      if (editId) {
        await updateBanner(editId, payload);
      } else {
        await createBanner(payload);
      }
      resetForm();
      refetch();
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to save banner'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (b: AdminBanner) => {
    setEditId(b.id);
    setForm({ title: b.title, image: b.image, link: b.link || '', position: b.position, sortOrder: String(b.sortOrder) });
    setShowForm(true);
  };

  const handleToggle = async (b: AdminBanner) => {
    try {
      await updateBanner(b.id, { isActive: !b.isActive });
      refetch();
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to toggle banner'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    try {
      await deleteBanner(id);
      refetch();
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to delete banner'));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Banners</h1>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">
          + Add Banner
        </button>
      </div>

      {error && <AdminError message={error} onRetry={refetch} />}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">{editId ? 'Edit Banner' : 'Add New Banner'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#666] mb-1">Title *</label>
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="Banner title" required />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Image URL *</label>
              <input value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="https://..." required />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Link URL</label>
              <input value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="/flash-sale/..." />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Position</label>
              <select value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none">
                <option value="HOME_TOP">Home Top</option>
                <option value="HOME_MIDDLE">Home Middle</option>
                <option value="HOME_BOTTOM">Home Bottom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-[#666] hover:bg-[#f5f5f5] rounded-lg">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
              {submitting ? 'Saving...' : editId ? 'Update Banner' : 'Add Banner'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <AdminLoading />
      ) : !data || data.length === 0 ? (
        <AdminEmpty message="No banners found" />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {data.map((banner) => (
            <div key={banner.id} className="bg-white rounded-xl border border-[#eee] p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-full sm:w-48 h-24 rounded-lg bg-gradient-to-br from-[#f0f0f0] to-[#e0e0e0] flex items-center justify-center overflow-hidden">
                  {banner.image ? (
                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-[#888] text-3xl">image</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-[#222]">{banner.title}</h3>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${positionColors[banner.position] || 'bg-gray-100 text-gray-700'}`}>
                      {banner.position.replace(/_/g, ' ')}
                    </span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {banner.link && <p className="text-xs text-[#888] mt-1">Link: {banner.link}</p>}
                  <p className="text-xs text-[#888]">Sort: #{banner.sortOrder}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleToggle(banner)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Toggle">
                    <span className="material-symbols-outlined text-[20px] text-[#666]">{banner.isActive ? 'toggle_on' : 'toggle_off'}</span>
                  </button>
                  <button onClick={() => handleEdit(banner)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Edit">
                    <span className="material-symbols-outlined text-[18px] text-[#666]">edit</span>
                  </button>
                  <button onClick={() => handleDelete(banner.id)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Delete">
                    <span className="material-symbols-outlined text-[18px] text-[#666]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
