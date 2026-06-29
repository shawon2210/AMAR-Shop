'use client';

export default function SettlementsPage() {
  const settlements = [
    { id: 'STL-000001', seller: 'TechZone BD', period: 'Jun 1-15, 2026', gross: 125000, commission: 6250, fee: 1250, net: 117500, status: 'PENDING' },
    { id: 'STL-000002', seller: 'GadgetPro', period: 'Jun 1-15, 2026', gross: 98000, commission: 4900, fee: 980, net: 92120, status: 'PROCESSING' },
    { id: 'STL-000003', seller: 'Fashion Hub', period: 'May 16-31, 2026', gross: 72000, commission: 3600, fee: 720, net: 67680, status: 'COMPLETED' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-md text-on-surface">Settlement Management</h1>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-primary text-on-primary rounded-lg text-body-sm font-medium">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Generate Settlement
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
        <table className="w-full text-body-sm">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-low">
              <th className="text-left py-3 px-4 text-on-surface-variant font-medium">Settlement #</th>
              <th className="text-left py-3 px-4 text-on-surface-variant font-medium">Seller</th>
              <th className="text-left py-3 px-4 text-on-surface-variant font-medium">Period</th>
              <th className="text-right py-3 px-4 text-on-surface-variant font-medium">Gross</th>
              <th className="text-right py-3 px-4 text-on-surface-variant font-medium">Commission</th>
              <th className="text-right py-3 px-4 text-on-surface-variant font-medium">Net</th>
              <th className="text-left py-3 px-4 text-on-surface-variant font-medium">Status</th>
              <th className="text-left py-3 px-4 text-on-surface-variant font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {settlements.map((s, i) => (
              <tr key={i} className="border-b border-outline-variant/50 hover:bg-surface-container-low">
                <td className="py-3 px-4 text-on-surface font-medium">{s.id}</td>
                <td className="py-3 px-4 text-on-surface">{s.seller}</td>
                <td className="py-3 px-4 text-on-surface-variant">{s.period}</td>
                <td className="py-3 px-4 text-right text-on-surface">৳{s.gross.toLocaleString()}</td>
                <td className="py-3 px-4 text-right text-error">-৳{s.commission.toLocaleString()}</td>
                <td className="py-3 px-4 text-right text-on-surface font-semibold">৳{s.net.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-bold ${s.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : s.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                    {s.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button className="text-primary text-body-sm font-medium hover:underline">
                    {s.status === 'PENDING' ? 'Process' : 'View'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
