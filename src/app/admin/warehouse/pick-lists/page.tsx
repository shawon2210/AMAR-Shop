'use client';

export default function PickListsPage() {
  const pickLists = [
    { id: 'PK-000001', orders: 3, items: 8, status: 'OPEN', priority: 'HIGH', warehouse: 'Dhaka' },
    { id: 'PK-000002', orders: 1, items: 2, status: 'IN_PROGRESS', priority: 'NORMAL', warehouse: 'Dhaka' },
    { id: 'PK-000003', orders: 5, items: 12, status: 'OPEN', priority: 'URGENT', warehouse: 'Chattogram' },
    { id: 'PK-000004', orders: 2, items: 4, status: 'COMPLETED', priority: 'LOW', warehouse: 'Dhaka' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-md text-on-surface">Pick Lists</h1>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-primary text-on-primary rounded-lg text-body-sm font-medium hover:bg-primary-container transition-colors">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Generate Pick List
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {pickLists.map((pl, i) => (
          <div key={i} className="bg-surface rounded-xl border border-outline-variant p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${pl.priority === 'URGENT' ? 'bg-error-container' : pl.priority === 'HIGH' ? 'bg-amber-100' : 'bg-surface-container-highest'}`}>
                <span className="material-symbols-outlined text-[20px] text-on-surface">assignment</span>
              </div>
              <div>
                <p className="text-body-md text-on-surface font-semibold">{pl.id}</p>
                <p className="text-body-sm text-on-surface-variant">{pl.orders} orders · {pl.items} items · {pl.warehouse}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-bold ${pl.priority === 'URGENT' ? 'bg-error-container text-on-error-container' : pl.priority === 'HIGH' ? 'bg-amber-100 text-amber-700' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                {pl.priority}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-bold ${pl.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : pl.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                {pl.status.replace('_', ' ')}
              </span>
              <button className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-body-sm font-medium">View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
