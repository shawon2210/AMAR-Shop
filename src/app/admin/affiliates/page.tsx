'use client';

const affiliates = [
  { id: 'AF001', name: 'Rahim Mia', refCode: 'RAH7F3K', clicks: 1284, conv: 89, revenue: '৳24,580', status: 'ACTIVE', joined: '15 Jan 2026' },
  { id: 'AF002', name: 'Karima Akhter', refCode: 'KAR9B2X', clicks: 892, conv: 54, revenue: '৳16,720', status: 'ACTIVE', joined: '22 Feb 2026' },
  { id: 'AF003', name: 'Jahid Hasan', refCode: 'JAH4M8P', clicks: 567, conv: 31, revenue: '৳9,450', status: 'ACTIVE', joined: '10 Mar 2026' },
];

const commissionRates = [
  { tier: 'Bronze', rate: '3%', minConv: '0', maxConv: '50' },
  { tier: 'Silver', rate: '5%', minConv: '51', maxConv: '200' },
  { tier: 'Gold', rate: '7%', minConv: '201', maxConv: '500' },
  { tier: 'Platinum', rate: '10%', minConv: '501', maxConv: '-' },
];

export default function AdminAffiliatesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#222]">Affiliate Management</h1>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#eee]">
          <p className="text-sm text-[#888]">Total Affiliates</p>
          <p className="text-2xl font-bold text-[#222]">147</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#eee]">
          <p className="text-sm text-[#888]">Active</p>
          <p className="text-2xl font-bold text-green-600">124</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#eee]">
          <p className="text-sm text-[#888]">Pending Approval</p>
          <p className="text-2xl font-bold text-amber-600">12</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#eee]">
          <p className="text-sm text-[#888]">Total Paid</p>
          <p className="text-2xl font-bold text-[#222]">৳2,45,800</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#eee]">
          <div className="p-5 border-b border-[#eee]">
            <h2 className="text-lg font-semibold text-[#222]">Affiliates</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-[#888] text-xs uppercase tracking-wider border-b border-[#eee]">
                <th className="p-3">ID</th><th className="p-3">Name</th><th className="p-3">Code</th>
                <th className="p-3">Clicks</th><th className="p-3">Conv.</th><th className="p-3">Revenue</th>
                <th className="p-3">Status</th><th className="p-3">Actions</th>
              </tr></thead>
              <tbody>
                {affiliates.map((a) => (
                  <tr key={a.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 font-medium text-[#333]">{a.id}</td>
                    <td className="p-3 text-[#555]">{a.name}</td>
                    <td className="p-3 text-primary font-mono text-xs">{a.refCode}</td>
                    <td className="p-3 text-[#555]">{a.clicks}</td>
                    <td className="p-3 text-[#555]">{a.conv}</td>
                    <td className="p-3 font-semibold">{a.revenue}</td>
                    <td className="p-3">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">{a.status}</span>
                    </td>
                    <td className="p-3">
                      <button className="text-xs bg-primary text-white px-3 py-1 rounded hover:bg-primary/90">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">Commission Rates</h2>
          <div className="space-y-3">
            {commissionRates.map((r) => (
              <div key={r.tier} className="flex items-center justify-between p-3 bg-[#fafafa] rounded-lg">
                <div>
                  <p className="text-sm font-medium text-[#333]">{r.tier}</p>
                  <p className="text-xs text-[#888]">{r.minConv}-{r.maxConv} conversions</p>
                </div>
                <span className="text-lg font-bold text-primary">{r.rate}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">Update Rates</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#eee] p-5">
        <h2 className="text-lg font-semibold text-[#222] mb-4">Payout Processing</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[#888] text-xs uppercase tracking-wider border-b border-[#eee]">
              <th className="p-3">Request ID</th><th className="p-3">Affiliate</th><th className="p-3">Amount</th>
              <th className="p-3">Method</th><th className="p-3">Status</th><th className="p-3">Actions</th>
            </tr></thead>
            <tbody>
              {[
                { id: 'REQ001', name: 'Rahim Mia', amount: '৳2,500', method: 'bKash', status: 'PENDING' },
                { id: 'REQ002', name: 'Karima Akhter', amount: '৳1,800', method: 'Nagad', status: 'PROCESSING' },
              ].map((r) => (
                <tr key={r.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                  <td className="p-3 font-medium text-[#333]">{r.id}</td>
                  <td className="p-3 text-[#555]">{r.name}</td>
                  <td className="p-3 font-semibold">{r.amount}</td>
                  <td className="p-3 text-[#555]">{r.method}</td>
                  <td className="p-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${r.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{r.status}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Approve</button>
                      <button className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
