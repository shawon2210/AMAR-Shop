'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { api } from '@/services/api';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
}

interface FAQData {
  items: FAQItem[];
  total: number;
  page: number;
  totalPages: number;
}

const defaultForm = { question: '', answer: '', category: 'General', sortOrder: '1', isActive: true };
const categories = ['General', 'Orders', 'Shipping', 'Returns', 'Payments', 'Account'];

async function fetchFAQs(): Promise<FAQData> {
  try {
    return await api.get<FAQData>('/admin/faq');
  } catch {
    return {
      items: [
        { id: '1', question: 'How long does shipping take?', answer: 'Standard shipping takes 3-5 business days.', category: 'Shipping', sortOrder: 1, isActive: true },
        { id: '2', question: 'What payment methods do you accept?', answer: 'We accept bKash, Nagad, and Cash on Delivery.', category: 'Payments', sortOrder: 2, isActive: true },
        { id: '3', question: 'Can I return a product?', answer: 'Yes, within 7 days of delivery.', category: 'Returns', sortOrder: 1, isActive: true },
        { id: '4', question: 'How do I track my order?', answer: 'Use the tracking number sent to your email.', category: 'Orders', sortOrder: 1, isActive: false },
        { id: '5', question: 'How to create an account?', answer: 'Click Sign Up and enter your details.', category: 'Account', sortOrder: 1, isActive: true },
      ],
      total: 5,
      page: 1,
      totalPages: 1,
    };
  }
}

export default function FAQPage() {
  const [data, setData] = useState<FAQData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');

  const load = async () => {
    setLoading(true);
    try {
      const d = await fetchFAQs();
      setData(d);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = !data ? [] : categoryFilter === 'All' ? data.items : data.items.filter((f) => f.category === categoryFilter);

  const resetForm = () => { setForm(defaultForm); setEditId(null); };

  const openCreate = () => { resetForm(); setShowModal(true); };

  const openEdit = (item: FAQItem) => {
    setEditId(item.id);
    setForm({ question: item.question, answer: item.answer, category: item.category, sortOrder: String(item.sortOrder), isActive: item.isActive });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) return;
    setSubmitting(true);
    try {
      const payload = { question: form.question, answer: form.answer, category: form.category, sortOrder: parseInt(form.sortOrder), isActive: form.isActive };
      if (editId) {
        await api.put(`/admin/faq/${editId}`, payload);
      } else {
        await api.post('/admin/faq', payload);
      }
      setShowModal(false);
      resetForm();
      load();
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to save FAQ'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (item: FAQItem) => {
    try {
      await api.put(`/admin/faq/${item.id}`, { isActive: !item.isActive });
      setData((prev) => prev ? { ...prev, items: prev.items.map((f) => f.id === item.id ? { ...f, isActive: !f.isActive } : f) } : prev);
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to toggle FAQ'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    try {
      await api.delete(`/admin/faq/${id}`);
      setData((prev) => prev ? { ...prev, items: prev.items.filter((f) => f.id !== id), total: prev.total - 1 } : prev);
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to delete FAQ'));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">FAQ</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">+ Add FAQ</button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['All', ...categories].map((cat) => (
          <button key={cat} onClick={() => setCategoryFilter(cat)}
            className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${categoryFilter === cat ? 'bg-primary text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f5f5f5]'}`}>
            {cat}
          </button>
        ))}
      </div>

      {error && <AdminError message={error} onRetry={load} />}

      {showModal && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">{editId ? 'Edit FAQ' : 'Add FAQ'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm text-[#666] mb-1">Question *</label>
              <input value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-[#666] mb-1">Answer *</label>
              <textarea value={form.answer} onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none min-h-[80px]" required />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="faq-active" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                className="rounded border-[#ddd]" />
              <label htmlFor="faq-active" className="text-sm text-[#666]">Active</label>
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
      ) : filtered.length === 0 ? (
        <AdminEmpty message="No FAQs found" />
      ) : (
        <>
          <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                  <th className="p-3">Question</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Sort Order</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 font-medium text-[#333] max-w-[300px] truncate">{item.question}</td>
                    <td className="p-3"><span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{item.category}</span></td>
                    <td className="p-3 text-[#666]">{item.sortOrder}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{item.isActive ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Edit">
                          <span className="material-symbols-outlined text-[18px] text-[#666]">edit</span>
                        </button>
                        <button onClick={() => handleToggle(item)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Toggle">
                          <span className="material-symbols-outlined text-[18px] text-[#666]">{item.isActive ? 'toggle_on' : 'toggle_off'}</span>
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Delete">
                          <span className="material-symbols-outlined text-[18px] text-[#666]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={data!.page} totalPages={data!.totalPages} total={data!.total} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
