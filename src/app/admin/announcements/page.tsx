'use client';

import { useState, useEffect } from 'react';
import { fetchAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '@/lib/api/admin/cms-support';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import type { Announcement } from '@/types';
import { getErrorMessage } from '@/lib/error-helper';
import { formatDate } from '@/types';

const defaultForm = { title: '', message: '', type: 'Info', expiresAt: '' };

export default function AnnouncementsPage() {
  const [data, setData] = useState<Announcement[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await fetchAnnouncements();
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

  const openEdit = (a: Announcement) => {
    setEditId(a.id);
    setForm({ title: a.title, message: a.message, type: a.type, expiresAt: a.expiresAt ? a.expiresAt.split('T')[0] : '' });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return;
    setSubmitting(true);
    try {
      const payload = { title: form.title, message: form.message, type: form.type, expiresAt: form.expiresAt || undefined };
      if (editId) {
        await updateAnnouncement(editId, payload);
      } else {
        await createAnnouncement(payload);
      }
      setShowModal(false);
      resetForm();
      load();
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to save announcement'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (a: Announcement) => {
    try {
      await updateAnnouncement(a.id, { isActive: !a.isActive });
      load();
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to toggle announcement'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this announcement?')) return;
    try {
      await deleteAnnouncement(id);
      load();
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to delete announcement'));
    }
  };

  const isExpired = (a: Announcement) => a.expiresAt && new Date(a.expiresAt) < new Date();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Announcements</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">+ New Announcement</button>
      </div>

      {error && <AdminError message={error} onRetry={load} />}

      {showModal && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">{editId ? 'Edit Announcement' : 'New Announcement'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm text-[#666] mb-1">Title *</label>
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-[#666] mb-1">Message *</label>
              <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none min-h-[100px]" required />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none">
                <option value="Info">Info</option>
                <option value="Warning">Warning</option>
                <option value="Promotion">Promotion</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Expires At</label>
              <input type="date" value={form.expiresAt} onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
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
      ) : !data || data.length === 0 ? (
        <AdminEmpty message="No announcements found" />
      ) : (
        <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                <th className="p-3">Title</th>
                <th className="p-3">Type</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((a) => {
                const expired = isExpired(a);
                const status = expired ? 'Expired' : a.isActive ? 'Active' : 'Inactive';
                return (
                  <tr key={a.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 font-medium text-[#333] max-w-[250px] truncate">{a.title}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${a.type === 'Warning' ? 'bg-red-100 text-red-700' : a.type === 'Promotion' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{a.type}</span>
                    </td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${status === 'Active' ? 'bg-green-100 text-green-700' : status === 'Expired' ? 'bg-gray-100 text-gray-700' : 'bg-amber-100 text-amber-700'}`}>{status}</span>
                    </td>
                    <td className="p-3 text-[#888] text-xs">{formatDate(a.createdAt)}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Edit">
                          <span className="material-symbols-outlined text-[18px] text-[#666]">edit</span>
                        </button>
                        <button onClick={() => handleToggle(a)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Toggle">
                          <span className="material-symbols-outlined text-[18px] text-[#666]">{a.isActive ? 'toggle_on' : 'toggle_off'}</span>
                        </button>
                        <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Delete">
                          <span className="material-symbols-outlined text-[18px] text-[#666]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
