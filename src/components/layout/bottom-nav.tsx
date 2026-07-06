'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthHydrated } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { fastTransition } from '@/lib/motion-variants';

const navItems = [
  { href: '/', label: 'Home', icon: 'home', fillIcon: true },
  { href: '/categories', label: 'Categories', icon: 'category' },
  { href: '/messages', label: 'Messages', icon: 'mail' },
  { href: '/cart', label: 'Cart', icon: 'shopping_cart' },
  { href: '/account', label: 'Account', icon: 'person' },
];

export function BottomNav() {
  const pathname = usePathname();
  const hydrated = useAuthHydrated();
  const itemCount = useCartStore(s => s.getItemCount());

  return (
    <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center py-1.5 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0px_-2px_10px_rgba(0,0,0,0.08)] safe-area-bottom" aria-label="Mobile navigation">
      {navItems.map(item => {
        const isActive = pathname === item.href;
        const isCart = item.href === '/cart';

        return (
          <Link
            key={item.href}
            href={item.href}
            className={'flex flex-col items-center justify-center relative px-3 py-1 ' + (isActive ? 'text-primary' : 'text-gray-400')}
            aria-current={isActive ? 'page' : undefined}
          >
            <motion.span
              whileTap={{ scale: 0.85 }}
              transition={fastTransition}
              className="material-symbols-outlined text-xl relative"
              style={(isActive && item.fillIcon) ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </motion.span>
            <span className={'text-[10px] font-medium mt-0.5 ' + (isActive ? 'text-primary font-semibold' : 'text-gray-400')}>{item.label}</span>
            {isCart && hydrated && itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 right-0.5 bg-red text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1"
              >
                {itemCount > 9 ? '9+' : itemCount}
              </motion.span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
