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
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', icon: 'dashboard', href: '/seller/dashboard' },
      { label: 'Analytics', icon: 'analytics', href: '/seller/analytics' },
      { label: 'Messages', icon: 'chat', href: '/seller/chat', badge: 2 },
    ],
  },
  {
    title: 'Products',
    items: [
      { label: 'All Products', icon: 'inventory_2', href: '/seller/products' },
      { label: 'Add Product', icon: 'add_box', href: '/seller/products/add' },
      { label: 'Inventory', icon: 'warehouse', href: '/seller/inventory', badge: 5 },
      { label: 'Reviews', icon: 'star', href: '/seller/reviews' },
    ],
  },
  {
    title: 'Orders',
    items: [
      { label: 'All Orders', icon: 'receipt_long', href: '/seller/orders', badge: 3 },
      { label: 'Returns', icon: 'assignment_return', href: '/seller/orders/returns' },
      { label: 'Refunds', icon: 'currency_ruble', href: '/seller/orders/refunds' },
    ],
  },
  {
    title: 'Finance',
    items: [
      { label: 'Finance Overview', icon: 'account_balance_wallet', href: '/seller/finance' },
      { label: 'Payouts', icon: 'payments', href: '/seller/payouts' },
      { label: 'Transactions', icon: 'receipt', href: '/seller/transactions' },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { label: 'Campaigns', icon: 'campaign', href: '/seller/campaigns' },
      { label: 'Promotions', icon: 'discount', href: '/seller/promotions' },
    ],
  },
  {
    title: 'AI Tools',
    items: [
      { label: 'Description Gen.', icon: 'auto_awesome', href: '/seller/ai/description-generator' },
      { label: 'Campaign Copy', icon: 'campaign', href: '/seller/ai/campaign-generator' },
      { label: 'Smart Pricing', icon: 'trending_up', href: '/seller/ai/smart-pricing' },
      { label: 'Demand Forecast', icon: 'insights', href: '/seller/ai/demand-forecast' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { label: 'Store Settings', icon: 'store', href: '/seller/store' },
      { label: 'Profile', icon: 'person', href: '/seller/profile' },
      { label: 'Policy', icon: 'description', href: '/seller/policy' },
      { label: 'Support', icon: 'headset_mic', href: '/seller/support' },
      { label: 'Settings', icon: 'settings', href: '/seller/settings' },
    ],
  },
];

const allNavItems = navSections.flatMap((s) => s.items.map((i) => ({ ...i, section: s.title })));

function useActiveState(href: string): boolean {
  const pathname = usePathname();
  if (href === '/seller/dashboard') return pathname === href || pathname === '/seller';
  return href === '/seller' ? pathname === '/seller' : pathname.startsWith(href);
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
    <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-label="Search">
      <div
        className="absolute top-0 sm:top-18 left-0 right-0 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-lg bg-white sm:rounded-2xl shadow-2xl sm:border sm:border-[#eee] overflow-hidden min-h-50 sm:min-h-0"
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

  const sidebar = (
    <div className="flex flex-col h-full relative">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary via-primary/50 to-transparent" />

      <div className="flex items-center h-16 shrink-0 border-b border-white/5 px-4">
        <Link href="/seller/dashboard" className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            <span className="material-symbols-outlined text-white text-xl">storefront</span>
          </div>
          {!collapsed && (
            <span className="text-base font-bold text-white tracking-tight truncate">Seller Center</span>
          )}
        </Link>
        {!isDesktop && (
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="ml-auto p-1.5 rounded-lg hover:bg-white/8 text-white/40"
            aria-label="Close sidebar"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
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

      <nav className="flex-1 overflow-y-auto py-2 space-y-1 hide-scrollbar">
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
            {user?.name?.charAt(0) || 'S'}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/80 truncate leading-tight">
                  {user?.name || 'Seller'}
                </p>
                <p className="text-[10px] text-white/35 truncate tracking-wider uppercase">
                  Seller
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
          aria-label="Seller navigation sidebar"
          className={`fixed top-32 left-4 bottom-4 z-50 w-70 max-w-[85vw] bg-[#0f1219] text-white flex flex-col rounded-2xl shadow-2xl shadow-black/40 border border-white/5 transition-transform duration-300 ease-out ${
            open ? 'translate-x-0' : '-translate-x-[calc(100%+32px)]'
          }`}
        >
          {sidebar}
        </aside>
      </>
    );
  }

  return (
    <aside
      ref={sidebarRef}
      className={`fixed top-32 left-4 bottom-4 z-30 text-white flex flex-col rounded-2xl border border-white/[0.05] shadow-[0_8px_32px_-4px_rgba(0,0,0,0.12)] transition-all duration-300 ease-out overflow-hidden bg-[#0f1219] ${
        collapsed ? 'w-[72px]' : 'w-60'
      }`}
    >
      {sidebar}
    </aside>
  );
}

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthHydrated();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('amarshop-seller-sidebar');
    if (saved !== null) return saved === 'true';
    return false;
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
        localStorage.setItem('amarshop-seller-sidebar', String(next));
      } catch {}
      return next;
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (pathname.startsWith('/seller/login')) return;
    if (!user) {
      window.location.href = '/auth/login?redirect=' + encodeURIComponent(pathname);
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

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f2f6] to-[#e8ecf1]">
        <span className="material-symbols-outlined animate-spin text-primary text-3xl">
          progress_activity
        </span>
      </div>
    );
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
      <header className="sticky top-0 z-50 h-16 bg-white/75 backdrop-blur-xl border-b border-gray-200/40 flex items-center px-4 lg:px-8 gap-3">
        <button
          ref={hamburgerRef}
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar menu"
        >
          <span className="material-symbols-outlined text-slate-500">menu</span>
        </button>

        <nav className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
          {breadcrumbs.map((crumb) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              {crumb.href !== '/seller' && <span className="text-slate-300">/</span>}
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
            href="/seller/notifications"
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
              href="/seller/profile"
              className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm shrink-0"
            >
              {user?.name?.charAt(0) || 'S'}
            </Link>
            <div className="hidden lg:block text-left min-w-0">
              <p className="text-xs font-medium text-slate-700 truncate leading-tight">
                {user?.name || 'Seller'}
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

      {/* Sidebar (below header) */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
        isDesktop={isDesktop}
      />

      {/* Main content (below header) */}
      <div
        className={`transition-all duration-300 ease-out ${
          isDesktop
            ? sidebarCollapsed ? 'ml-[104px]' : 'ml-[272px]'
            : 'ml-0'
        }`}
      >
        <main className="p-4 lg:p-8 min-w-0">
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