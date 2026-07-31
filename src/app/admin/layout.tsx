'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore, useAuthHydrated } from '@/stores/auth-store';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { useFocusTrap } from '@/components/layout/header/hooks/use-focus-trap';
import { useBodyLock } from '@/components/layout/header/hooks/use-body-lock';
import { useSidebarBehavior } from '@/components/layout/header/hooks/use-sidebar-behavior';
import { AdminSearchOverlay } from '@/components/layout/header/search/AdminSearchOverlay';

interface NavItem {
  label: string;
  icon: string;
  href: string;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Dashboard',
    items: [
      { label: 'Overview', icon: 'dashboard', href: '/admin/overview' },
      { label: 'Analytics', icon: 'analytics', href: '/admin/analytics' },
      { label: 'Reports', icon: 'description', href: '/admin/reports' },
      { label: 'Activity', icon: 'monitoring', href: '/admin/activity' },
    ],
  },
  {
    title: 'Commerce',
    items: [
      { label: 'Orders', icon: 'receipt_long', href: '/admin/orders' },
      { label: 'Returns', icon: 'assignment_return', href: '/admin/orders/returns' },
      { label: 'Refunds', icon: 'currency_ruble', href: '/admin/orders/refunds' },
      { label: 'Transactions', icon: 'swap_horiz', href: '/admin/transactions' },
      { label: 'Invoices', icon: 'receipt', href: '/admin/invoices' },
      { label: 'Payments', icon: 'payments', href: '/admin/payments' },
      { label: 'Coupons', icon: 'confirmation_number', href: '/admin/coupons' },
      { label: 'Flash Sales', icon: 'local_fire_department', href: '/admin/flash-sales' },
      { label: 'Campaigns', icon: 'campaign', href: '/admin/campaigns' },
    ],
  },
  {
    title: 'Products',
    items: [
      { label: 'Products', icon: 'inventory_2', href: '/admin/products' },
      { label: 'Categories', icon: 'category', href: '/admin/categories' },
      { label: 'Brands', icon: 'branding_watermark', href: '/admin/brands' },
      { label: 'Inventory', icon: 'warehouse', href: '/admin/inventory' },
      { label: 'Attributes', icon: 'list_alt', href: '/admin/attributes' },
      { label: 'Reviews', icon: 'star', href: '/admin/reviews' },
      { label: 'Tags', icon: 'sell', href: '/admin/tags' },
      { label: 'Collections', icon: 'collections_bookmark', href: '/admin/collections' },
    ],
  },
  {
    title: 'Vendors',
    items: [
      { label: 'All Vendors', icon: 'storefront', href: '/admin/vendors' },
      { label: 'Approvals', icon: 'verified', href: '/admin/sellers/approvals' },
      { label: 'Commissions', icon: 'percent', href: '/admin/sellers/commissions' },
      { label: 'Withdraw Requests', icon: 'account_balance_wallet', href: '/admin/sellers/withdraw-requests' },
      { label: 'Analytics', icon: 'trending_up', href: '/admin/sellers/analytics' },
      { label: 'Vendor Support', icon: 'headset_mic', href: '/admin/sellers/support' },
    ],
  },
  {
    title: 'Customers',
    items: [
      { label: 'Customers', icon: 'group', href: '/admin/customers' },
      { label: 'Segments', icon: 'layers', href: '/admin/customers/segments' },
      { label: 'Wishlists', icon: 'favorite', href: '/admin/customers/wishlists' },
      { label: 'Addresses', icon: 'location_on', href: '/admin/customers/addresses' },
      { label: 'Support Tickets', icon: 'support', href: '/admin/support-tickets' },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Banners', icon: 'view_carousel', href: '/admin/banners' },
      { label: 'Homepage', icon: 'home', href: '/admin/homepage' },
      { label: 'CMS Pages', icon: 'article', href: '/admin/cms' },
      { label: 'Announcements', icon: 'campaign', href: '/admin/announcements' },
      { label: 'Blogs', icon: 'rss_feed', href: '/admin/blogs' },
      { label: 'FAQ', icon: 'quiz', href: '/admin/faq' },
    ],
  },
  {
    title: 'Moderation',
    items: [
      { label: 'Moderation Queue', icon: 'fact_check', href: '/admin/moderation' },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { label: 'Email Campaigns', icon: 'email', href: '/admin/email-campaigns' },
      { label: 'Push Notifications', icon: 'notifications_active', href: '/admin/push-notifications' },
      { label: 'Promotions', icon: 'discount', href: '/admin/promotions' },
      { label: 'Affiliate Program', icon: 'campaign', href: '/admin/affiliates' },
      { label: 'SEO', icon: 'travel_explore', href: '/admin/seo' },
      { label: 'Referral System', icon: 'share', href: '/admin/referral-system' },
    ],
  },
  {
    title: 'Logistics',
    items: [
      { label: 'Shipping', icon: 'local_shipping', href: '/admin/shipping' },
      { label: 'Delivery Zones', icon: 'map', href: '/admin/delivery-zones' },
      { label: 'Couriers', icon: 'speed', href: '/admin/couriers' },
      { label: 'Tracking', icon: 'pin_drop', href: '/admin/tracking' },
      { label: 'Warehouses', icon: 'warehouse', href: '/admin/warehouses' },
    ],
  },
  {
    title: 'Finance',
    items: [
      { label: 'Revenue', icon: 'trending_up', href: '/admin/revenue' },
      { label: 'Taxes', icon: 'receipt_long', href: '/admin/taxes' },
      { label: 'Settlements', icon: 'account_balance', href: '/admin/settlements' },
      { label: 'Payouts', icon: 'payments', href: '/admin/payouts' },
      { label: 'Accounting', icon: 'book', href: '/admin/accounting' },
    ],
  },
  {
    title: 'Administration',
    items: [
      { label: 'Users', icon: 'group', href: '/admin/users' },
      { label: 'Roles', icon: 'admin_panel_settings', href: '/admin/roles' },
      { label: 'Teams', icon: 'people', href: '/admin/teams' },
      { label: 'Audit Logs', icon: 'history', href: '/admin/audit-logs' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { label: 'General', icon: 'settings', href: '/admin/settings' },
      { label: 'API Keys', icon: 'vpn_key', href: '/admin/api-keys' },
      { label: 'Integrations', icon: 'extension', href: '/admin/integrations' },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Backups', icon: 'backup', href: '/admin/backups' },
      { label: 'Monitoring', icon: 'monitoring', href: '/admin/monitoring' },
      { label: 'Jobs', icon: 'hourglass_empty', href: '/admin/jobs' },
      { label: 'Logs', icon: 'terminal', href: '/admin/logs' },
      { label: 'Security', icon: 'security', href: '/admin/security' },
    ],
  },
];

const allNavItems = navSections.flatMap((s) => s.items.map((i) => ({ ...i, section: s.title })));

function useActiveState(href: string): boolean {
  const pathname = usePathname();
  return href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
}

function NavItemLink({ item, onClose, collapsed }: { item: NavItem; onClose: () => void; collapsed?: boolean }) {
  const isActive = useActiveState(item.href);

  return (
    <Link
      href={item.href}
      onClick={onClose}
      title={collapsed ? item.label : undefined}
      className={`group relative flex items-center h-10 rounded-lg transition-all duration-150 ${
        collapsed ? 'justify-center w-10 mx-auto' : 'gap-3 px-3'
      } ${
        isActive
          ? 'bg-primary/12 text-white shadow-sm shadow-primary/5'
          : 'text-white/45 hover:bg-white/6 hover:text-white/80'
      }`}
    >
      {isActive && (
        <span className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-linear-to-b from-primary to-primary/50 shadow-sm shadow-primary/30" />
      )}
      <span
        className={`material-symbols-outlined text-lg shrink-0 transition-all duration-150 ${
          isActive
            ? 'text-primary'
            : 'text-white/25 group-hover:text-white/60 group-hover:scale-110'
        }`}
      >
        {item.icon}
      </span>
      {!collapsed && (
        <span className="flex-1 truncate text-sm font-medium">{item.label}</span>
      )}
      {!collapsed && item.badge && (
        <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-primary/20 text-primary">
          {item.badge}
        </span>
      )}
    </Link>
  );
}



function SidebarContent({
  collapsed,
  onToggleCollapse,
  isDesktop,
  onClose,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
  isDesktop: boolean;
  onClose: () => void;
}) {
  const [search, setSearch] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    navSections.forEach((s) => { init[s.title] = true; });
    return init;
  });
  const user = useAuthStore((s) => s.user);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isDesktop) {
      closeButtonRef.current?.focus();
    }
  }, [isDesktop]);

  const toggleSection = useCallback((title: string) => {
    setExpandedSections((prev) => ({ ...prev, [title]: !prev[title] }));
  }, []);

  const filteredSections = useMemo(() => {
    if (collapsed) return [];
    if (!search.trim()) return navSections;
    const q = search.toLowerCase();
    return navSections
      .map((s) => ({
        ...s,
        items: s.items.filter((i) => i.label.toLowerCase().includes(q)),
      }))
      .filter((s) => s.items.length > 0);
  }, [search, collapsed]);

  return (
    <div className="flex flex-col flex-1 min-h-0 relative">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary via-primary/50 to-transparent" />

      <div className="flex items-center h-16 shrink-0 border-b border-white/5 px-4">
        <Link href="/admin" className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            <span className="material-symbols-outlined text-white text-xl">store</span>
          </div>
          {!collapsed && (
            <span className="text-base font-bold text-white tracking-tight truncate">AmarShop</span>
          )}
        </Link>
        {!isDesktop && (
          <div className="flex items-center ml-auto gap-0.5">
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg hover:bg-white/8 text-white/40"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <span className="material-symbols-outlined text-lg">
                {collapsed ? 'chevron_right' : 'chevron_left'}
              </span>
            </button>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/8 text-white/40"
              aria-label="Close sidebar"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        )}
      </div>

      {isDesktop && (
        <button
          onClick={onToggleCollapse}
          className={`absolute top-[22px] z-10 w-6 h-6 rounded-full bg-[#1a1f2e] border border-white/8 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all shadow-lg shadow-black/20 ${
            collapsed ? '-right-3' : 'right-3'
          }`}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="material-symbols-outlined text-sm transition-transform duration-200">
            {collapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      )}

      {!collapsed && (
        <div className="px-3 pt-3 pb-1 shrink-0">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-sm text-white/20">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search menu..."
              className="w-full bg-white/5 border border-white/8 rounded-lg pl-8 pr-3 py-2 text-xs text-white/60 placeholder:text-white/20 outline-none focus:border-primary/40 focus:bg-white/8 transition-all"
            />
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-2 space-y-1 sidebar-scrollbar">
        {collapsed ? (
          <div className="flex flex-col items-center gap-1 px-2 pt-2">
            {navSections.map((section) =>
              section.items.map((item) => (
                <NavItemLink
                  key={`${section.title}-${item.label}`}
                  item={item}
                  onClose={onClose}
                  collapsed
                />
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4 px-2">
            {filteredSections.map((section) => (
              <div key={section.title}>
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex items-center justify-between w-full h-8 px-2 group"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25 group-hover:text-white/45 transition-colors">
                    {section.title}
                  </span>
                  <span
                    className={`material-symbols-outlined text-xs text-white/15 transition-transform duration-200 ${
                      expandedSections[section.title] ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    expandedSections[section.title]
                      ? 'max-h-[9999px] opacity-100 mt-0.5'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="space-y-0.5">
                    {section.items.map((item) => (
                      <NavItemLink
                        key={`${section.title}-${item.label}`}
                        item={item}
                        onClose={onClose}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </nav>

      <div className="border-t border-white/5 shrink-0">
        <div className={`flex items-center ${collapsed ? 'justify-center py-3' : 'gap-3 p-3'}`}>
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm shrink-0">
            {user?.name?.charAt(0) || 'A'}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/80 truncate leading-tight">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-[10px] text-white/35 truncate tracking-wider uppercase">
                  {user?.role || 'Administrator'}
                </p>
              </div>
              <button
                onClick={async () => {
                  await useAuthStore.getState().logout();
                  window.location.href = '/auth/login';
                }}
                className="p-2 rounded-lg hover:bg-white/8 text-white/25 hover:text-red-400 transition-colors"
                aria-label="Logout"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthHydrated();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileCollapsed, setMobileCollapsed] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('amarshop-admin-sidebar');
    if (saved !== null) return saved === 'true';
    return false;
  });
  const [searchOpen, setSearchOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);

  useFocusTrap(mobileDrawerRef, sidebarOpen && !isDesktop);
  useBodyLock(sidebarOpen && !isDesktop);
  useSidebarBehavior({
    open: sidebarOpen,
    onClose: () => setSidebarOpen(false),
    isDesktop,
  });

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  const handleToggleCollapse = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('amarshop-admin-sidebar', String(next));
      } catch {}
      return next;
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (pathname.startsWith('/admin/login')) return;
    if (!user) {
      window.location.href = '/admin/login';
    }
  }, [hydrated, user, pathname]);

  useEffect(() => {
    if (!sidebarOpen) {
      hamburgerRef.current?.focus();
    }
  }, [sidebarOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  if (!hydrated || pathname.startsWith('/admin/login')) {
    return <>{children}</>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f2f6] to-[#e8ecf1]">
        <div className="text-center">
          <span className="material-symbols-outlined animate-spin text-primary text-3xl">
            progress_activity
          </span>
          <p className="text-sm text-[#888] mt-3">Verifying access...</p>
        </div>
      </div>
    );
  }

  const breadcrumbs = pathname
    .split('/')
    .filter(Boolean)
    .map((segment, i, arr) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      href: '/' + arr.slice(0, i + 1).join('/'),
      current: i === arr.length - 1,
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f2f6] to-[#e8ecf1]">
      {/* Full-width header */}
      <header className="sticky top-0 z-50 h-18 bg-white/80 backdrop-blur-xl border-b border-gray-200/40 shadow-sm shadow-black/5 flex items-center px-4 lg:px-8 gap-4">
        <button
          ref={hamburgerRef}
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar menu"
          aria-expanded={sidebarOpen}
          aria-controls="admin-sidebar"
        >
          <span className="material-symbols-outlined text-slate-500">menu</span>
        </button>

        <nav className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
          {breadcrumbs.map((crumb) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              {crumb.href !== '/admin' && <span className="text-slate-300">/</span>}
              {crumb.current ? (
                <span className="text-slate-700 font-medium">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-slate-600 transition-colors">
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        <div className="flex-1" />
        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 bg-slate-100/80 hover:bg-slate-200/70 rounded-lg px-2.5 py-2 transition-colors md:w-56"
            aria-label="Open search"
          >
            <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
            <span className="hidden md:inline text-xs text-slate-400 flex-1 text-left">Search...</span>
            <kbd className="hidden md:inline-flex text-[9px] bg-white px-1 py-0.5 rounded text-slate-400 font-mono border border-slate-200">
              ⌘K
            </kbd>
          </button>

          <Link
            href="/admin/notifications"
            className="relative p-2 rounded-full hover:bg-slate-100 transition-colors shrink-0"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-slate-500 text-lg">notifications</span>
            <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
              3
            </span>
          </Link>

          <div className="flex items-center gap-2 pl-2 md:pl-3 border-l border-slate-200 shrink-0">
            <Link
              href="/admin/settings"
              className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm shrink-0"
            >
              {user?.name?.charAt(0) || 'A'}
            </Link>
            <div className="hidden lg:block text-left min-w-0">
              <p className="text-xs font-medium text-slate-700 truncate leading-tight">
                {user?.name || 'Admin'}
              </p>
            </div>
            <button
              onClick={async () => {
                await useAuthStore.getState().logout();
                window.location.href = '/auth/login';
              }}
              className="ml-1 p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0"
              aria-label="Logout"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Desktop: flex with sticky sidebar */}
      {isDesktop ? (
        <div className="flex px-4 pb-4 gap-6 items-start">
          <aside
            className={`sticky top-24 self-start text-white flex flex-col rounded-2xl border border-white/[0.05] shadow-[0_8px_32px_-4px_rgba(0,0,0,0.12)] bg-[#0f1219] transition-all duration-300 ease-out overflow-hidden ${
              sidebarCollapsed ? 'w-[72px]' : 'w-60'
            }`}
            style={{ maxHeight: 'calc(100vh - 7rem)' }}
          >
            <SidebarContent
              collapsed={sidebarCollapsed}
              onToggleCollapse={handleToggleCollapse}
              isDesktop={true}
              onClose={() => {}}
            />
          </aside>

          <main className="flex-1 min-w-0 mt-6">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
        </div>
      ) : (
        <>
          {/* Mobile: drawer sidebar */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 animate-fade-in"
              style={{ zIndex: 'var(--z-sidebar-overlay, 80)' }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <aside
            ref={mobileDrawerRef}
            id="admin-sidebar"
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation sidebar"
            tabIndex={-1}
            className={`fixed top-24 left-4 bottom-4 bg-[#0f1219] text-white flex flex-col rounded-2xl shadow-2xl shadow-black/40 border border-white/5 transition-all duration-300 ease-out ${
              mobileCollapsed ? 'w-[72px]' : 'w-[min(88vw,300px)]'
            } ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-[calc(100%+32px)]'
            }`}
            style={{ zIndex: 'var(--z-sidebar, 90)' }}
          >
            <SidebarContent
              collapsed={mobileCollapsed}
              onToggleCollapse={() => setMobileCollapsed((v) => !v)}
              isDesktop={false}
              onClose={() => setSidebarOpen(false)}
            />
          </aside>

          <main className="p-4 min-w-0">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
        </>
      )}

      {searchOpen && (
        <AdminSearchOverlay
          allNavItems={allNavItems}
          onClose={() => setSearchOpen(false)}
        />
      )}
    </div>
  );
}