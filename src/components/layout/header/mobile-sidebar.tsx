'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore, useAuthHydrated } from '@/stores/auth-store';

const categoryNav = [
  { href: '/category/fashion', label: 'Fashion', icon: 'checkroom' },
  { href: '/category/electronics', label: 'Electronics', icon: 'devices' },
  { href: '/category/beauty', label: 'Beauty', icon: 'spa' },
  { href: '/category/groceries', label: 'Groceries', icon: 'restaurant' },
  { href: '/category/home', label: 'Home & Living', icon: 'chair' },
  { href: '/category/sports', label: 'Sports', icon: 'sports_tennis' },
];

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const showAuth = hydrated;
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Close on route change
  useEffect(() => {
    onCloseRef.current();
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
            {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-999"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.div
            ref={drawerRef}
            tabIndex={-1}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
             className="              fixed left-0 top-0 bottom-0 h-full w-[80vw] max-w-sm bg-white shadow-2xl z-1000 outline-none overflow-hidden flex flex-col rounded-r-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Header with logo + close */}
            <div className="flex items-center justify-between px-5 h-16 md:h-18 border-b border-gray-100">
              <Image
          src="/images/amarshop-logo.png"
          alt="AmarShop"
          width={120}
          height={48}
          className="w-[120px] h-auto object-contain"
        />
              <button
                onClick={onClose}
                className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              {/* Auth section */}
              {showAuth && isAuthenticated ? (
                <div className="px-5 py-5 bg-gradient-to-b from-primary/5 to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                      {(user?.name || 'U')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email || user?.phone}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-5 py-5 bg-gradient-to-b from-primary/5 to-transparent">
                  <div className="flex gap-2">
                    <Link
                      href="/auth/login"
                      onClick={onClose}
                      className="flex-1 h-10 flex items-center justify-center text-sm font-semibold text-white bg-primary rounded-xl hover:brightness-110 transition-all shadow-sm"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={onClose}
                      className="flex-1 h-10 flex items-center justify-center text-sm font-semibold text-primary border border-primary rounded-xl hover:bg-primary/5 transition-all"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              )}

              {/* Search shortcut */}
              <div className="px-5 py-3">
                <div className="flex items-center gap-3 px-4 h-11 rounded-xl bg-gray-100 text-sm text-gray-400 cursor-pointer active:bg-gray-200 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">search</span>
                  <span>Search products...</span>
                </div>
              </div>

              <div className="px-5 pb-2">
                {/* Categories */}
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Shop by Category</p>
                <nav className="flex flex-col gap-0.5">
                  {categoryNav.map((cat) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                        pathname === cat.href ? 'bg-primary-fixed text-primary' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px] text-gray-400">{cat.icon}</span>
                      {cat.label}
                    </Link>
                  ))}
                  <Link
                    href="/flash-sale"
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px] text-red-400">local_fire_department</span>
                    🔥 Flash Sale
                  </Link>
                </nav>
              </div>

              <div className="mx-5 my-3 h-px bg-gray-100" />

              {/* Quick links */}
              <div className="px-5 pb-6">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Quick Links</p>
                <div className="flex flex-col gap-0.5">
                  {showAuth && isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                    <Link href="/admin" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-primary hover:bg-primary-fixed rounded-xl transition-colors">
                      <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                      Admin Panel
                    </Link>
                  )}
                  <Link href="/help" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                    <span className="material-symbols-outlined text-[20px] text-gray-400">help_outline</span>
                    Help Center
                  </Link>
                  <Link href="/orders" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                    <span className="material-symbols-outlined text-[20px] text-gray-400">local_shipping</span>
                    Track Order
                  </Link>
                  <Link href="/notifications" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                    <span className="material-symbols-outlined text-[20px] text-gray-400">notifications</span>
                    Offers & Deals
                  </Link>
                  {!isAuthenticated && (
                    <Link href="/seller/dashboard" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                      <span className="material-symbols-outlined text-[20px] text-gray-400">storefront</span>
                      Become a Seller
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom logout bar */}
            {showAuth && isAuthenticated && (
              <div className="shrink-0 border-t border-gray-100 px-5 py-3">
                <button
                  onClick={async () => { await logout(); onClose(); router.push('/'); }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                  Sign Out
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
