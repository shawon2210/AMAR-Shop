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
      {/* Row 1: Utility (Desktop only) */}
      <div className="hidden lg:block bg-gray-100 h-9">
        <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-6">
            <Link href="/help" className="hover:text-primary">Help Center</Link>
            <Link href="/orders" className="hover:text-primary">Track Order</Link>
            <Link href="/seller/dashboard" className="hover:text-primary">Become a Seller</Link>
          </div>
          <Link href="/notifications" className="hover:text-primary">Offers</Link>
        </div>
      </div>

      {/* Row 2: Main Header (Responsive) */}
      <div className="h-[72px] lg:h-[96px] flex items-center">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6 w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Hamburger menu */}
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-600">
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <img src="/images/amarshop-logo.png" alt="AmarShop" className="w-[clamp(140px,18vw,300px)] h-auto object-contain" />
            </Link>
          </div>

          {/* Search (Tablet+) */}
          <div className="flex-1 max-w-[760px] hidden md:block">
            <div className="relative w-full">
              <input
                className="w-full h-10 lg:h-12 rounded-full border border-gray-300 bg-gray-50 pl-5 pr-12 text-sm outline-none focus:ring-2 focus:ring-green-500 transition-all"
                placeholder="Search in AmarShop"
                type="text"
              />
              <button className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-full bg-[#0F9D58] text-white hover:bg-green-700">
                <span className="material-symbols-outlined text-base lg:text-lg">search</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 lg:gap-4 text-gray-600">
            <button onClick={() => setMobileSearchOpen(!mobileSearchOpen)} className="md:hidden hover:text-primary">
              <span className="material-symbols-outlined text-xl">search</span>
            </button>
            <Link href="/seller/dashboard" className="hidden lg:flex hover:text-primary">
              <span className="material-symbols-outlined text-xl">storefront</span>
            </Link>
            <Link href="/notifications" className="hover:text-primary">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </Link>
            <Link href="/cart" className="relative hover:text-primary">
              <span className="material-symbols-outlined text-xl">shopping_cart</span>
              {hydrated && itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 lg:-top-2 lg:-right-2 bg-red-500 text-white text-[9px] lg:text-[10px] rounded-full w-3.5 h-3.5 lg:w-4 lg:h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            {!showAuth || !isAuthenticated ? (
              <Link href="/auth/login" className="px-3 lg:px-5 py-1.5 lg:py-2 text-[11px] lg:text-xs font-semibold text-white bg-primary rounded-full hover:brightness-110 whitespace-nowrap">
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

      {/* Row 3: Category Nav + Sidebar (Mobile) */}
      <div className="hidden lg:block bg-white border-t border-gray-100 shadow-[0_1px_0_rgba(0,0,0,.04)] h-11">
        <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center gap-8">
          {categoryNav.map((cat) => (
            <Link key={cat.href} href={cat.href} className="text-sm font-medium text-gray-600 hover:text-primary whitespace-nowrap">
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[80vw] bg-white p-6 shadow-xl">
             <button onClick={() => setSidebarOpen(false)} className="mb-6"><span className="material-symbols-outlined text-3xl">close</span></button>
             <div className="flex flex-col gap-4">
               {categoryNav.map(cat => <Link key={cat.href} href={cat.href} onClick={() => setSidebarOpen(false)}>{cat.label}</Link>)}
             </div>
          </div>
        </div>
      )}

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-4">
           <input className="w-full h-10 rounded-full border px-4" placeholder="Search..." />
        </div>
      )}
    </header>
  );
}
