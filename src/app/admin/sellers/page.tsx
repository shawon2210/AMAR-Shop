'use client';

import { useState } from 'react';
import { useAdminData } from '@/lib/api/hooks';
import {
  fetchSellers,
  approveSeller,
  rejectSeller,
  toggleStoreStatus,
  updateSeller,
} from '@/lib/api/admin';

const kycStyles: Record<string, string> = {
  verified: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  rejected: 'bg-red-100 text-red-700',
  none: 'bg-gray-100 text-gray-700',
};

function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString('en-IN')}`;
}

export default function SellersPage() {
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const limit = 15;

  const { data, loading, error, refetch } = useAdminData(
    () => fetchSellers({ page, limit }),
    [page],
  );

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await approveSeller(id);
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to approve seller');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModal || !rejectReason.trim()) return;
    setActionLoading(rejectModal);
    try {
      await rejectSeller(rejectModal, rejectReason.trim());
      setRejectModal(null);
      setRejectReason('');
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to reject seller');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStore = async (id: string) => {
    setActionLoading(id);
    try {
      await toggleStoreStatus(id);
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle store status');
    } finally {
      setActionLoading(null);
    }
  };

  const totalSellers = data?.total || 0;
  const activeCount = data?.sellers?.filter((s) => s.isActive).length || 0;
  const pendingKycCount = data?.sellers?.filter((s) => s.sellerProfile && !s.sellerProfile.isKycVerified && s.sellerProfile.kycSubmittedAt).length || 0;
  const suspendedCount = data?.sellers?.filter((s) => !s.isActive).length || 0;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">Sellers</h1>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Sellers', value: totalSellers.toLocaleString('en-IN') },
          { label: 'Active', value: activeCount.toLocaleString('en-IN'), color: 'text-green-600' },
          { label: 'Pending KYC', value: pendingKycCount.toString(), color: 'text-amber-600' },
          { label: 'Suspended', value: suspendedCount.toString(), color: 'text-red-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-[#eee]">
            <p className={`text-2xl font-bold ${s.color || 'text-[#222]'}`}>{s.value}</p>
            <p className="text-sm text-[#888] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm border border-red-200">{error}</div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-[#eee] p-8 text-center text-[#888]">
          <span className="material-symbols-outlined animate-spin align-middle mr-2">progress_activity</span>
          Loading...
        </div>
      ) : !data || data.sellers.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#eee] p-8 text-center text-[#888]">No sellers found</div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block bg-white rounded-xl border border-[#eee] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                  <th className="p-3">Store</th>
                  <th className="p-3">Owner</th>
                  <th className="p-3">Products</th>
                  <th className="p-3">Revenue</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">KYC</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.sellers.map((s) => {
                  const kycStatus = !s.sellerProfile ? 'none' : s.sellerProfile.isKycVerified ? 'verified' : s.sellerProfile.kycSubmittedAt ? 'pending' : 'none';
                  const storeProductCount = (s.store as any)?._count?.products || 0;
                  return (
                    <tr key={s.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[#333]">{s.store?.name || 'Unnamed Store'}</span>
                          {s.store?.rating && s.store.rating >= 4.5 && (
                            <span className="material-symbols-outlined text-blue-500 text-[16px]" title="Top Rated">verified</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-[#555]">{s.name}</td>
                      <td className="p-3 text-[#666]">{storeProductCount}</td>
                      <td className="p-3 font-medium">{s.sellerProfile?.totalRevenue ? formatBDT(s.sellerProfile.totalRevenue) : '৳0'}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-amber-400 text-[16px]">star</span>
                          <span>{s.store?.rating?.toFixed(1) || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${kycStyles[kycStatus]}`}>
                          {kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {s.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          {kycStatus === 'pending' && (
                            <>
                              <button onClick={() => handleApprove(s.id)} disabled={actionLoading === s.id} className="text-[11px] bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 disabled:opacity-50">Approve</button>
                              <button onClick={() => setRejectModal(s.id)} disabled={actionLoading === s.id} className="text-[11px] bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 disabled:opacity-50">Reject</button>
                            </>
                          )}
                          <button onClick={() => handleToggleStore(s.id)} disabled={actionLoading === s.id} className="p-1.5 rounded-lg hover:bg-[#f5f5f5] disabled:opacity-50" title={s.isActive ? 'Suspend Store' : 'Activate Store'}>
                            <span className="material-symbols-outlined text-[18px] text-[#666]">{s.isActive ? 'block' : 'check_circle'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {data.sellers.map((s) => {
              const kycStatus = !s.sellerProfile ? 'none' : s.sellerProfile.isKycVerified ? 'verified' : s.sellerProfile.kycSubmittedAt ? 'pending' : 'none';
              return (
                <div key={s.id} className="bg-white rounded-xl border border-[#eee] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#333] text-sm">{s.store?.name || 'Unnamed Store'}</p>
                      <p className="text-xs text-[#888]">{s.name}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-amber-400 text-[16px]">star</span>
                      <span className="text-sm">{s.store?.rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${kycStyles[kycStatus]}`}>
                        {kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}
                      </span>
                      <span className={s.isActive ? 'text-green-600' : 'text-red-600'}>
                        {s.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </div>
                    <span className="font-semibold text-[#333]">{s.sellerProfile?.totalRevenue ? formatBDT(s.sellerProfile.totalRevenue) : '৳0'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#888]">
                    <span>{(s.store as any)?._count?.products || 0} products</span>
                    <span>Followers: {s.store?.followerCount || 0}</span>
                  </div>
                  {kycStatus === 'pending' && (
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => handleApprove(s.id)} disabled={actionLoading === s.id} className="flex-1 text-xs bg-green-500 text-white py-1.5 rounded-md font-medium hover:bg-green-600 disabled:opacity-50">Approve KYC</button>
                      <button onClick={() => setRejectModal(s.id)} disabled={actionLoading === s.id} className="flex-1 text-xs bg-red-500 text-white py-1.5 rounded-md font-medium hover:bg-red-600 disabled:opacity-50">Reject</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#888]">
            Page {data.page} of {data.totalPages} ({data.total} total)
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

      {/* Reject KYC Modal */}
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
              <button
                onClick={() => { setRejectModal(null); setRejectReason(''); }}
                className="px-4 py-2 text-sm text-[#666] hover:bg-[#f5f5f5] rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || actionLoading === rejectModal}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                {actionLoading === rejectModal ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
