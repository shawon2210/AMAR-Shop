'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore, useAuthHydrated } from '@/stores/auth-store';
import { useSearchStore } from '@/stores/search-store';
import { useFocusTrap } from '../hooks/use-focus-trap';
import { useBodyLock } from '../hooks/use-body-lock';
import { MobileCategoryList } from './MobileCategoryList';
import { Z_SIDEBAR, Z_SIDEBAR_OVERLAY } from '../styles';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const drawerVariants = {
  hidden: { x: '-100%' },
  visible: { x: 0 },
};

export function NavigationDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const drawerRef = useRef<HTMLDivElement>(null);
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const setIsSearchOpen = useSearchStore((s) => s.setIsOpen);
  const showAuth = hydrated;

  useFocusTrap(drawerRef, open);
  useBodyLock(open);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  useEffect(() => {
    onClose();
  }, [pathname]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="sidebar-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            style={{ zIndex: Z_SIDEBAR_OVERLAY }}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            key="sidebar-drawer"
            ref={drawerRef}
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 flex flex-col bg-white shadow-2xl outline-none rounded-r-2xl overflow-hidden"
            style={{
              zIndex: Z_SIDEBAR,
              width: 'clamp(280px, 80vw, 400px)',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            tabIndex={-1}
          >
            <div className="flex items-center justify-between px-5 h-16 md:h-18 border-b border-gray-100 shrink-0">
              <Image
                src="/images/amarshop-logo.png"
                alt="AmarShop"
                width={120}
                height={48}
                className="w-[clamp(90px,16vw,120px)] h-auto object-contain"
              />
              <button
                onClick={onClose}
                className="flex items-center justify-center w-11 h-11 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain">
              {showAuth && isAuthenticated ? (
                <div className="px-5 py-5 bg-gradient-to-b from-primary/5 to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                      {(user?.name || 'U')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email || user?.phone}
                      </p>
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

              <div className="px-5 py-3">
                <button
                  onClick={() => {
                    setIsSearchOpen(true);
                    onClose();
                  }}
                  className="flex items-center gap-3 w-full px-4 h-11 rounded-xl bg-gray-100 text-sm text-gray-400 active:bg-gray-200 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[18px]">search</span>
                  <span>Search products...</span>
                </button>
              </div>

              <MobileCategoryList onClose={onClose} />

              <div className="mx-5 my-3 h-px bg-gray-100" />

              <div className="px-5 pb-6">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  Quick Links
                </p>
                <div className="flex flex-col gap-0.5">
                  {showAuth &&
                    isAuthenticated &&
                    (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                      <Link
                        href="/admin"
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-primary hover:bg-primary-fixed rounded-xl transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          admin_panel_settings
                        </span>
                        Admin Panel
                      </Link>
                    )}
                  <Link
                    href="/help"
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px] text-gray-400">
                      help_outline
                    </span>
                    Help Center
                  </Link>
                  <Link
                    href="/orders"
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px] text-gray-400">
                      local_shipping
                    </span>
                    Track Order
                  </Link>
                  <Link
                    href="/notifications"
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px] text-gray-400">
                      notifications
                    </span>
                    Offers & Deals
                  </Link>
                  {!isAuthenticated && (
                    <Link
                      href="/seller/dashboard"
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px] text-gray-400">
                        storefront
                      </span>
                      Become a Seller
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {showAuth && isAuthenticated && (
              <div className="shrink-0 border-t border-gray-100 px-5 py-3 safe-bottom">
                <button
                  onClick={async () => {
                    await logout();
                    onClose();
                    router.push('/');
                  }}
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
