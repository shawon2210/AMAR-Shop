'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/seller/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/seller/products', label: 'Products', icon: 'inventory_2', badge: 0 },
  { href: '/seller/orders', label: 'Orders', icon: 'receipt_long', badge: 3 },
  { href: '/seller/inventory', label: 'Inventory', icon: 'warehouse', badge: 5 },
  { href: '/seller/analytics', label: 'Analytics', icon: 'analytics' },
  { href: '/seller/finance', label: 'Finance', icon: 'account_balance_wallet' },
  { href: '/seller/chat', label: 'Chat', icon: 'chat', badge: 2 },
  { href: '/seller/campaigns', label: 'Campaigns', icon: 'campaign' },
  { href: '/seller/ai/description-generator', label: 'AI Desc. Generator', icon: 'auto_awesome' },
  { href: '/seller/ai/campaign-generator', label: 'AI Campaign Copy', icon: 'campaign' },
  { href: '/seller/store', label: 'Store Settings', icon: 'store' },
  { href: '/seller/settings', label: 'Settings', icon: 'settings' },
];

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-surface-container-low">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#1a1a2e] text-white transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
          <Link href="/seller/dashboard" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffb59b]">storefront</span>
            <img src="/images/logo.png" alt="AmarShop" className="h-6 w-auto brightness-0 invert" />
          </Link>
          <button
            className="lg:hidden text-white/70 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-primary/20 text-[#ffb59b] font-semibold'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-error text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/50 hover:text-white/80 text-xs transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main area */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-white border-b border-surface-container-high shadow-sm">
          <div className="flex items-center justify-between px-4 h-16">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden text-on-surface"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
              <h2 className="text-sm font-semibold text-on-surface hidden sm:block">
                Seller Center
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-full hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-on-surface">notifications</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
              </button>

              <div className="flex items-center gap-2 pl-3 border-l border-surface-container-high">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-sm font-bold">
                  S
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-on-surface">ShopZone</p>
                  <p className="text-xs text-on-surface-variant">seller@amarshop.com</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
