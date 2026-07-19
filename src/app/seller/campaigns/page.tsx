'use client';

import { useState } from 'react';

const activeCampaigns = [
  { id: 1, title: 'Eid Mega Sale 2026', type: 'Flash Sale', dates: 'Jun 20 - Jul 5', products: 12, enrolled: 8, revenue: '৳2,45,000', status: 'Active', progress: 65 },
  { id: 2, title: 'Summer Clearance', type: 'Discounted', dates: 'Jul 1 - Jul 15', products: 8, enrolled: 5, revenue: '৳1,12,000', status: 'Active', progress: 30 },
];

const availableCampaigns = [
  { id: 3, title: 'Independence Day Offer', type: 'Flash Sale', dates: 'Aug 10 - Aug 15', discount: 'Up to 40%', slots: 20, enrolled: 12 },
  { id: 4, title: 'Back to School', type: 'Seasonal', dates: 'Aug 20 - Sep 5', discount: 'Up to 25%', slots: 15, enrolled: 7 },
  { id: 5, title: 'Weekend Bonanza', type: 'Flash Sale', dates: 'Jul 8 - Jul 9', discount: 'Up to 50%', slots: 25, enrolled: 18 },
];

const pastCampaigns = [
  { id: 6, title: 'Boishakh Sale 2026', type: 'Seasonal', dates: 'Apr 1 - Apr 15', enrolled: 6, revenue: '৳98,000', status: 'Ended' },
  { id: 7, title: 'Ramadan Special', type: 'Flash Sale', dates: 'Mar 1 - Mar 30', enrolled: 10, revenue: '৳3,12,000', status: 'Ended' },
];

export default function SellerCampaigns() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-on-surface">Campaigns</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary-container transition-colors"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Create Campaign
        </button>
      </div>

      {/* Active Campaigns */}
      <section>
        <h2 className="text-sm font-semibold text-on-surface mb-3">Active Campaigns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeCampaigns.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-surface-container-high shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-on-surface">{c.title}</h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">{c.type} • {c.dates}</p>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Active</span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="text-center p-2 rounded-lg bg-surface-container-low">
                    <p className="text-sm font-bold text-on-surface">{c.products}</p>
                    <p className="text-[10px] text-on-surface-variant">Products</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-surface-container-low">
                    <p className="text-sm font-bold text-on-surface">{c.enrolled}</p>
                    <p className="text-[10px] text-on-surface-variant">Enrolled</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-surface-container-low">
                    <p className="text-sm font-bold text-on-surface">{c.revenue}</p>
                    <p className="text-[10px] text-on-surface-variant">Revenue</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1">
                    <span>Progress</span>
                    <span>{c.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${c.progress}%` }} />
                  </div>
                </div>
              </div>
              <div className="px-4 py-2 bg-surface-container-low border-t border-surface-container-high flex gap-2">
                <button className="text-xs text-primary font-medium hover:underline">View Details</button>
                <button className="text-xs text-on-surface-variant font-medium hover:underline">Enroll Products</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Available Campaigns */}
      <section>
        <h2 className="text-sm font-semibold text-on-surface mb-3">Available Campaigns</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {availableCampaigns.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-surface-container-high shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="mb-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-tertiary">{c.type}</span>
                <h3 className="font-semibold text-on-surface mt-0.5">{c.title}</h3>
                <p className="text-xs text-on-surface-variant mt-1">{c.dates}</p>
              </div>
              <div className="text-sm font-bold text-primary mb-2">{c.discount}</div>
              <div className="flex items-center justify-between text-xs text-on-surface-variant mb-3">
                <span>{c.enrolled}/{c.slots} slots filled</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-high rounded-full mb-3">
                <div className="h-full rounded-full bg-tertiary" style={{ width: `${(c.enrolled / c.slots) * 100}%` }} />
              </div>
              <button className="w-full px-3 py-1.5 text-sm rounded-lg border border-primary text-primary font-medium hover:bg-primary/5 transition-colors">
                Join Campaign
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Past Campaigns */}
      <section>
        <h2 className="text-sm font-semibold text-on-surface mb-3">Past Campaigns</h2>
        <div className="bg-white rounded-xl border border-surface-container-high shadow-sm overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="text-left text-on-surface-variant text-xs border-b border-surface-container-high bg-surface-container-low">
                <th className="p-3 font-medium whitespace-nowrap">Campaign</th>
                <th className="p-3 font-medium whitespace-nowrap hidden lg:table-cell">Type</th>
                <th className="p-3 font-medium whitespace-nowrap">Dates</th>
                <th className="p-3 font-medium whitespace-nowrap">Enrolled</th>
                <th className="p-3 font-medium whitespace-nowrap">Revenue</th>
                <th className="p-3 font-medium whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {pastCampaigns.map((c) => (
                <tr key={c.id} className="border-b border-surface-container-high last:border-b-0 hover:bg-surface-container-low">
                  <td className="p-3 font-medium text-on-surface whitespace-nowrap">{c.title}</td>
                  <td className="p-3 text-on-surface-variant whitespace-nowrap hidden lg:table-cell">{c.type}</td>
                  <td className="p-3 text-on-surface-variant whitespace-nowrap">{c.dates}</td>
                  <td className="p-3 text-on-surface whitespace-nowrap">{c.enrolled}</td>
                  <td className="p-3 font-medium text-on-surface whitespace-nowrap">{c.revenue}</td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Ended</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Create Campaign Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-on-surface">Create Campaign</h3>
              <button onClick={() => setShowCreate(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-on-surface block mb-1">Campaign Title</label>
                <input type="text" placeholder="Enter campaign name" className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-on-surface block mb-1">Campaign Type</label>
                  <select className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none">
                    <option>Flash Sale</option>
                    <option>Seasonal</option>
                    <option>Discounted</option>
                    <option>Buy 1 Get 1</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-on-surface block mb-1">Discount (%)</label>
                  <input type="text" placeholder="e.g. 25" className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-on-surface block mb-1">Start Date</label>
                  <input type="date" className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-on-surface block mb-1">End Date</label>
                  <input type="date" className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-on-surface block mb-1">Description</label>
                <textarea rows={3} placeholder="Campaign description" className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm rounded-lg border border-outline text-on-surface font-medium hover:bg-surface-container-high transition-colors">Cancel</button>
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm rounded-lg bg-primary text-on-primary font-medium hover:bg-primary-container transition-colors">Create Campaign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
