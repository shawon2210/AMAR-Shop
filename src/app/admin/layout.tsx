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
      { label: 'CMS', icon: 'article', href: '/admin/cms' },
      { label: 'Announcements', icon: 'campaign', href: '/admin/cms' },
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
      { label: 'Fulfillment', icon: 'local_shipping', href: '/admin/fulfillment' },
    ],
  },
  {
    title: 'FINANCE',
    items: [
      { label: 'Finance', icon: 'payments', href: '/admin/finance' },
      { label: 'Settlements', icon: 'account_balance', href: '/admin/finance/settlements' },
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

function NavItemLink({ item, sectionTitle, onClose }: { item: NavItem; sectionTitle: string; onClose: () => void }) {
  const pathname = usePathname();
  const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);

  return (
    <Link
      key={`${sectionTitle}-${item.label}`}
      href={item.href}
      onClick={onClose}
      className={`
        group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150
        ${isActive
          ? 'bg-primary/15 text-primary shadow-sm'
          : 'text-white/60 hover:bg-white/8 hover:text-white'
        }
      `}
    >
      <span className={`material-symbols-outlined text-[20px] transition-colors ${isActive ? 'text-primary' : 'text-white/40 group-hover:text-white/70'}`}>
        {item.icon}
      </span>
      <span>{item.label}</span>
      {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
    </Link>
  );
}

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
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
    if (!search.trim()) return navSections;
    const q = search.toLowerCase();
    return navSections
      .map((s) => ({
        ...s,
        items: s.items.filter((i) => i.label.toLowerCase().includes(q)),
      }))
      .filter((s) => s.items.length > 0);
  }, [search]);

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 w-64 bg-gradient-to-b from-[#111827] to-[#0f172a] text-white flex flex-col
          shadow-2xl shadow-black/20
          transition-all duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto lg:h-auto
          ${open ? 'h-screen' : 'h-full'}
          max-h-screen
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/25">
            <span className="material-symbols-outlined text-white text-xl">store</span>
          </div>
          <div>
            <span className="font-bold text-base text-white tracking-tight">AmarShop</span>
            <p className="text-[10px] text-white/40 -mt-0.5">Admin Panel</p>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 pt-3 pb-1 shrink-0">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[16px] text-white/30">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search menu..."
              className="w-full bg-white/5 border border-white/5 rounded-lg pl-8 pr-3 py-2 text-xs text-white/70 placeholder:text-white/25 outline-none focus:border-primary/40 focus:bg-white/8 transition-all"
            />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-0.5 scrollbar-thin scrollbar-thumb-white/10">
          {filteredSections.map((section) => (
            <div key={section.title} className="py-1">
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center justify-between w-full px-3 py-1.5 text-[10px] font-semibold tracking-widest text-white/30 uppercase hover:text-white/50 transition-colors"
              >
                <span>{section.title}</span>
                <span className={`material-symbols-outlined text-[14px] transition-transform duration-200 ${expandedSections[section.title] ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
              <div className={`space-y-0.5 overflow-hidden transition-all duration-200 ${expandedSections[section.title] ? 'max-h-[9999px] opacity-100' : 'max-h-0 opacity-0'}`}>
                {section.items.map((item) => (
                  <NavItemLink key={`${section.title}-${item.label}`} item={item} sectionTitle={section.title} onClose={onClose} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User / Footer */}
        <div className="border-t border-white/5 p-3 shrink-0">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-sm font-bold uppercase shadow-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/80 truncate leading-tight">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-white/40 truncate">{user?.role || 'Administrator'}</p>
            </div>
            <button
              onClick={() => { useAuthStore.getState().logout(); window.location.href = '/admin/login'; }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function SearchOverlay({ query, setQuery, onClose }: { query: string; setQuery: (v: string) => void; onClose: () => void }) {
  const router = useRouter();

  const allItems = useMemo(() => navSections.flatMap((s) => s.items.map((i) => ({ ...i, section: s.title }))), []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allItems.filter((i) => i.label.toLowerCase().includes(q));
  }, [query, allItems]);

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
        className="absolute top-16 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white rounded-xl shadow-2xl border border-[#eee] overflow-hidden"
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <div className="min-h-screen flex bg-[#f5f5f5]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#e5e5e5] h-16 flex items-center px-4 lg:px-6 gap-3">
          <button
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-[#f5f5f5] transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="material-symbols-outlined text-[#555]">menu</span>
          </button>

          {/* Desktop search trigger */}
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

          {/* Mobile search icon */}
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