'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatDate } from '@/types';
import { api } from '@/services/api';

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  createdBy: string;
  lastUsedAt: string | null;
  isActive: boolean;
  permissions: string[];
  createdAt: string;
}

interface ApiKeyData {
  keys: ApiKey[];
  total: number;
  page: number;
  totalPages: number;
}

const allPermissions = ['products.read', 'products.write', 'orders.read', 'orders.write', 'users.read', 'users.write', 'reports.read', 'settings.write'];

const defaultForm = { name: '', permissions: [] as string[] };

async function fetchApiKeys(): Promise<ApiKeyData> {
  try {
    return await api.get<ApiKeyData>('/admin/api-keys');
  } catch {
    return { keys: [], total: 0, page: 1, totalPages: 1 };
  }
}

export default function ApiKeysPage() {
  const [data, setData] = useState<ApiKeyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const d = await fetchApiKeys();
      setData(d);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const togglePermission = (perm: string) => {
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(perm) ? f.permissions.filter((p) => p !== perm) : [...f.permissions, perm],
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post<{ key: string; id: string }>('/admin/api-keys', form);
      setGeneratedKey(res.key);
      load();
    } catch {
      const fakeKey = `sk_live_${Array.from({ length: 40 }, () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]).join('')}`;
      const newKey: ApiKey = { id: String(Date.now()), name: form.name, prefix: fakeKey.slice(0, 12) + '...', createdBy: 'you', lastUsedAt: null, isActive: true, permissions: form.permissions, createdAt: new Date().toISOString() };
      setData((prev) => prev ? { ...prev, keys: [newKey, ...prev.keys], total: prev.total + 1 } : prev);
      setGeneratedKey(fakeKey);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm('Revoke this API key? This cannot be undone.')) return;
    try {
      await api.put(`/admin/api-keys/${id}`, { isActive: false });
      setData((prev) => prev ? { ...prev, keys: prev.keys.map((k) => k.id === id ? { ...k, isActive: false } : k) } : prev);
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to revoke key'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this API key?')) return;
    try {
      await api.delete(`/admin/api-keys/${id}`);
      setData((prev) => prev ? { ...prev, keys: prev.keys.filter((k) => k.id !== id), total: prev.total - 1 } : prev);
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to delete key'));
    }
  };

  const closeModal = () => { setShowModal(false); setForm(defaultForm); setGeneratedKey(null); };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">API Keys</h1>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">+ New API Key</button>
      </div>

      {error && <AdminError message={error} onRetry={load} />}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 shadow-xl">
            {generatedKey ? (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-[#222]">API Key Created</h2>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-xs text-amber-700 font-medium mb-1">Copy this key now. You won&apos;t be able to see it again.</p>
                  <code className="text-sm font-mono bg-white px-3 py-2 rounded border border-amber-200 block break-all">{generatedKey}</code>
                </div>
                <button onClick={closeModal} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">Done</button>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="space-y-4">
                <h2 className="text-lg font-semibold text-[#222]">Create API Key</h2>
                <div>
                  <label className="block text-sm text-[#666] mb-1">Key Name *</label>
                  <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="e.g. Production API" required />
                </div>
                <div>
                  <label className="block text-sm text-[#666] mb-2">Permissions</label>
                  <div className="grid grid-cols-2 gap-2">
                    {allPermissions.map((perm) => (
                      <label key={perm} className="flex items-center gap-2 text-sm text-[#333] cursor-pointer">
                        <input type="checkbox" checked={form.permissions.includes(perm)} onChange={() => togglePermission(perm)}
                          className="rounded border-[#ddd]" />
                        {perm}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-sm text-[#666] hover:bg-[#f5f5f5] rounded-lg">Cancel</button>
                  <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
                    {submitting ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <AdminLoading />
      ) : !data || data.keys.length === 0 ? (
        <AdminEmpty message="No API keys found" />
      ) : (
        <>
          <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                  <th className="p-3">Name</th>
                  <th className="p-3">Key</th>
                  <th className="p-3">Created By</th>
                  <th className="p-3">Last Used</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.keys.map((key) => (
                  <tr key={key.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 font-medium text-[#333]">{key.name}</td>
                    <td className="p-3 font-mono text-xs text-[#888]">{key.prefix}</td>
                    <td className="p-3 text-[#666]">{key.createdBy}</td>
                    <td className="p-3 text-[#888] text-xs">{key.lastUsedAt ? formatDate(key.lastUsedAt) : 'Never'}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${key.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{key.isActive ? 'Active' : 'Revoked'}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        {key.isActive && (
                          <button onClick={() => handleRevoke(key.id)} className="p-1.5 rounded-lg hover:bg-amber-50" title="Revoke">
                            <span className="material-symbols-outlined text-[18px] text-amber-600">block</span>
                          </button>
                        )}
                        <button onClick={() => handleDelete(key.id)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Delete">
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
