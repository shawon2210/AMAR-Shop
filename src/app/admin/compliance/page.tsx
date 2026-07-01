'use client';

import { useAdminData } from '@/lib/api/hooks';
import { fetchComplianceDashboard } from '@/lib/api/admin';

export default function CompliancePage() {
  const { data, loading, error } = useAdminData(fetchComplianceDashboard);

  if (loading) {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-bold text-[#222]">Compliance Dashboard</h1>
        <div className="bg-white rounded-xl border border-[#eee] p-8 text-center text-[#888]">
          <span className="material-symbols-outlined animate-spin align-middle mr-2">progress_activity</span>Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-bold text-[#222]">Compliance Dashboard</h1>
        <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm border border-red-200">{error}</div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Sellers', value: data?.totalSellers || 0, icon: 'store', color: 'text-blue-600' },
    { label: 'KYC Verified', value: data?.kycVerified || 0, icon: 'verified', color: 'text-green-600' },
    { label: 'Pending Verification', value: data?.pendingVerification || 0, icon: 'hourglass_empty', color: 'text-amber-600' },
    { label: 'Flagged Products', value: data?.flaggedProducts || 0, icon: 'report', color: 'text-red-600' },
    { label: 'Open Disputes', value: data?.openDisputes || 0, icon: 'gavel', color: 'text-orange-600' },
    { label: 'Return Requests', value: data?.returnRequests || 0, icon: 'assignment_return', color: 'text-purple-600' },
    { label: 'Reported Reviews', value: data?.recentReports || 0, icon: 'feedback', color: 'text-red-600' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Compliance Dashboard</h1>
        <span className="text-xs text-[#888]">Last updated: {data?.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : '—'}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#eee] p-4">
            <div className="flex items-center gap-3">
              <div className={s.color}>
                <span className="material-symbols-outlined text-2xl">{s.icon}</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#222]">{s.value}</p>
                <p className="text-xs text-[#888]">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#eee] p-5">
        <h2 className="text-sm font-semibold text-[#222] mb-4">Notes</h2>
        <ul className="space-y-2 text-sm text-[#666]">
          <li>• KYC verification status reflects seller profile completeness.</li>
          <li>• Flagged products are those marked as out of stock.</li>
          <li>• Reported reviews need moderation attention.</li>
          <li>• Disputes and return requests require manual resolution.</li>
        </ul>
      </div>
    </div>
  );
}
