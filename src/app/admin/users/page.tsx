'use client';

import React, { useState } from 'react';
import { useAdminPage } from '@/lib/api/hooks';
import { fetchUsers, updateUser } from '@/lib/api/admin';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';

const roleBadge: Record<string, string> = {
  ADMIN: 'bg-purple-100 text-purple-700',
  SELLER: 'bg-blue-100 text-blue-700',
  CUSTOMER: 'bg-gray-100 text-gray-700',
  MODERATOR: 'bg-teal-100 text-teal-700',
  LOGISTICS: 'bg-cyan-100 text-cyan-700',
};

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const { data, loading, error, refetch, page, setPage } = useAdminPage(
    ({ page, limit }) =>
      fetchUsers({
        page,
        limit,
        search: search || undefined,
        role: roleFilter !== 'All' ? roleFilter : undefined,
      }),
    [search, roleFilter],
  );

  const handleToggleBan = async (userId: string, currentlyActive: boolean) => {
    try {
      await updateUser(userId, { isActive: !currentlyActive });
      refetch();
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to update user'));
    }
  };

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
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="bg-transparent border-none outline-none text-sm flex-1"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="bg-white border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none"
          >
            <option value="All">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="SELLER">Seller</option>
            <option value="CUSTOMER">Customer</option>
            <option value="MODERATOR">Moderator</option>
            <option value="LOGISTICS">Logistics</option>
          </select>
        </div>
        {data && (
          <span className="text-sm text-[#888]">{data.total} users</span>
        )}
      </div>

      {error && <AdminError message={error} onRetry={refetch} />}

      <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <AdminLoading />
            ) : !data || data.users.length === 0 ? (
              <AdminEmpty message="No users found" />
            ) : (
              data.users.map((u) => (
                <React.Fragment key={u.id}>
                  <tr
                    className="border-b border-[#f5f5f5] hover:bg-[#fafafa] cursor-pointer"
                    onClick={() => setExpandedRow(expandedRow === u.id ? null : u.id)}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold uppercase">
                          {u.name?.charAt(0) || '?'}
                        </div>
                        <span className="font-medium text-[#333]">{u.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-[#666]">{u.email || '—'}</td>
                    <td className="p-3 text-[#666]">{u.phone}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${roleBadge[u.role] || 'bg-gray-100 text-gray-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {u.isActive ? 'Active' : 'Banned'}
                      </span>
                    </td>
                    <td className="p-3 text-[#888]">{formatDate(u.createdAt)}</td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleBan(u.id, u.isActive)}
                          className={`p-1.5 rounded-lg hover:bg-[#f5f5f5]`}
                          title={u.isActive ? 'Ban User' : 'Unban User'}
                        >
                          <span className="material-symbols-outlined text-[18px] text-[#666]">
                            {u.isActive ? 'block' : 'check_circle'}
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRow === u.id && (
                    <tr key={`${u.id}-detail`}>
                      <td colSpan={7} className="p-4 bg-[#fafafa] border-b border-[#f0f0f0]">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-[#888] text-xs mb-1">User ID</p>
                            <p className="text-[#444] font-mono text-xs">{u.id}</p>
                          </div>
                          <div>
                            <p className="text-[#888] text-xs mb-1">Verified</p>
                            <p className="text-[#444]">{u.isVerified ? 'Yes' : 'No'}</p>
                          </div>
                          <div>
                            <p className="text-[#888] text-xs mb-1">Last Login</p>
                            <p className="text-[#444]">{u.lastLoginAt ? formatDate(u.lastLoginAt) : 'Never'}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 && (
        <Pagination page={page} totalPages={data.totalPages} total={data.total} onPageChange={setPage} />
      )}
    </div>
  );
}
