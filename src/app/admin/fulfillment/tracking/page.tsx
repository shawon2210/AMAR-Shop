'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { api } from '@/services/api';

interface TrackingEvent {
  status: string;
  note: string;
  createdAt: string;
}

interface Shipment {
  trackingId: string;
  status: string;
  courier: { name: string };
  estimatedDays: string;
  timeline: TrackingEvent[];
}

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState('');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async (id?: string) => {
    setLoading(true);
    setError(null);
    try {
      const path = id ? `/admin/fulfillment/tracking?trackingId=${encodeURIComponent(id)}` : '/admin/fulfillment/tracking';
      setShipment(await api.get<Shipment>(path));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tracking data');
      setShipment(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleTrack = () => {
    if (trackingId.trim()) load(trackingId.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleTrack();
  };

  if (loading && !shipment) return <AdminLoading message="Loading shipment..." />;
  if (error && !shipment) return <AdminError message={error} onRetry={() => load()} />;

  return (
    <div className="space-y-6">
      <h1 className="text-headline-md text-on-surface">Track Shipment</h1>

      <div className="flex gap-2 max-w-md">
        <input type="text" value={trackingId} onChange={e => setTrackingId(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter tracking ID..."
          className="flex-1 px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface text-body-sm" />
        <button onClick={handleTrack} className="px-4 py-2 bg-primary text-on-primary rounded-lg text-body-sm font-medium">Track</button>
      </div>

      {loading && <AdminLoading message="Searching..." />}

      {!loading && error && <AdminError message={error} onRetry={() => load(trackingId.trim() || undefined)} />}

      {!loading && !error && !shipment && <AdminEmpty message="No shipment found" icon="local_shipping" />}

      {shipment && !loading && (
        <div className="bg-surface rounded-xl border border-outline-variant p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-label-bold text-on-surface-variant uppercase">Tracking ID</p>
              <p className="text-title-sm text-on-surface font-mono font-semibold">{shipment.trackingId}</p>
            </div>
            <div className="text-right">
              <p className="text-label-bold text-on-surface-variant uppercase">Courier</p>
              <p className="text-body-md text-on-surface font-semibold">{shipment.courier.name}</p>
            </div>
          </div>

          <div className="relative">
            {shipment.timeline.map((event, i) => (
              <div key={i} className="flex gap-4 pb-6 last:pb-0 relative">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full mt-1.5 ${i === 0 ? 'bg-green-500' : 'bg-primary'}`} />
                  {i < shipment.timeline.length - 1 && <div className="w-0.5 flex-1 bg-primary/20 mt-1" />}
                </div>
                <div>
                  <p className="text-body-sm text-on-surface font-medium">{event.status.replace(/_/g, ' ')}</p>
                  <p className="text-body-sm text-on-surface-variant">{event.note}</p>
                  <p className="text-label-bold text-on-surface-variant mt-0.5">
                    {new Date(event.createdAt).toLocaleString('en-BD')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
