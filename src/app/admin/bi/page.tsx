'use client';

import Link from 'next/link';
import { useAdminData } from '@/lib/api/hooks';
import { fetchAnalytics } from '@/lib/api/admin';

function formatBDT(v: number): string {
  return `৳${v.toLocaleString('en-IN')}`;
}

export default function BiDashboardPage() {
  const { data, loading, error } = useAdminData(fetchAnalytics);

  const totalRevenue = data?.revenueChart?.reduce((s, d) => s + d.revenue, 0) || 0;
  const totalOrders = data?.orderStats?.reduce((s, o) => s + o._count.id, 0) || 0;
  const totalUsers = data?.userStats?.reduce((s, u) => s + u._count.id, 0) || 0;
  const activeSellers = data?.userStats?.find((u) => u.role === 'SELLER')?._count.id || 0;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const executiveMetrics = [
    { label: 'GMV', value: formatBDT(totalRevenue), growth: '+12.8%', positive: true },
    { label: 'Total Revenue', value: formatBDT(totalRevenue), growth: '+12.8%', positive: true },
    { label: 'Total Orders', value: totalOrders.toLocaleString(), growth: '+8.5%', positive: true },
    { label: 'Total Users', value: totalUsers.toLocaleString(), growth: '+15.3%', positive: true },
    { label: 'Active Sellers', value: String(activeSellers), growth: '+5.2%', positive: true },
    { label: 'Avg Order Value', value: formatBDT(avgOrderValue), growth: '+3.2%', positive: true },
  ];

  const sections = [
    { label: 'RFM Analysis', icon: 'group_work', href: '/admin/bi/rfm', desc: 'Customer segmentation by Recency, Frequency, Monetary' },
    { label: 'Cohort Analysis', icon: 'calendar_view_month', href: '/admin/bi/cohorts', desc: 'Retention cohorts over time' },
    { label: 'Custom Reports', icon: 'description', href: '/admin/bi/reports', desc: 'Build & schedule custom reports' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Business Intelligence</h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 border border-[#ddd] text-[#666] rounded-lg text-sm font-medium">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium">
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Refresh Data
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm border border-red-200">{error}</div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-[#eee] p-8 text-center text-[#888]">
          <span className="material-symbols-outlined animate-spin align-middle mr-2">progress_activity</span>Loading...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {executiveMetrics.map((m, i) => (
              <div key={i} className="bg-white rounded-xl border border-[#eee] p-3">
                <p className="text-xs text-[#888]">{m.label}</p>
                <p className="text-lg font-bold text-[#222] mt-1">{m.value}</p>
                <p className={`text-xs font-semibold mt-0.5 ${m.positive ? 'text-green-600' : 'text-red-500'}`}>{m.growth}</p>
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
                  <h3 className="text-sm font-semibold text-[#222]">{s.label}</h3>
                </div>
                <p className="text-sm text-[#888]">{s.desc}</p>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-[#eee] p-5">
              <h2 className="text-sm font-semibold text-[#222] mb-4">Revenue Trend (Last 30 Days)</h2>
              {data?.revenueChart && data.revenueChart.length > 0 ? (
                <div className="flex items-end gap-1 h-44">
                  {data.revenueChart.map((d, i) => {
                    const maxRev = Math.max(...data.revenueChart.map((r) => r.revenue), 1);
                    const h = (d.revenue / maxRev) * 160;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-primary/30 rounded-t min-h-[2px]" style={{ height: `${Math.max(h, 2)}px` }} />
                        {i % 5 === 0 && (
                          <span className="text-[10px] text-[#888]">{d.date.slice(-5)}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-[#888] text-center py-8">No revenue data</p>
              )}
            </div>

            <div className="bg-white rounded-xl border border-[#eee] p-5">
              <h2 className="text-sm font-semibold text-[#222] mb-4">Top Sellers</h2>
              {data?.topSellers && data.topSellers.length > 0 ? (
                data.topSellers.map((s, i) => (
                  <div key={s.id} className="flex items-center justify-between py-2.5 border-b border-[#eee]/50 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{i + 1}</span>
                      <p className="text-sm font-medium text-[#333]">{s.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#888]">{s.rating?.toFixed(1) || 'N/A'} ★</p>
                      <p className="text-xs text-[#888]">{s._count?.products || 0} products</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#888] text-center py-8">No seller data</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
