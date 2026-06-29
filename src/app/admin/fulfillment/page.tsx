'use client';

import Link from 'next/link';

export default function FulfillmentPage() {
  const stats = [
    { label: 'Active Shipments', value: '156', icon: 'local_shipping', color: 'text-primary' },
    { label: 'Pending Pickup', value: '23', icon: 'schedule', color: 'text-amber-600' },
    { label: 'In Transit', value: '89', icon: 'route', color: 'text-blue-600' },
    { label: 'Delivered Today', value: '45', icon: 'check_circle', color: 'text-green-600' },
  ];

  const couriers = [
    { name: 'RedX', shipments: 234, delivered: 220, rate: 94, onTime: 91 },
    { name: 'Steadfast', shipments: 189, delivered: 175, rate: 92.6, onTime: 88 },
    { name: 'eCourier', shipments: 156, delivered: 148, rate: 94.9, onTime: 95 },
    { name: 'Pathao', shipments: 98, delivered: 90, rate: 91.8, onTime: 85 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-headline-md text-on-surface">Fulfillment Network</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-surface rounded-xl border border-outline-variant p-4">
            <div className="flex items-center gap-3">
              <div className={s.color}><span className="material-symbols-outlined text-2xl">{s.icon}</span></div>
              <div>
                <p className="text-body-sm text-on-surface-variant">{s.label}</p>
                <p className="text-title-sm text-on-surface font-semibold">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-surface rounded-xl border border-outline-variant p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-title-sm text-on-surface font-semibold">Courier Performance</h2>
            <Link href="/admin/fulfillment/courier" className="text-primary text-body-sm">View All</Link>
          </div>
          <div className="space-y-3">
            {couriers.map((c, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-outline-variant/50 last:border-0">
                <div>
                  <p className="text-body-sm text-on-surface font-medium">{c.name}</p>
                  <p className="text-label-bold text-on-surface-variant">{c.delivered}/{c.shipments} delivered</p>
                </div>
                <div className="text-right">
                  <p className="text-body-sm font-semibold text-green-600">{c.rate}%</p>
                  <p className="text-label-bold text-on-surface-variant">{c.onTime}% on-time</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-outline-variant p-5">
          <h2 className="text-title-sm text-on-surface font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Create Shipment', icon: 'add_circle', href: '/admin/fulfillment' },
              { label: 'Schedule Pickup', icon: 'calendar_today', href: '/admin/fulfillment/pickup' },
              { label: 'Track Order', icon: 'pin_drop', href: '/admin/fulfillment/tracking' },
              { label: 'SLA Calculator', icon: 'timer', href: '/admin/fulfillment' },
            ].map((link, i) => (
              <Link key={i} href={link.href}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-outline-variant hover:bg-primary/5 transition-colors text-center">
                <span className="material-symbols-outlined text-2xl text-primary">{link.icon}</span>
                <span className="text-body-sm text-on-surface font-medium">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant p-5">
        <h2 className="text-title-sm text-on-surface font-semibold mb-4">Recent Shipments</h2>
        <table className="w-full text-body-sm">
          <thead>
            <tr className="border-b border-outline-variant">
              <th className="text-left py-3 px-3 text-on-surface-variant font-medium">Tracking ID</th>
              <th className="text-left py-3 px-3 text-on-surface-variant font-medium">Courier</th>
              <th className="text-left py-3 px-3 text-on-surface-variant font-medium">Status</th>
              <th className="text-left py-3 px-3 text-on-surface-variant font-medium">Est. Delivery</th>
              <th className="text-left py-3 px-3 text-on-surface-variant font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {[
              { tracking: 'AMR001A2B3C', courier: 'RedX', status: 'IN_TRANSIT', eta: '2026-07-01' },
              { tracking: 'AMR004D5E6F', courier: 'Steadfast', status: 'PICKUP_SCHEDULED', eta: '2026-07-02' },
              { tracking: 'AMR007G8H9I', courier: 'eCourier', status: 'DELIVERED', eta: '2026-06-28' },
            ].map((s, i) => (
              <tr key={i} className="border-b border-outline-variant/50 hover:bg-surface-container-low">
                <td className="py-3 px-3 text-on-surface font-mono">{s.tracking}</td>
                <td className="py-3 px-3 text-on-surface-variant">{s.courier}</td>
                <td className="py-3 px-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-bold ${s.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : s.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                    {s.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3 px-3 text-on-surface-variant">{s.eta}</td>
                <td className="py-3 px-3">
                  <button className="text-primary text-body-sm font-medium hover:underline">Track</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
