'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatDate } from '@/types';
import { api } from '@/services/api';

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  resource: string;
  resourceId: string;
  ip: string;
  details: string;
}

interface AuditData {
  entries: AuditEntry[];
  total: number;
  page: number;
  totalPages: number;
}

const actionTypes = ['All', 'CREATE', 'UPDATE', 'DELETE'];

async function fetchAuditLogs(): Promise<AuditData> {
  try {
    return await api.get<AuditData>('/admin/audit-logs');
  } catch {
    return { entries: [], total: 0, page: 1, totalPages: 1 };
  }
}

export default function AuditLogsPage() {
  const [data, setData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [actionFilter, setActionFilter] = useState('All');

  const load = async () => {
    setLoading(true);
    try {
      const d = await fetchAuditLogs();
      setData(d);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = !data ? [] : data.entries.filter((e) => {
    if (actionFilter !== 'All' && e.action !== actionFilter) return false;
    if (dateFrom && new Date(e.timestamp) < new Date(dateFrom)) return false;
    if (dateTo && new Date(e.timestamp) > new Date(dateTo + 'T23:59:59Z')) return false;
    return true;
  });

  const actionColors: Record<string, string> = {
    CREATE: 'bg-green-100 text-green-700',
    UPDATE: 'bg-blue-100 text-blue-700',
    DELETE: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Audit Logs</h1>
      </div>

      <div className="flex gap-4 flex-wrap items-end">
        <div>
          <label className="block text-xs text-[#666] mb-1">Action</label>
          <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}
            className="border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none">
            {actionTypes.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-[#666] mb-1">From</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
        </div>
        <div>
          <label className="block text-xs text-[#666] mb-1">To</label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            className="border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
        </div>
        {(dateFrom || dateTo || actionFilter !== 'All') && (
          <button onClick={() => { setDateFrom(''); setDateTo(''); setActionFilter('All'); }} className="text-sm text-[#666] hover:text-[#222] px-3 py-2">Clear</button>
        )}
      </div>

      {error && <AdminError message={error} onRetry={load} />}

      {loading ? (
        <AdminLoading />
      ) : filtered.length === 0 ? (
        <AdminEmpty message="No audit logs found" />
      ) : (
        <>
          <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Resource</th>
                  <th className="p-3">ID</th>
                  <th className="p-3">IP</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => (
                  <tr key={entry.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 text-[#888] text-xs whitespace-nowrap">{formatDate(entry.timestamp)} {new Date(entry.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="p-3 text-[#666]">{entry.user}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${actionColors[entry.action]}`}>{entry.action}</span>
                    </td>
                    <td className="p-3 text-[#333]">{entry.resource}</td>
                    <td className="p-3 font-mono text-xs text-[#888]">{entry.resourceId}</td>
                    <td className="p-3 font-mono text-xs text-[#888]">{entry.ip}</td>
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
