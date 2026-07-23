'use client';

import React, { useState } from 'react';
import { useAdminPage } from '@/lib/api/hooks';
import { fetchUsers, updateUser, fetchOrders } from '@/lib/api/admin';
import type { UserSummary, PaginatedUsers, AdminOrder } from '@/types';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatDate, formatBDT, ORDER_STATUS_COLORS } from '@/types';

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [viewingOrdersFor, setViewingOrdersFor] = useState<string | null>(null);
  const [ordersData, setOrdersData] = useState<AdminOrder[] | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const { data, loading, error, refetch, page, setPage } = useAdminPage<
    PaginatedUsers
  >(
    ({ page, limit }) =>
      fetchUsers({
        page,
        limit,
        search: search || undefined,
        role: roleFilter !== 'All' ? roleFilter : undefined,
      }),
    [search, roleFilter]
  );

  const fetchUserOrders = async (userId: string) => {
    setOrdersLoading(true);
    try {
      const res = await fetchOrders({ page: 1, limit: 100 });
      const userOrders = res.orders.filter(
        (order: any) => order.user?.id === userId
      );
      setOrdersData(userOrders);
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to fetch orders'));
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleToggleBan = async (userId: string, currentlyActive: boolean) => {
    if (
      !window.confirm(
        `Are you sure you want to ${currentlyActive ? 'ban' : 'unban'} this user?`
      )
    )
      return;
    try {
      await updateUser(userId, { isActive: !currentlyActive });
      refetch();
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to update user status'));
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">Customers</h1>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-white border border-[#ddd] rounded-lg px-3 py-2 w-full sm:w-64">
            <span className="material-symbols-outlined text-[#888] text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="bg-transparent border-none outline-none text-sm flex-1"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
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
          <span className="text-sm text-[#888]">{data.total} customers</span>
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
              <th className="p-3">Orders</th>
              <th className="p-3">Status</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-4 text-center text-[#888]">
                  Loading...
                </td>
              </tr>
            ) : !data || data.users.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-4 text-center text-[#888]">
                  No customers found
                </td>
              </tr>
            ) : (
              data.users.map((user: UserSummary) => (
                <React.Fragment key={user.id}>
                  <tr
                    className="border-b border-[#f5f5f5] hover:bg-[#fafafa] cursor-pointer"
                    onClick={() => setExpandedRow(expandedRow === user.id ? null : user.id)}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold uppercase">
                          {user.name?.charAt(0) || '?'}
                        </div>
                        <span className="font-medium text-[#333]">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-[#666]">{user.email || '—'}</td>
                    <td className="p-3 text-[#666]">{user.phone}</td>
                    <td className="p-3 text-[#666]">0</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        user.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {user.isActive ? 'Active' : 'Banned'}
                      </span>
                    </td>
                    <td className="p-3 text-[#888]">{formatDate(user.createdAt)}</td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleBan(user.id, user.isActive)}
                          className={`p-1.5 rounded-lg hover:bg-[#f5f5f5]`}
                          title={user.isActive ? 'Ban User' : 'Unban User'}
                        >
                          <span className="material-symbols-outlined text-[18px] text-[#666]">
                            {user.isActive ? 'block' : 'check_circle'}
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setViewingOrdersFor(user.id);
                            fetchUserOrders(user.id);
                          }}
                          className={`p-1.5 rounded-lg hover:bg-[#f5f5f5]`}
                          title="View Orders"
                        >
                          <span className="material-symbols-outlined text-[18px] text-[#666]">
                            list_alt
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRow === user.id && (
                    <tr key={`${user.id}-detail`}>
                      <td colSpan={7} className="p-4 bg-[#fafafa] border-b border-[#f0f0f0]">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-[#888] text-xs mb-1">User ID</p>
                            <p className="text-[#444] font-mono text-xs">{user.id}</p>
                          </div>
                          <div>
                            <p className="text-[#888] text-xs mb-1">Last Login</p>
                            <p className="text-[#444]">
                              {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                            </p>
                          </div>
                          <div>
                            <p className="text-[#888] text-xs mb-1">Verified</p>
                            <p className="text-[#444]">{user.isVerified ? 'Yes' : 'No'}</p>
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

      {/* Modal for viewing orders */}
      {viewingOrdersFor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#eee] flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Orders for User {viewingOrdersFor}
              </h3>
              <button
                onClick={() => {
                  setViewingOrdersFor(null);
                  setOrdersData(null);
                }}
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-[#888]">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {ordersLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : !ordersData || ordersData.length === 0 ? (
                <p className="text-center text-[#888]">No orders found for this user.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                        <th className="p-3">Order #</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordersData.map((order: any) => (
                        <tr key={order.id} className="border-b border-[#f5f5f5]">
                          <td className="p-3 whitespace-nowrap">
                            #{order.orderNumber || order.id.slice(-6)}
                          </td>
                          <td className="p-3 text-[#888]">{formatDate(order.createdAt)}</td>
                          <td className="p-3 font-medium whitespace-nowrap">
                            {formatBDT(order.total)}
                          </td>
                          <td className="p-3">
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                              ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}