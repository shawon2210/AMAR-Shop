'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate, ORDER_STATUS_COLORS } from '@/types';
import { api } from '@/services/api';

interface Segment {
  id: string;
  name: string;
  description: string;
  count: number;
  criteria: string;
  createdAt: string;
}

interface SegmentsResponse {
  data: Segment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

async function fetchSegments(params: { page: number; limit: number }): Promise<SegmentsResponse> {
  try {
    const q = new URLSearchParams();
    q.set('page', String(params.page));
    q.set('limit', String(params.limit));
    return await api.get<SegmentsResponse>(`/admin/segments?${q.toString()}`);
  } catch {
    return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
  }
}

export default function SegmentsPage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<SegmentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', criteria: '' });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchSegments({ page, limit: 10 });
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page]);

  const handleCreate = async () => {
    try {
      await api.post('/admin/segments', form);
      setShowModal(false);
      setForm({ name: '', description: '', criteria: '' });
      fetchData();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Customer Segments</h1>
        <button onClick={() => setShowModal(true)}
          className="bg-primary text-white text-sm px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">add</span> Create Segment
        </button>
      </div>

      {error && <AdminError message={error} onRetry={fetchData} />}

      {loading ? <AdminLoading /> : !data || data.data.length === 0 ? (
        <AdminEmpty message="No segments found" />
      ) : (
        <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                <th className="p-3">Name</th>
                <th className="p-3">Description</th>
                <th className="p-3">Count</th>
                <th className="p-3">Criteria</th>
                <th className="p-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((s) => (
                <tr key={s.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                  <td className="p-3 font-medium text-[#333]">{s.name}</td>
                  <td className="p-3 text-[#666] max-w-[240px] truncate">{s.description}</td>
                  <td className="p-3 text-[#333]">{s.count.toLocaleString()}</td>
                  <td className="p-3">
                    <span className="bg-blue-100 text-blue-700 text-[11px] font-medium px-2 py-0.5 rounded-full">{s.criteria}</span>
                  </td>
                  <td className="p-3 text-[#888] text-xs">{formatDate(s.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && data.totalPages > 1 && (
        <Pagination page={page} totalPages={data.totalPages} total={data.total} onPageChange={setPage} />
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[#222]">Create Segment</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-[#f5f5f5] rounded-lg">
                <span className="material-symbols-outlined text-[#888]">close</span>
              </button>
            </div>
            <input placeholder="Segment name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
            <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
            <input placeholder="Criteria (e.g. Orders > 5)" value={form.criteria} onChange={(e) => setForm({ ...form, criteria: e.target.value })}
              className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
            <button onClick={handleCreate} className="w-full bg-primary text-white text-sm py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Create Segment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
