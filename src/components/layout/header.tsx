'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore, useAuthHydrated } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { fadeUp, fastTransition } from '@/lib/motion-variants';
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
    <motion.header
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="sticky top-0 z-50 w-full bg-white/75 backdrop-blur-md border-b border-gray-200/50"
    >
      {/* Utility bar */}
      <div className="hidden lg:block bg-gray-50/80 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-6">
            <Link href="/help" className="hover:text-primary transition-colors duration-200">Help Center</Link>
            <Link href="/orders" className="hover:text-primary transition-colors duration-200">Track Order</Link>
            {!isAuthenticated && (
              <Link href="/seller/dashboard" className="hover:text-primary transition-colors duration-200">Become a Seller</Link>
            )}
          </div>
          <Link href="/notifications" className="hover:text-primary transition-colors duration-200">Offers</Link>
        </div>
      </div>

      {/* Main header */}
      <div className="h-16 lg:h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-3 lg:px-6 w-full flex items-center justify-between gap-2 lg:gap-6">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-2 lg:gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center justify-center w-9 h-9 -ml-1 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <motion.span whileTap={{ scale: 0.85 }} transition={fastTransition} className="material-symbols-outlined text-2xl">menu</motion.span>
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
                className="w-full h-10 lg:h-12 rounded-full border border-gray-300 bg-gray-50 pl-5 pr-12 text-sm outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white focus:shadow-md"
                placeholder="Search products, categories & more..."
                type="text"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={fastTransition}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark transition-colors"
              >
                <span className="material-symbols-outlined text-base lg:text-lg">search</span>
              </motion.button>
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
              <motion.span whileTap={{ scale: 0.85 }} transition={fastTransition} className="material-symbols-outlined text-xl">search</motion.span>
            </button>

            {/* Seller storefront */}
            {isAuthenticated && (user?.isSeller || user?.role === 'SELLER') && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={fastTransition}>
                <Link
                  href="/seller/dashboard"
                  className={'hidden lg:flex items-center justify-center w-9 h-9 rounded-lg ' + iconBtnClasses}
                  aria-label="Seller dashboard"
                >
                  <span className="material-symbols-outlined text-xl">storefront</span>
                </Link>
              </motion.div>
            )}

            {/* Notifications */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={fastTransition}>
              <Link
                href="/notifications"
                className={'relative flex items-center justify-center w-9 h-9 rounded-lg ' + iconBtnClasses}
                aria-label="Notifications"
              >
                <span className="material-symbols-outlined text-xl">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </Link>
            </motion.div>

            {/* Cart */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={fastTransition}>
              <Link
                href="/cart"
                className={'relative flex items-center justify-center w-9 h-9 rounded-lg ' + iconBtnClasses}
                aria-label="Shopping cart"
              >
                <span className="material-symbols-outlined text-xl">shopping_cart</span>
                {showAuth && itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm"
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </motion.span>
                )}
              </Link>
            </motion.div>

            {/* Auth / Profile */}
            {!showAuth || !isAuthenticated ? (
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={fastTransition}>
                <Link
                  href="/auth/login"
                  className="px-4 lg:px-5 h-8 lg:h-9 flex items-center text-xs font-semibold text-white bg-primary rounded-full hover:brightness-110 hover:shadow-md transition-all whitespace-nowrap"
                >
                  Login
                </Link>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={fastTransition}>
                <Link
                  href={isAdmin ? '/admin' : user?.isSeller ? '/seller/dashboard' : '/account'}
                  className={'flex items-center justify-center w-9 h-9 rounded-lg ' + iconBtnClasses}
                  aria-label="My account"
                >
                  <span className="material-symbols-outlined text-xl">person</span>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-3 pb-4">
              <div className="relative">
                <input
                  className="w-full h-10 rounded-full border border-gray-300 bg-gray-50 pl-5 pr-12 text-sm outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Search products..."
                  type="text"
                  autoFocus
                />
                <button className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white">
                  <span className="material-symbols-outlined text-base">search</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category nav */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-3 lg:px-6">
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
    </motion.header>
  );
}
