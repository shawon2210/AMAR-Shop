'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ErrorBoundary } from '@/components/ui/error-boundary';

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen grid" style={{ gridTemplateColumns: 'auto 1fr' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-gradient-to-b from-[#0f172a] to-[#0b1220] text-white flex flex-col transition-all duration-300 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ width: sidebarCollapsed ? '72px' : '256px' }}
      >
        <div className="flex items-center h-16 px-5 border-b border-white/[0.04]">
          <Link href="/seller/dashboard" className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">storefront</span>
            {!sidebarCollapsed && <span className="font-bold text-white">Seller Center</span>}
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-white/60 hover:bg-white/[0.06] hover:text-white/90'
                }`}
              >
                <span className="material-symbols-outlined size-5">{item.icon}</span>
                {!sidebarCollapsed && <span className="flex-1 text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/[0.04]">
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="w-full flex items-center justify-center p-2 text-white/40 hover:text-white" aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            <span className="material-symbols-outlined">{sidebarCollapsed ? 'chevron_right' : 'chevron_left'}</span>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-col min-w-0">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="flex items-center justify-between px-4 h-16">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-full hover:bg-slate-100" aria-label="Notifications">
                <span className="material-symbols-outlined text-slate-600">notifications</span>
              </button>

              <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                  S
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 bg-slate-50"><ErrorBoundary>{children}</ErrorBoundary></main>
      </div>
    </div>
  );
}
