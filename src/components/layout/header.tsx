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
  const [hydrated, setHydrated] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
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

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const showAuth = hydrated && hydrated_store;

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    router.push('/');
  };

  return (
    <header className="w-full top-0 sticky z-50 bg-surface shadow-sm transition-colors duration-200 py-lg lg:py-7">
      <div className="flex items-center justify-between px-container-margin w-full max-w-7xl mx-auto gap-md">
        <div className="shrink-0 overflow-visible">
          <Link href="/">
            <img src="/images/logo.png?v=2" alt="AmarShop" className="h-16 lg:h-20 xl:h-24 w-auto object-contain" />
          </Link>
        </div>

        <div className="flex-grow max-w-2xl hidden md:flex relative">
          <input
            className="w-full bg-surface-container-low border-none rounded-lg px-md py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
            placeholder="Search..."
            type="text"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-primary">
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            className="md:hidden p-1 hover:bg-surface-container-high rounded-full transition-colors"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          >
            <span className="material-symbols-outlined text-primary">search</span>
          </button>

          {!showAuth || !isAuthenticated ? (
            <>
              <Link
                href="/auth/login"
                className="hidden sm:inline-flex px-3 py-1.5 text-xs font-label-bold text-primary border border-primary rounded-lg hover:bg-primary-fixed transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="hidden sm:inline-flex px-3 py-1.5 text-xs font-label-bold bg-primary text-on-primary rounded-lg hover:brightness-110 transition-colors"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-1.5 p-1 hover:bg-surface-container-high rounded-full transition-colors"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-sm sm:text-base">person</span>
                  )}
                </div>
                <span className="hidden md:inline text-sm font-label-bold max-w-[100px] truncate">
                  {user?.name?.split(' ')[0]}
                </span>
                <span className="material-symbols-outlined text-secondary text-base hidden md:inline">
                  {menuOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant overflow-hidden z-50">
                  <div className="p-3 border-b border-outline-variant">
                    <p className="font-label-bold text-sm truncate">{user?.name}</p>
                    <p className="text-[10px] text-secondary truncate">{user?.email || user?.phone}</p>
                  </div>
                  <div className="py-1">
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-base text-secondary">dashboard</span>
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href="/account"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-surface-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-base text-secondary">person</span>
                      My Profile
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-surface-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-base text-secondary">receipt_long</span>
                      Orders
                    </Link>
                    <Link
                      href="/account/addresses"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-surface-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-base text-secondary">location_on</span>
                      Addresses
                    </Link>
                    <Link
                      href="/account/wishlist"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-surface-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-base text-secondary">favorite</span>
                      Wishlist
                    </Link>
                    <Link
                      href="/notifications"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-surface-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-base text-secondary">notifications</span>
                      Notifications
                    </Link>
                    <Link
                      href="/account/settings"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-surface-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-base text-secondary">settings</span>
                      Settings
                    </Link>
                  </div>
                  <div className="border-t border-outline-variant py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-error hover:bg-error-container transition-colors w-full text-left"
                    >
                      <span className="material-symbols-outlined text-base">logout</span>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <Link
            href="/notifications"
            className="relative p-1 hover:bg-surface-container-high rounded-full transition-colors hidden sm:block"
          >
            <span className="material-symbols-outlined text-primary">notifications</span>
          </Link>

          <Link href="/cart" className="relative p-1 hover:bg-surface-container-high rounded-full transition-colors">
            <span className="material-symbols-outlined text-primary">shopping_cart</span>
            {hydrated && itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="md:hidden px-container-margin pb-sm">
          <div className="relative flex items-center bg-surface-container-high rounded-full px-md py-2">
            <span className="material-symbols-outlined text-secondary mr-sm text-lg">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
              placeholder="Search..."
              type="text"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}
