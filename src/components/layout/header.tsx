'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore, useAuthHydrated } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hydrated_store = useAuthHydrated();

  useEffect(() => { setHydrated(true); }, []);

  const user = useAuthStore(s => s.user);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const logout = useAuthStore(s => s.logout);
  const itemCount = useCartStore(s => s.getItemCount());

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const showAuth = hydrated && hydrated_store;

  const isActiveCategory = (href: string) => pathname === href;

  const categoryNav = [
    { href: '/category/fashion', label: 'Fashion' },
    { href: '/category/electronics', label: 'Electronics' },
    { href: '/category/beauty', label: 'Beauty' },
    { href: '/category/groceries', label: 'Groceries' },
    { href: '/category/home', label: 'Home & Living' },
    { href: '/category/sports', label: 'Sports' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* Row 1: Utility */}
      <div className="hidden lg:block bg-gray-100 h-9">
        <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-6">
            <Link href="/help" className="hover:text-primary">Help Center</Link>
            <Link href="/orders" className="hover:text-primary">Track Order</Link>
            <Link href="/seller/dashboard" className="hover:text-primary">Become a Seller</Link>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/notifications" className="hover:text-primary">Offers</Link>
          </div>
        </div>
      </div>

      {/* Row 2: Main Header */}
      <div className="h-[96px]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 h-full flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center shrink-0">
            <img src="/images/amarshop-logo.png" alt="AmarShop" className="w-[clamp(180px,22vw,400px)] h-auto object-contain" />
          </Link>

          <div className="flex-1 max-w-[760px] hidden md:block">
            <div className="relative w-full">
              <input
                className="w-full h-12 rounded-full border border-gray-300 bg-gray-50 pl-6 pr-14 text-sm outline-none focus:ring-2 focus:ring-green-500 transition-all"
                placeholder="Search in AmarShop"
                type="text"
              />
              <button className="absolute right-1 top-1/2 -translate-y-1/2 w-12 h-11 flex items-center justify-center rounded-full bg-[#0F9D58] text-white hover:bg-green-700">
                <span className="material-symbols-outlined text-lg">search</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-600">
            <Link href="/seller/dashboard" className="hidden lg:flex hover:text-primary">
              <span className="material-symbols-outlined text-xl">storefront</span>
            </Link>
            <Link href="/notifications" className="hover:text-primary">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </Link>
            <Link href="/cart" className="relative hover:text-primary">
              <span className="material-symbols-outlined text-xl">shopping_cart</span>
              {hydrated && itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            {!showAuth || !isAuthenticated ? (
              <Link href="/auth/login" className="px-4 py-2 text-xs font-semibold text-white bg-primary rounded-full hover:brightness-110 whitespace-nowrap">
                Login
              </Link>
            ) : (
              <button onClick={() => setMenuOpen(!menuOpen)} className="hover:text-primary">
                <span className="material-symbols-outlined text-xl">person</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Category Nav */}
      <div className="hidden lg:block bg-white border-t border-gray-100 shadow-[0_1px_0_rgba(0,0,0,.04)] h-11">
        <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center gap-8">
          {categoryNav.map((cat) => (
            <Link key={cat.href} href={cat.href} className="text-sm font-medium text-gray-600 hover:text-primary whitespace-nowrap">
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
