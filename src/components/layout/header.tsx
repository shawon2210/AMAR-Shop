'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore, useAuthHydrated } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { MobileSidebar } from '@/components/layout/header/mobile-sidebar';

const iconBtnClasses = 'flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors';

export function Header() {
  const pathname = usePathname();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hydrated = useAuthHydrated();

  const user = useAuthStore(s => s.user);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const itemCount = useCartStore(s => s.getItemCount());

  const showAuth = hydrated;

  const categoryNav = [
    { href: '/category/fashion', label: 'Fashion' },
    { href: '/category/electronics', label: 'Electronics' },
    { href: '/category/beauty', label: 'Beauty' },
    { href: '/category/groceries', label: 'Groceries' },
    { href: '/category/home', label: 'Home & Living' },
    { href: '/category/sports', label: 'Sports' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/50">
      {/* Utility bar — desktop only */}
      <div className="hidden lg:block bg-gray-50/80 border-b border-gray-100">
        <div className="app-container h-9 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-6">
            <Link href="/help" className="hover:text-primary transition-colors">Help Center</Link>
            <Link href="/orders" className="hover:text-primary transition-colors">Track Order</Link>
            {!isAuthenticated && (
              <Link href="/seller/dashboard" className="hover:text-primary transition-colors">Become a Seller</Link>
            )}
          </div>
          <Link href="/notifications" className="hover:text-primary transition-colors">Offers</Link>
        </div>
      </div>

      {/* Main header - Three column layout for desktop, flexible for mobile */}
      <div className="app-container h-16 md:h-[72px] lg:h-20">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 lg:gap-6 h-full">
          {/* Logo - Fixed width that scales within limits */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] -ml-1 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors touch-target"
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined text-xl">menu</span>
            </button>
            <Link href="/" className="flex items-center group">
              <img
                src="/images/amarshop-logo.png"
                alt="AmarShop"
                className="h-8 md:h-10 lg:h-12 w-auto object-contain transition-all duration-300 group-hover:scale-105"
                style={{ maxWidth: '200px', minWidth: '120px' }}
                priority="true"
              />
            </Link>
          </div>

          {/* Search - Centered on desktop, full width on mobile */}
          <div className="hidden md:flex md:justify-center">
            <div className="relative w-full max-w-[600px] lg:max-w-[720px]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 text-lg">search</span>
              </div>
              <input
                className="w-full h-12 rounded-full border border-gray-300 bg-gray-50 pl-12 pr-16 text-sm outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white focus:shadow-lg"
                placeholder="Search products, categories & more..."
                type="text"
              />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-12 h-12 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark transition-all shadow-sm">
                <span className="material-symbols-outlined text-lg">search</span>
              </button>
            </div>
          </div>

          {/* Actions - Fixed width container */}
          <div className="flex items-center justify-end gap-2 lg:gap-3 min-w-0">
            {/* Mobile search toggle - Only visible on mobile */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg text-gray-600 hover:bg-gray-100 transition-all touch-target"
              aria-label="Toggle search"
            >
              <span className="material-symbols-outlined text-xl">search</span>
            </button>

            {/* Desktop notification - Hidden on mobile, visible on sm+ */}
            <Link
              href="/notifications"
              className="hidden sm:flex relative items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg transition-all hover:bg-gray-100 text-gray-600 hover:text-primary touch-target"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg transition-all hover:bg-gray-100 text-gray-600 hover:text-primary touch-target"
              aria-label="Shopping cart"
            >
              <span className="material-symbols-outlined text-xl">shopping_cart</span>
              {showAuth && itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Auth / Profile */}
            {!showAuth || !isAuthenticated ? (
              <Link
                href="/auth/login"
                className="hidden md:flex px-5 h-11 min-h-[44px] items-center text-sm font-semibold text-white bg-primary rounded-full hover:brightness-110 hover:shadow-md transition-all whitespace-nowrap touch-target"
              >
                Login
              </Link>
            ) : (
              <Link
                href={user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? '/admin' : user?.isSeller ? '/seller/dashboard' : '/account'}
                className="hidden md:flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg transition-all hover:bg-gray-100 text-gray-600 hover:text-primary touch-target"
                aria-label="My account"
              >
                <span className="material-symbols-outlined text-xl">person</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search overlay */}
      {mobileSearchOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="app-container py-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 text-lg">search</span>
              </div>
              <input
                className="w-full h-12 rounded-full border border-gray-300 bg-gray-50 pl-12 pr-16 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Search products..."
                type="text"
                autoFocus
              />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-12 h-12 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full bg-primary text-white transition-all">
                <span className="material-symbols-outlined text-lg">search</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category navigation - Tablet scrollable, desktop full */}
      <div className="hidden md:block border-t border-gray-100">
        <div className="app-container">
          <nav className="flex items-center gap-2 h-11 overflow-x-auto hide-scrollbar" aria-label="Category navigation">
            {categoryNav.map((cat) => {
              const isActive = pathname === cat.href;
              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className={`flex-none px-5 min-h-[44px] flex items-center text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap touch-target ${isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </header>
  );
}
