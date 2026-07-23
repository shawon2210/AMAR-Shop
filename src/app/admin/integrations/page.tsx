'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { getErrorMessage } from '@/lib/error-helper';
import { api } from '@/services/api';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
}

async function fetchIntegrations(): Promise<Integration[]> {
  try {
    return await api.get<Integration[]>('/admin/integrations');
  } catch {
    return [];
  }
}

export default function IntegrationsPage() {
  const [data, setData] = useState<Integration[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const d = await fetchIntegrations();
      setData(d);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleToggle = async (item: Integration) => {
    try {
      await api.put(`/admin/integrations/${item.id}`, { connected: !item.connected });
      setData((prev) => prev ? prev.map((i) => i.id === item.id ? { ...i, connected: !i.connected } : i) : prev);
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to toggle integration'));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Integrations</h1>
      </div>

      {error && <AdminError message={error} onRetry={load} />}

      {loading ? (
        <AdminLoading />
      ) : !data || data.length === 0 ? (
        <AdminEmpty message="No integrations found" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-[#eee] p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-[#f5f5f5] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#666]">{item.icon}</span>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${item.connected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {item.connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-[#222]">{item.name}</h3>
                <p className="text-xs text-[#888] mt-1">{item.description}</p>
              </div>
              <button onClick={() => handleToggle(item)}
                className={`w-full text-sm px-4 py-2 rounded-lg transition-colors ${item.connected ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-primary text-white hover:bg-primary/90'}`}>
                {item.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
