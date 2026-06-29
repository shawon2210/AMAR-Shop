'use client';

import Link from 'next/link';

const stats = [
  { label: 'Total Clicks', value: '1,284', icon: 'mouse', change: '+12.3%', color: 'text-green-600' },
  { label: 'Conversions', value: '89', icon: 'shopping_cart', change: '+8.7%', color: 'text-green-600' },
  { label: 'Conversion Rate', value: '6.93%', icon: 'trending_up', change: '+2.1%', color: 'text-green-600' },
  { label: 'Total Earnings', value: '৳24,580', icon: 'payments', change: '+15.2%', color: 'text-green-600' },
];

const recentClicks = [
  { product: 'Samsung Galaxy S24', commission: '৳345', time: '2 min ago', converted: true },
  { product: 'Men\'s Cotton T-Shirt', commission: '৳28', time: '15 min ago', converted: false },
  { product: 'iPhone 15 Pro Max', commission: '৳560', time: '1 hour ago', converted: true },
  { product: 'Wireless Bluetooth Earbuds', commission: '৳42', time: '3 hours ago', converted: false },
  { product: 'Casio Digital Watch', commission: '৳18', time: '5 hours ago', converted: false },
];

const topProducts = [
  { name: 'Samsung Galaxy S24', clicks: 234, conversions: 18, revenue: '৳6,210' },
  { name: 'iPhone 15 Pro Max', clicks: 189, conversions: 12, revenue: '৳6,720' },
  { name: 'Wireless Earbuds Pro', clicks: 156, conversions: 9, revenue: '৳378' },
  { name: 'Men\'s Formal Shirt', clicks: 98, conversions: 7, revenue: '৳196' },
  { name: 'Smart Watch Ultra', clicks: 87, conversions: 5, revenue: '৳425' },
];

export default function AffiliateDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Affiliate Dashboard</h1>
        <Link href="/affiliate/links" className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">
          Create Tracking Link
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-[#eee]">
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-[#888]">{s.icon}</span>
              <span className={`text-xs font-semibold ${s.color}`}>{s.change}</span>
            </div>
            <p className="text-2xl font-bold text-[#222]">{s.value}</p>
            <p className="text-sm text-[#888] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#eee]">
          <div className="p-5 border-b border-[#eee] flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#222]">Recent Clicks</h2>
            <Link href="/affiliate/analytics" className="text-sm text-primary hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-[#f5f5f5]">
            {recentClicks.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-[#fafafa]">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    c.converted ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    <span className="material-symbols-outlined text-[18px]">
                      {c.converted ? 'check' : 'ads_click'}
                    </span>
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[#333]">{c.product}</p>
                    <p className="text-xs text-[#888]">{c.time}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-green-600">{c.commission}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#eee] p-5">
            <h2 className="text-lg font-semibold text-[#222] mb-4">Earnings Summary</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#888]">Available Balance</p>
                <p className="text-3xl font-bold text-[#222]">৳12,450</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#fafafa] rounded-lg p-3">
                  <p className="text-xs text-[#888]">Pending</p>
                  <p className="text-lg font-bold text-amber-600">৳8,230</p>
                </div>
                <div className="bg-[#fafafa] rounded-lg p-3">
                  <p className="text-xs text-[#888]">Paid</p>
                  <p className="text-lg font-bold text-green-600">৳3,900</p>
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">
                Request Payout
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#eee] p-5">
            <h2 className="text-lg font-semibold text-[#222] mb-4">Referral Code</h2>
            <div className="bg-[#fafafa] rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-primary tracking-wider">AMAR7F3K</p>
              <p className="text-xs text-[#888] mt-1">Share this code with your audience</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#eee]">
        <div className="p-5 border-b border-[#eee]">
          <h2 className="text-lg font-semibold text-[#222]">Top Performing Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[#888] text-xs uppercase tracking-wider border-b border-[#eee]">
              <th className="p-3">Product</th><th className="p-3">Clicks</th>
              <th className="p-3">Conversions</th><th className="p-3">Revenue</th><th className="p-3">Rate</th>
            </tr></thead>
            <tbody>
              {topProducts.map((p) => (
                <tr key={p.name} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                  <td className="p-3 font-medium text-[#333]">{p.name}</td>
                  <td className="p-3 text-[#555]">{p.clicks}</td>
                  <td className="p-3 text-[#555]">{p.conversions}</td>
                  <td className="p-3 font-semibold">{p.revenue}</td>
                  <td className="p-3">
                    <span className="text-green-600 font-medium">{Math.round((p.conversions / p.clicks) * 100)}%</span>
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
