'use client';

export default function PickupPage() {
  const pickups = [
    { id: 'SHP-001', courier: 'RedX', items: 3, status: 'SCHEDULED', date: '2026-07-01', slot: '10:00 - 14:00' },
    { id: 'SHP-002', courier: 'Steadfast', items: 1, status: 'PENDING', date: '-', slot: '-' },
    { id: 'SHP-003', courier: 'eCourier', items: 5, status: 'SCHEDULED', date: '2026-06-30', slot: '14:00 - 18:00' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-md text-on-surface">Pickup Schedules</h1>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-primary text-on-primary rounded-lg text-body-sm font-medium">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Schedule Pickup
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {pickups.map((p, i) => (
          <div key={i} className="bg-surface rounded-xl border border-outline-variant p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${p.status === 'SCHEDULED' ? 'bg-blue-100' : 'bg-surface-container-highest'}`}>
                <span className="material-symbols-outlined text-[20px] text-blue-600">calendar_today</span>
              </div>
              <div>
                <p className="text-body-md text-on-surface font-semibold">{p.id} · {p.courier}</p>
                <p className="text-body-sm text-on-surface-variant">{p.items} items{p.status === 'SCHEDULED' ? ` · ${p.date} ${p.slot}` : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded-full text-label-bold ${p.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                {p.status}
              </span>
              <button className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-body-sm font-medium">
                {p.status === 'PENDING' ? 'Schedule' : 'Reschedule'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
