'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAdminPage } from '@/lib/api/hooks';
import { fetchProducts, approveProduct, rejectProduct } from '@/lib/api/admin';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  rejected: 'bg-red-100 text-red-700',
  inactive: 'bg-gray-100 text-gray-700',
};

function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString('en-IN')}`;
}

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const { data, loading, error, refetch, page, setPage } = useAdminPage(
    ({ page, limit }) =>
      fetchProducts({
        page,
        limit,
        search: search || undefined,
        status: statusFilter !== 'All' ? statusFilter.toLowerCase() : undefined,
      }),
    [search, statusFilter],
  );

  const handleApprove = async (id: string) => {
    try {
      await approveProduct(id);
      refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to approve product');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    try {
      await rejectProduct(id, reason);
      refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reject product');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-[#222]">Products</h1>
        {data && (
          <span className="text-xs sm:text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium w-fit">
            {data.total} total
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white border border-[#ddd] rounded-lg px-3 py-2 flex-1 max-w-md">
          <span className="material-symbols-outlined text-[#888] text-[20px]">search</span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="bg-transparent border-none outline-none text-sm flex-1"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="bg-white border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {error && <AdminError message={error} onRetry={refetch} />}

      {loading ? (
        <AdminLoading />
      ) : !data || data.products.length === 0 ? (
        <AdminEmpty message="No products found" />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block bg-white rounded-xl border border-[#eee] overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                  <th className="p-2 sm:p-3 whitespace-nowrap">Product</th>
                  <th className="p-2 sm:p-3 whitespace-nowrap">Store</th>
                  <th className="p-2 sm:p-3 whitespace-nowrap hidden lg:table-cell">Category</th>
                  <th className="p-2 sm:p-3 whitespace-nowrap">Price</th>
                  <th className="p-2 sm:p-3 whitespace-nowrap">Stock</th>
                  <th className="p-2 sm:p-3 whitespace-nowrap">Status</th>
                  <th className="p-2 sm:p-3 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((p) => (
                  <tr key={p.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-2 sm:p-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#f0f0f0] flex items-center justify-center overflow-hidden shrink-0">
                          {p.images?.[0] ? (
                            <Image src={p.images[0]} alt={p.name} width={40} height={40} className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined text-[#888] text-[16px] sm:text-[20px]">inventory_2</span>
                          )}
                        </div>
                        <span className="font-medium text-[#333] max-w-[140px] sm:max-w-[200px] truncate">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-2 sm:p-3 text-[#555] whitespace-nowrap">{p.store?.name || 'N/A'}</td>
                    <td className="p-2 sm:p-3 text-[#666] whitespace-nowrap hidden lg:table-cell">{p.category?.name || 'N/A'}</td>
                    <td className="p-2 sm:p-3 font-medium whitespace-nowrap">{formatBDT(p.price)}</td>
                    <td className="p-2 sm:p-3 whitespace-nowrap">
                      <span className={p.stockCount === 0 ? 'text-red-500 font-medium' : 'text-[#666]'}>
                        {p.stockCount === 0 ? 'Out of Stock' : p.stockCount}
                      </span>
                    </td>
                    <td className="p-2 sm:p-3 whitespace-nowrap">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[p.status] || 'bg-gray-100 text-gray-700'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-2 sm:p-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {p.status === 'pending' && (
                          <>
                            <button onClick={() => handleApprove(p.id)} className="text-[10px] sm:text-[11px] bg-green-500 text-white px-1.5 sm:px-2 py-1 rounded-md hover:bg-green-600 font-medium">Approve</button>
                            <button onClick={() => handleReject(p.id)} className="text-[10px] sm:text-[11px] bg-red-500 text-white px-1.5 sm:px-2 py-1 rounded-md hover:bg-red-600 font-medium">Reject</button>
                          </>
                        )}
                        <button className="p-1 sm:p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Edit">
                          <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#666]">edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {data.products.map((p) => (
              <div key={p.id} className="bg-white rounded-xl border border-[#eee] p-3 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#f0f0f0] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {p.images?.[0] ? (
                      <Image src={p.images[0]} alt={p.name} width={48} height={48} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-[#888] text-[20px]">inventory_2</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[#333] text-sm truncate">{p.name}</p>
                    <p className="text-xs text-[#888]">{p.store?.name || 'N/A'} · {p.category?.name || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{formatBDT(p.price)}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[p.status] || 'bg-gray-100 text-gray-700'}`}>
                      {p.status}
                    </span>
                    <span className={p.stockCount === 0 ? 'text-red-500 text-xs font-medium' : 'text-[#888] text-xs'}>
                      {p.stockCount === 0 ? 'Out of Stock' : `${p.stockCount} in stock`}
                    </span>
                  </div>
                </div>
                {p.status === 'pending' && (
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => handleApprove(p.id)} className="flex-1 text-xs bg-green-500 text-white py-1.5 rounded-md font-medium hover:bg-green-600">Approve</button>
                    <button onClick={() => handleReject(p.id)} className="flex-1 text-xs bg-red-500 text-white py-1.5 rounded-md font-medium hover:bg-red-600">Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#888]">
            Page {page} of {data.totalPages} ({data.total} total)
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 bg-white border border-[#ddd] rounded-lg disabled:opacity-50 hover:bg-[#f5f5f5]"
            >
              Previous
            </button>
            <button
              disabled={page >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 bg-white border border-[#ddd] rounded-lg disabled:opacity-50 hover:bg-[#f5f5f5]"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
