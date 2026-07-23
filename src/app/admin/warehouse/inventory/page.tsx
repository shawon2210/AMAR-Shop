'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { api } from '@/services/api';

interface InventoryItem {
  inventoryId: string;
  productId: string;
  productName: string;
  quantity: number;
}

interface BinItem {
  binId: string;
  code: string;
  zone: string;
  items: InventoryItem[];
}

export default function InventoryPage() {
  const [selectedZone, setSelectedZone] = useState('A');
  const [bins, setBins] = useState<BinItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const zones = ['A', 'B', 'C', 'D'];

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setBins(await api.get<BinItem[]>('/admin/warehouse/inventory'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inventory');
      setBins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = selectedZone ? bins.filter(b => b.zone === selectedZone) : bins;

  if (loading) return <AdminLoading message="Loading inventory..." />;
  if (error) return <AdminError message={error} onRetry={load} />;
  if (!bins.length) return <AdminEmpty message="No inventory bins found" icon="shelves" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-md text-on-surface">Inventory by Bin</h1>
        <div className="flex gap-2">
          {zones.map(z => (
            <button key={z} onClick={() => setSelectedZone(z)}
              className={`px-3 py-1.5 rounded-lg text-body-sm font-medium transition-colors ${selectedZone === z ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface hover:bg-surface-container-highest'}`}>
              Zone {z}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(bin => (
          <div key={bin.binId} className="bg-surface rounded-xl border border-outline-variant p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-title-sm text-on-surface font-semibold">{bin.code}</p>
                <p className="text-label-bold text-on-surface-variant uppercase">Zone {bin.zone}</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">shelves</span>
            </div>
            <div className="space-y-2">
              {bin.items.map(item => (
                <div key={item.inventoryId} className="flex justify-between items-center py-2 px-3 bg-surface-container-low rounded-lg">
                  <div>
                    <p className="text-body-sm text-on-surface font-medium">{item.productName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-body-sm font-semibold text-primary">{item.quantity}</span>
                    <button className="text-on-surface-variant hover:text-primary">
                      <span className="material-symbols-outlined text-[18px]">more_vert</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
