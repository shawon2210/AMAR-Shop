'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore, useAuthHydrated } from '@/stores/auth-store';

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
    title: 'MAIN',
    items: [{ label: 'Dashboard', icon: 'dashboard', href: '/admin' }],
  },
  {
    title: 'COMMERCE',
    items: [
      { label: 'Products', icon: 'inventory_2', href: '/admin/products' },
      { label: 'Categories', icon: 'category', href: '/admin/categories' },
      { label: 'Orders', icon: 'receipt_long', href: '/admin/orders' },
      { label: 'Payments', icon: 'payments', href: '/admin/payments' },
    ],
  },
  {
    title: 'USERS',
    items: [
      { label: 'Users', icon: 'group', href: '/admin/users' },
      { label: 'Sellers', icon: 'store', href: '/admin/sellers' },
      { label: 'Reviews', icon: 'star', href: '/admin/reviews' },
    ],
  },
  {
    title: 'MARKETING',
    items: [
      { label: 'Flash Sales', icon: 'local_fire_department', href: '/admin/flash-sales' },
      { label: 'Coupons', icon: 'confirmation_number', href: '/admin/coupons' },
      { label: 'Banners', icon: 'view_carousel', href: '/admin/banners' },
    ],
  },
  {
    title: 'CONTENT',
    items: [
      { label: 'CMS Pages', icon: 'article', href: '/admin/cms' },
    ],
  },
  {
    title: 'AFFILIATE',
    items: [
      { label: 'Affiliates', icon: 'campaign', href: '/admin/affiliates' },
      { label: 'Creators', icon: 'person_add', href: '/admin/creators' },
    ],
  },
  {
    title: 'COMPLIANCE',
    items: [
      { label: 'Compliance Center', icon: 'verified', href: '/admin/compliance' },
    ],
  },
  {
    title: 'OPERATIONS',
    items: [
      { label: 'Warehouse', icon: 'warehouse', href: '/admin/warehouse' },
      { label: 'Inbound Orders', icon: 'move_inbox', href: '/admin/warehouse/inbound' },
      { label: 'Bin Inventory', icon: 'shelves', href: '/admin/warehouse/inventory' },
      { label: 'Pick Lists', icon: 'assignment', href: '/admin/warehouse/pick-lists' },
      { label: 'Fulfillment', icon: 'local_shipping', href: '/admin/fulfillment' },
      { label: 'Courier', icon: 'speed', href: '/admin/fulfillment/courier' },
      { label: 'Pickup Schedules', icon: 'calendar_month', href: '/admin/fulfillment/pickup' },
      { label: 'Tracking', icon: 'pin_drop', href: '/admin/fulfillment/tracking' },
    ],
  },
  {
    title: 'FINANCE',
    items: [
      { label: 'Overview', icon: 'payments', href: '/admin/finance' },
      { label: 'Settlements', icon: 'account_balance', href: '/admin/finance/settlements' },
      { label: 'Invoices', icon: 'description', href: '/admin/finance/invoices' },
      { label: 'Tax Reports', icon: 'receipt', href: '/admin/finance/tax' },
    ],
  },
  {
    title: 'ANALYTICS',
    items: [
      { label: 'BI Dashboard', icon: 'bar_chart', href: '/admin/bi' },
      { label: 'RFM / CLV', icon: 'group_work', href: '/admin/bi/rfm' },
      { label: 'Cohorts', icon: 'calendar_view_month', href: '/admin/bi/cohorts' },
      { label: 'Reports', icon: 'description', href: '/admin/bi/reports' },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'Real-Time', icon: 'monitoring', href: '/admin/realtime' },
      { label: 'Reports', icon: 'assessment', href: '/admin/reports' },
      { label: 'Roles', icon: 'admin_panel_settings', href: '/admin/roles' },
      { label: 'Settings', icon: 'settings', href: '/admin/settings' },
      { label: 'Support', icon: 'support', href: '/admin/support' },
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
      className={`
        group relative flex items-center h-11 rounded-xl transition-all duration-150
        ${collapsed ? 'justify-center w-11 mx-auto' : 'gap-3 px-4'}
        ${isActive
          ? 'bg-primary/10 text-primary'
          : 'text-white/60 hover:bg-white/[0.06] hover:text-white/90'
        }
      `}
    >
      {isActive && (
        <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-primary" />
      )}
      <span className={`material-symbols-outlined text-[20px] transition-colors shrink-0 ${isActive ? 'text-primary' : 'text-white/40 group-hover:text-white/70'}`}>
        {item.icon}
      </span>
      {!collapsed && (
        <span className="truncate text-sm font-medium">{item.label}</span>
      )}
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
      {/* Logo */}
      <div className={`flex items-center h-16 shrink-0 border-b border-white/[0.04] ${collapsed ? 'justify-center px-0' : 'gap-3 px-5'}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/25 shrink-0">
          <span className="material-symbols-outlined text-white text-xl">store</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <img src="/images/amarshop-logo.png" alt="AmarShop" className="w-[clamp(120px,14vw,220px)] h-auto object-contain" />
            <p className="text-[9px] text-white/30 -mt-0.5 tracking-wider">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Desktop collapse toggle */}
      {isDesktop && (
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-[26px] z-10 w-6 h-6 rounded-full bg-[#1e293b] border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:border-white/[0.12] transition-all shadow-lg"
        >
          <span className="material-symbols-outlined text-[14px] transition-transform duration-300">
            {collapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      )}

      {/* Search */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${collapsed ? 'opacity-0 pointer-events-none h-0' : 'opacity-100'}`}
      >
        <div className="px-3 pt-3 pb-1 shrink-0">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[15px] text-white/20">search</span>
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

      {/* Nav */}
      <nav
        className="flex-1 overflow-y-auto py-3 space-y-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {collapsed ? (
          <div className="flex flex-col items-center gap-1">
            {navSections.map((section) =>
              section.items.map((item) => (
                <NavItemLink key={`${section.title}-${item.label}`} item={item} onClose={onClose} collapsed />
              ))
            )}
          </div>
        ) : (
          filteredSections.map((section) => (
            <div key={section.title} className="px-2">
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center justify-between w-full h-9 px-3 text-xs uppercase tracking-wide text-white/40 hover:text-white/60 transition-colors"
              >
                <span className={`transition-all duration-300 ${collapsed ? 'opacity-0 scale-95' : 'opacity-70'}`}>
                  {section.title}
                </span>
                {!collapsed && (
                  <span className={`material-symbols-outlined text-[13px] transition-transform duration-200 ${expandedSections[section.title] ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                )}
              </button>
              <div
                className={`space-y-0.5 overflow-hidden transition-all duration-200 ${expandedSections[section.title] ? 'max-h-[9999px] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                {section.items.map((item) => (
                  <NavItemLink key={`${section.title}-${item.label}`} item={item} onClose={onClose} />
                ))}
              </div>
            </div>
          ))
        )}
      </nav>

      {/* User / Footer */}
      <div className="border-t border-white/[0.04] p-2 shrink-0">
        <div className={`flex items-center py-2 ${collapsed ? 'justify-center' : 'gap-3 px-2'} rounded-lg hover:bg-white/[0.03] transition-colors`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-sm font-bold uppercase shadow-sm shrink-0">
            {user?.name?.charAt(0) || 'A'}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/80 truncate leading-tight">{user?.name || 'Admin'}</p>
                <p className="text-[9px] text-white/35 truncate tracking-wider">{user?.role || 'Administrator'}</p>
              </div>
              <button
                onClick={() => { useAuthStore.getState().logout(); window.location.href = '/admin/login'; }}
                className="p-1.5 rounded-lg hover:bg-white/8 text-white/25 hover:text-red-400 transition-colors"
                title="Logout"
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
          <div className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300" onClick={onClose} />
        )}
        <aside
          className={`fixed top-0 left-0 bottom-0 z-50 w-[280px] bg-gradient-to-b from-[#0f172a] to-[#0b1220] text-white flex flex-col shadow-2xl shadow-black/30 transition-transform duration-300 ease-out ${
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
      className="sticky top-0 h-screen text-white flex flex-col z-auto"
      style={{
        width: collapsed ? '72px' : '256px',
        background: 'linear-gradient(180deg, #0f172a 0%, #0b1220 60%, #090d18 100%)',
        transition: 'width 300ms ease-out',
      }}
    >
      {sidebarContent}
    </aside>
  );
}

function SearchOverlay({ query, setQuery, onClose }: { query: string; setQuery: (v: string) => void; onClose: () => void }) {
  const router = useRouter();

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

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="absolute top-[72px] left-1/2 -translate-x-1/2 w-full max-w-lg bg-white rounded-xl shadow-2xl border border-[#eee] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b border-[#eee]">
          <span className="material-symbols-outlined text-[#888] text-[20px]">search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anything..."
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-sm text-[#333] placeholder:text-[#aaa]"
          />
          <kbd className="hidden sm:inline-flex text-[10px] bg-[#f5f5f5] px-1.5 py-0.5 rounded text-[#888] font-mono">ESC</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {results.length === 0 && query.trim() ? (
            <p className="p-6 text-center text-sm text-[#888]">No results found</p>
          ) : (
            results.map((item) => (
              <button
                key={item.href}
                onClick={() => { router.push(item.href); onClose(); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#fafafa] transition-colors text-left border-b border-[#f5f5f5] last:border-0"
              >
                <span className="material-symbols-outlined text-[18px] text-[#888]">{item.icon}</span>
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 1024);
      if (!localStorage.getItem('adminSidebar')) {
        if (window.innerWidth >= 768 && window.innerWidth < 1024) {
          setSidebarCollapsed(true);
        }
      }
    };
    checkScreen();

    const saved = localStorage.getItem('adminSidebar');
    if (saved !== null) {
      setSidebarCollapsed(saved === 'true');
    }

    setMounted(true);

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleCollapse = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try { localStorage.setItem('adminSidebar', String(next)); } catch {}
      return next;
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (pathname.startsWith('/admin/login')) return;
    if (!token || !user) {
      router.replace('/admin/login');
    } else if (user.role !== 'ADMIN') {
      router.replace('/');
    }
  }, [hydrated, token, user, pathname, router]);

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

  if (!token || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="text-center">
          <span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
          <p className="text-sm text-[#888] mt-3">Verifying access...</p>
        </div>
      </div>
    );
  }

  const sidebarWidth = sidebarCollapsed ? '72px' : '256px';

  return (
    <div
      className="min-h-screen"
      style={{
        display: 'grid',
        gridTemplateColumns: mounted && isDesktop ? `${sidebarWidth} 1fr` : '1fr',
        transition: 'grid-template-columns 300ms ease-out',
      }}
    >
      {mounted && (
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
          isDesktop={isDesktop}
        />
      )}

      <div className="flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-[72px] bg-white/85 backdrop-blur-md border-b border-slate-200 flex items-center px-4 lg:px-6 gap-3">
          <button
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-[#f5f5f5] transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="material-symbols-outlined text-[#555]">menu</span>
          </button>

          <button
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 flex-1 max-w-md bg-[#f5f5f5] hover:bg-[#f0f0f0] rounded-lg px-3 py-2 transition-colors group"
          >
            <span className="material-symbols-outlined text-[#888] text-[20px]">search</span>
            <span className="text-sm text-[#aaa] flex-1 text-left">Search anything...</span>
            <kbd className="text-[10px] bg-white px-1.5 py-0.5 rounded text-[#999] font-mono border border-[#ddd]">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={() => setSearchOpen(true)}
            className="sm:hidden p-2 rounded-lg hover:bg-[#f5f5f5]"
          >
            <span className="material-symbols-outlined text-[#555]">search</span>
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <button className="relative p-2 rounded-full hover:bg-[#f5f5f5] transition-colors">
              <span className="material-symbols-outlined text-[#555]">notifications</span>
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                3
              </span>
            </button>

            <div className="flex items-center gap-2 pl-3 border-l border-[#e5e5e5]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-sm font-bold uppercase shadow-sm">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-[#333] leading-tight">{user?.name || 'Admin'}</p>
                <p className="text-xs text-[#888]">{user?.phone || ''}</p>
              </div>
              <button
                onClick={() => {
                  useAuthStore.getState().logout();
                  router.push('/admin/login');
                }}
                className="ml-2 p-1.5 rounded-lg hover:bg-red-50 text-[#888] hover:text-red-500 transition-colors"
                title="Logout"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>

      {searchOpen && <SearchOverlay query={searchQuery} setQuery={setSearchQuery} onClose={() => setSearchOpen(false)} />}
    </div>
  );
}
