'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore, useAuthHydrated } from '@/stores/auth-store';

const menuItems = [
  { href: '/orders', icon: 'receipt_long', label: 'My Orders' },
  { href: '/account/wishlist', icon: 'favorite', label: 'Wishlist' },
  { href: '/account/addresses', icon: 'location_on', label: 'My Addresses' },
  { href: '/account/reviews', icon: 'rate_review', label: 'My Reviews' },
  { href: '/account/settings', icon: 'settings', label: 'Settings' },
  { href: '/account/help', icon: 'help', label: 'Help Center' },
];

export default function AccountPage() {
  const router = useRouter();
  const user = useAuthStore(s => s.user);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const logout = useAuthStore(s => s.logout);
  const hydrated = useAuthHydrated();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!hydrated) {
    return (
      <div className="px-container-margin pt-md space-y-md pb-24">
        <div className="bg-surface-container-lowest rounded-xl p-md animate-pulse">
          <div className="flex items-center gap-md">
            <div className="w-16 h-16 rounded-full bg-surface-container-high" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-surface-container-high rounded w-1/3" />
              <div className="h-3 bg-surface-container-high rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="px-container-margin pt-md space-y-md pb-24">
        <div className="bg-surface-container-lowest rounded-xl p-md flex items-center gap-md shadow-sm">
          <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-3xl">person</span>
          </div>
          <div className="flex-1">
            <h2 className="font-title-sm text-title-sm">Welcome!</h2>
            <p className="text-sm text-secondary">Sign in to access your account</p>
          </div>
          <Link
            href="/auth/login?redirect=/account"
            className="bg-primary text-on-primary px-lg py-2 rounded-lg font-label-bold text-sm hover:brightness-110 transition-all"
          >
            Sign In
          </Link>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm">
          <h3 className="font-title-sm text-title-sm mb-sm">Why create an account?</h3>
          <ul className="space-y-2 text-sm text-secondary">
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">check_circle</span>
              Track your orders in real-time
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">check_circle</span>
              Faster checkout with saved addresses
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">check_circle</span>
              Exclusive deals and personalized recommendations
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">check_circle</span>
              Easy returns and order management
            </li>
          </ul>
          <div className="mt-md flex gap-sm">
            <Link
              href="/auth/login?redirect=/account"
              className="flex-1 py-2.5 bg-primary text-on-primary text-center rounded-lg font-label-bold text-sm hover:brightness-110 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register?redirect=/account"
              className="flex-1 py-2.5 border border-primary text-primary text-center rounded-lg font-label-bold text-sm hover:bg-primary-fixed transition-all"
            >
              Register
            </Link>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm">
          <h3 className="font-title-sm text-title-sm mb-sm">Track Your Order</h3>
          <p className="text-sm text-secondary mb-sm">Enter your order ID to track your shipment</p>
          <div className="flex gap-sm">
            <input
              type="text"
              placeholder="Order ID"
              className="flex-1 px-3 py-2 border border-outline rounded-lg bg-transparent text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-bold text-sm hover:brightness-110 transition-all">
              Track
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-container-margin pt-md space-y-md pb-24">
      <div className="bg-surface-container-lowest rounded-xl p-md flex items-center gap-md shadow-sm">
        <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary overflow-hidden">
          {user.avatar ? (
            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-3xl">person</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-title-sm text-title-sm truncate">{user.name}</h2>
          <p className="text-xs sm:text-sm text-secondary truncate">{user.email || user.phone}</p>
          <span className="inline-block mt-0.5 text-[10px] px-2 py-0.5 bg-primary-fixed text-primary rounded-full capitalize font-label-bold">
            {user.role?.toLowerCase()}
          </span>
        </div>
        <Link
          href="/account/edit"
          className="text-primary text-xs font-label-bold hover:underline shrink-0"
        >
          Edit
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-sm">
        {[
          { icon: 'payments', label: 'To Pay', value: '0' },
          { icon: 'local_shipping', label: 'To Ship', value: '0' },
          { icon: 'inventory_2', label: 'To Receive', value: '1' },
          { icon: 'star', label: 'Reviews', value: '0' },
        ].map(stat => (
          <div key={stat.label} className="bg-surface-container-lowest rounded-xl p-sm text-center shadow-sm">
            <span className="material-symbols-outlined text-primary text-2xl">{stat.icon}</span>
            <p className="font-headline-md text-headline-md text-primary">{stat.value}</p>
            <p className="text-[10px] text-secondary">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm divide-y divide-outline-variant">
        {menuItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-md px-md py-sm hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-secondary">{item.icon}</span>
            <span className="flex-1 font-body-md">{item.label}</span>
            <span className="material-symbols-outlined text-secondary text-lg">chevron_right</span>
          </Link>
        ))}
      </div>

      {user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? (
        <Link
          href="/admin"
          className="flex items-center gap-md px-md py-sm bg-surface-container-lowest rounded-xl shadow-sm hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined text-primary">dashboard</span>
          <span className="flex-1 font-body-md">Admin Dashboard</span>
          <span className="material-symbols-outlined text-secondary text-lg">chevron_right</span>
        </Link>
      ) : null}

      <button
        onClick={handleLogout}
        className="w-full py-3 text-error font-label-bold rounded-xl border border-error hover:bg-error-container transition-colors flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-base">logout</span>
        Logout
      </button>
    </div>
  );
}
