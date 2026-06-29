'use client';

export default function CourierPage() {
  const couriers = [
    { name: 'RedX', slug: 'redx', shipments: 234, delivered: 220, failed: 5, returned: 9, onTime: 91, codCollected: 456000, codRemitted: 442320 },
    { name: 'Steadfast', slug: 'steadfast', shipments: 189, delivered: 175, failed: 8, returned: 6, onTime: 88, codCollected: 321000, codRemitted: 311370 },
    { name: 'eCourier', slug: 'ecourier', shipments: 156, delivered: 148, failed: 3, returned: 5, onTime: 95, codCollected: 289000, codRemitted: 283220 },
    { name: 'Pathao', slug: 'pathao', shipments: 98, delivered: 90, failed: 4, returned: 4, onTime: 85, codCollected: 167000, codRemitted: 160320 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-headline-md text-on-surface">Courier Performance</h1>

      <div className="grid grid-cols-1 gap-3">
        {couriers.map((c, i) => (
          <div key={i} className="bg-surface rounded-xl border border-outline-variant p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">local_shipping</span>
                </div>
                <div>
                  <h3 className="text-title-sm text-on-surface font-semibold">{c.name}</h3>
                  <p className="text-label-bold text-on-surface-variant uppercase">{c.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-body-sm">
                <div className="text-center">
                  <p className="text-on-surface-variant">Delivery Rate</p>
                  <p className="text-title-sm text-green-600 font-semibold">{c.delivered && c.shipments ? ((c.delivered / c.shipments) * 100).toFixed(1) : 0}%</p>
                </div>
                <div className="text-center">
                  <p className="text-on-surface-variant">On-Time</p>
                  <p className="text-title-sm text-blue-600 font-semibold">{c.onTime}%</p>
                </div>
                <div className="text-center">
                  <p className="text-on-surface-variant">Failure</p>
                  <p className="text-title-sm text-error font-semibold">{c.shipments ? ((c.failed / c.shipments) * 100).toFixed(1) : 0}%</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 pt-3 border-t border-outline-variant">
              <div>
                <p className="text-label-bold text-on-surface-variant">Total Shipments</p>
                <p className="text-body-md text-on-surface font-semibold">{c.shipments}</p>
              </div>
              <div>
                <p className="text-label-bold text-on-surface-variant">Delivered</p>
                <p className="text-body-md text-green-600 font-semibold">{c.delivered}</p>
              </div>
              <div>
                <p className="text-label-bold text-on-surface-variant">Failed</p>
                <p className="text-body-md text-error font-semibold">{c.failed}</p>
              </div>
              <div>
                <p className="text-label-bold text-on-surface-variant">Returned</p>
                <p className="text-body-md text-amber-600 font-semibold">{c.returned}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-3">
              <div>
                <p className="text-label-bold text-on-surface-variant">COD Collected</p>
                <p className="text-body-md text-on-surface font-semibold">৳{c.codCollected.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-label-bold text-on-surface-variant">COD Remitted</p>
                <p className="text-body-md text-on-surface font-semibold">৳{c.codRemitted.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
