'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate, ORDER_STATUS_COLORS } from '@/types';
import { api } from '@/services/api';

interface Backup {
  id: string;
  filename: string;
  size: string;
  type: string;
  createdAt: string;
  status: string;
}

interface BackupsResponse {
  data: Backup[];
  total: number;
}

async function fetchBackups(): Promise<BackupsResponse> {
  try {
    return await api.get<BackupsResponse>('/admin/backups');
  } catch {
    return { data: [], total: 0 };
  }
}

export default function BackupsPage() {
  const [data, setData] = useState<BackupsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchBackups();
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      await api.post('/admin/backups', {});
      await fetchData();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  const handleDownload = async (id: string) => {
    try {
      const res = await api.get<{ url: string }>(`/admin/backups/${id}/download`);
      window.open(res.url, '_blank');
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleRestore = async (id: string) => {
    if (!confirm('Restore this backup? This will overwrite current data.')) return;
    try {
      await api.post(`/admin/backups/${id}/restore`, {});
      alert('Restore started. Monitor progress in the jobs page.');
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this backup permanently?')) return;
    try {
      await api.delete(`/admin/backups/${id}`);
      fetchData();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Backups</h1>
        <button onClick={handleCreate} disabled={creating}
          className="bg-primary text-white text-sm px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1 disabled:opacity-50">
          <span className="material-symbols-outlined text-[18px]">{creating ? 'sync' : 'backup'}</span>
          {creating ? 'Creating...' : 'Create Backup'}
        </button>
      </div>

      {error && <AdminError message={error} onRetry={fetchData} />}

      {loading ? <AdminLoading /> : !data || data.data.length === 0 ? (
        <AdminEmpty message="No backups found" />
      ) : (
        <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                <th className="p-3">Filename</th>
                <th className="p-3">Size</th>
                <th className="p-3">Type</th>
                <th className="p-3">Created</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((b) => (
                <tr key={b.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                  <td className="p-3 font-medium text-[#333] max-w-[280px] truncate">{b.filename}</td>
                  <td className="p-3 text-[#666]">{b.size}</td>
                  <td className="p-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${b.type === 'Full' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'}`}>
                      {b.type}
                    </span>
                  </td>
                  <td className="p-3 text-[#888] text-xs">{formatDate(b.createdAt)}</td>
                  <td className="p-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${b.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button onClick={() => handleDownload(b.id)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Download">
                        <span className="material-symbols-outlined text-[18px] text-[#666]">download</span>
                      </button>
                      <button onClick={() => handleRestore(b.id)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Restore">
                        <span className="material-symbols-outlined text-[18px] text-[#666]">restore</span>
                      </button>
                      <button onClick={() => handleDelete(b.id)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Delete">
                        <span className="material-symbols-outlined text-[18px] text-red-500">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
