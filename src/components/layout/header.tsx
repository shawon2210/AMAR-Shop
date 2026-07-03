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

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm h-[84px] md:h-[96px] lg:h-[112px] xl:h-[120px]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Brand - width-driven logo */}
        <div className="basis-[28%] min-w-fit shrink-0 overflow-visible flex items-center">
          <Link href="/">
            <img
              src="/images/logo.svg"
              alt="AmarShop"
              className="w-[170px] md:w-[220px] lg:w-[320px] xl:w-[360px] 2xl:w-[380px] h-auto object-contain block"
            />
          </Link>
        </div>

        {/* Search */}
        <div className="hidden md:flex basis-[48%] max-w-[800px]">
          <div className="relative w-full">
            <input
              className="w-full h-[52px] rounded-full border border-gray-200 bg-gray-50 px-6 pr-14 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              placeholder="Search in AmarShop..."
              type="text"
            />
            <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white hover:brightness-110 transition-all">
              <span className="material-symbols-outlined text-lg">search</span>
            </button>
          </div>
        </div>

        {/* Actions - right side */}
        <div className="hidden lg:flex items-center basis-[24%] gap-8 shrink-0 text-[15px]">
          {/* Navigation links */}
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}

          {/* Auth */}
          {!showAuth || !isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-semibold text-primary border border-primary rounded-lg hover:bg-primary-fixed transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:brightness-110 transition-colors"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-lg">person</span>
                  )}
                </div>
                <span className="text-sm font-medium max-w-[100px] truncate">{user?.name?.split(' ')[0]}</span>
                <span className="material-symbols-outlined text-gray-400 text-base">
                  {menuOpen ? 'expand_less' : 'expand_more'}
                </span>
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

          {/* Notifications */}
          <Link href="/notifications" className="relative text-gray-600 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-2xl">notifications</span>
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative text-gray-600 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-2xl">shopping_cart</span>
            {hydrated && itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile actions */}
        <div className="flex lg:hidden items-center gap-3">
          <button
            className="text-gray-600 hover:text-primary transition-colors"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          >
            <span className="material-symbols-outlined text-2xl">search</span>
          </button>

          <Link href="/cart" className="relative text-gray-600 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-2xl">shopping_cart</span>
            {hydrated && itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          <button
            className="text-gray-600 hover:text-primary transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      {mobileSearchOpen && (
        <div className="lg:hidden px-4 pb-3">
          <div className="relative w-full">
            <input
              className="w-full h-11 rounded-full border border-gray-200 bg-gray-50 px-4 pr-11 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="Search in AmarShop..."
              type="text"
              autoFocus
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-primary text-white">
              <span className="material-symbols-outlined text-base">search</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div ref={sidebarRef} className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
              <span className="font-semibold text-lg">Menu</span>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-700">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              {/* User section */}
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

              {/* Navigation links */}
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
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-primary hover:bg-primary-fixed rounded-lg transition-colors font-semibold"
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
