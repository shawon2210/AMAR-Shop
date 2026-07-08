'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthHydrated } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';

const navItems = [
  { href: '/', label: 'Home', icon: 'home' },
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
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center h-14 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0px_-2px_10px_rgba(0,0,0,0.08)] md:hidden"
      aria-label="Mobile navigation"
    >
      {navItems.map(item => {
        const isActive = pathname === item.href;
        const isCart = item.href === '/cart';

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center relative px-3 py-1 transition-colors ${
              isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <span
              className="material-symbols-outlined text-xl relative"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className={`text-[10px] font-medium mt-0.5 ${isActive ? 'font-semibold' : ''}`}>
              {item.label}
            </span>
            {isCart && hydrated && itemCount > 0 && (
              <span className="absolute -top-0.5 right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
