'use client';

import { useState } from 'react';

const mockUsers = [
  { id: '#USR-001', name: 'Rahima Begum', email: 'rahima@email.com', phone: '+8801712345601', role: 'Customer', status: 'Active', orders: 24, joined: '12 Jan 2024', addresses: 'Dhaka, Mirpur 12', totalSpent: '৳45,200', lastLogin: '28 Jun 2026 10:23 AM' },
  { id: '#USR-002', name: 'Karim Hossain', email: 'karim@email.com', phone: '+8801712345602', role: 'Seller', status: 'Active', orders: 8, joined: '03 Mar 2024', addresses: 'Chittagong, Agrabad', totalSpent: '৳12,800', lastLogin: '28 Jun 2026 09:15 AM' },
  { id: '#USR-003', name: 'Fatima Akhter', email: 'fatima@email.com', phone: '+8801712345603', role: 'Customer', status: 'Active', orders: 56, joined: '22 May 2023', addresses: 'Sylhet, Zindabazar', totalSpent: '৳89,500', lastLogin: '27 Jun 2026 06:45 PM' },
  { id: '#USR-004', name: 'Nurul Islam', email: 'nurul@email.com', phone: '+8801712345604', role: 'Customer', status: 'Banned', orders: 2, joined: '15 Aug 2024', addresses: 'Rajshahi, Shaheb Bazar', totalSpent: '৳3,200', lastLogin: '10 May 2026 02:30 PM' },
  { id: '#USR-005', name: 'Sharmin Sultana', email: 'sharmin@email.com', phone: '+8801712345605', role: 'Seller', status: 'Active', orders: 0, joined: '01 Feb 2025', addresses: 'Khulna, Sonadanga', totalSpent: '৳0', lastLogin: '25 Jun 2026 11:00 AM' },
  { id: '#USR-006', name: 'Jahid Hasan', email: 'jahid@email.com', phone: '+8801712345606', role: 'Admin', status: 'Active', orders: 12, joined: '10 Nov 2023', addresses: 'Dhaka, Gulshan 2', totalSpent: '৳34,100', lastLogin: '28 Jun 2026 08:00 AM' },
  { id: '#USR-007', name: 'Morshed Alam', email: 'morshed@email.com', phone: '+8801712345607', role: 'Customer', status: 'Active', orders: 3, joined: '05 Jul 2024', addresses: 'Barisal, Sadar Road', totalSpent: '৳5,600', lastLogin: '20 Jun 2026 03:15 PM' },
  { id: '#USR-008', name: 'Parvin Akhter', email: 'parvin@email.com', phone: '+8801712345608', role: 'Customer', status: 'Banned', orders: 1, joined: '18 Sep 2024', addresses: 'Rangpur, Station Road', totalSpent: '৳890', lastLogin: '02 Apr 2026 01:00 PM' },
  { id: '#USR-009', name: 'Shahidul Islam', email: 'shahidul@email.com', phone: '+8801712345609', role: 'Seller', status: 'Active', orders: 15, joined: '20 Dec 2023', addresses: 'Mymensingh, Kewatkhali', totalSpent: '৳67,300', lastLogin: '27 Jun 2026 07:30 PM' },
  { id: '#USR-010', name: 'Taslima Nasrin', email: 'taslima@email.com', phone: '+8801712345610', role: 'Customer', status: 'Active', orders: 31, joined: '14 Apr 2024', addresses: 'Dhaka, Uttara Sector 7', totalSpent: '৳52,100', lastLogin: '28 Jun 2026 12:00 PM' },
];

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filtered = mockUsers.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">Users</h1>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-white border border-[#ddd] rounded-lg px-3 py-2 w-full sm:w-64">
            <span className="material-symbols-outlined text-[#888] text-[20px]">search</span>
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm flex-1"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none"
          >
            <option value="All">All Roles</option>
            <option value="Customer">Customer</option>
            <option value="Seller">Seller</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <span className="text-sm text-[#888]">{filtered.length} users</span>
      </div>

      <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Orders</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <>
                <tr
                  key={u.id}
                  className="border-b border-[#f5f5f5] hover:bg-[#fafafa] cursor-pointer"
                  onClick={() => setExpandedRow(expandedRow === u.id ? null : u.id)}
                >
                  <td className="p-3 font-medium text-[#333]">{u.id}</td>
                  <td className="p-3 text-[#444]">{u.name}</td>
                  <td className="p-3 text-[#666]">{u.email}</td>
                  <td className="p-3 text-[#666]">{u.phone}</td>
                  <td className="p-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      u.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                      u.role === 'Seller' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{u.role}</span>
                  </td>
                  <td className="p-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      u.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>{u.status}</span>
                  </td>
                  <td className="p-3 text-[#666]">{u.orders}</td>
                  <td className="p-3 text-[#888]">{u.joined}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title={u.status === 'Active' ? 'Ban User' : 'Unban User'}>
                        <span className="material-symbols-outlined text-[18px] text-[#666]">
                          {u.status === 'Active' ? 'block' : 'check_circle'}
                        </span>
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Edit">
                        <span className="material-symbols-outlined text-[18px] text-[#666]">edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedRow === u.id && (
                  <tr key={`${u.id}-detail`}>
                    <td colSpan={9} className="p-4 bg-[#fafafa] border-b border-[#f0f0f0]">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-[#888] text-xs mb-1">Addresses</p>
                          <p className="text-[#444]">{u.addresses}</p>
                        </div>
                        <div>
                          <p className="text-[#888] text-xs mb-1">Total Spent</p>
                          <p className="text-[#444] font-semibold">{u.totalSpent}</p>
                        </div>
                        <div>
                          <p className="text-[#888] text-xs mb-1">Last Login</p>
                          <p className="text-[#444]">{u.lastLogin}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
