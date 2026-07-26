'use client';

import { useState } from 'react';
import { useAdminPage } from '@/lib/api/hooks';
import { fetchProducts, approveProduct, rejectProduct } from '@/lib/api/admin/products';
import { fetchSellers, approveSeller, rejectSeller, toggleStoreStatus } from '@/lib/api/admin/sellers';
import { fetchReviews, updateReview } from '@/lib/api/admin/marketing';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';

type Tab = 'products' | 'reviews' | 'sellers';

const tabLabels: Record<Tab, string> = {
  products: 'Pending Products',
  reviews: 'Flagged Reviews',
  sellers: 'Vendor Approvals',
};

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ModerationPage() {
  const [tab, setTab] = useState<Tab>('products');

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">Moderation Queue</h1>

      <div className="flex gap-2 flex-wrap">
        {(Object.entries(tabLabels) as [Tab, string][]).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${tab === key ? 'bg-primary text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f5f5f5]'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'products' && <PendingProducts />}
      {tab === 'reviews' && <FlaggedReviews />}
      {tab === 'sellers' && <PendingSellers />}
    </div>
  );
}

function PendingProducts() {
  const [statusFilter] = useState('pending');
  const { data, loading, error, refetch, page, setPage } = useAdminPage(
    ({ page, limit }) => fetchProducts({ page, limit, status: statusFilter }),
    [statusFilter],
  );

  const handleApprove = async (id: string) => {
    try { await approveProduct(id); refetch(); } catch (e) { alert(getErrorMessage(e)); }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Rejection reason:');
    if (!reason) return;
    try { await rejectProduct(id, reason); refetch(); } catch (e) { alert(getErrorMessage(e)); }
  };

  if (loading) return <AdminLoading />;
  if (error) return <AdminError message={error} onRetry={refetch} />;
  if (!data?.products?.length) return <AdminEmpty message="No pending products" />;

  return (
    <>
      <div className="hidden sm:block bg-white rounded-xl border border-[#eee] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
              <th className="p-3">Product</th>
              <th className="p-3">Store</th>
              <th className="p-3">Price</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((p) => (
              <tr key={p.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                <td className="p-3 max-w-[200px]"><p className="font-medium text-[#333] truncate">{p.name}</p></td>
                <td className="p-3 text-[#555]">{p.store?.name || '—'}</td>
                <td className="p-3 text-[#555]">৳{p.price?.toLocaleString()}</td>
                <td className="p-3 text-[#888] text-xs">{formatDate(p.createdAt)}</td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <button onClick={() => handleApprove(p.id)} className="text-[10px] sm:text-[11px] bg-green-500 text-white px-1.5 sm:px-2 py-1 rounded-md hover:bg-green-600 font-medium">Approve</button>
                    <button onClick={() => handleReject(p.id)} className="text-[10px] sm:text-[11px] bg-red-500 text-white px-1.5 sm:px-2 py-1 rounded-md hover:bg-red-600 font-medium">Reject</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden space-y-3">
        {data.products.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-[#eee] p-3 space-y-2">
            <p className="font-medium text-sm text-[#333]">{p.name}</p>
            <div className="flex items-center justify-between text-xs text-[#666]">
              <span>{p.store?.name || '—'} · ৳{p.price?.toLocaleString()}</span>
              <span className="text-[#888]">{formatDate(p.createdAt)}</span>
            </div>
            <div className="flex gap-1 pt-1">
              <button onClick={() => handleApprove(p.id)} className="text-[10px] bg-green-500 text-white px-2 py-1 rounded-md font-medium">Approve</button>
              <button onClick={() => handleReject(p.id)} className="text-[10px] bg-red-500 text-white px-2 py-1 rounded-md font-medium">Reject</button>
            </div>
          </div>
        ))}
      </div>

      {data && data.totalPages > 1 && (
        <Pagination page={page} totalPages={data.totalPages} total={data.total} onPageChange={setPage} />
      )}
    </>
  );
}

function FlaggedReviews() {
  const [statusFilter] = useState('PENDING');
  const { data, loading, error, refetch, page, setPage } = useAdminPage(
    ({ page, limit }) => fetchReviews({ page, limit, status: statusFilter }),
    [statusFilter],
  );

  const handleApprove = async (id: string) => {
    try { await updateReview(id, { status: 'APPROVED' }); refetch(); } catch (e) { alert(getErrorMessage(e)); }
  };

  const handleHide = async (id: string) => {
    try { await updateReview(id, { status: 'HIDDEN' }); refetch(); } catch (e) { alert(getErrorMessage(e)); }
  };

  if (loading) return <AdminLoading />;
  if (error) return <AdminError message={error} onRetry={refetch} />;
  if (!data?.reviews?.length) return <AdminEmpty message="No flagged reviews" />;

  return (
    <>
      <div className="hidden sm:block bg-white rounded-xl border border-[#eee] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
              <th className="p-3">Product</th>
              <th className="p-3">User</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Content</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.reviews.map((r) => (
              <tr key={r.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                <td className="p-3 max-w-[160px]"><p className="font-medium text-[#333] truncate">{r.product?.name || '—'}</p></td>
                <td className="p-3 text-[#555]">{r.user?.name || '—'}</td>
                <td className="p-3">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={`material-symbols-outlined text-[16px] ${star <= r.rating ? 'text-amber-400' : 'text-[#ddd]'}`}>star</span>
                    ))}
                  </div>
                </td>
                <td className="p-3 text-[#666] max-w-[250px] truncate">{r.comment || '—'}</td>
                <td className="p-3 text-[#888] text-xs">{formatDate(r.createdAt)}</td>
                <td className="p-3">
                  <div className="flex gap-1">
                    {r.status === 'PENDING' && <button onClick={() => handleApprove(r.id)} className="text-[10px] sm:text-[11px] bg-green-500 text-white px-1.5 sm:px-2 py-1 rounded-md hover:bg-green-600 font-medium">Approve</button>}
                    {r.status !== 'HIDDEN' && <button onClick={() => handleHide(r.id)} className="text-[10px] sm:text-[11px] bg-amber-500 text-white px-1.5 sm:px-2 py-1 rounded-md hover:bg-amber-600 font-medium">Hide</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden space-y-3">
        {data.reviews.map((r) => (
          <div key={r.id} className="bg-white rounded-xl border border-[#eee] p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm text-[#333] truncate flex-1">{r.product?.name || '—'}</p>
              <div className="flex items-center gap-1 shrink-0">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`material-symbols-outlined text-[14px] ${star <= r.rating ? 'text-amber-400' : 'text-[#ddd]'}`}>star</span>
                ))}
              </div>
            </div>
            <p className="text-xs text-[#666] line-clamp-2">{r.comment || '—'}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#888]">{r.user?.name || '—'} · {formatDate(r.createdAt)}</span>
              <div className="flex gap-1">
                {r.status === 'PENDING' && <button onClick={() => handleApprove(r.id)} className="text-[10px] bg-green-500 text-white px-2 py-1 rounded-md">Approve</button>}
                {r.status !== 'HIDDEN' && <button onClick={() => handleHide(r.id)} className="text-[10px] bg-amber-500 text-white px-2 py-1 rounded-md">Hide</button>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {data && data.totalPages > 1 && (
        <Pagination page={page} totalPages={data.totalPages} total={data.total} onPageChange={setPage} />
      )}
    </>
  );
}

function PendingSellers() {
  const [filter, setFilter] = useState('pending');
  const { data, loading, error, refetch, page, setPage } = useAdminPage(
    ({ page, limit }) => fetchSellers({ page, limit, kycStatus: filter === 'all' ? undefined : filter }),
    [filter],
  );

  const handleApprove = async (id: string) => {
    try { await approveSeller(id); refetch(); } catch (e) { alert(getErrorMessage(e)); }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Rejection reason:');
    if (!reason) return;
    try { await rejectSeller(id, reason); refetch(); } catch (e) { alert(getErrorMessage(e)); }
  };

  const handleToggleStore = async (id: string) => {
    try { await toggleStoreStatus(id); refetch(); } catch (e) { alert(getErrorMessage(e)); }
  };

  if (loading) return <AdminLoading />;
  if (error) return <AdminError message={error} onRetry={refetch} />;
  if (!data?.sellers?.length) return <AdminEmpty message="No vendor approvals" />;

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        {['pending', 'approved', 'rejected', 'all'].map((t) => (
          <button key={t} onClick={() => { setFilter(t); setPage(1); }}
            className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${filter === t ? 'bg-primary text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f5f5f5]'}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="hidden sm:block bg-white rounded-xl border border-[#eee] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
              <th className="p-3">Business</th>
              <th className="p-3">Owner</th>
              <th className="p-3">Phone</th>
              <th className="p-3">KYC</th>
              <th className="p-3">Store</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.sellers.map((s) => (
              <tr key={s.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                <td className="p-3 max-w-[160px]"><p className="font-medium text-[#333] truncate">{s.name || '—'}</p></td>
                <td className="p-3 text-[#555]">{s.email || '—'}</td>
                <td className="p-3 text-[#555]">{s.phone || '—'}</td>
                <td className="p-3">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${s.sellerProfile?.isKycVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {s.sellerProfile?.isKycVerified ? 'Verified' : s.sellerProfile?.kycRejectedReason ? 'Rejected' : 'Pending'}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${s.store?.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {s.store?.isActive ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-1">
                    {!s.sellerProfile?.isKycVerified && <button onClick={() => handleApprove(s.id)} className="text-[10px] bg-green-500 text-white px-1.5 py-1 rounded-md hover:bg-green-600 font-medium">Approve</button>}
                    {!s.sellerProfile?.isKycVerified && <button onClick={() => handleReject(s.id)} className="text-[10px] bg-red-500 text-white px-1.5 py-1 rounded-md hover:bg-red-600 font-medium">Reject</button>}
                    <button onClick={() => handleToggleStore(s.id)} className="text-[10px] bg-amber-500 text-white px-1.5 py-1 rounded-md hover:bg-amber-600 font-medium">
                      {s.store?.isActive ? 'Suspend' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden space-y-3">
        {data.sellers.map((s) => (
          <div key={s.id} className="bg-white rounded-xl border border-[#eee] p-3 space-y-2">
            <p className="font-medium text-sm text-[#333]">{s.name || '—'}</p>
            <div className="flex items-center justify-between text-xs text-[#666]">
              <span>{s.email || '—'} · {s.phone || '—'}</span>
              <div className="flex gap-1">
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${s.sellerProfile?.isKycVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {s.sellerProfile?.isKycVerified ? 'Verified' : s.sellerProfile?.kycRejectedReason ? 'Rejected' : 'Pending'}
                </span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${s.store?.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {s.store?.isActive ? 'Active' : 'Suspended'}
                </span>
              </div>
            </div>
            <div className="flex gap-1 pt-1">
              {!s.sellerProfile?.isKycVerified && <button onClick={() => handleApprove(s.id)} className="text-[10px] bg-green-500 text-white px-2 py-1 rounded-md">Approve</button>}
              {!s.sellerProfile?.isKycVerified && <button onClick={() => handleReject(s.id)} className="text-[10px] bg-red-500 text-white px-2 py-1 rounded-md">Reject</button>}
              <button onClick={() => handleToggleStore(s.id)} className="text-[10px] bg-amber-500 text-white px-2 py-1 rounded-md">{s.store?.isActive ? 'Suspend' : 'Activate'}</button>
            </div>
          </div>
        ))}
      </div>

      {data && data.totalPages > 1 && (
        <Pagination page={page} totalPages={data.totalPages} total={data.total} onPageChange={setPage} />
      )}
    </>
  );
}
