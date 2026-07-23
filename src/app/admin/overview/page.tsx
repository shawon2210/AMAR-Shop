'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { api } from '@/services/api';
import { getErrorMessage } from '@/lib/error-helper';

interface DashboardStat {
  label: string;
  value: string;
  change: string;
  icon: string;
  trend: 'up' | 'down';
}

interface DashboardStats {
  stats: DashboardStat[];
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<DashboardStats>({ stats: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<DashboardStats>('/admin/dashboard/stats');
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err));
      setData({ stats: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-sm text-slate-500">Welcome back, Admin. Here is what is happening today.</p>
      </div>

      {error && <AdminError message={error} onRetry={fetchStats} />}

      {loading ? <AdminLoading /> : !data.stats || data.stats.length === 0 ? (
        <AdminEmpty message="No dashboard data available" icon="dashboard" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.stats.map((stat) => (
              <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="material-symbols-outlined text-slate-400">{stat.icon}</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-slate-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900 mb-4">Recent Sales Activity</h2>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl text-slate-400">
                [Chart Component Placeholder]
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900 mb-4">Urgent Actions</h2>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                    <p className="text-sm font-medium text-slate-800">Pending Order #402{i}</p>
                    <p className="text-xs text-slate-400">Waiting for courier assignment</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
