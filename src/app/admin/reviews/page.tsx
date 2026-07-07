'use client';

import { useState } from 'react';
import { useAdminPage } from '@/lib/api/hooks';
import { fetchReviews, updateReview, deleteReview } from '@/lib/api/admin';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

const statusStyles: Record<string, string> = {
  APPROVED: 'bg-green-100 text-green-700',
  PENDING: 'bg-amber-100 text-amber-700',
  HIDDEN: 'bg-red-100 text-red-700',
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`material-symbols-outlined text-[16px] ${star <= rating ? 'text-amber-400' : 'text-[#ddd]'}`}>
          star
        </span>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const { data, loading, error, refetch, page, setPage } = useAdminPage(
    ({ page, limit }) => fetchReviews({
      page,
      limit,
      status: statusFilter === 'ALL' ? undefined : statusFilter,
    }),
    [statusFilter],
  );

  const handleApprove = async (id: string) => {
    try { await updateReview(id, { status: 'APPROVED' }); refetch(); } catch (e) { alert(getErrorMessage(e)); }
  };

  const handleHide = async (id: string) => {
    try { await updateReview(id, { status: 'HIDDEN' }); refetch(); } catch (e) { alert(getErrorMessage(e)); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    try { await deleteReview(id); refetch(); } catch (e) { alert(getErrorMessage(e)); }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">Reviews</h1>

      {error && <AdminError message={error} onRetry={refetch} />}

      <div className="flex gap-2 flex-wrap">
        {['ALL', 'APPROVED', 'PENDING', 'HIDDEN'].map((tab) => (
          <button key={tab} onClick={() => { setStatusFilter(tab); setPage(1); }}
            className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${statusFilter === tab ? 'bg-primary text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f5f5f5]'}`}>
            {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <AdminLoading />
      ) : !data?.reviews || data.reviews.length === 0 ? (
        <AdminEmpty message="No reviews found" />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block bg-white rounded-xl border border-[#eee] overflow-x-auto">
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
                {data.reviews.map((r) => (
                  <tr key={r.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 max-w-[160px]"><p className="font-medium text-[#333] truncate">{r.product.name}</p></td>
                    <td className="p-3 text-[#555]">{r.user.name}</td>
                    <td className="p-3"><StarRating rating={r.rating} /></td>
                    <td className="p-3 text-[#666] max-w-[250px] truncate">{r.comment || '—'}</td>
                    <td className="p-3 text-[#888] text-xs">{formatDate(r.createdAt)}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[r.status] || 'bg-gray-100 text-gray-700'}`}>{r.status}</span>
                      {r.reported && <span className="ml-1 text-[10px] text-red-500">⚠</span>}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        {r.status === 'PENDING' && <button onClick={() => handleApprove(r.id)} className="text-xs bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600">Approve</button>}
                        {r.status !== 'HIDDEN' && <button onClick={() => handleHide(r.id)} className="text-xs bg-amber-500 text-white px-2 py-1 rounded-md hover:bg-amber-600">Hide</button>}
                        <button onClick={() => handleDelete(r.id)} className="text-xs bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {data.reviews.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border border-[#eee] p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm text-[#333] truncate flex-1">{r.product.name}</p>
                  <div className="flex items-center gap-1 shrink-0">
                    <StarRating rating={r.rating} />
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${statusStyles[r.status] || 'bg-gray-100 text-gray-700'}`}>{r.status}</span>
                    {r.reported && <span className="text-[10px] text-red-500">⚠</span>}
                  </div>
                </div>
                <p className="text-xs text-[#666] line-clamp-2">{r.comment || '—'}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#888]">{r.user.name} · {formatDate(r.createdAt)}</span>
                  <div className="flex gap-1">
                    {r.status === 'PENDING' && <button onClick={() => handleApprove(r.id)} className="text-[10px] bg-green-500 text-white px-2 py-1 rounded-md">Approve</button>}
                    {r.status !== 'HIDDEN' && <button onClick={() => handleHide(r.id)} className="text-[10px] bg-amber-500 text-white px-2 py-1 rounded-md">Hide</button>}
                    <button onClick={() => handleDelete(r.id)} className="text-[10px] bg-red-500 text-white px-2 py-1 rounded-md">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {data && data.totalPages > 1 && (
        <Pagination page={page} totalPages={data.totalPages} total={data.total} onPageChange={setPage} />
      )}
    </div>
  );
}
