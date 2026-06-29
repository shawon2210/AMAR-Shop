'use client';

const creators = [
  { id: 'CR001', name: 'TechReview BD', type: 'YouTube', followers: '145K', engagement: '4.8%', status: 'APPROVED', joined: '10 Jan 2026' },
  { id: 'CR002', name: 'FashionWithMona', type: 'Instagram', followers: '89K', engagement: '5.2%', status: 'APPROVED', joined: '5 Feb 2026' },
  { id: 'CR003', name: 'Gadget Guru', type: 'YouTube', followers: '234K', engagement: '3.9%', status: 'PENDING', joined: '20 Jun 2026' },
  { id: 'CR004', name: 'BD Foodie', type: 'Facebook', followers: '67K', engagement: '2.1%', status: 'PENDING', joined: '18 Jun 2026' },
];

export default function AdminCreatorsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#222]">Creator Marketplace</h1>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#eee]">
          <p className="text-sm text-[#888]">Total Creators</p>
          <p className="text-2xl font-bold text-[#222]">38</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#eee]">
          <p className="text-sm text-[#888]">Approved</p>
          <p className="text-2xl font-bold text-green-600">28</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#eee]">
          <p className="text-sm text-[#888]">Pending Review</p>
          <p className="text-2xl font-bold text-amber-600">10</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#eee]">
          <p className="text-sm text-[#888]">Avg Engagement</p>
          <p className="text-2xl font-bold text-[#222]">4.1%</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#eee] p-5">
        <h2 className="text-lg font-semibold text-[#222] mb-4">Content Review Queue</h2>
        <div className="space-y-3">
          {[
            { creator: 'Gadget Guru', content: 'Samsung S24 Unboxing Review', submitted: '2 hours ago', status: 'PENDING' },
            { creator: 'BD Foodie', content: 'Kitchen Gadgets Haul', submitted: '5 hours ago', status: 'PENDING' },
            { creator: 'TechReview BD', content: 'Best Wireless Earbuds 2026', submitted: '1 day ago', status: 'APPROVED' },
          ].map((c, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-[#fafafa] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">person</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#333]">{c.content}</p>
                  <p className="text-xs text-[#888]">by {c.creator} &middot; {c.submitted}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  c.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>{c.status}</span>
                {c.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <button className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Approve</button>
                    <button className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Reject</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#eee]">
        <div className="p-5 border-b border-[#eee]">
          <h2 className="text-lg font-semibold text-[#222]">All Creators</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[#888] text-xs uppercase tracking-wider border-b border-[#eee]">
              <th className="p-3">ID</th><th className="p-3">Name</th><th className="p-3">Platform</th>
              <th className="p-3">Followers</th><th className="p-3">Engagement</th><th className="p-3">Status</th><th className="p-3">Actions</th>
            </tr></thead>
            <tbody>
              {creators.map((c) => (
                <tr key={c.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                  <td className="p-3 font-medium text-[#333]">{c.id}</td>
                  <td className="p-3 text-[#555]">{c.name}</td>
                  <td className="p-3 text-[#555]">{c.type}</td>
                  <td className="p-3 text-[#555]">{c.followers}</td>
                  <td className="p-3 font-medium text-green-600">{c.engagement}</td>
                  <td className="p-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      c.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>{c.status}</span>
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
    </div>
  );
}
