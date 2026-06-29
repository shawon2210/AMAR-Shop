'use client';

import Link from 'next/link';

export default function FinancePage() {
  const stats = [
    { label: 'Total Revenue', value: '৳12,45,000', icon: 'payments', color: 'text-green-600' },
    { label: 'Pending Settlements', value: '৳3,42,000', icon: 'account_balance', color: 'text-amber-600' },
    { label: 'Commission Earned', value: '৳62,250', icon: 'percent', color: 'text-blue-600' },
    { label: 'Cash Flow (Net)', value: '৳8,91,000', icon: 'trending_up', color: 'text-primary' },
  ];

  const sections = [
    { label: 'Settlements', icon: 'account_balance', href: '/admin/finance/settlements', desc: 'Seller payout management' },
    { label: 'Tax Reports', icon: 'receipt', href: '/admin/finance/tax', desc: 'VAT/BIN quarterly reports' },
    { label: 'Invoices', icon: 'description', href: '/admin/finance/invoices', desc: 'Purchase invoices & credit notes' },
    { label: 'Balance Sheet', icon: 'balance', href: '/admin/finance', desc: 'Assets, liabilities & equity' },
    { label: 'P&L Statement', icon: 'chart_data', href: '/admin/finance', desc: 'Profit & loss overview' },
    { label: 'Cash Flow', icon: 'water', href: '/admin/finance', desc: 'Cash flow projections' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-headline-md text-on-surface">Financial Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-surface rounded-xl border border-outline-variant p-4">
            <div className="flex items-center gap-3">
              <div className={s.color}><span className="material-symbols-outlined text-2xl">{s.icon}</span></div>
              <div>
                <p className="text-body-sm text-on-surface-variant">{s.label}</p>
                <p className="text-title-sm text-on-surface font-semibold">{s.value}</p>
              </div>
            </div>
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
          <h2 className="text-title-sm text-on-surface font-semibold mb-4">Revenue vs Expenses</h2>
          <div className="flex items-end gap-3 h-40">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col items-center gap-0.5">
                  <div className="w-full bg-primary/30 rounded-t" style={{ height: `${40 + Math.random() * 60}px` }} />
                  <div className="w-full bg-error/30 rounded-t" style={{ height: `${20 + Math.random() * 30}px` }} />
                </div>
                <span className="text-label-bold text-on-surface-variant">{m}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 text-body-sm">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-primary/30" /> Revenue</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-error/30" /> Expenses</div>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-outline-variant p-5">
          <h2 className="text-title-sm text-on-surface font-semibold mb-4">Pending Settlements</h2>
          {[
            { seller: 'TechZone BD', amount: '৳1,25,000', status: 'PENDING', date: '2026-06-25' },
            { seller: 'GadgetPro', amount: '৳98,000', status: 'PENDING', date: '2026-06-24' },
            { seller: 'Fashion Hub', amount: '৳72,000', status: 'PROCESSING', date: '2026-06-23' },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-outline-variant/50 last:border-0">
              <div>
                <p className="text-body-sm text-on-surface font-medium">{s.seller}</p>
                <p className="text-label-bold text-on-surface-variant">{s.date}</p>
              </div>
              <div className="text-right">
                <p className="text-body-sm font-semibold text-on-surface">{s.amount}</p>
                <span className={`text-label-bold ${s.status === 'PROCESSING' ? 'text-blue-600' : 'text-amber-600'}`}>{s.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
