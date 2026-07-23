'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore, useAuthHydrated } from '@/stores/auth-store';
import { ErrorBoundary } from '@/components/ui/error-boundary';

interface NavItem {
  label: string;
  icon: string;
  href: string;
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

function NavItemLink({ item, onClose, collapsed }: { item: NavItem; onClose: () => void; collapsed?: boolean }) {
  const pathname = usePathname();
  const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      onClick={onClose}
      title={collapsed ? item.label : undefined}
      className={`group relative flex items-center h-11 rounded-xl transition-all duration-150 ${
        collapsed ? 'justify-center w-11 mx-auto' : 'gap-3 px-4'
      } ${
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-white/60 hover:bg-white/[0.06] hover:text-white/90'
      }`}
    >
      {isActive && (
        <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-primary" />
      )}
      <span
        className={`material-symbols-outlined size-5 transition-colors shrink-0 ${
          isActive ? 'text-primary' : 'text-white/40 group-hover:text-white/70'
        }`}
      >
        {item.icon}
      </span>
      {!collapsed && <span className="truncate text-sm font-medium">{item.label}</span>}
    </Link>
  );
}

function Sidebar({
  open,
  onClose,
  collapsed,
  onToggleCollapse,
  isDesktop,
}: {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isDesktop: boolean;
}) {
  const [search, setSearch] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    navSections.forEach((s) => { init[s.title] = true; });
    return init;
  });
  const user = useAuthStore((s) => s.user);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (open && !isDesktop) {
      closeButtonRef.current?.focus();
    }
  }, [open, isDesktop]);

  // Esc close + focus trap for mobile sidebar
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !sidebarRef.current || isDesktop) return;
      const focusable = sidebarRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, isDesktop, onClose]);

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

  const sidebarContent = (
    <>
      <div
        className={`flex items-center justify-between h-16 shrink-0 border-b border-white/[0.04] ${
          collapsed ? 'justify-center px-0' : 'gap-3 px-5'
        }`}
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/25 shrink-0">
          <span className="material-symbols-outlined text-white text-xl">store</span>
        </div>
        {!isDesktop && (
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-white/50"
            aria-label="Close sidebar menu"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        )}
      </div>

      {isDesktop && (
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-[26px] z-10 w-6 h-6 rounded-full bg-[#1e293b] border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:border-white/[0.12] transition-all shadow-lg"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="material-symbols-outlined text-[14px] transition-transform duration-300">
            {collapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      )}

      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          collapsed ? 'opacity-0 pointer-events-none h-0' : 'opacity-100'
        }`}
      >
        <div className="px-3 pt-3 pb-1 shrink-0">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[15px] text-white/20">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search menu..."
              className="w-full bg-white/[0.04] border border-white/[0.05] rounded-lg pl-8 pr-3 py-2 text-xs text-white/60 placeholder:text-white/20 outline-none focus:border-primary/30 focus:bg-white/[0.06] transition-all"
            />
          </div>
        </div>
      </div>

      <nav
        className="flex-1 overflow-y-auto py-3 space-y-1 hide-scrollbar"
      >
        {collapsed ? (
          <div className="flex flex-col items-center gap-1 px-2">
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
          <div className="space-y-5">
            {filteredSections.map((section) => (
              <div key={section.title} className="px-2">
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex items-center justify-between w-full min-h-[44px] px-3 text-xs uppercase tracking-wide text-white/40 hover:text-white/60 transition-colors"
                >
                  <span className="opacity-70">{section.title}</span>
                  <span
                    className={`material-symbols-outlined text-[13px] transition-transform duration-200 ${
                      expandedSections[section.title] ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                <div
                  className={`space-y-0.5 overflow-hidden transition-all duration-200 ${
                    expandedSections[section.title]
                      ? 'max-h-[9999px] opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  {section.items.map((item) => (
                    <NavItemLink
                      key={`${section.title}-${item.label}`}
                      item={item}
                      onClose={onClose}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </nav>

      <div className="border-t border-white/[0.04] p-2 shrink-0">
        <div
          className={`flex items-center py-2 ${
            collapsed ? 'justify-center' : 'gap-3 px-2'
          } rounded-lg hover:bg-white/[0.03] transition-colors`}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-sm font-bold uppercase shadow-sm shrink-0">
            {user?.name?.charAt(0) || 'A'}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/80 truncate leading-tight">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-[9px] text-white/35 truncate tracking-wider">
                  {user?.role || 'Administrator'}
                </p>
              </div>
              <button
                onClick={() => {
                  useAuthStore.getState().logout();
                  if (typeof window !== 'undefined') window.location.href = '/admin/login';
                }}
                className="p-2.5 rounded-lg hover:bg-white/8 text-white/25 hover:text-red-400 transition-colors"
                aria-label="Logout"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );

  if (!isDesktop) {
    return (
      <>
        {open && (
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
            onClick={onClose}
          />
        )}
        <aside
          ref={sidebarRef}
          role="dialog"
          aria-modal="true"
          aria-label="Admin navigation sidebar"
          className={`fixed top-0 left-0 bottom-0 z-50 w-[280px] max-w-[85vw] bg-gradient-to-b from-[#0f172a] to-[#0b1220] text-white flex flex-col shadow-2xl shadow-black/30 transition-transform duration-300 ease-out ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {sidebarContent}
        </aside>
      </>
    );
  }

  return (
    <aside
      className={`sticky top-0 h-screen text-white flex flex-col z-auto transition-[width] duration-300 ease-out bg-gradient-to-b from-[#0f172a] via-[#0b1220] via-60% to-[#090d18] ${
        collapsed ? 'w-[72px]' : 'w-[256px]'
      }`}
    >
      {sidebarContent}
    </aside>
  );
}

function SearchOverlay({
  query,
  setQuery,
  onClose,
}: {
  query: string;
  setQuery: (v: string) => void;
  onClose: () => void;
}) {
  const router = useRouter();
  const prevFocusRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allNavItems.filter((i) => i.label.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    prevFocusRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';
    setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = '';
      prevFocusRef.current?.focus();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-label="Search">
      <div
        className="absolute top-0 sm:top-[72px] left-0 right-0 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-lg bg-white sm:rounded-xl shadow-2xl sm:border sm:border-[#eee] overflow-hidden min-h-[200px] sm:min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b border-[#eee]">
          <span className="material-symbols-outlined text-[#888] text-[20px]">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anything..."
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-sm text-[#333] placeholder:text-[#aaa]"
          />
          <kbd className="hidden sm:inline-flex text-[10px] bg-[#f5f5f5] px-1.5 py-0.5 rounded text-[#888] font-mono">
            ESC
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {results.length === 0 && query.trim() ? (
            <p className="p-6 text-center text-sm text-[#888]">No results found</p>
          ) : (
            results.map((item) => (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href);
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#fafafa] transition-colors text-left border-b border-[#f5f5f5] last:border-0"
              >
                <span className="material-symbols-outlined text-[18px] text-[#888]">
                  {item.icon}
                </span>
                <div>
                  <p className="text-sm font-medium text-[#333]">{item.label}</p>
                  <p className="text-[10px] text-[#aaa]">{item.section}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthHydrated();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('amarshop-admin-sidebar');
    if (saved !== null) return saved === 'true';
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  });
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    if (!token || !user) {
      router.replace('/admin/login');
    } else if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      router.replace('/');
    }
  }, [hydrated, token, user, pathname, router]);

  // Focus hamburger when sidebar closes on mobile
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

  if (!token || !user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="text-center">
          <span className="material-symbols-outlined animate-spin text-primary text-3xl">
            progress_activity
          </span>
          <p className="text-sm text-[#888] mt-3">Verifying access...</p>
        </div>
      </div>
    );
  }

  const sidebarWidth = sidebarCollapsed ? '72px' : '256px';

  const breadcrumbs = pathname
    .split('/')
    .filter(Boolean)
    .map((segment, i, arr) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      href: '/' + arr.slice(0, i + 1).join('/'),
      current: i === arr.length - 1,
    }));

  return (
    <div
      className={`min-h-screen grid transition-[grid-template-columns] duration-300 ease-out ${
        isDesktop 
          ? sidebarCollapsed ? 'grid-cols-[72px_1fr]' : 'grid-cols-[256px_1fr]'
          : 'grid-cols-1'
      }`}
    >
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
        isDesktop={isDesktop}
      />

      <div className="flex flex-col min-w-0 overflow-hidden">
        <header className="sticky top-0 z-30 h-[72px] bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center px-4 lg:px-6 gap-3">
          <button
            ref={hamburgerRef}
            className="lg:hidden p-2.5 -ml-2 rounded-lg hover:bg-[#f5f5f5] transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar menu"
          >
            <span className="material-symbols-outlined text-[#555]">menu</span>
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
          <div className="flex items-center gap-1 md:gap-3">
            {/* Search Trigger (Mobile/Desktop) */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 bg-[#f5f5f5] hover:bg-[#f0f0f0] rounded-lg px-2.5 py-2 transition-colors md:w-[240px]"
              aria-label="Open search"
            >
              <span className="material-symbols-outlined text-[#888] text-[18px]">search</span>
              <span className="hidden md:inline text-xs text-[#aaa] flex-1 text-left">Search...</span>
              <kbd className="hidden md:inline-flex text-[9px] bg-white px-1 py-0.5 rounded text-[#999] font-mono border border-[#ddd]">
                ⌘K
              </kbd>
            </button>

            <Link
              href="/admin/notifications"
              className="relative p-2 rounded-full hover:bg-[#f5f5f5] transition-colors shrink-0"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined text-[#555] text-[20px]">notifications</span>
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                3
              </span>
            </Link>

            <div className="flex items-center gap-2 pl-2 md:pl-3 border-l border-[#e5e5e5] shrink-0">
              <Link 
                href="/admin/settings"
                className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm shrink-0"
              >
                {user?.name?.charAt(0) || 'A'}
              </Link>
              
              <div className="hidden lg:block text-left min-w-0">
                <p className="text-xs font-medium text-[#333] truncate leading-tight">
                  {user?.name || 'Admin'}
                </p>
              </div>

              <button
                onClick={() => {
                  useAuthStore.getState().logout();
                  router.push('/admin/login');
                }}
                className="ml-1 p-1.5 rounded-lg hover:bg-red-50 text-[#888] hover:text-red-500 transition-colors shrink-0"
                aria-label="Logout"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 min-w-0">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>

      {searchOpen && (
        <SearchOverlay
          query={searchQuery}
          setQuery={setSearchQuery}
          onClose={() => setSearchOpen(false)}
        />
      )}
    </div>
  );
}
