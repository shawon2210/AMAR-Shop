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
      <div className="app-container py-6 space-y-4 pb-24">
        <div className="bg-white rounded-xl p-4 animate-pulse border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="app-container py-6 space-y-4 pb-24">
        <div className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm border border-gray-100">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-3xl">person</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold">Welcome!</h2>
            <p className="text-sm text-gray-500">Sign in to access your account</p>
          </div>
          <Link
            href="/auth/login?redirect=/account"
            className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition-all shrink-0"
          >
            Sign In
          </Link>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold mb-3">Why create an account?</h3>
          <ul className="space-y-2 text-sm text-gray-500">
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base shrink-0">check_circle</span>
              Track your orders in real-time
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base shrink-0">check_circle</span>
              Faster checkout with saved addresses
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base shrink-0">check_circle</span>
              Exclusive deals and personalized recommendations
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base shrink-0">check_circle</span>
              Easy returns and order management
            </li>
          </ul>
          <div className="mt-4 flex gap-2">
            <Link
              href="/auth/login?redirect=/account"
              className="flex-1 py-2.5 bg-primary text-white text-center rounded-lg text-sm font-semibold hover:brightness-110 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register?redirect=/account"
              className="flex-1 py-2.5 border border-primary text-primary text-center rounded-lg text-sm font-semibold hover:bg-emerald-50 transition-all"
            >
              Register
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold mb-3">Track Your Order</h3>
          <p className="text-sm text-gray-500 mb-3">Enter your order ID to track your shipment</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Order ID"
              className="flex-1 h-11 min-h-[44px] px-3 border border-gray-200 rounded-lg bg-transparent text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="px-5 h-11 min-h-[44px] bg-primary text-white rounded-lg text-sm font-semibold hover:brightness-110 transition-all">
              Track
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container py-6 space-y-4 pb-24">
      <div className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm border border-gray-100">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-primary overflow-hidden shrink-0">
          {user.avatar ? (
            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-3xl">person</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold truncate">{user.name}</h2>
          <p className="text-xs sm:text-sm text-gray-500 truncate">{user.email || user.phone}</p>
          <span className="inline-block mt-0.5 text-[10px] px-2 py-0.5 bg-emerald-50 text-primary rounded-full capitalize font-semibold">
            {user.role?.toLowerCase()}
          </span>
        </div>
        <Link
          href="/account/edit"
          className="text-primary text-xs font-semibold hover:underline shrink-0"
        >
          Edit
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2">
        {[
          { icon: 'payments', label: 'To Pay', value: '0' },
          { icon: 'local_shipping', label: 'To Ship', value: '0' },
          { icon: 'inventory_2', label: 'To Receive', value: '1' },
          { icon: 'star', label: 'Reviews', value: '0' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-2 text-center border border-gray-100 shadow-sm">
            <span className="material-symbols-outlined text-primary text-2xl">{stat.icon}</span>
            <p className="text-lg font-bold text-primary">{stat.value}</p>
            <p className="text-[10px] text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl overflow-hidden shadow-sm divide-y divide-gray-100 border border-gray-100">
        {menuItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 px-4 py-3.5 hover:bg-gray-50 transition-colors"
          >
            <span className="material-symbols-outlined text-gray-400">{item.icon}</span>
            <span className="flex-1 text-sm">{item.label}</span>
            <span className="material-symbols-outlined text-gray-400 text-lg">chevron_right</span>
          </Link>
        ))}
      </div>

      {user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? (
        <Link
          href="/admin"
          className="flex items-center gap-4 px-4 py-3.5 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <span className="material-symbols-outlined text-primary">dashboard</span>
          <span className="flex-1 text-sm">Admin Dashboard</span>
          <span className="material-symbols-outlined text-gray-400 text-lg">chevron_right</span>
        </Link>
      ) : null}

      <button
        onClick={handleLogout}
        className="w-full h-11 min-h-[44px] text-red-600 font-semibold rounded-xl border border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 text-sm"
      >
        <span className="material-symbols-outlined text-base">logout</span>
        Logout
      </button>
    </div>
  );
}
