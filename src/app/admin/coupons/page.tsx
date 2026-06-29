'use client';

import { useState } from 'react';

const mockCoupons = [
  { code: 'EID50', type: 'Percentage', value: '50%', min: '৳500', uses: 1240, maxUses: 2000, perUser: 1, start: '20 Jun 2026', end: '30 Jun 2026', status: 'Active', revenue: '৳4,50,000' },
  { code: 'FREESHIP', type: 'Free Shipping', value: '—', min: '৳1,000', uses: 3400, maxUses: 5000, perUser: 2, start: '01 Jun 2026', end: '31 Jul 2026', status: 'Active', revenue: '৳12,00,000' },
  { code: 'WELCOME200', type: 'Fixed', value: '৳200', min: '৳1,000', uses: 890, maxUses: 1000, perUser: 1, start: '01 Jan 2026', end: '31 Dec 2026', status: 'Active', revenue: '৳1,78,000' },
  { code: 'SUMMER15', type: 'Percentage', value: '15%', min: '৳2,000', uses: 560, maxUses: 500, perUser: 1, start: '15 May 2026', end: '15 Jun 2026', status: 'Expired', revenue: '৳2,10,000' },
  { code: 'SPLASH30', type: 'Percentage', value: '30%', min: '৳3,000', uses: 0, maxUses: 300, perUser: 1, start: '01 Jul 2026', end: '10 Jul 2026', status: 'Upcoming', revenue: '৳0' },
];

const tabs = ['Active', 'Upcoming', 'Expired'] as const;

export default function CouponsPage() {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [showCreate, setShowCreate] = useState(false);

  const filtered = activeTab === 'All' ? mockCoupons : mockCoupons.filter((c) => c.status === activeTab);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Coupons</h1>
        <button onClick={() => setShowCreate(!showCreate)} className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">+ Create Coupon</button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[{ label: 'All', value: 'All' }, ...tabs.map((t) => ({ label: t, value: t }))].map((tab) => (
          <button key={tab.value} onClick={() => setActiveTab(tab.value)} className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${activeTab === tab.value ? 'bg-primary text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f5f5f5]'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">Create Coupon</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-[#666] mb-1">Code</label>
              <input type="text" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none uppercase" placeholder="e.g. SAVE50" />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Type</label>
              <select className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none">
                <option>Percentage</option>
                <option>Fixed</option>
                <option>Free Shipping</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Value</label>
              <input type="text" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="50 or ৳200" />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Min Purchase</label>
              <input type="text" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="৳500" />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Max Uses</label>
              <input type="number" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="1000" />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Max Per User</label>
              <input type="number" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="1" />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Start Date</label>
              <input type="date" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">End Date</label>
              <input type="date" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-[#666] hover:bg-[#f5f5f5] rounded-lg">Cancel</button>
            <button className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">Create Coupon</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
              <th className="p-3">Code</th>
              <th className="p-3">Type</th>
              <th className="p-3">Value</th>
              <th className="p-3">Min Purchase</th>
              <th className="p-3">Uses</th>
              <th className="p-3">Expiry</th>
              <th className="p-3">Revenue</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.code} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                <td className="p-3 font-mono font-bold text-[#333]">{c.code}</td>
                <td className="p-3 text-[#666]">{c.type}</td>
                <td className="p-3 font-medium">{c.value}</td>
                <td className="p-3 text-[#666]">{c.min}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span>{c.uses.toLocaleString()}</span>
                    <div className="w-16 h-1.5 bg-[#eee] rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${(c.uses / c.maxUses) * 100}%` }} />
                    </div>
                  </div>
                </td>
                <td className="p-3 text-[#888] text-xs">{c.end}</td>
                <td className="p-3 font-medium">{c.revenue}</td>
                <td className="p-3">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    c.status === 'Active' ? 'bg-green-100 text-green-700' :
                    c.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>{c.status}</span>
                </td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-[#f5f5f5]"><span className="material-symbols-outlined text-[18px] text-[#666]">edit</span></button>
                    <button className="p-1.5 rounded-lg hover:bg-[#f5f5f5]"><span className="material-symbols-outlined text-[18px] text-[#666]">delete</span></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
