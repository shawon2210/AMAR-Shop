'use client';

import Link from 'next/link';
import { useAdminData } from '@/lib/api/hooks';
import { fetchFinanceDashboard } from '@/lib/api/admin';
import type { PendingSettlement } from '@/types';
import { getErrorMessage } from '@/lib/error-helper';

function formatBDT(v: number): string {
  return `৳${Math.round(v).toLocaleString('en-IN')}`;
}

export default function FinancePage() {
  const { data, loading, error } = useAdminData(fetchFinanceDashboard);

  const stats = [
    { label: 'Total Revenue', value: data ? formatBDT(data.totalRevenue) : '...', icon: 'payments', color: 'text-green-600' },
    { label: 'Pending Settlements', value: data ? formatBDT(data.pendingSettlementAmount) : '...', icon: 'account_balance', color: 'text-amber-600' },
    { label: 'Commission Earned', value: data ? formatBDT(data.totalCommission) : '...', icon: 'percent', color: 'text-blue-600' },
    { label: 'Cash Flow (Net)', value: data ? formatBDT(data.netCashFlow) : '...', icon: 'trending_up', color: 'text-primary' },
  ];

  const sections = [
    { label: 'Settlements', icon: 'account_balance', href: '/admin/finance/settlements', desc: 'Seller payout management' },
    { label: 'Tax Reports', icon: 'receipt', href: '/admin/finance/tax', desc: 'VAT quarterly reports' },
    { label: 'Invoices', icon: 'description', href: '/admin/finance/invoices', desc: 'Purchase invoices & credit notes' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#222]">Financial Dashboard</h1>

      {error && (
        <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm border border-red-200">{error}</div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#eee] p-4">
            <div className="flex items-center gap-3">
              <div className={s.color}>
                <span className="material-symbols-outlined text-2xl">{s.icon}</span>
              </div>
              <div>
                <p className="text-sm text-[#888]">{s.label}</p>
                <p className="text-lg font-semibold text-[#222]">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sections.map((s, i) => (
          <Link key={i} href={s.href}
            className="bg-white rounded-xl border border-[#eee] p-5 hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">{s.icon}</span>
              </div>
              <h3 className="font-semibold text-[#222]">{s.label}</h3>
            </div>
            <p className="text-sm text-[#888]">{s.desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="font-semibold text-[#222] mb-4">Revenue Overview</h2>
          {loading ? (
            <div className="h-40 flex items-center justify-center text-[#888]">
              <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>Loading...
            </div>
          ) : !data ? (
            <p className="text-sm text-[#888]">No data available</p>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-[#eee]">
                <span className="text-[#666]">Total Revenue</span>
                <span className="font-semibold text-lg">{formatBDT(data.totalRevenue)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#eee]">
                <span className="text-[#666]">Commission Earned</span>
                <span className="font-semibold">{formatBDT(data.totalCommission)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#eee]">
                <span className="text-[#666]">Pending Settlements</span>
                <span className="font-semibold text-amber-600">{formatBDT(data.pendingSettlementAmount)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[#666]">Net Cash Flow</span>
                <span className="font-semibold text-lg text-primary">{formatBDT(data.netCashFlow)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="font-semibold text-[#222] mb-4">Pending Settlements</h2>
          {loading ? (
            <div className="h-40 flex items-center justify-center text-[#888]">
              <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>Loading...
            </div>
          ) : !data?.pendingSettlements || data.pendingSettlements.length === 0 ? (
            <p className="text-sm text-[#888] text-center py-8">No pending settlements</p>
          ) : (
            data.pendingSettlements.map((s: PendingSettlement) => (
              <div key={s.id} className="flex items-center justify-between py-2.5 border-b border-[#eee]/50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-[#333]">{s.seller?.name || 'Seller'}</p>
                  <p className="text-xs text-[#888]">{s.settlementNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatBDT(s.netAmount)}</p>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                    s.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                  }`}>{s.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
