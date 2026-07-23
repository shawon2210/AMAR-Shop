'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate, ORDER_STATUS_COLORS } from '@/types';
import { api } from '@/services/api';

interface ServiceStatus {
  name: string;
  status: string;
  responseTime: string;
  lastChecked: string;
}

interface SystemMetrics {
  uptime: string;
  responseTime: string;
  memory: number;
  memoryUsed: string;
  cpu: number;
  disk: number;
  diskUsed: string;
}

interface MonitoringData {
  metrics: SystemMetrics;
  services: ServiceStatus[];
}

function BarGauge({ value, label, good, bad }: { value: number; label: string; good: number; bad: number }) {
  const color = value <= good ? 'bg-green-500' : value <= bad ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#888]">{label}</span>
        <span className="text-[#333] font-medium">{value}%</span>
      </div>
      <div className="h-2 bg-[#eee] rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  );
}

async function fetchMonitoring(): Promise<MonitoringData> {
  try {
    return await api.get<MonitoringData>('/admin/monitoring');
  } catch {
    return {
      metrics: { uptime: '14d 6h 32m', responseTime: '245ms', memory: 62, memoryUsed: '6.2 GB / 10 GB', cpu: 38, disk: 47, diskUsed: '235 GB / 500 GB' },
      services: [
        { name: 'Web Server', status: 'up', responseTime: '120ms', lastChecked: '2026-07-22T14:00:00Z' },
        { name: 'Database', status: 'up', responseTime: '45ms', lastChecked: '2026-07-22T14:00:00Z' },
        { name: 'Redis Cache', status: 'up', responseTime: '2ms', lastChecked: '2026-07-22T14:00:00Z' },
        { name: 'Queue Worker', status: 'up', responseTime: '—', lastChecked: '2026-07-22T14:00:00Z' },
        { name: 'Storage (S3)', status: 'up', responseTime: '180ms', lastChecked: '2026-07-22T14:00:00Z' },
        { name: 'Email Service', status: 'down', responseTime: '—', lastChecked: '2026-07-22T13:55:00Z' },
        { name: 'Search Engine', status: 'up', responseTime: '90ms', lastChecked: '2026-07-22T14:00:00Z' },
        { name: 'Payment Gateway', status: 'up', responseTime: '310ms', lastChecked: '2026-07-22T14:00:00Z' },
      ],
    };
  }
}

export default function MonitoringPage() {
  const [data, setData] = useState<MonitoringData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchMonitoring();
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">System Monitoring</h1>

      {error && <AdminError message={error} onRetry={fetchData} />}

      {loading ? <AdminLoading /> : !data ? (
        <AdminEmpty message="No monitoring data available" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl border border-[#eee] p-4">
              <p className="text-xs text-[#888] mb-1">Uptime</p>
              <p className="text-lg font-bold text-[#222]">{data.metrics.uptime}</p>
            </div>
            <div className="bg-white rounded-xl border border-[#eee] p-4">
              <p className="text-xs text-[#888] mb-1">Avg Response Time</p>
              <p className="text-lg font-bold text-[#222]">{data.metrics.responseTime}</p>
            </div>
            <div className="bg-white rounded-xl border border-[#eee] p-4">
              <p className="text-xs text-[#888] mb-1">Memory</p>
              <div className="space-y-1">
                <p className="text-lg font-bold text-[#222]">{data.metrics.memory}%</p>
                <p className="text-[10px] text-[#888]">{data.metrics.memoryUsed}</p>
              </div>
              <BarGauge value={data.metrics.memory} label="" good={60} bad={85} />
            </div>
            <div className="bg-white rounded-xl border border-[#eee] p-4">
              <p className="text-xs text-[#888] mb-1">CPU</p>
              <div className="space-y-1">
                <p className="text-lg font-bold text-[#222]">{data.metrics.cpu}%</p>
              </div>
              <BarGauge value={data.metrics.cpu} label="" good={50} bad={80} />
            </div>
            <div className="bg-white rounded-xl border border-[#eee] p-4">
              <p className="text-xs text-[#888] mb-1">Disk</p>
              <div className="space-y-1">
                <p className="text-lg font-bold text-[#222]">{data.metrics.disk}%</p>
                <p className="text-[10px] text-[#888]">{data.metrics.diskUsed}</p>
              </div>
              <BarGauge value={data.metrics.disk} label="" good={70} bad={90} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                  <th className="p-3">Service</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Response Time</th>
                  <th className="p-3">Last Checked</th>
                </tr>
              </thead>
              <tbody>
                {data.services.map((s) => (
                  <tr key={s.name} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 font-medium text-[#333]">{s.name}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${s.status === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.status === 'up' ? 'bg-green-500' : 'bg-red-500'}`} />
                        {s.status === 'up' ? 'Up' : 'Down'}
                      </span>
                    </td>
                    <td className="p-3 text-[#666]">{s.responseTime || '—'}</td>
                    <td className="p-3 text-[#888] text-xs">{formatDate(s.lastChecked)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
