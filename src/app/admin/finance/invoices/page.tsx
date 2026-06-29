'use client';

export default function InvoicesPage() {
  const invoices = [
    { id: 'INV-000001', order: 'ORD-001', seller: 'TechZone BD', amount: 45000, status: 'DRAFT', date: '2026-06-28' },
    { id: 'INV-000002', order: 'ORD-002', seller: 'GadgetPro', amount: 32000, status: 'SENT', date: '2026-06-27' },
    { id: 'INV-000003', order: 'ORD-003', seller: 'Fashion Hub', amount: 28000, status: 'PAID', date: '2026-06-25' },
    { id: 'INV-000004', order: 'ORD-004', seller: 'TechZone BD', amount: 15000, status: 'PAID', date: '2026-06-24' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-md text-on-surface">Invoices</h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 border border-outline text-on-surface rounded-lg text-body-sm font-medium">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-primary text-on-primary rounded-lg text-body-sm font-medium">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create Invoice
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
        <table className="w-full text-body-sm">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-low">
              <th className="text-left py-3 px-4 text-on-surface-variant font-medium">Invoice #</th>
              <th className="text-left py-3 px-4 text-on-surface-variant font-medium">Order</th>
              <th className="text-left py-3 px-4 text-on-surface-variant font-medium">Seller</th>
              <th className="text-right py-3 px-4 text-on-surface-variant font-medium">Amount</th>
              <th className="text-left py-3 px-4 text-on-surface-variant font-medium">Status</th>
              <th className="text-left py-3 px-4 text-on-surface-variant font-medium">Date</th>
              <th className="text-left py-3 px-4 text-on-surface-variant font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, i) => (
              <tr key={i} className="border-b border-outline-variant/50 hover:bg-surface-container-low">
                <td className="py-3 px-4 text-on-surface font-medium">{inv.id}</td>
                <td className="py-3 px-4 text-on-surface-variant">{inv.order}</td>
                <td className="py-3 px-4 text-on-surface">{inv.seller}</td>
                <td className="py-3 px-4 text-right text-on-surface font-semibold">৳{inv.amount.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-bold ${inv.status === 'PAID' ? 'bg-green-100 text-green-700' : inv.status === 'SENT' ? 'bg-blue-100 text-blue-700' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-on-surface-variant">{inv.date}</td>
                <td className="py-3 px-4">
                  <button className="text-primary text-body-sm font-medium hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
