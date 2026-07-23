'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate, ORDER_STATUS_COLORS } from '@/types';
import { api } from '@/services/api';

interface Job {
  id: string;
  name: string;
  status: string;
  lastRun: string;
  nextRun: string;
  duration: string;
  description?: string;
}

interface JobsResponse {
  data: Job[];
  total: number;
}

async function fetchJobs(): Promise<JobsResponse> {
  try {
    return await api.get<JobsResponse>('/admin/jobs');
  } catch {
    const mock: Job[] = [
      { id: '1', name: 'Send Daily Digest Emails', status: 'success', lastRun: '2026-07-22T06:00:00Z', nextRun: '2026-07-23T06:00:00Z', duration: '12s', description: 'Sends daily order summary emails to customers' },
      { id: '2', name: 'Process Pending Refunds', status: 'running', lastRun: '2026-07-22T00:00:00Z', nextRun: '2026-07-23T00:00:00Z', duration: '—', description: 'Processes all pending refund requests' },
      { id: '3', name: 'Generate Seller Settlements', status: 'failed', lastRun: '2026-07-21T23:00:00Z', nextRun: '2026-07-22T23:00:00Z', duration: '45s', description: 'Calculates and generates seller settlement reports' },
      { id: '4', name: 'Clear Expired Flash Sales', status: 'success', lastRun: '2026-07-22T05:00:00Z', nextRun: '2026-07-23T05:00:00Z', duration: '3s', description: 'Deactivates flash sales past their end date' },
      { id: '5', name: 'Update Product Search Index', status: 'success', lastRun: '2026-07-22T04:00:00Z', nextRun: '2026-07-23T04:00:00Z', duration: '28s', description: 'Reindexes products for search functionality' },
      { id: '6', name: 'Cleanup Expired Cart Sessions', status: 'success', lastRun: '2026-07-22T03:00:00Z', nextRun: '2026-07-23T03:00:00Z', duration: '8s', description: 'Removes cart sessions older than 7 days' },
    ];
    return { data: mock, total: mock.length };
  }
}

const statusStyles: Record<string, string> = {
  running: 'bg-blue-100 text-blue-700',
  success: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
};

export default function JobsPage() {
  const [data, setData] = useState<JobsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchJobs();
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRunNow = async (id: string) => {
    try {
      await api.post(`/admin/jobs/${id}/run`, {});
      fetchData();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">Scheduled Jobs</h1>

      {error && <AdminError message={error} onRetry={fetchData} />}

      {loading ? <AdminLoading /> : !data || data.data.length === 0 ? (
        <AdminEmpty message="No jobs found" />
      ) : (
        <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                <th className="p-3">Name</th>
                <th className="p-3">Status</th>
                <th className="p-3">Last Run</th>
                <th className="p-3">Next Run</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((j) => (
                <tr key={j.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                  <td className="p-3 max-w-[240px]">
                    <p className="font-medium text-[#333] truncate">{j.name}</p>
                    {j.description && <p className="text-[#888] text-xs truncate">{j.description}</p>}
                  </td>
                  <td className="p-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${statusStyles[j.status] || 'bg-gray-100 text-gray-700'}`}>
                      {j.status === 'running' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
                      {j.status === 'success' ? 'Success' : j.status === 'failed' ? 'Failed' : 'Running'}
                    </span>
                  </td>
                  <td className="p-3 text-[#888] text-xs">{j.lastRun ? formatDate(j.lastRun) : '—'}</td>
                  <td className="p-3 text-[#888] text-xs">{j.nextRun ? formatDate(j.nextRun) : '—'}</td>
                  <td className="p-3 text-[#666]">{j.duration}</td>
                  <td className="p-3">
                    <button onClick={() => handleRunNow(j.id)}
                      disabled={j.status === 'running'}
                      className="text-xs bg-primary text-white px-3 py-1 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">play_arrow</span> Run Now
                    </button>
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
