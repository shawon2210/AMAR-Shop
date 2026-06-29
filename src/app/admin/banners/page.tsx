'use client';

import { useState } from 'react';

const mockBanners = [
  { id: '#BNR-001', title: 'Eid Collection 2026', image: '', link: '/flash-sale/eid-2026', position: 'Home Top', sortOrder: 1, active: true },
  { id: '#BNR-002', title: 'Free Shipping Week', image: '', link: '/offers/free-shipping', position: 'Home Middle', sortOrder: 2, active: true },
  { id: '#BNR-003', title: 'New Arrivals', image: '', link: '/category/new-arrivals', position: 'Home Bottom', sortOrder: 3, active: false },
  { id: '#BNR-004', title: 'Summer Sale', image: '', link: '/flash-sale/summer', position: 'Home Top', sortOrder: 4, active: true },
  { id: '#BNR-005', title: 'Tech Festival', image: '', link: '/offers/tech-fest', position: 'Home Middle', sortOrder: 5, active: false },
];

const positionColors: Record<string, string> = {
  'Home Top': 'bg-purple-100 text-purple-700',
  'Home Middle': 'bg-blue-100 text-blue-700',
  'Home Bottom': 'bg-green-100 text-green-700',
};

export default function BannersPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Banners</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">
          + Add Banner
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">Add New Banner</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#666] mb-1">Title</label>
              <input type="text" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="Banner title" />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Image URL</label>
              <input type="text" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Link URL</label>
              <input type="text" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="/flash-sale/..." />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Position</label>
              <select className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none">
                <option>Home Top</option>
                <option>Home Middle</option>
                <option>Home Bottom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Sort Order</label>
              <input type="number" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" defaultValue={1} />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-[#666] hover:bg-[#f5f5f5] rounded-lg">Cancel</button>
            <button className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">Add Banner</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {mockBanners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-xl border border-[#eee] p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-full sm:w-48 h-24 rounded-lg bg-gradient-to-br from-[#f0f0f0] to-[#e0e0e0] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#888] text-3xl">image</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-[#222]">{banner.title}</h3>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${positionColors[banner.position]}`}>{banner.position}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${banner.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {banner.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-xs text-[#888] mt-1">Link: {banner.link}</p>
                <p className="text-xs text-[#888]">Sort: #{banner.sortOrder}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Toggle">
                  <span className="material-symbols-outlined text-[20px] text-[#666]">{banner.active ? 'toggle_on' : 'toggle_off'}</span>
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
        ))}
      </div>
    </div>
  );
}
