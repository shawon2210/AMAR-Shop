'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore, useAuthHydrated } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';

export function Header() {
  const router = useRouter();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const hydrated_store = useAuthHydrated();

  useEffect(() => { setHydrated(true); }, []);

  const user = useAuthStore(s => s.user);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const logout = useAuthStore(s => s.logout);
  const itemCount = useCartStore(s => s.getItemCount());

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setSidebarOpen(false);
      }
    };
    if (sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const showAuth = hydrated && hydrated_store;

  const handleLogout = () => {
    setMenuOpen(false);
    setSidebarOpen(false);
    logout();
    router.push('/');
  };

  const navLinks = [
    { href: '/categories', label: 'Categories' },
    { href: '/flash-sale', label: 'Flash Sale' },
    { href: '/orders', label: 'Orders' },
    { href: '/help', label: 'Help' },
  ];

  const categoryNav = [
    { href: '/category/fashion', label: 'Fashion' },
    { href: '/category/electronics', label: 'Electronics' },
    { href: '/category/beauty', label: 'Beauty' },
    { href: '/category/groceries', label: 'Groceries' },
    { href: '/category/home', label: 'Home & Living' },
    { href: '/category/sports', label: 'Sports' },
    { href: '/flash-sale', label: '⚡ Flash Sale' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Main header row — compact, single-bar */}
      <div className="h-[56px] sm:h-[60px] md:h-[64px] lg:h-[68px]">
        <div className="max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-full flex items-center justify-between gap-2 md:gap-4 lg:gap-6">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-gray-600 hover:text-primary shrink-0"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>

          {/* Brand */}
          <Link href="/" className="flex items-center gap-1.5 shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-sm sm:text-base md:text-lg lg:text-xl">shopping_bag</span>
            </div>
            <span className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 hidden sm:block">
              Amar<span className="text-primary">Shop</span>
            </span>
          </Link>

          {/* Search — h-12, centered */}
          <div className="hidden md:flex flex-1 max-w-[400px] md:max-w-[480px] lg:max-w-[640px] xl:max-w-[800px]">
            <div className="relative w-full">
              <input
                className="w-full h-12 rounded-full border border-gray-300 bg-gray-50 px-4 pr-12 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                placeholder="Search in AmarShop"
                type="text"
              />
              <button className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-primary text-white hover:brightness-110 transition-all">
                <span className="material-symbols-outlined text-base">search</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3 lg:gap-5 shrink-0">
            {/* Help */}
            <Link href="/help" className="hidden lg:flex items-center gap-1 text-xs lg:text-sm text-gray-500 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-lg">help</span>
              <span className="hidden xl:inline">Help</span>
            </Link>

            {/* Sell */}
            <Link href="/seller/dashboard" className="hidden lg:flex items-center gap-1 text-xs lg:text-sm font-medium text-primary hover:text-primary-dark transition-colors">
              <span className="material-symbols-outlined text-lg">storefront</span>
              <span className="hidden xl:inline">Sell</span>
            </Link>

            {/* Notifications */}
            <Link href="/notifications" className="relative text-gray-600 hover:text-primary transition-colors hidden sm:flex">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative text-gray-600 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-xl">shopping_cart</span>
              {hydrated && itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red text-white text-[10px] font-bold rounded-full size-5 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {!showAuth || !isAuthenticated ? (
              <Link
                href="/auth/login"
                className="hidden sm:flex px-5 py-1.5 text-xs font-semibold text-white bg-primary rounded-full hover:brightness-110 transition-colors whitespace-nowrap"
              >
                Login
              </Link>
            ) : (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-1 px-1 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-base">person</span>
                    )}
                  </div>
                  <span className="text-xs font-medium max-w-[60px] truncate hidden lg:block">{user?.name?.split(' ')[0]}</span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                    <div className="p-3 border-b border-gray-100">
                      <p className="font-semibold text-sm truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email || user?.phone}</p>
                    </div>
                    <div className="py-1">
                      {isAdmin && (
                        <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 transition-colors">
                          <span className="material-symbols-outlined text-base text-gray-500">dashboard</span>
                          Admin Dashboard
                        </Link>
                      )}
                      <Link href="/account" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 transition-colors">
                        <span className="material-symbols-outlined text-base text-gray-500">person</span>
                        My Profile
                      </Link>
                      <Link href="/orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 transition-colors">
                        <span className="material-symbols-outlined text-base text-gray-500">receipt_long</span>
                        Orders
                      </Link>
                      <Link href="/account/addresses" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 transition-colors">
                        <span className="material-symbols-outlined text-base text-gray-500">location_on</span>
                        Addresses
                      </Link>
                      <Link href="/account/wishlist" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 transition-colors">
                        <span className="material-symbols-outlined text-base text-gray-500">favorite</span>
                        Wishlist
                      </Link>
                      <Link href="/notifications" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 transition-colors">
                        <span className="material-symbols-outlined text-base text-gray-500">notifications</span>
                        Notifications
                      </Link>
                      <Link href="/account/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 transition-colors">
                        <span className="material-symbols-outlined text-base text-gray-500">settings</span>
                        Settings
                      </Link>
                    </div>
                    <div className="border-t border-gray-100 py-1">
                      <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                        <span className="material-symbols-outlined text-base">logout</span>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile search trigger */}
            <button
              className="md:hidden text-gray-600 hover:text-primary transition-colors"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <span className="material-symbols-outlined text-xl">search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category navigation — slim bar */}
      <div className="hidden lg:block bg-white border-b border-gray-100">
        <div className="max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex items-center gap-6 h-[38px] lg:h-[42px] xl:h-[46px] overflow-x-auto hide-scrollbar">
            <Link
              href="/"
              className="flex items-center gap-1 text-xs lg:text-sm font-semibold text-primary hover:text-primary/80 rounded-md transition-colors whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-base lg:text-lg">home</span>
              Home
            </Link>
            {categoryNav.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="text-xs lg:text-sm font-medium text-gray-600 hover:text-primary transition-colors whitespace-nowrap"
              >
                {cat.label}
              </Link>
            ))}
            <Link
              href="/categories"
              className="text-xs lg:text-sm font-medium text-primary hover:text-primary/80 transition-colors whitespace-nowrap flex items-center gap-0.5 ml-auto"
            >
              All Categories
              <span className="material-symbols-outlined text-sm lg:text-base">chevron_right</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      {mobileSearchOpen && (
        <div className="lg:hidden px-4 pb-3 bg-white border-b border-gray-100">
          <div className="relative w-full">
            <input
              className="w-full h-11 rounded-lg border-2 border-primary/20 bg-gray-50 px-4 pr-11 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              placeholder="Search in AmarShop..."
              type="text"
              autoFocus
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-lg bg-primary text-white">
              <span className="material-symbols-outlined text-base">search</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div ref={sidebarRef} className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 h-14 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-sm">shopping_bag</span>
                </div>
                <span className="font-bold text-gray-900">AmarShop</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-700">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              {showAuth && isAuthenticated && user ? (
                <div className="px-4 pb-4 border-b border-gray-100 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-2xl">person</span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email || user.phone}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-4 pb-4 border-b border-gray-100 mb-4">
                  <Link
                    href="/auth/login"
                    onClick={() => setSidebarOpen(false)}
                    className="block w-full text-center py-2.5 bg-primary text-white rounded-lg font-semibold text-sm mb-2"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setSidebarOpen(false)}
                    className="block w-full text-center py-2.5 border border-primary text-primary rounded-lg font-semibold text-sm"
                  >
                    Register
                  </Link>
                </div>
              )}

              <div className="px-2 space-y-1">
                {[
                  { href: '/', label: 'Home', icon: 'home' },
                  { href: '/categories', label: 'Categories', icon: 'category' },
                  { href: '/flash-sale', label: 'Flash Sale', icon: 'flash_on' },
                  { href: '/orders', label: 'My Orders', icon: 'receipt_long' },
                  { href: '/cart', label: 'Cart', icon: 'shopping_cart' },
                  { href: '/account/wishlist', label: 'Wishlist', icon: 'favorite' },
                  { href: '/account', label: 'My Account', icon: 'person' },
                  { href: '/notifications', label: 'Notifications', icon: 'notifications' },
                  { href: '/seller/dashboard', label: 'Become a Seller', icon: 'storefront' },
                  { href: '/help', label: 'Help Center', icon: 'help' },
                  { href: '/support/chat', label: 'Live Chat', icon: 'chat' },
                ].map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-base text-gray-500">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-primary hover:bg-primary/5 rounded-lg transition-colors font-semibold"
                  >
                    <span className="material-symbols-outlined text-base">dashboard</span>
                    Admin Dashboard
                  </Link>
                )}
              </div>
            </div>
            {showAuth && isAuthenticated && (
              <div className="border-t border-gray-200 p-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
