'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-[#1a1a2e] text-white flex flex-col
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10 shrink-0">
          <span className="material-symbols-outlined text-primary text-3xl">store</span>
          <span className="font-bold text-lg">AmarShop</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navSections.map((section) => (
            <div key={section.title}>
              <p className="text-[11px] font-semibold tracking-[0.1em] text-white/40 px-3 mb-2 uppercase">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                        ${active
                          ? 'bg-primary/20 text-primary border-l-[3px] border-primary rounded-l-none'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }
                      `}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4 shrink-0">
          <div className="flex items-center gap-3 text-sm text-white/60">
            <span className="material-symbols-outlined text-[18px]">shield</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen flex bg-[#f5f5f5]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white border-b border-[#e5e5e5] h-16 flex items-center px-4 lg:px-6 gap-4">
          <button
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-[#f5f5f5]"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 flex-1 max-w-md bg-[#f5f5f5] rounded-lg px-3 py-2">
            <span className="material-symbols-outlined text-[#888] text-[20px]">search</span>
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm flex-1 text-[#333] placeholder:text-[#aaa]"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button className="relative p-2 rounded-full hover:bg-[#f5f5f5]">
              <span className="material-symbols-outlined text-[#555]">notifications</span>
              <span className="absolute top-1 right-1 w-4 h-4 bg-error text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            <div className="flex items-center gap-2 pl-3 border-l border-[#e5e5e5]">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                A
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-[#333] leading-tight">Admin</p>
                <p className="text-xs text-[#888]">admin@amarshop.com</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
