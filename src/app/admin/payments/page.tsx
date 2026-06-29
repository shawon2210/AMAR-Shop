'use client';

const transactions = [
  { id: '#TXN-8932', order: '#ORD-28471', amount: '৳2,450', method: 'bKash', status: 'Completed', date: '28 Jun 2026' },
  { id: '#TXN-8931', order: '#ORD-28470', amount: '৳5,200', method: 'Nagad', status: 'Completed', date: '28 Jun 2026' },
  { id: '#TXN-8930', order: '#ORD-28469', amount: '৳890', method: 'COD', status: 'Pending', date: '27 Jun 2026' },
  { id: '#TXN-8929', order: '#ORD-28468', amount: '৳12,400', method: 'SSLCommerz', status: 'Completed', date: '27 Jun 2026' },
  { id: '#TXN-8928', order: '#ORD-28467', amount: '৳3,600', method: 'bKash', status: 'Refunded', date: '26 Jun 2026' },
  { id: '#TXN-8927', order: '#ORD-28466', amount: '৳8,750', method: 'Nagad', status: 'Completed', date: '26 Jun 2026' },
  { id: '#TXN-8926', order: '#ORD-28465', amount: '৳1,200', method: 'COD', status: 'Completed', date: '25 Jun 2026' },
  { id: '#TXN-8925', order: '#ORD-28464', amount: '৳15,000', method: 'bKash', status: 'Pending', date: '25 Jun 2026' },
  { id: '#TXN-8924', order: '#ORD-28463', amount: '৳4,300', method: 'SSLCommerz', status: 'Completed', date: '24 Jun 2026' },
  { id: '#TXN-8923', order: '#ORD-28462', amount: '৳980', method: 'Nagad', status: 'Completed', date: '24 Jun 2026' },
];

const statusStyles: Record<string, string> = {
  Completed: 'bg-green-100 text-green-700',
  Pending: 'bg-amber-100 text-amber-700',
  Refunded: 'bg-red-100 text-red-700',
  Failed: 'bg-red-100 text-red-700',
};

function PaymentBreakdownChart() {
  const data = [
    { label: 'bKash', value: 45, color: '#a63600' },
    { label: 'Nagad', value: 25, color: '#cf4500' },
    { label: 'COD', value: 18, color: '#007f9f' },
    { label: 'SSLCommerz', value: 12, color: '#5f5e5e' },
  ];
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  const arcs = data.map((d) => {
    const startAngle = (cumulative / total) * 360;
    cumulative += d.value;
    const endAngle = (cumulative / total) * 360;
    return { ...d, startAngle, endAngle };
  });

  const cx = 120, cy = 120, r = 90;
  const toRad = (deg: number) => (deg - 90) * (Math.PI / 180);
  const arcPath = (start: number, end: number) => {
    const s = toRad(start), e = toRad(end);
    const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
    const large = end - start > 180 ? 1 : 0;
    return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`;
  };

  return (
    <svg viewBox="0 0 240 240" className="w-48 h-48 mx-auto">
      {arcs.map((d) => (
        <path key={d.label} d={arcPath(d.startAngle, d.endAngle)} fill={d.color} stroke="white" strokeWidth="2" />
      ))}
      <text x={cx} y={cy - 4} textAnchor="middle" className="fill-[#333] text-sm font-bold">Total</text>
      <text x={cx} y={cy + 14} textAnchor="middle" className="fill-[#333] text-lg font-bold">100%</text>
    </svg>
  );
}

export default function PaymentsPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">Payments</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">Settlement Summary</h2>
          <div className="space-y-3 text-sm">
            {[
              { label: 'Total Received', value: '৳2,84,90,000' },
              { label: 'Pending Clearance', value: '৳18,40,000' },
              { label: 'Total Refunded', value: '৳3,20,000' },
              { label: 'Platform Fee', value: '৳28,50,000' },
              { label: 'Net Payable', value: '৳2,53,20,000', bold: true },
            ].map((s) => (
              <div key={s.label} className="flex justify-between">
                <span className="text-[#888]">{s.label}</span>
                <span className={`font-medium ${s.bold ? 'text-lg text-[#222]' : 'text-[#444]'}`}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">Payment Method Breakdown</h2>
          <PaymentBreakdownChart />
          <div className="mt-3 space-y-1 text-sm">
            {[
              { label: 'bKash', color: 'bg-[#a63600]', value: '45%' },
              { label: 'Nagad', color: 'bg-[#cf4500]', value: '25%' },
              { label: 'COD', color: 'bg-[#007f9f]', value: '18%' },
              { label: 'SSLCommerz', color: 'bg-[#5f5e5e]', value: '12%' },
            ].map((d) => (
              <div key={d.label} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${d.color}`} />
                <span className="text-[#666]">{d.label}</span>
                <span className="ml-auto font-medium">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">Refund Management</h2>
          <div className="space-y-3">
            {[
              { order: '#ORD-28467', amount: '৳3,600', reason: 'Item damaged', status: 'Completed' },
              { order: '#ORD-28455', amount: '৳1,200', reason: 'Wrong item', status: 'Pending' },
              { order: '#ORD-28442', amount: '৳5,000', reason: 'Customer request', status: 'Processing' },
            ].map((r) => (
              <div key={r.order} className="flex items-center justify-between p-3 bg-[#fafafa] rounded-lg text-sm">
                <div>
                  <p className="font-medium text-[#333]">{r.order}</p>
                  <p className="text-[#888] text-xs">{r.reason}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{r.amount}</p>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                    r.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    r.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>{r.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
              <th className="p-3">Transaction ID</th>
              <th className="p-3">Order</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Method</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                <td className="p-3 font-medium text-[#333]">{t.id}</td>
                <td className="p-3 text-[#555]">{t.order}</td>
                <td className="p-3 font-medium">{t.amount}</td>
                <td className="p-3 text-[#666]">{t.method}</td>
                <td className="p-3">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[t.status]}`}>{t.status}</span>
                </td>
                <td className="p-3 text-[#888]">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
