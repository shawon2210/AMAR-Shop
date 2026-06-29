'use client';

import { useState } from 'react';

const mockPages = [
  { id: '#PG-001', title: 'About Us', slug: 'about-us', status: 'Published', updated: '25 Jun 2026' },
  { id: '#PG-002', title: 'Terms & Conditions', slug: 'terms', status: 'Published', updated: '20 Jun 2026' },
  { id: '#PG-003', title: 'Privacy Policy', slug: 'privacy', status: 'Published', updated: '18 Jun 2026' },
  { id: '#PG-004', title: 'Return Policy', slug: 'return-policy', status: 'Draft', updated: '15 Jun 2026' },
  { id: '#PG-005', title: 'FAQ', slug: 'faq', status: 'Published', updated: '10 Jun 2026' },
];

const mockAnnouncements = [
  { id: '#ANN-001', title: 'Eid ul-Adha Holiday Notice', content: 'Our offices will remain closed on...', status: 'Active', date: '25 Jun 2026' },
  { id: '#ANN-002', title: 'New Seller Onboarding Process', content: 'We have updated our seller onboarding...', status: 'Active', date: '20 Jun 2026' },
  { id: '#ANN-003', title: 'Site Maintenance', content: 'Scheduled maintenance on July 1st...', status: 'Inactive', date: '15 Jun 2026' },
];

export default function CMSPage() {
  const [activeSection, setActiveSection] = useState<'pages' | 'announcements' | 'homepage'>('pages');
  const [showCreatePage, setShowCreatePage] = useState(false);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">CMS</h1>

      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'pages' as const, label: 'Pages', icon: 'article' },
          { key: 'announcements' as const, label: 'Announcements', icon: 'campaign' },
          { key: 'homepage' as const, label: 'Homepage Editor', icon: 'home' },
        ].map((s) => (
          <button key={s.key} onClick={() => setActiveSection(s.key)} className={`flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${activeSection === s.key ? 'bg-primary text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f5f5f5]'}`}>
            <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === 'pages' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowCreatePage(!showCreatePage)} className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">+ Create Page</button>
          </div>

          {showCreatePage && (
            <div className="bg-white rounded-xl border border-[#eee] p-5 mb-4">
              <h2 className="text-lg font-semibold text-[#222] mb-4">Create New Page</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#666] mb-1">Title</label>
                  <input type="text" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="Page title" />
                </div>
                <div>
                  <label className="block text-sm text-[#666] mb-1">Slug</label>
                  <input type="text" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="page-slug" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-[#666] mb-1">Content</label>
                  <textarea rows={6} className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none resize-none font-mono" placeholder="Page content here..." />
                </div>
                <div>
                  <label className="block text-sm text-[#666] mb-1">Meta Title</label>
                  <input type="text" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-[#666] mb-1">Meta Description</label>
                  <input type="text" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button onClick={() => setShowCreatePage(false)} className="px-4 py-2 text-sm text-[#666] hover:bg-[#f5f5f5] rounded-lg">Cancel</button>
                <button className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">Save Page</button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                  <th className="p-3">Title</th>
                  <th className="p-3">Slug</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Last Updated</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockPages.map((p) => (
                  <tr key={p.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 font-medium text-[#333]">{p.title}</td>
                    <td className="p-3 text-[#888] font-mono text-xs">{p.slug}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${p.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{p.status}</span>
                    </td>
                    <td className="p-3 text-[#888] text-xs">{p.updated}</td>
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
      )}

      {activeSection === 'announcements' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">+ New Announcement</button>
          </div>
          {mockAnnouncements.map((a) => (
            <div key={a.id} className="bg-white rounded-xl border border-[#eee] p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[#222]">{a.title}</h3>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${a.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{a.status}</span>
                  </div>
                  <p className="text-sm text-[#666] mt-1">{a.content}</p>
                  <p className="text-xs text-[#888] mt-2">{a.date}</p>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-[#f5f5f5]"><span className="material-symbols-outlined text-[18px] text-[#666]">edit</span></button>
                  <button className="p-1.5 rounded-lg hover:bg-[#f5f5f5]"><span className="material-symbols-outlined text-[18px] text-[#666]">delete</span></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'homepage' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#eee] p-5">
            <h2 className="text-lg font-semibold text-[#222] mb-4">Homepage Sections</h2>
            <div className="space-y-3">
              {[
                { name: 'Hero Slider', type: 'Slideshow', active: true },
                { name: 'Flash Sale Banner', type: 'Banner', active: true },
                { name: 'Category Grid', type: 'Categories', active: true },
                { name: 'Featured Products', type: 'Product Grid', active: true },
                { name: 'Best Sellers', type: 'Product Grid', active: false },
                { name: 'Bottom Banners', type: 'Banners', active: true },
              ].map((section) => (
                <div key={section.name} className="flex items-center justify-between p-3 bg-[#fafafa] rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#888]">drag_indicator</span>
                    <div>
                      <p className="text-sm font-medium text-[#333]">{section.name}</p>
                      <p className="text-xs text-[#888]">{section.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${section.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {section.active ? 'Visible' : 'Hidden'}
                    </span>
                    <button className="p-1.5 rounded-lg hover:bg-[#eee]">
                      <span className="material-symbols-outlined text-[18px] text-[#666]">settings</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
