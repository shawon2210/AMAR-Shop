'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore, useAuthHydrated } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { MobileSidebar } from '@/components/layout/header/mobile-sidebar';

const categoryNav = [
  { href: '/category/fashion', label: 'Fashion' },
  { href: '/category/electronics', label: 'Electronics' },
  { href: '/category/beauty', label: 'Beauty' },
  { href: '/category/groceries', label: 'Groceries' },
  { href: '/category/home', label: 'Home & Living' },
  { href: '/category/sports', label: 'Sports' },
  { href: '/flash-sale', label: '🔥 Flash Sale' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hydrated = useAuthHydrated();
  const headerRef = useRef<HTMLElement>(null);

  const user = useAuthStore(s => s.user);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const itemCount = useCartStore(s => s.getItemCount());
  const showAuth = hydrated;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile search on route change
  useEffect(() => { setMobileSearchOpen(false); }, [pathname]);

  return (
    <header
      ref={headerRef}
      className={
        'sticky top-0 z-50 w-full bg-white/97 backdrop-blur-md border-b border-gray-200/60 transition-shadow duration-200 ' +
        (scrolled ? 'shadow-[0_1px_0_0_rgb(0_0_0/0.06),0_2px_12px_0_rgb(0_0_0/0.06)]' : '')
      }
    >
      {/* ── Utility bar — desktop only ── */}
      <div className="hidden lg:block bg-gray-50 border-b border-gray-100/80">
        <div className="app-container h-9 flex items-center justify-between">
          <div className="flex items-center gap-5 text-xs text-gray-500">
            <Link href="/help" className="hover:text-primary transition-colors duration-150">Help Center</Link>
            <Link href="/orders" className="hover:text-primary transition-colors duration-150">Track Order</Link>
            {!isAuthenticated && (
              <Link href="/seller/dashboard" className="hover:text-primary transition-colors duration-150">Become a Seller</Link>
            )}
          </div>
          <div className="flex items-center gap-5 text-xs text-gray-500">
            <Link href="/notifications" className="hover:text-primary transition-colors duration-150">Offers & Deals</Link>
            <Link href="/help" className="hover:text-primary transition-colors duration-150">Download App</Link>
          </div>
        </div>
      </div>

      {/* ── Main header ── */}
      <div className="app-container h-14 md:h-16 lg:h-[68px]">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 md:gap-4 lg:gap-6 h-full">

          {/* Logo + mobile menu */}
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center justify-center w-11 h-11 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-150"
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>
            <Link href="/" className="flex items-center shrink-0 ml-0.5 lg:ml-0">
              <img
                src="/images/amarshop-logo.png"
                alt="AmarShop"
                className="h-7 md:h-8 lg:h-9 w-auto object-contain"
                style={{ minWidth: '90px', maxWidth: '160px' }}
              />
            </Link>
          </div>

          {/* Search — prominent white bg with border */}
          <div className="hidden md:flex justify-center">
            <div className="relative w-full max-w-[560px] lg:max-w-[680px]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px] pointer-events-none">
                search
              </span>
              <input
                className="w-full h-11 rounded-full border-2 border-gray-200 bg-white pl-11 pr-14 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:shadow-sm"
                placeholder="Search products, brands & categories..."
                type="text"
                aria-label="Search"
              />
              <button
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark transition-colors duration-150"
                aria-label="Submit search"
              >
                <span className="material-symbols-outlined text-[18px]">search</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-1 lg:gap-2 shrink-0">
            {/* Mobile search */}
            <button
              onClick={() => setMobileSearchOpen(v => !v)}
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-150"
              aria-label="Search"
            >
              <span className="material-symbols-outlined text-[22px]">search</span>
            </button>

            {/* Notifications */}
            <Link
              href="/notifications"
              className="hidden sm:flex relative items-center justify-center w-11 h-11 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors duration-150"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-11 h-11 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors duration-150"
              aria-label="Shopping cart"
            >
              <span className="material-symbols-outlined text-[22px]">shopping_cart</span>
              {showAuth && itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[17px] h-[17px] flex items-center justify-center px-1 ring-2 ring-white">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {!showAuth || !isAuthenticated ? (
              <Link
                href="/auth/login"
                className="hidden md:flex items-center h-9 px-4 text-sm font-semibold text-white bg-primary rounded-full hover:bg-primary-dark transition-colors duration-150 whitespace-nowrap"
              >
                Sign In
              </Link>
            ) : (
              <Link
                href={
                  user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'
                    ? '/admin'
                    : user?.isSeller
                    ? '/seller/dashboard'
                    : '/account'
                }
                className="hidden md:flex items-center justify-center w-11 h-11 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors duration-150"
                aria-label="My account"
              >
                <span className="material-symbols-outlined text-[22px]">person</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile search expand ── */}
      {mobileSearchOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-3 py-2.5">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px] pointer-events-none">
              search
            </span>
            <input
              autoFocus
              className="w-full h-11 rounded-full border-2 border-gray-200 bg-white pl-11 pr-14 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10"
              placeholder="Search products..."
              type="text"
              aria-label="Search"
            />
            <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white">
              <span className="material-symbols-outlined text-[18px]">search</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Category nav — underline active style ── */}
      <div className="hidden md:block border-t border-gray-100/80">
        <div className="app-container">
          <nav className="flex items-center gap-0.5 h-10 overflow-x-auto hide-scrollbar" aria-label="Category navigation">
            {categoryNav.map(cat => {
              const isActive = pathname === cat.href;
              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className={
                    'relative flex-none px-3.5 h-10 flex items-center text-[13px] font-medium whitespace-nowrap transition-colors duration-150 ' +
                    (isActive
                      ? 'text-primary font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg')
                  }
                >
                  {cat.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-primary rounded-full" />
                  )}
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
