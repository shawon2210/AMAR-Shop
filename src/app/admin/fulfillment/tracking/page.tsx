'use client';

import { useState } from 'react';

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState('');

  const shipment = {
    trackingId: 'AMR001A2B3C',
    status: 'IN_TRANSIT',
    courier: { name: 'RedX' },
    estimatedDays: '2-3 business days',
    timeline: [
      { status: 'DELIVERED', note: 'Package delivered', createdAt: '2026-06-29T14:30:00Z' },
      { status: 'OUT_FOR_DELIVERY', note: 'Out for delivery', createdAt: '2026-06-29T08:00:00Z' },
      { status: 'IN_TRANSIT', note: 'Reached Dhaka hub', createdAt: '2026-06-28T22:00:00Z' },
      { status: 'PICKED_UP', note: 'Picked up from warehouse', createdAt: '2026-06-28T10:00:00Z' },
      { status: 'PENDING', note: 'Shipment created', createdAt: '2026-06-27T16:00:00Z' },
    ],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-headline-md text-on-surface">Track Shipment</h1>

      <div className="flex gap-2 max-w-md">
        <input type="text" value={trackingId} onChange={e => setTrackingId(e.target.value)}
          placeholder="Enter tracking ID..."
          className="flex-1 px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface text-body-sm" />
        <button className="px-4 py-2 bg-primary text-on-primary rounded-lg text-body-sm font-medium">Track</button>
      </div>

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
    </div>
  );
}
