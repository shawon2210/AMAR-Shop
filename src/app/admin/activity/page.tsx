'use client';

import { useState, useMemo } from 'react';

const activityEntries = [
  {
    id: '1', timestamp: '2026-07-14T09:15:00Z', user: 'Rahim Mia', action: 'placed_order',
    resource: '#ORD-7821', details: 'Order placed — Smartphone X Pro, ৳45,000', type: 'order' as const,
  },
  {
    id: '2', timestamp: '2026-07-14T09:02:00Z', user: 'Admin', action: 'approved_seller',
    resource: 'TechZone BD', details: 'Seller TechZone BD approved for platform listing', type: 'seller' as const,
  },
  {
    id: '3', timestamp: '2026-07-14T08:45:00Z', user: 'Fatima Begum', action: 'registered',
    resource: 'New Account', details: 'New customer registration from Dhaka', type: 'user' as const,
  },
  {
    id: '4', timestamp: '2026-07-14T08:30:00Z', user: 'System', action: 'backup_completed',
    resource: 'Database Backup', details: 'Daily automated backup completed — 2.4 GB', type: 'system' as const,
  },
  {
    id: '5', timestamp: '2026-07-14T07:55:00Z', user: 'Kamal Hossain', action: 'refund_requested',
    resource: '#ORD-7790', details: 'Refund requested — Bluetooth Speaker, ৳1,800', type: 'order' as const,
  },
  {
    id: '6', timestamp: '2026-07-14T07:20:00Z', user: 'Nusrat Jahan', action: 'review_submitted',
    resource: 'Product Review', details: '5★ review for Cotton Saree — "Excellent quality!"', type: 'review' as const,
  },
  {
    id: '7', timestamp: '2026-07-14T06:50:00Z', user: 'Shahidul Islam', action: 'login',
    resource: 'Account Login', details: 'User logged in from Dhaka, Bangladesh', type: 'user' as const,
  },
  {
    id: '8', timestamp: '2026-07-14T06:00:00Z', user: 'Admin', action: 'updated_settings',
    resource: 'Platform Settings', details: 'Shipping rate updated for Chattogram zone', type: 'system' as const,
  },
  {
    id: '9', timestamp: '2026-07-13T22:15:00Z', user: 'System', action: 'cron_job',
    resource: 'Daily Report', details: 'Daily sales report generated and emailed to admins', type: 'system' as const,
  },
  {
    id: '10', timestamp: '2026-07-13T21:00:00Z', user: 'Tahmina Akter', action: 'placed_order',
    resource: '#ORD-7816', details: 'Order placed — Winter Jacket, ৳4,800', type: 'order' as const,
  },
  {
    id: '11', timestamp: '2026-07-13T19:45:00Z', user: 'Fashion Hub', action: 'product_added',
    resource: 'New Product', details: 'Fashion Hub added 12 new products to their store', type: 'seller' as const,
  },
  {
    id: '12', timestamp: '2026-07-13T18:30:00Z', user: 'Admin', action: 'moderated_review',
    resource: 'Review #892', details: 'Flagged review hidden — inappropriate content', type: 'review' as const,
  },
  {
    id: '13', timestamp: '2026-07-13T17:00:00Z', user: 'TechZone BD', action: 'inventory_updated',
    resource: 'Stock Update', details: 'Stock updated for 45 products — 230 units added', type: 'seller' as const,
  },
  {
    id: '14', timestamp: '2026-07-13T15:20:00Z', user: 'System', action: 'monitoring_alert',
    resource: 'Server Alert', details: 'CPU usage spiked to 78% — auto-scaled resources', type: 'system' as const,
  },
  {
    id: '15', timestamp: '2026-07-13T14:05:00Z', user: 'Rahim Mia', action: 'cancelled_order',
    resource: '#ORD-7805', details: 'Order cancelled — Leather Wallet variant out of stock', type: 'order' as const,
  },
  {
    id: '16', timestamp: '2026-07-13T12:30:00Z', user: 'HomeCraft Ltd', action: 'campaign_launched',
    resource: 'Flash Sale', details: 'HomeCraft launched "Summer Sale" — 20% off home decor', type: 'campaign' as const,
  },
  {
    id: '17', timestamp: '2026-07-13T10:15:00Z', user: 'Admin', action: 'payout_processed',
    resource: 'Seller Payout', details: 'Weekly payout processed — ৳285,000 to 12 sellers', type: 'finance' as const,
  },
  {
    id: '18', timestamp: '2026-07-13T09:00:00Z', user: 'BeautyGlow', action: 'coupon_created',
    resource: 'Coupon WELCOME10', details: 'New coupon created — "WELCOME10" — 10% off first order', type: 'campaign' as const,
  },
  {
    id: '19', timestamp: '2026-07-13T08:00:00Z', user: 'System', action: 'cache_cleared',
    resource: 'Redis Cache', details: 'Product cache cleared — 1,248 keys evicted', type: 'system' as const,
  },
  {
    id: '20', timestamp: '2026-07-12T23:30:00Z', user: 'Admin', action: 'backup_verified',
    resource: 'Database Backup', details: 'Weekly backup verified and encrypted — 18.5 GB', type: 'system' as const,
  },
];

const actionConfig: Record<string, { icon: string; color: string; bg: string }> = {
  placed_order: { icon: 'shopping_bag', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  approved_seller: { icon: 'verified', color: 'text-blue-600', bg: 'bg-blue-50' },
  registered: { icon: 'person_add', color: 'text-purple-600', bg: 'bg-purple-50' },
  backup_completed: { icon: 'backup', color: 'text-cyan-600', bg: 'bg-cyan-50' },
  refund_requested: { icon: 'currency_ruble', color: 'text-orange-600', bg: 'bg-orange-50' },
  review_submitted: { icon: 'star', color: 'text-amber-600', bg: 'bg-amber-50' },
  login: { icon: 'login', color: 'text-slate-600', bg: 'bg-slate-100' },
  updated_settings: { icon: 'settings', color: 'text-slate-600', bg: 'bg-slate-100' },
  cron_job: { icon: 'schedule', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  product_added: { icon: 'inventory_2', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  moderated_review: { icon: 'fact_check', color: 'text-red-600', bg: 'bg-red-50' },
  inventory_updated: { icon: 'warehouse', color: 'text-teal-600', bg: 'bg-teal-50' },
  monitoring_alert: { icon: 'monitoring', color: 'text-rose-600', bg: 'bg-rose-50' },
  cancelled_order: { icon: 'cancel', color: 'text-red-600', bg: 'bg-red-50' },
  campaign_launched: { icon: 'campaign', color: 'text-pink-600', bg: 'bg-pink-50' },
  payout_processed: { icon: 'payments', color: 'text-green-600', bg: 'bg-green-50' },
  coupon_created: { icon: 'confirmation_number', color: 'text-violet-600', bg: 'bg-violet-50' },
  cache_cleared: { icon: 'cleaning_services', color: 'text-slate-600', bg: 'bg-slate-100' },
  backup_verified: { icon: 'verified', color: 'text-cyan-600', bg: 'bg-cyan-50' },
};

const typeFilters = [
  { key: 'all', label: 'All Activity', icon: 'dynamic_feed' },
  { key: 'order', label: 'Orders', icon: 'shopping_bag' },
  { key: 'seller', label: 'Sellers', icon: 'storefront' },
  { key: 'user', label: 'Users', icon: 'group' },
  { key: 'system', label: 'System', icon: 'settings' },
];

function TimelineEntry({ entry, isLast }: { entry: typeof activityEntries[0]; isLast: boolean }) {
  const cfg = actionConfig[entry.action] || { icon: 'circle', color: 'text-slate-500', bg: 'bg-slate-100' };
  const time = new Date(entry.timestamp);
  const timeStr = time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[17px] top-10 bottom-0 w-px bg-slate-200" />
      )}

      {/* Icon circle */}
      <div className={`relative z-10 w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0 shadow-sm`}>
        <span className={`material-symbols-outlined text-lg ${cfg.color}`}>{cfg.icon}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <p className="text-sm font-medium text-slate-800">
              <span className="font-semibold">{entry.user}</span>
              <span className="text-slate-400 font-normal">
                {' '}
                {entry.action === 'placed_order' && 'placed an order'}
                {entry.action === 'approved_seller' && 'approved a seller'}
                {entry.action === 'registered' && 'registered'}
                {entry.action === 'backup_completed' && 'completed backup'}
                {entry.action === 'refund_requested' && 'requested refund'}
                {entry.action === 'review_submitted' && 'submitted a review'}
                {entry.action === 'login' && 'logged in'}
                {entry.action === 'updated_settings' && 'updated settings'}
                {entry.action === 'cron_job' && 'ran scheduled job'}
                {entry.action === 'product_added' && 'added products'}
                {entry.action === 'moderated_review' && 'moderated a review'}
                {entry.action === 'inventory_updated' && 'updated inventory'}
                {entry.action === 'monitoring_alert' && 'triggered alert'}
                {entry.action === 'cancelled_order' && 'cancelled order'}
                {entry.action === 'campaign_launched' && 'launched campaign'}
                {entry.action === 'payout_processed' && 'processed payout'}
                {entry.action === 'coupon_created' && 'created coupon'}
                {entry.action === 'cache_cleared' && 'cleared cache'}
                {entry.action === 'backup_verified' && 'verified backup'}
              </span>
            </p>
            <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">{timeStr}</span>
          </div>
          <p className="text-xs text-slate-500">{entry.details}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {entry.resource}
            </span>
            <span className="text-[10px] text-slate-300 capitalize">{entry.type}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivitySummaryCards({ entries }: { entries: typeof activityEntries }) {
  const stats = useMemo(() => {
    const byType: Record<string, number> = {};
    entries.forEach((e) => { byType[e.type] = (byType[e.type] || 0) + 1; });
    return [
      { label: 'Total Events', value: entries.length, icon: 'dynamic_feed', color: 'bg-blue-500', change: '+' },
      { label: 'Orders', value: byType.order || 0, icon: 'shopping_bag', color: 'bg-emerald-500', change: '+' },
      { label: 'Sellers', value: byType.seller || 0, icon: 'storefront', color: 'bg-purple-500', change: '+' },
      { label: 'System', value: byType.system || 0, icon: 'settings', color: 'bg-amber-500', change: '-' },
    ];
  }, [entries]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="bg-white rounded-xl border border-slate-200/70 p-4">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color} shadow-sm`}>
              <span className="material-symbols-outlined text-white text-lg">{s.icon}</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">{s.label}</p>
              <p className="text-lg font-bold text-slate-900">{s.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ActivityPage() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return activityEntries.filter((e) => {
      if (typeFilter !== 'all' && e.type !== typeFilter) return false;
      if (dateFrom && new Date(e.timestamp) < new Date(dateFrom)) return false;
      if (dateTo && new Date(e.timestamp) > new Date(dateTo + 'T23:59:59Z')) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!e.user.toLowerCase().includes(q) && !e.details.toLowerCase().includes(q) && !e.resource.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [typeFilter, dateFrom, dateTo, search]);

  const groupedByDate = useMemo(() => {
    const groups: Record<string, typeof activityEntries> = {};
    filtered.forEach((e) => {
      const date = new Date(e.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      if (!groups[date]) groups[date] = [];
      groups[date].push(e);
    });
    return groups;
  }, [filtered]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Activity Log</h1>
          <p className="text-sm text-slate-400 mt-0.5">Track all platform activities and user actions</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-white rounded-xl border border-slate-200 px-4 py-2.5 shadow-sm">
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          <span>Auto-refresh every 30s</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* Summary Cards */}
      <ActivitySummaryCards entries={filtered} />

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/70 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Type Filter */}
          <div className="flex gap-1.5 flex-wrap">
            {typeFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setTypeFilter(f.key)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  typeFilter === f.key
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-500 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Date + Search */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400 text-lg">calendar_today</span>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-600 outline-none focus:border-primary/50 w-32" />
              <span className="text-slate-300">—</span>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-600 outline-none focus:border-primary/50 w-32" />
            </div>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-sm text-slate-400">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search activity..."
                className="border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-600 outline-none focus:border-primary/50 w-40 lg:w-48"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="max-w-3xl mx-auto">
        {(dateFrom || dateTo || search || typeFilter !== 'all') && (
          <div className="flex items-center gap-2 mb-4 text-xs text-slate-400">
            <span>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
            {(dateFrom || dateTo || search || typeFilter !== 'all') && (
              <button
                onClick={() => { setTypeFilter('all'); setDateFrom(''); setDateTo(''); setSearch(''); }}
                className="text-primary hover:text-primary/80 font-medium ml-2"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {Object.keys(groupedByDate).length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-4xl text-slate-300">dynamic_feed</span>
            <p className="text-sm text-slate-400 mt-2">No activity found for the selected filters</p>
          </div>
        ) : (
          Object.entries(groupedByDate).map(([date, entries]) => (
            <div key={date} className="mb-8 last:mb-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-slate-200">
                  {date}
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              {entries.map((entry, i) => (
                <TimelineEntry key={entry.id} entry={entry} isLast={i === entries.length - 1 && Object.keys(groupedByDate).length <= 1} />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}