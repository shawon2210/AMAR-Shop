'use client';

import { useState } from 'react';

const mockSellers = [
  { id: '#SLR-001', store: 'TechHaven BD', owner: 'Shahidul Islam', products: 340, revenue: '৳28,40,000', commission: '5%', rating: 4.8, kyc: 'Verified', status: 'Active', official: true },
  { id: '#SLR-002', store: 'Fashion Hub', owner: 'Nasrin Akhter', products: 520, revenue: '৳21,60,000', commission: '7%', rating: 4.5, kyc: 'Verified', status: 'Active', official: false },
  { id: '#SLR-003', store: 'Gadget Pro', owner: 'Rafiq Hasan', products: 180, revenue: '৳18,90,000', commission: '5%', rating: 4.2, kyc: 'Pending', status: 'Pending', official: false },
  { id: '#SLR-004', store: 'Home Decor Ltd', owner: 'Sharmin Sultana', products: 95, revenue: '৳15,20,000', commission: '8%', rating: 4.6, kyc: 'Verified', status: 'Active', official: true },
  { id: '#SLR-005', store: 'Book Nook', owner: 'Jahid Hasan', products: 1500, revenue: '৳12,70,000', commission: '10%', rating: 4.9, kyc: 'Verified', status: 'Active', official: false },
  { id: '#SLR-006', store: 'Beauty Bazaar', owner: 'Parvin Akhter', products: 210, revenue: '৳9,80,000', commission: '7%', rating: 4.1, kyc: 'Rejected', status: 'Suspended', official: false },
  { id: '#SLR-007', store: 'Sports Kingdom', owner: 'Morshed Alam', products: 160, revenue: '৳8,50,000', commission: '6%', rating: 4.3, kyc: 'Pending', status: 'Active', official: false },
  { id: '#SLR-008', store: 'Organic Foods BD', owner: 'Taslima Nasrin', products: 80, revenue: '৳6,20,000', commission: '5%', rating: 4.7, kyc: 'Verified', status: 'Active', official: false },
];

const kycStyles: Record<string, string> = {
  Verified: 'bg-green-100 text-green-700',
  Pending: 'bg-amber-100 text-amber-700',
  Rejected: 'bg-red-100 text-red-700',
};

const statusStyles: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Pending: 'bg-amber-100 text-amber-700',
  Suspended: 'bg-red-100 text-red-700',
};

export default function SellersPage() {
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">Sellers</h1>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Sellers', value: '3,420' },
          { label: 'Active', value: '2,850', color: 'text-green-600' },
          { label: 'Pending KYC', value: '120', color: 'text-amber-600' },
          { label: 'Suspended', value: '45', color: 'text-red-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-[#eee]">
            <p className={`text-2xl font-bold ${s.color || 'text-[#222]'}`}>{s.value}</p>
            <p className="text-sm text-[#888] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
              <th className="p-3">Store</th>
              <th className="p-3">Owner</th>
              <th className="p-3">Products</th>
              <th className="p-3">Revenue</th>
              <th className="p-3">Commission</th>
              <th className="p-3">Rating</th>
              <th className="p-3">KYC</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockSellers.map((s) => (
              <tr key={s.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#333]">{s.store}</span>
                    {s.official && (
                      <span className="material-symbols-outlined text-blue-500 text-[16px]" title="Official Store">verified</span>
                    )}
                  </div>
                </td>
                <td className="p-3 text-[#555]">{s.owner}</td>
                <td className="p-3 text-[#666]">{s.products}</td>
                <td className="p-3 font-medium">{s.revenue}</td>
                <td className="p-3 text-[#666]}">{s.commission}</td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-amber-400 text-[16px]">star</span>
                    <span>{s.rating}</span>
                  </div>
                </td>
                <td className="p-3">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${kycStyles[s.kyc]}`}>{s.kyc}</span>
                </td>
                <td className="p-3">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[s.status]}`}>{s.status}</span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    {s.kyc === 'Pending' && (
                      <>
                        <button className="text-[11px] bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600">Approve KYC</button>
                        <button onClick={() => setRejectModal(s.id)} className="text-[11px] bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600">Reject</button>
                      </>
                    )}
                    <button className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Edit Commission">
                      <span className="material-symbols-outlined text-[18px] text-[#666]">percent</span>
                    </button>
                    {s.status === 'Active' && (
                      <button className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Suspend">
                        <span className="material-symbols-outlined text-[18px] text-[#666]">block</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[#222] mb-2">Reject KYC</h3>
            <p className="text-sm text-[#888] mb-4">Provide a reason for rejecting this seller&apos;s KYC.</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={3}
              className="w-full border border-[#ddd] rounded-lg p-3 text-sm outline-none resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => { setRejectModal(null); setRejectReason(''); }} className="px-4 py-2 text-sm text-[#666] hover:bg-[#f5f5f5] rounded-lg">Cancel</button>
              <button onClick={() => { setRejectModal(null); setRejectReason(''); }} className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
