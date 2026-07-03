'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', href: '/affiliate' },
  { label: 'Tracking Links', icon: 'link', href: '/affiliate/links' },
  { label: 'Products', icon: 'inventory_2', href: '/affiliate/products' },
  { label: 'Earnings', icon: 'payments', href: '/affiliate/earnings' },
  { label: 'Analytics', icon: 'bar_chart', href: '/affiliate/analytics' },
];

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#f5f5f5]">
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#1a1a2e] text-white flex flex-col transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:z-auto`}>
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10 shrink-0">
          <span className="material-symbols-outlined text-primary text-3xl">campaign</span>
          <div>
            <img src="/images/logo.png" alt="AmarShop" className="h-6 w-auto brightness-0 invert" />
            <p className="text-[10px] text-white/50">Affiliate Dashboard</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  active ? 'bg-primary/20 text-primary border-l-[3px] border-primary rounded-l-none' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}>
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4 shrink-0">
          <Link href="/" className="flex items-center gap-2 text-sm text-white/60 hover:text-white">
            <span className="material-symbols-outlined text-[18px]">store</span>
            <span>Back to Store</span>
          </Link>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white border-b border-[#e5e5e5] h-16 flex items-center px-4 lg:px-6 gap-4">
          <button className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-[#f5f5f5]" onClick={() => setSidebarOpen(true)}>
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
            <span className="material-symbols-outlined text-[16px]">celebration</span>
            You earn up to 5% commission on every sale!
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">A</div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-[#333] leading-tight">Affiliate</p>
                <p className="text-xs text-[#888]">REF: AMAR7F3K</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
