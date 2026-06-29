'use client';

import { useState } from 'react';

const mockReviews = [
  { id: '#REV-001', product: 'Samsung Galaxy S24 Ultra', user: 'Rahima Begum', rating: 5, content: 'Excellent phone! Camera quality is outstanding. Battery lasts 2 days.', date: '25 Jun 2026', status: 'Approved', reported: false },
  { id: '#REV-002', product: 'Men\'s Cotton Panjabi', user: 'Karim Hossain', rating: 4, content: 'Good quality fabric, fits well. Color slightly different from picture.', date: '24 Jun 2026', status: 'Approved', reported: false },
  { id: '#REV-003', product: 'Wireless Bluetooth Earbuds', user: 'Fatima Akhter', rating: 2, content: 'Not worth the price. Sound quality is average.', date: '23 Jun 2026', status: 'Pending', reported: true },
  { id: '#REV-004', product: 'Handcrafted Wooden Showpiece', user: 'Nurul Islam', rating: 5, content: 'Beautiful craftsmanship! Looks amazing on my shelf.', date: '22 Jun 2026', status: 'Approved', reported: false },
  { id: '#REV-005', product: 'Bengali Novel - Hajar Bochor', user: 'Sharmin Sultana', rating: 3, content: 'Decent book but expected better packaging.', date: '21 Jun 2026', status: 'Hidden', reported: false },
  { id: '#REV-006', product: 'Organic Green Tea (100 Pack)', user: 'Jahid Hasan', rating: 5, content: 'Great taste! Love the natural flavor.', date: '20 Jun 2026', status: 'Approved', reported: false },
  { id: '#REV-007', product: 'Samsung Galaxy S24 Ultra', user: 'Morshed Alam', rating: 1, content: 'Phone arrived with a scratch. Very disappointed.', date: '19 Jun 2026', status: 'Pending', reported: true },
  { id: '#REV-008', product: 'Smart LED TV 55 Inch', user: 'Parvin Akhter', rating: 4, content: 'Great picture quality. Sound could be better.', date: '18 Jun 2026', status: 'Approved', reported: false },
];

const statusStyles: Record<string, string> = {
  Approved: 'bg-green-100 text-green-700',
  Pending: 'bg-amber-100 text-amber-700',
  Hidden: 'bg-red-100 text-red-700',
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`material-symbols-outlined text-[16px] ${star <= rating ? 'text-amber-400' : 'text-[#ddd]'}`}>
          {star <= rating ? 'star' : 'star'}
        </span>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = statusFilter === 'All' ? mockReviews : mockReviews.filter((r) => r.status === statusFilter);

  const avgRating = (mockReviews.reduce((s, r) => s + r.rating, 0) / mockReviews.length).toFixed(1);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">Reviews</h1>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Reviews', value: mockReviews.length },
          { label: 'Average Rating', value: avgRating, icon: 'star' },
          { label: 'Pending', value: mockReviews.filter((r) => r.status === 'Pending').length, color: 'text-amber-600' },
          { label: 'Reported', value: mockReviews.filter((r) => r.reported).length, color: 'text-red-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-[#eee]">
            <p className={`text-2xl font-bold ${s.color || 'text-[#222]'}`}>{s.value}</p>
            <p className="text-sm text-[#888] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {['All', 'Approved', 'Pending', 'Hidden'].map((tab) => (
          <button key={tab} onClick={() => setStatusFilter(tab)} className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${statusFilter === tab ? 'bg-primary text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f5f5f5]'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
              <th className="p-3">Product</th>
              <th className="p-3">User</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Content</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                <td className="p-3 font-medium text-[#333] max-w-[160px] truncate">{r.product}</td>
                <td className="p-3 text-[#555]">{r.user}</td>
                <td className="p-3"><StarRating rating={r.rating} /></td>
                <td className="p-3 text-[#666] max-w-[240px] truncate">{r.content}</td>
                <td className="p-3 text-[#888] text-xs">{r.date}</td>
                <td className="p-3">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[r.status]}`}>{r.status}</span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    {r.status === 'Pending' && (
                      <>
                        <button className="text-[11px] bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600">Approve</button>
                        <button className="text-[11px] bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600">Hide</button>
                      </>
                    )}
                    {r.reported && <span className="text-[11px] bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">Flagged</span>}
                    <button className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Delete">
                      <span className="material-symbols-outlined text-[18px] text-[#666]">delete</span>
                    </button>
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
