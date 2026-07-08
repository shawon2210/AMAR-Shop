'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore, useAuthHydrated } from '@/stores/auth-store';

const categoryNav = [
  { href: '/category/fashion', label: 'Fashion' },
  { href: '/category/electronics', label: 'Electronics' },
  { href: '/category/beauty', label: 'Beauty' },
  { href: '/category/groceries', label: 'Groceries' },
  { href: '/category/home', label: 'Home & Living' },
  { href: '/category/sports', label: 'Sports' },
];

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const showAuth = hydrated;
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Close on route change
  useEffect(() => {
    if (open) onClose();
  }, [pathname]);

  // Body scroll lock + focus trap
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      // Focus the drawer
      setTimeout(() => drawerRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // ESC close
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay — positioned above header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-[100]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer panel — slides in from left */}
          <motion.div
            ref={drawerRef}
            tabIndex={-1}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-[110] outline-none"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Header with logo + close */}
            <div className="flex items-center justify-between px-5 h-16 md:h-[72px] border-b border-gray-100">
              <img src="/images/amarshop-logo.png" alt="AmarShop" className="w-[110px] h-auto" />
              <button
                onClick={onClose}
                className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto h-[calc(100%-64px)] md:h-[calc(100%-72px)] p-5">
              {/* Auth section */}
              {showAuth && isAuthenticated ? (
                <div className="mb-6 pb-4 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{user?.email || user?.phone}</p>
                </div>
              ) : (
                <div className="mb-6 pb-4 border-b border-gray-100 flex gap-2">
                  <Link
                    href="/auth/login"
                    onClick={onClose}
                    className="flex-1 h-9 flex items-center justify-center text-sm font-semibold text-white bg-primary rounded-full hover:brightness-110 transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={onClose}
                    className="flex-1 h-9 flex items-center justify-center text-sm font-semibold text-primary border border-primary rounded-full hover:bg-primary-fixed transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Categories */}
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</p>
              <nav className="flex flex-col gap-1 mb-4">
                {categoryNav.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={onClose}
                    className={`px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      pathname === cat.href ? 'bg-primary-fixed text-primary' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {cat.label}
                  </Link>
                ))}
              </nav>

              <hr className="mb-4 border-gray-100" />

              {/* Quick links */}
              <div className="flex flex-col gap-1">
                <Link href="/help" onClick={onClose} className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  Help Center
                </Link>
                <Link href="/orders" onClick={onClose} className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  Track Order
                </Link>
                <Link href="/notifications" onClick={onClose} className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  Offers
                </Link>
                {!isAuthenticated && (
                  <Link href="/seller/dashboard" onClick={onClose} className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    Become a Seller
                  </Link>
                )}
                {showAuth && isAuthenticated && (
                  <button
                    onClick={() => { logout(); onClose(); }}
                    className="px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
