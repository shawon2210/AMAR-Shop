'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore, useAuthHydrated } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';

const navItems = [
  { href: '/', label: 'Home', icon: 'home', fillIcon: true },
  { href: '/categories', label: 'Categories', icon: 'category' },
  { href: '/messages', label: 'Messages', icon: 'mail' },
  { href: '/cart', label: 'Cart', icon: 'shopping_cart' },
  { href: '/account', label: 'Account', icon: 'person' },
];

export function BottomNav() {
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);
  const itemCount = useCartStore(s => s.getItemCount());

  return (
    <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center py-1.5 bg-white border-t border-gray-200 shadow-[0px_-2px_10px_rgba(0,0,0,0.08)]">
      {navItems.map(item => {
        const isActive = pathname === item.href;
        const isCart = item.href === '/cart';
        const isAccount = item.href === '/account';

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center transition-transform duration-150 active:scale-90 relative ${
              isActive
                ? 'text-primary'
                : 'text-secondary hover:text-primary-container'
            }`}
          >
            <span
              className="material-symbols-outlined text-xl"
              style={(isActive && item.fillIcon) ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : ''}`}>{item.label}</span>
            {isCart && hydrated && itemCount > 0 && (
              <span className="absolute -top-0.5 right-0.5 bg-red text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
