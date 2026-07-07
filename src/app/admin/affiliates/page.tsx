'use client';

import { useState } from 'react';
import { useAdminPage } from '@/lib/api/hooks';
import { fetchAdminAffiliates, updateAdminAffiliate } from '@/lib/api/admin';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatBDT(v: number): string {
  return `৳${Math.round(v).toLocaleString('en-IN')}`;
}

const statusStyles: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  PENDING: 'bg-amber-100 text-amber-700',
  SUSPENDED: 'bg-red-100 text-red-700',
};

export default function AdminAffiliatesPage() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const { data, loading, error, refetch, page, setPage } = useAdminPage(
    ({ page, limit }) => fetchAdminAffiliates({
      page,
      limit,
      status: statusFilter === 'ALL' ? undefined : statusFilter,
    }),
    [statusFilter],
  );

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateAdminAffiliate(id, { status });
      refetch();
    } catch (e) {
      alert(getErrorMessage(e, 'Failed to update affiliate'));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#222]">Affiliate Management</h1>

      {error && <AdminError message={error} onRetry={refetch} />}

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Affiliates', value: data?.total?.toLocaleString() || '...' },
          { label: 'Active', value: data?.affiliates?.filter((a) => a.status === 'ACTIVE').length.toString() || '...', color: 'text-green-600' },
          { label: 'Pending', value: data?.affiliates?.filter((a) => a.status === 'PENDING').length.toString() || '...', color: 'text-amber-600' },
          { label: 'Suspended', value: data?.affiliates?.filter((a) => a.status === 'SUSPENDED').length.toString() || '...', color: 'text-red-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-[#eee]">
            <p className={`text-2xl font-bold ${(s as { color?: string }).color || 'text-[#222]'}`}>{s.value}</p>
            <p className="text-sm text-[#888] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {['ALL', 'ACTIVE', 'PENDING', 'SUSPENDED'].map((t) => (
          <button key={t} onClick={() => { setStatusFilter(t); setPage(1); }}
            className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${statusFilter === t ? 'bg-primary text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f5f5f5]'}`}>
            {t === 'ALL' ? 'All' : t.charAt(0) + t.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <AdminLoading />
      ) : !data?.affiliates || data.affiliates.length === 0 ? (
        <AdminEmpty message="No affiliates found" />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block bg-white rounded-xl border border-[#eee] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                  <th className="p-3">Name</th>
                  <th className="p-3">Code</th>
                  <th className="p-3">Clicks</th>
                  <th className="p-3">Conv.</th>
                  <th className="p-3">Earned</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Joined</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.affiliates.map((a) => (
                  <tr key={a.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 font-medium text-[#333]">{a.user.name}</td>
                    <td className="p-3 text-primary font-mono text-xs">{a.referralCode}</td>
                    <td className="p-3 text-[#555]">{a._count.clicks}</td>
                    <td className="p-3 text-[#555]">{a._count.conversions}</td>
                    <td className="p-3 font-semibold">{formatBDT(a.totalEarned)}</td>
                    <td className="p-3"><span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[a.status] || 'bg-gray-100 text-gray-700'}`}>{a.status}</span></td>
                    <td className="p-3 text-[#888] text-xs">{formatDate(a.createdAt)}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        {a.status === 'PENDING' && <button onClick={() => handleStatusChange(a.id, 'ACTIVE')} className="text-xs bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600">Approve</button>}
                        {a.status === 'ACTIVE' && <button onClick={() => handleStatusChange(a.id, 'SUSPENDED')} className="text-xs bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600">Suspend</button>}
                        {a.status === 'SUSPENDED' && <button onClick={() => handleStatusChange(a.id, 'ACTIVE')} className="text-xs bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600">Reactivate</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {data.affiliates.map((a) => (
              <div key={a.id} className="bg-white rounded-xl border border-[#eee] p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm text-[#333]">{a.user.name}</p>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${statusStyles[a.status] || 'bg-gray-100 text-gray-700'}`}>{a.status}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-primary font-mono">{a.referralCode}</span>
                  <span className="font-semibold">{formatBDT(a.totalEarned)}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#888]">
                  <span>{a._count.clicks} clicks · {a._count.conversions} conv.</span>
                  <span>{formatDate(a.createdAt)}</span>
                </div>
                <div className="flex gap-2 pt-1">
                  {a.status === 'PENDING' && <button onClick={() => handleStatusChange(a.id, 'ACTIVE')} className="flex-1 text-xs bg-green-500 text-white py-1.5 rounded-md font-medium hover:bg-green-600">Approve</button>}
                  {a.status === 'ACTIVE' && <button onClick={() => handleStatusChange(a.id, 'SUSPENDED')} className="flex-1 text-xs bg-red-500 text-white py-1.5 rounded-md font-medium hover:bg-red-600">Suspend</button>}
                  {a.status === 'SUSPENDED' && <button onClick={() => handleStatusChange(a.id, 'ACTIVE')} className="flex-1 text-xs bg-green-500 text-white py-1.5 rounded-md font-medium hover:bg-green-600">Reactivate</button>}
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
