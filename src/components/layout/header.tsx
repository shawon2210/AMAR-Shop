'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore, useAuthHydrated } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';

export function Header() {
  const pathname = usePathname();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hydrated = useAuthHydrated();

  const user = useAuthStore(s => s.user);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const logout = useAuthStore(s => s.logout);
  const itemCount = useCartStore(s => s.getItemCount());

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      {/* Utility bar */}
      <div className="hidden lg:block bg-gray-50 border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-6 h-9 flex items-center justify-between text-xs text-gray-500">
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

      {/* Main header */}
      <div className="h-16 lg:h-20 flex items-center">
        <div className="max-w-[1440px] mx-auto px-3 lg:px-6 w-full flex items-center justify-between gap-2 lg:gap-6">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-2 lg:gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center justify-center w-9 h-9 -ml-1 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
            <Link href="/" className="flex items-center flex-none">
              <img
                src="/images/amarshop-logo.png"
                alt="AmarShop"
                className="w-[130px] md:w-[155px] lg:w-[180px] h-auto object-contain"
              />
            </Link>
          </div>

          {/* Search (tablet+) */}
          <div className="flex-1 max-w-[600px] lg:max-w-[720px] hidden md:block">
            <div className="relative">
              <input
                className="w-full h-10 lg:h-12 rounded-full border border-gray-300 bg-gray-50 pl-5 pr-12 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Search products, categories & more..."
                type="text"
              />
              <button className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark transition-colors">
                <span className="material-symbols-outlined text-base lg:text-lg">search</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Mobile search toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Toggle search"
            >
              <span className="material-symbols-outlined text-xl">search</span>
            </button>

            {/* Seller storefront */}
            {isAuthenticated && (user?.isSeller || user?.role === 'SELLER') && (
              <Link
                href="/seller/dashboard"
                className="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors"
                aria-label="Seller dashboard"
              >
                <span className="material-symbols-outlined text-xl">storefront</span>
              </Link>
            )}

            {/* Notifications */}
            <Link
              href="/notifications"
              className="relative flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors"
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
                href={isAdmin ? '/admin' : user?.isSeller ? '/seller/dashboard' : '/account'}
                className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors"
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
        <div className="md:hidden px-3 pb-4 animate-fade-in-up">
          <div className="relative">
            <input
              className="w-full h-10 rounded-full border border-gray-300 bg-gray-50 pl-5 pr-12 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Search products..."
              type="text"
              autoFocus
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white">
              <span className="material-symbols-outlined text-base">search</span>
            </button>
          </div>
        </div>
      )}

      {/* Category nav — always visible, horizontal scroll on mobile */}
      <div className="border-t border-gray-100">
        <div className="max-w-[1440px] mx-auto px-3 lg:px-6">
          <nav className="flex items-center gap-1 h-11 overflow-x-auto hide-scrollbar">
            {categoryNav.map((cat) => {
              const isActive = pathname === cat.href;
              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className={`flex-none px-3 py-1.5 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-primary-fixed text-primary'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[280px] max-w-[85vw] bg-white shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100">
              <img src="/images/amarshop-logo.png" alt="AmarShop" className="w-[110px] h-auto" />
              <button
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            <div className="p-5 overflow-y-auto h-[calc(100%-64px)]">
              {showAuth && isAuthenticated ? (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || user?.phone}</p>
                </div>
              ) : (
                <div className="mb-6 flex gap-2">
                  <Link
                    href="/auth/login"
                    onClick={() => setSidebarOpen(false)}
                    className="flex-1 h-9 flex items-center justify-center text-sm font-semibold text-white bg-primary rounded-full hover:brightness-110 transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setSidebarOpen(false)}
                    className="flex-1 h-9 flex items-center justify-center text-sm font-semibold text-primary border border-primary rounded-full hover:bg-primary-fixed transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</p>
              <nav className="flex flex-col gap-1 mb-4">
                {categoryNav.map(cat => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      pathname === cat.href
                        ? 'bg-primary-fixed text-primary'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {cat.label}
                  </Link>
                ))}
              </nav>
              <hr className="mb-4" />
              <div className="flex flex-col gap-1">
                <Link href="/help" onClick={() => setSidebarOpen(false)} className="px-3 py-2.5 text-sm text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">Help Center</Link>
                <Link href="/orders" onClick={() => setSidebarOpen(false)} className="px-3 py-2.5 text-sm text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">Track Order</Link>
                <Link href="/notifications" onClick={() => setSidebarOpen(false)} className="px-3 py-2.5 text-sm text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">Offers</Link>
                {!isAuthenticated && (
                  <Link href="/seller/dashboard" onClick={() => setSidebarOpen(false)} className="px-3 py-2.5 text-sm text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">Become a Seller</Link>
                )}
                {showAuth && isAuthenticated && (
                  <button
                    onClick={() => { logout(); setSidebarOpen(false); }}
                    className="px-3 py-2.5 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors text-left"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
