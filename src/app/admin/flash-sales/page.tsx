    'use client';

import { useState } from 'react';

const mockCampaigns = [
  { id: '#FS-001', title: 'Eid Mega Sale', banner: '', start: '25 Jun 2026 00:00', end: '30 Jun 2026 23:59', status: 'active', revenue: '৳12,40,000', itemsSold: 3450, products: 120 },
  { id: '#FS-002', title: 'Tech Tuesday', banner: '', start: '01 Jul 2026 10:00', end: '01 Jul 2026 23:59', status: 'upcoming', revenue: '৳0', itemsSold: 0, products: 45 },
  { id: '#FS-003', title: 'Flash Friday', banner: '', start: '20 Jun 2026 10:00', end: '20 Jun 2026 23:59', status: 'ended', revenue: '৳5,80,000', itemsSold: 1280, products: 60 },
  { id: '#FS-004', title: 'Summer Clearance', banner: '', start: '15 Jun 2026 00:00', end: '20 Jun 2026 23:59', status: 'ended', revenue: '৳18,90,000', itemsSold: 5670, products: 200 },
  { id: '#FS-005', title: 'Weekend Bazaar', banner: '', start: '03 Jul 2026 00:00', end: '04 Jul 2026 23:59', status: 'upcoming', revenue: '৳0', itemsSold: 0, products: 80 },
];

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  upcoming: 'bg-blue-100 text-blue-700',
  ended: 'bg-gray-100 text-gray-700',
};

const tabs = ['active', 'upcoming', 'ended'] as const;

export default function FlashSalesPage() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showCreate, setShowCreate] = useState(false);

  const filtered = activeTab === 'all' ? mockCampaigns : mockCampaigns.filter((c) => c.status === activeTab);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Flash Sales</h1>
        <button onClick={() => setShowCreate(!showCreate)} className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">
          + New Flash Sale
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[{ label: 'All', value: 'all' }, ...tabs.map((t) => ({ label: t.charAt(0).toUpperCase() + t.slice(1), value: t }))].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === tab.value ? 'bg-primary text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f5f5f5]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">Create Flash Sale</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#666] mb-1">Title</label>
              <input type="text" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="e.g. Eid Mega Sale" />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Banner Image URL</label>
              <input type="text" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Start Date & Time</label>
              <input type="datetime-local" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">End Date & Time</label>
              <input type="datetime-local" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-[#666] mb-1">Select Products</label>
              <select multiple className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none h-24">
                <option>Samsung Galaxy S24 Ultra</option>
                <option>Mens Cotton Panjabi</option>
                <option>Wireless Bluetooth Earbuds</option>
                <option>Handcrafted Wooden Showpiece</option>
                <option>Organic Green Tea (100 Pack)</option>
              </select>
              <p className="text-xs text-[#888] mt-1">Hold Ctrl to select multiple</p>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-[#666] hover:bg-[#f5f5f5] rounded-lg">Cancel</button>
            <button className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">Create Flash Sale</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {filtered.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-[#eee] p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-[#f0f0f0] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#888] text-3xl">local_fire_department</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[#222]">{c.title}</h3>
                  <p className="text-xs text-[#888]">{c.start} → {c.end}</p>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full inline-block mt-1 ${statusStyles[c.status]}`}>
                    {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="font-semibold text-[#333]">{c.revenue}</p>
                  <p className="text-xs text-[#888]">Revenue</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-[#333]">{c.itemsSold.toLocaleString()}</p>
                  <p className="text-xs text-[#888]">Items Sold</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-[#333]">{c.products}</p>
                  <p className="text-xs text-[#888]">Products</p>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Toggle Active">
                    <span className="material-symbols-outlined text-[18px] text-[#666]">{c.status === 'active' ? 'toggle_on' : 'toggle_off'}</span>
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Edit">
                    <span className="material-symbols-outlined text-[18px] text-[#666]">edit</span>
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Delete">
                    <span className="material-symbols-outlined text-[18px] text-[#666]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
