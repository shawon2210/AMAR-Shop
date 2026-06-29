'use client';

const commissions = [
  { id: 'COM001', order: '#ORD-28901', product: 'Samsung Galaxy S24', amount: '৳6,900', commission: '৳345', rate: '5%', status: 'PENDING', date: '28 Jun 2026' },
  { id: 'COM002', order: '#ORD-28895', product: 'iPhone 15 Pro Max', amount: '৳1,12,000', commission: '৳560', rate: '5%', status: 'PENDING', date: '27 Jun 2026' },
  { id: 'COM003', order: '#ORD-28882', product: 'Wireless Earbuds Pro', amount: '৳560', commission: '৳42', rate: '5%', status: 'PAID', date: '26 Jun 2026' },
  { id: 'COM004', order: '#ORD-28876', product: 'Men\'s Formal Shirt', amount: '৳560', commission: '৳28', rate: '5%', status: 'PAID', date: '25 Jun 2026' },
  { id: 'COM005', order: '#ORD-28865', product: 'Smart Watch Ultra', amount: '৳8,500', commission: '৳425', rate: '5%', status: 'PAID', date: '24 Jun 2026' },
  { id: 'COM006', order: '#ORD-28854', product: 'Casio Digital Watch', amount: '৳360', commission: '৳18', rate: '5%', status: 'PAID', date: '23 Jun 2026' },
];

const payouts = [
  { id: 'PAY001', amount: '৳2,500', fee: '৳0', net: '৳2,500', method: 'bKash', account: '01XXXXXXXXX', status: 'COMPLETED', date: '20 Jun 2026' },
  { id: 'PAY002', amount: '৳1,400', fee: '৳0', net: '৳1,400', method: 'Nagad', account: '01XXXXXXXXX', status: 'COMPLETED', date: '10 Jun 2026' },
];

export default function AffiliateEarningsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#222]">Earnings & Payouts</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#eee]">
          <p className="text-sm text-[#888]">Available Balance</p>
          <p className="text-3xl font-bold text-[#222]">৳12,450</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#eee]">
          <p className="text-sm text-[#888]">Pending Commission</p>
          <p className="text-3xl font-bold text-amber-600">৳8,230</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#eee]">
          <p className="text-sm text-[#888]">Total Paid</p>
          <p className="text-3xl font-bold text-green-600">৳3,900</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#eee] p-6">
        <h2 className="text-lg font-semibold text-[#222] mb-4">Request Payout</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-medium text-[#666] block mb-1">Amount</label>
            <input type="number" placeholder="Enter amount" className="w-full px-3 py-2 border border-[#ddd] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-xs font-medium text-[#666] block mb-1">Method</label>
            <select className="w-full px-3 py-2 border border-[#ddd] rounded-lg text-sm focus:outline-none">
              <option>bKash</option><option>Nagad</option><option>Bank Transfer</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-[#666] block mb-1">Account</label>
            <input type="text" placeholder="Account number" className="w-full px-3 py-2 border border-[#ddd] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">Request Payout</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-[#eee]">
          <div className="p-5 border-b border-[#eee]">
            <h2 className="text-lg font-semibold text-[#222]">Commission History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-[#888] text-xs uppercase tracking-wider border-b border-[#eee]">
                <th className="p-3">Order</th><th className="p-3">Product</th><th className="p-3">Amount</th>
                <th className="p-3">Commission</th><th className="p-3">Status</th>
              </tr></thead>
              <tbody>
                {commissions.map((c) => (
                  <tr key={c.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 font-medium text-[#333]">{c.order}</td>
                    <td className="p-3 text-[#555]">{c.product}</td>
                    <td className="p-3 text-[#555]">{c.amount}</td>
                    <td className="p-3 font-semibold text-green-600">{c.commission} <span className="text-[10px] text-[#888]">({c.rate})</span></td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        c.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>{c.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#eee]">
          <div className="p-5 border-b border-[#eee]">
            <h2 className="text-lg font-semibold text-[#222]">Payout History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-[#888] text-xs uppercase tracking-wider border-b border-[#eee]">
                <th className="p-3">ID</th><th className="p-3">Net Amount</th><th className="p-3">Method</th>
                <th className="p-3">Status</th><th className="p-3">Date</th>
              </tr></thead>
              <tbody>
                {payouts.map((p) => (
                  <tr key={p.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 font-medium text-[#333]">{p.id}</td>
                    <td className="p-3 font-semibold">{p.net}</td>
                    <td className="p-3 text-[#555]">{p.method}</td>
                    <td className="p-3">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">{p.status}</span>
                    </td>
                    <td className="p-3 text-[#888]">{p.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
