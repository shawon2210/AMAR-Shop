'use client';

import { useState } from 'react';
import { useAdminData } from '@/lib/api/hooks';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import {
  fetchCMSPages, createCMSPage, updateCMSPage, deleteCMSPage,
  fetchAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement,
} from '@/lib/api/admin';
import type { CMSPage, Announcement } from '@/lib/api/admin';
import { getErrorMessage } from '@/lib/error-helper';

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── Pages Section ──────────────────────────────────────

function PagesSection({ onError }: { onError: (msg: string) => void }) {
  const { data: pages, loading, error, refetch } = useAdminData(fetchCMSPages);
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', slug: '', content: '', metaTitle: '', metaDesc: '' });
  const [submitting, setSubmitting] = useState(false);

  if (error) onError(error);

  const resetForm = () => { setForm({ title: '', slug: '', content: '', metaTitle: '', metaDesc: '' }); setEditId(null); setShowCreate(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      if (editId) {
        await updateCMSPage(editId, form);
      } else {
        await createCMSPage(form);
      }
      resetForm();
      refetch();
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to save page'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (p: CMSPage) => {
    setEditId(p.id);
    setForm({ title: p.title, slug: p.slug, content: p.content || '', metaTitle: p.metaTitle || '', metaDesc: p.metaDesc || '' });
    setShowCreate(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this page?')) return;
    try { await deleteCMSPage(id); refetch(); } catch (err) { alert(getErrorMessage(err)); }
  };

  const handleToggleActive = async (p: CMSPage) => {
    try { await updateCMSPage(p.id, { isActive: !p.isActive }); refetch(); } catch (err) { alert(getErrorMessage(err)); }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => { resetForm(); setShowCreate(!showCreate); }} className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">+ Create Page</button>
      </div>

      {showCreate && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#eee] p-5 mb-4">
          <h2 className="text-lg font-semibold text-[#222] mb-4">{editId ? 'Edit Page' : 'Create New Page'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#666] mb-1">Title *</label>
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="Page title" required />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Slug</label>
              <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="page-slug" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-[#666] mb-1">Content</label>
              <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                rows={6} className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none resize-none font-mono" placeholder="Page content here..." />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Meta Title</label>
              <input value={form.metaTitle} onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Meta Description</label>
              <input value={form.metaDesc} onChange={(e) => setForm((f) => ({ ...f, metaDesc: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-[#666] hover:bg-[#f5f5f5] rounded-lg">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
              {submitting ? 'Saving...' : editId ? 'Update' : 'Save Page'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <AdminLoading />
      ) : !pages || pages.length === 0 ? (
        <AdminEmpty message="No pages found" />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block bg-white rounded-xl border border-[#eee] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                  <th className="p-3">Title</th>
                  <th className="p-3">Slug</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Last Updated</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((p) => (
                  <tr key={p.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 font-medium text-[#333]">{p.title}</td>
                    <td className="p-3 text-[#888] font-mono text-xs">{p.slug}</td>
                    <td className="p-3"><span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{p.isActive ? 'Published' : 'Draft'}</span></td>
                    <td className="p-3 text-[#888] text-xs">{formatDate(p.updatedAt || p.createdAt)}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button onClick={() => handleToggleActive(p)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title={p.isActive ? 'Set Draft' : 'Publish'}><span className="material-symbols-outlined text-[18px] text-[#666]">{p.isActive ? 'toggle_on' : 'toggle_off'}</span></button>
                        <button onClick={() => handleEdit(p)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Edit"><span className="material-symbols-outlined text-[18px] text-[#666]">edit</span></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Delete"><span className="material-symbols-outlined text-[18px] text-[#666]">delete</span></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {pages.map((p) => (
              <div key={p.id} className="bg-white rounded-xl border border-[#eee] p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm text-[#333]">{p.title}</p>
                  <div className="flex gap-1">
                    <button onClick={() => handleToggleActive(p)} className="p-1 rounded-lg hover:bg-[#f5f5f5]"><span className="material-symbols-outlined text-[18px] text-[#666]">{p.isActive ? 'toggle_on' : 'toggle_off'}</span></button>
                    <button onClick={() => handleEdit(p)} className="p-1 rounded-lg hover:bg-[#f5f5f5]"><span className="material-symbols-outlined text-[18px] text-[#666]">edit</span></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1 rounded-lg hover:bg-[#f5f5f5]"><span className="material-symbols-outlined text-[18px] text-[#666]">delete</span></button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#888] font-mono">/{p.slug}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{p.isActive ? 'Published' : 'Draft'}</span>
                </div>
                <p className="text-[10px] text-[#999]">{formatDate(p.updatedAt || p.createdAt)}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Announcements Section ──────────────────────────────

function AnnouncementsSection({ onError }: { onError: (msg: string) => void }) {
  const { data: announcements, loading, error, refetch } = useAdminData(fetchAnnouncements);
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', message: '', type: 'INFO' });
  const [submitting, setSubmitting] = useState(false);

  if (error) onError(error);

  const resetForm = () => { setForm({ title: '', message: '', type: 'INFO' }); setEditId(null); setShowCreate(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return;
    setSubmitting(true);
    try {
      if (editId) {
        await updateAnnouncement(editId, form);
      } else {
        await createAnnouncement(form);
      }
      resetForm();
      refetch();
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to save announcement'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (a: Announcement) => {
    setEditId(a.id);
    setForm({ title: a.title, message: a.message, type: a.type });
    setShowCreate(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this announcement?')) return;
    try { await deleteAnnouncement(id); refetch(); } catch (err) { alert(getErrorMessage(err)); }
  };

  const handleToggleActive = async (a: Announcement) => {
    try { await updateAnnouncement(a.id, { isActive: !a.isActive }); refetch(); } catch (err) { alert(getErrorMessage(err)); }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => { resetForm(); setShowCreate(!showCreate); }} className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">+ New Announcement</button>
      </div>

      {showCreate && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">{editId ? 'Edit Announcement' : 'New Announcement'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#666] mb-1">Title *</label>
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" required />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none">
                <option value="INFO">Info</option>
                <option value="WARNING">Warning</option>
                <option value="PROMO">Promo</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-[#666] mb-1">Message *</label>
              <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                rows={3} className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none resize-none" required />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-[#666] hover:bg-[#f5f5f5] rounded-lg">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
              {submitting ? 'Saving...' : editId ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <AdminLoading />
      ) : !announcements || announcements.length === 0 ? (
        <AdminEmpty message="No announcements" />
      ) : (
        announcements.map((a) => (
          <div key={a.id} className="bg-white rounded-xl border border-[#eee] p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-[#222]">{a.title}</h3>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${a.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {a.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">{a.type}</span>
                </div>
                <p className="text-sm text-[#666] mt-1">{a.message}</p>
                <p className="text-xs text-[#888] mt-2">{formatDate(a.createdAt)}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleToggleActive(a)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title={a.isActive ? 'Deactivate' : 'Activate'}>
                  <span className="material-symbols-outlined text-[18px] text-[#666]">{a.isActive ? 'toggle_on' : 'toggle_off'}</span>
                </button>
                <button onClick={() => handleEdit(a)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Edit">
                  <span className="material-symbols-outlined text-[18px] text-[#666]">edit</span>
                </button>
                <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Delete">
                  <span className="material-symbols-outlined text-[18px] text-[#666]">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── Main CMS Page ──────────────────────────────────────

export default function CMSPage() {
  const [activeSection, setActiveSection] = useState<'pages' | 'announcements'>('pages');
  const [globalError, setGlobalError] = useState('');

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">CMS</h1>

      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'pages' as const, label: 'Pages', icon: 'article' },
          { key: 'announcements' as const, label: 'Announcements', icon: 'campaign' },
        ].map((s) => (
          <button key={s.key} onClick={() => setActiveSection(s.key)}
            className={`flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${activeSection === s.key ? 'bg-primary text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f5f5f5]'}`}>
            <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      {globalError && <AdminError message={globalError} />}

      {activeSection === 'pages' && <PagesSection onError={setGlobalError} />}
      {activeSection === 'announcements' && <AnnouncementsSection onError={setGlobalError} />}
    </div>
  );
}
