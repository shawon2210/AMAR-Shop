'use client';

import Link from 'next/link';

export default function BiDashboardPage() {
  const executiveMetrics = [
    { label: 'GMV (Gross Merchandise Value)', value: '৳12,45,000', growth: '+15.3%', positive: true },
    { label: 'Total Revenue', value: '৳10,58,250', growth: '+12.8%', positive: true },
    { label: 'Total Orders', value: '1,234', growth: '+8.5%', positive: true },
    { label: 'New Users', value: '456', growth: '+22.1%', positive: true },
    { label: 'Active Sellers', value: '89', growth: '+5.2%', positive: true },
    { label: 'Avg Order Value', value: '৳1,009', growth: '+3.2%', positive: true },
  ];

  const sections = [
    { label: 'RFM Analysis', icon: 'group_work', href: '/admin/bi/rfm', desc: 'Customer segmentation by Recency, Frequency, Monetary' },
    { label: 'CLV Report', icon: 'trending_up', href: '/admin/bi', desc: 'Customer Lifetime Value & cohorts' },
    { label: 'Cohort Analysis', icon: 'calendar_view_month', href: '/admin/bi/cohorts', desc: 'Retention cohorts over time' },
    { label: 'Seller Performance', icon: 'store', href: '/admin/bi', desc: 'Seller ranking & revenue metrics' },
    { label: 'Product Profitability', icon: 'inventory', href: '/admin/bi', desc: 'Margin analysis by product' },
    { label: 'Custom Reports', icon: 'description', href: '/admin/bi/reports', desc: 'Build & schedule custom reports' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-md text-on-surface">Business Intelligence</h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 border border-outline text-on-surface rounded-lg text-body-sm font-medium">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-primary text-on-primary rounded-lg text-body-sm font-medium">
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Refresh Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {executiveMetrics.map((m, i) => (
          <div key={i} className="bg-surface rounded-xl border border-outline-variant p-3">
            <p className="text-label-bold text-on-surface-variant">{m.label}</p>
            <p className="text-title-sm text-on-surface font-bold mt-1">{m.value}</p>
            <p className={`text-label-bold mt-0.5 ${m.positive ? 'text-green-600' : 'text-error'}`}>{m.growth}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sections.map((s, i) => (
          <Link key={i} href={s.href}
            className="bg-surface rounded-xl border border-outline-variant p-5 hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">{s.icon}</span>
              </div>
              <h3 className="text-title-sm text-on-surface font-semibold">{s.label}</h3>
            </div>
            <p className="text-body-sm text-on-surface-variant">{s.desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-surface rounded-xl border border-outline-variant p-5">
          <h2 className="text-title-sm text-on-surface font-semibold mb-4">Revenue Trend</h2>
          <div className="flex items-end gap-2 h-44">
            {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-primary/30 rounded-t" style={{ height: `${30 + Math.random() * 80}px` }} />
                <span className="text-label-bold text-on-surface-variant text-[10px]">{m}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-outline-variant p-5">
          <h2 className="text-title-sm text-on-surface font-semibold mb-4">Top Sellers</h2>
          {[
            { name: 'TechZone BD', revenue: 345000, growth: 18 },
            { name: 'GadgetPro', revenue: 289000, growth: 12 },
            { name: 'Fashion Hub', revenue: 234000, growth: 25 },
            { name: 'Home Essentials', revenue: 189000, growth: 8 },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-outline-variant/50 last:border-0">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-label-bold text-primary">{i + 1}</span>
                <p className="text-body-sm text-on-surface font-medium">{s.name}</p>
              </div>
              <div className="text-right">
                <p className="text-body-sm font-semibold text-on-surface">৳{s.revenue.toLocaleString()}</p>
                <p className="text-label-bold text-green-600">+{s.growth}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
