'use client';

import { useAdminData } from '@/lib/api/hooks';
import { fetchPayments, fetchFinanceDashboard } from '@/lib/api/admin';

const statusStyles: Record<string, string> = {
  COMPLETED: 'bg-green-100 text-green-700',
  PENDING: 'bg-amber-100 text-amber-700',
  REFUNDED: 'bg-red-100 text-red-700',
  FAILED: 'bg-red-100 text-red-700',
};

function formatBDT(v: number): string {
  return `৳${Math.round(v).toLocaleString('en-IN')}`;
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function PaymentsPage() {
  const { data: payments, loading, error } = useAdminData(() =>
    fetchPayments({ page: 1, limit: 50 }),
  );
  const { data: finance } = useAdminData(fetchFinanceDashboard);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">Payments</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">Settlement Summary</h2>
          <div className="space-y-3 text-sm">
            {[
              { label: 'Total Revenue', value: formatBDT(finance?.totalRevenue || 0) },
              { label: 'Pending Clearance', value: formatBDT(finance?.pendingSettlementAmount || 0) },
              { label: 'Total Commission', value: formatBDT(finance?.totalCommission || 0) },
              { label: 'Net Cash Flow', value: formatBDT(finance?.netCashFlow || 0), bold: true },
            ].map((s) => (
              <div key={s.label} className="flex justify-between">
                <span className="text-[#888]">{s.label}</span>
                <span className={`font-medium ${(s as any).bold ? 'text-lg text-[#222]' : 'text-[#444]'}`}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">Payment Methods</h2>
          <div className="space-y-3 text-sm">
            {[
              { label: 'bKash', count: 0, color: 'bg-[#a63600]' },
              { label: 'Nagad', count: 0, color: 'bg-[#cf4500]' },
              { label: 'COD', count: 0, color: 'bg-[#007f9f]' },
              { label: 'SSLCommerz', count: 0, color: 'bg-[#5f5e5e]' },
            ].map((d) => {
              const methodCount = payments?.payments?.filter((p: any) => p.method === d.label.toUpperCase()).length || 0;
              const total = payments?.payments?.length || 1;
              const pct = Math.round((methodCount / total) * 100);
              return (
                <div key={d.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${d.color}`} />
                  <span className="text-[#666]">{d.label}</span>
                  <span className="ml-auto font-medium">{pct}%</span>
                </div>
              );
            })}
          </div>
          {(!payments?.payments || payments.payments.length === 0) && (
            <p className="text-xs text-[#888] mt-2">No transaction data yet</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">Pending Settlements</h2>
          <div className="space-y-3">
            {finance?.pendingSettlements && finance.pendingSettlements.length > 0 ? (
              finance.pendingSettlements.slice(0, 3).map((s: any) => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-[#fafafa] rounded-lg text-sm">
                  <div>
                    <p className="font-medium text-[#333]">{s.seller?.name || 'Seller'}</p>
                    <p className="text-[#888] text-xs">{s.settlementNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatBDT(s.netAmount)}</p>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                      s.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                    }`}>{s.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#888] text-center py-4">No pending settlements</p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm border border-red-200">{error}</div>
      )}

      <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
              <th className="p-3">Transaction ID</th>
              <th className="p-3">Order</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Method</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-[#888]">
                <span className="material-symbols-outlined animate-spin align-middle mr-2">progress_activity</span>Loading...
              </td></tr>
            ) : !payments?.payments || payments.payments.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-[#888]">No transactions found</td></tr>
            ) : (
              payments.payments.map((t: any) => (
                <tr key={t.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                  <td className="p-3 font-mono text-xs font-medium text-[#333]">{t.id.slice(0, 8)}...</td>
                  <td className="p-3 text-[#555]">#{t.order?.orderNumber || t.orderId?.slice(-6) || 'N/A'}</td>
                  <td className="p-3 font-medium">{formatBDT(t.amount)}</td>
                  <td className="p-3 text-[#666]">{t.method || 'N/A'}</td>
                  <td className="p-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[t.status] || 'bg-gray-100 text-gray-700'}`}>
                      {t.status || 'N/A'}
                    </span>
                  </td>
                  <td className="p-3 text-[#888]">{formatDate(t.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
