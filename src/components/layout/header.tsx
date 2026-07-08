'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore, useAuthHydrated } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { MobileSidebar } from '@/components/layout/header/mobile-sidebar';

const iconBtnClasses = 'flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors';

export function Header() {
  const pathname = usePathname();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hydrated = useAuthHydrated();

  const user = useAuthStore(s => s.user);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const logout = useAuthStore(s => s.logout);
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
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-9 flex items-center justify-between text-xs text-gray-500">
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

      {/* Main header row — CSS Grid */}
      <div className="h-[72px] md:h-[84px] lg:h-[88px] flex items-center">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 w-full">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 lg:gap-6">
            {/* Logo — never shrinks below 150px */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center justify-center w-9 h-9 -ml-1 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Open menu"
              >
                <span className="material-symbols-outlined text-2xl">menu</span>
              </button>
              <Link href="/" className="flex items-center flex-none min-w-[130px] md:min-w-[150px]">
                <img
                  src="/images/amarshop-logo.png"
                  alt="AmarShop"
                  className="w-[130px] md:w-[155px] lg:w-[180px] h-auto object-contain"
                />
              </Link>
            </div>

            {/* Search — hidden below md */}
            <div className="hidden md:block">
              <div className="relative max-w-[600px] lg:max-w-[720px] mx-auto">
                <input
                  className="w-full h-10 lg:h-12 rounded-full border border-gray-300 bg-gray-50 pl-5 pr-12 text-sm outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white focus:shadow-md"
                  placeholder="Search products, categories & more..."
                  type="text"
                />
                <button className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark transition-colors">
                  <span className="material-symbols-outlined text-base lg:text-lg">search</span>
                </button>
              </div>
            </div>

            {/* Actions — always visible */}
            <div className="flex items-center gap-1 lg:gap-2">
              {/* Mobile search toggle */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Toggle search"
              >
                <span className="material-symbols-outlined text-xl">search</span>
              </button>

              {/* Notifications */}
              <Link
                href="/notifications"
                className={'relative hidden sm:flex items-center justify-center w-9 h-9 rounded-lg ' + iconBtnClasses}
                aria-label="Notifications"
              >
                <span className="material-symbols-outlined text-xl">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className={'relative flex items-center justify-center w-9 h-9 rounded-lg ' + iconBtnClasses}
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
                  className="px-4 lg:px-5 h-8 lg:h-9 flex items-center text-xs font-semibold text-white bg-primary rounded-full hover:brightness-110 hover:shadow-md transition-all whitespace-nowrap"
                >
                  Login
                </Link>
              ) : (
                <Link
                  href={user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? '/admin' : user?.isSeller ? '/seller/dashboard' : '/account'}
                  className={'flex items-center justify-center w-9 h-9 rounded-lg ' + iconBtnClasses}
                  aria-label="My account"
                >
                  <span className="material-symbols-outlined text-xl">person</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search overlay */}
      {mobileSearchOpen && (
        <div className="md:hidden border-t border-gray-100">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3">
            <div className="relative">
              <input
                className="w-full h-10 rounded-full border border-gray-300 bg-gray-50 pl-5 pr-12 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Search products..."
                type="text"
                autoFocus
              />
              <button className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white">
                <span className="material-symbols-outlined text-base">search</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category nav */}
      <div className="hidden lg:block border-t border-gray-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <nav className="flex items-center gap-1 h-11 overflow-x-auto hide-scrollbar" aria-label="Category navigation">
            {categoryNav.map((cat) => {
              const isActive = pathname === cat.href;
              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className={'flex-none px-3 py-1.5 text-sm font-medium rounded-full transition-colors whitespace-nowrap ' + (isActive ? 'bg-primary-fixed text-primary' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')}
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
