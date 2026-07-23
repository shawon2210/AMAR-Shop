'use client';

import { useState, useEffect, useRef } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { getErrorMessage } from '@/lib/error-helper';
import { formatDate } from '@/types';
import { api } from '@/services/api';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  source: string;
  message: string;
}

const tabs = ['Application', 'Error', 'Access'] as const;

const levelColors: Record<string, string> = {
  INFO: 'bg-blue-100 text-blue-700',
  WARN: 'bg-amber-100 text-amber-700',
  ERROR: 'bg-red-100 text-red-700',
};

const mockLogs: Record<string, LogEntry[]> = {
  Application: [
    { id: 'a1', timestamp: '2026-07-23T10:30:00Z', level: 'INFO', source: 'api-server', message: 'Server started on port 4000' },
    { id: 'a2', timestamp: '2026-07-23T10:29:00Z', level: 'INFO', source: 'database', message: 'Connected to MongoDB cluster' },
    { id: 'a3', timestamp: '2026-07-23T10:28:00Z', level: 'WARN', source: 'cache', message: 'Redis connection retry #2' },
    { id: 'a4', timestamp: '2026-07-23T10:25:00Z', level: 'INFO', source: 'cron', message: 'Daily report generated successfully' },
    { id: 'a5', timestamp: '2026-07-23T10:20:00Z', level: 'INFO', source: 'api-server', message: 'GET /api/products - 200 - 45ms' },
  ],
  Error: [
    { id: 'e1', timestamp: '2026-07-23T10:15:00Z', level: 'ERROR', source: 'payment-worker', message: 'Payment gateway timeout for order O-7891' },
    { id: 'e2', timestamp: '2026-07-23T10:00:00Z', level: 'ERROR', source: 'api-server', message: 'Unhandled error: Cannot read properties of null' },
    { id: 'e3', timestamp: '2026-07-23T09:45:00Z', level: 'WARN', source: 'sms-service', message: 'SMS API rate limit approaching' },
    { id: 'e4', timestamp: '2026-07-23T09:30:00Z', level: 'ERROR', source: 'email-service', message: 'SMTP connection failed, retrying...' },
    { id: 'e5', timestamp: '2026-07-23T09:00:00Z', level: 'ERROR', source: 'database', message: 'Query timeout: db.orders.find() took 12s' },
  ],
  Access: [
    { id: 'x1', timestamp: '2026-07-23T10:30:00Z', level: 'INFO', source: 'auth', message: 'Admin login from 192.168.1.100' },
    { id: 'x2', timestamp: '2026-07-23T10:25:00Z', level: 'WARN', source: 'auth', message: 'Failed login attempt for admin@amarshop.com from 45.33.22.11' },
    { id: 'x3', timestamp: '2026-07-23T10:20:00Z', level: 'INFO', source: 'api-server', message: 'GET /admin/orders - admin@amarshop.com' },
    { id: 'x4', timestamp: '2026-07-23T10:15:00Z', level: 'INFO', source: 'auth', message: 'Token refreshed for user@example.com' },
    { id: 'x5', timestamp: '2026-07-23T10:00:00Z', level: 'WARN', source: 'auth', message: 'Suspicious activity: multiple 401 from IP 185.220.101.1' },
  ],
};

async function fetchLogs(): Promise<Record<string, LogEntry[]>> {
  try {
    return await api.get<Record<string, LogEntry[]>>('/admin/logs');
  } catch {
    return mockLogs;
  }
}

export default function LogsPage() {
  const [activeTab, setActiveTab] = useState<string>('Application');
  const [data, setData] = useState<Record<string, LogEntry[]> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = async () => {
    try {
      const d = await fetchLogs();
      setData(d);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(load, 10000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [autoRefresh]);

  const logs = data ? data[activeTab] || [] : [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">System Logs</h1>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-[#666] cursor-pointer">
            <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-[#ddd]" />
            Auto-refresh (10s)
          </label>
          <button onClick={load} className="px-3 py-1.5 text-sm border border-[#ddd] rounded-lg hover:bg-[#f5f5f5] text-[#666] flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${activeTab === tab ? 'bg-primary text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f5f5f5]'}`}>
            {tab} {data && <span className="ml-1 text-xs opacity-70">({(data[tab] || []).length})</span>}
          </button>
        ))}
      </div>

      {error && <AdminError message={error} onRetry={load} />}

      {loading ? (
        <AdminLoading />
      ) : logs.length === 0 ? (
        <AdminEmpty message={`No ${activeTab.toLowerCase()} logs found`} />
      ) : (
        <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                <th className="p-3">Timestamp</th>
                <th className="p-3">Level</th>
                <th className="p-3">Source</th>
                <th className="p-3">Message</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                  <td className="p-3 text-[#888] text-xs whitespace-nowrap">{formatDate(log.timestamp)} {new Date(log.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                  <td className="p-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${levelColors[log.level]}`}>{log.level}</span>
                  </td>
                  <td className="p-3 font-mono text-xs text-[#888]">{log.source}</td>
                  <td className="p-3 text-[#333] max-w-[400px] truncate">{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
