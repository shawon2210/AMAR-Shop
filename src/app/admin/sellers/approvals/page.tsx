'use client';

import { useState } from 'react';
import { useAdminPage } from '@/lib/api/hooks';
import { fetchSellers, approveSeller, rejectSeller } from '@/lib/api/admin';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate, ORDER_STATUS_COLORS } from '@/types';

function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function SellerApprovalsPage() {
  const [tab, setTab] = useState('PENDING');
  const [rejectModal, setRejectModal] = useState<{ id: string; store: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const { data, loading, error, refetch, page, setPage } = useAdminPage(
    ({ page, limit }) => fetchSellers({ page, limit, kycStatus: tab }),
    [tab],
  );

  const handleApprove = async (id: string) => {
    try { await approveSeller(id); refetch(); } catch (e) { alert(getErrorMessage(e)); }
  };

  const handleReject = async () => {
    if (!rejectModal || !rejectReason.trim()) return;
    try { await rejectSeller(rejectModal.id, rejectReason); setRejectModal(null); setRejectReason(''); refetch(); } catch (e) { alert(getErrorMessage(e)); }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">Seller Approvals</h1>

      {error && <AdminError message={error} onRetry={refetch} />}

      <div className="flex gap-2 flex-wrap">
        {['PENDING', 'APPROVED', 'REJECTED'].map((t) => (
          <button key={t} onClick={() => { setTab(t); setPage(1); }}
            className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${tab === t ? 'bg-primary text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f5f5f5]'}`}>
            {t.charAt(0) + t.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? <AdminLoading /> : !data?.sellers || data.sellers.length === 0 ? (
        <AdminEmpty message="No sellers found" />
      ) : (
        <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                <th className="p-3">Store</th>
                <th className="p-3">Owner</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Submitted</th>
                <th className="p-3">Docs Count</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.sellers.map((s) => (
                <tr key={s.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                  <td className="p-3 font-medium text-[#333]">{s.store?.name || s.name}</td>
                  <td className="p-3 text-[#666]">{s.name}</td>
                  <td className="p-3 text-[#666]">{s.phone}</td>
                  <td className="p-3 text-[#888] text-xs">{s.sellerProfile?.kycSubmittedAt ? fmtDate(s.sellerProfile.kycSubmittedAt) : '—'}</td>
                  <td className="p-3 text-[#666]">{s.sellerProfile ? '3 docs' : '—'}</td>
                  <td className="p-3">
                    {s.sellerProfile && !s.sellerProfile.isKycVerified && s.sellerProfile.kycRejectedReason === null && (
                      <div className="flex gap-1">
                        <button onClick={() => handleApprove(s.id)}
                          className="text-xs bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600">Approve</button>
                        <button onClick={() => setRejectModal({ id: s.id, store: s.store?.name || s.name })}
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600">Reject</button>
                      </div>
                    )}
                    {s.sellerProfile?.isKycVerified && (
                      <span className="text-xs text-green-600 font-medium">Approved</span>
                    )}
                    {s.sellerProfile?.kycRejectedReason && (
                      <span className="text-xs text-red-600 font-medium">Rejected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && data.totalPages > 1 && (
        <Pagination page={page} totalPages={data.totalPages} total={data.total} onPageChange={setPage} />
      )}

      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setRejectModal(null)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-semibold text-[#222]">Reject Seller</h2>
            <p className="text-sm text-[#666]">Reject <strong>{rejectModal.store}</strong>? Provide a reason.</p>
            <textarea placeholder="Rejection reason..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none focus:border-primary min-h-[80px]" />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setRejectModal(null)}
                className="px-4 py-2 text-sm text-[#666] border border-[#ddd] rounded-lg hover:bg-[#f5f5f5]">Cancel</button>
              <button onClick={handleReject} disabled={!rejectReason.trim()}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50">Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
