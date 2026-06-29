'use client';

import Link from 'next/link';

const menuItems = [
  { href: '/orders', icon: 'receipt_long', label: 'My Orders', badge: '2' },
  { href: '/account/wishlist', icon: 'favorite', label: 'Wishlist', badge: '' },
  { href: '/account/vouchers', icon: 'sell', label: 'My Vouchers', badge: '3' },
  { href: '/account/addresses', icon: 'location_on', label: 'My Addresses', badge: '' },
  { href: '/account/reviews', icon: 'rate_review', label: 'My Reviews', badge: '' },
  { href: '/account/settings', icon: 'settings', label: 'Settings', badge: '' },
  { href: '/account/help', icon: 'help', label: 'Help Center', badge: '' },
];

export default function AccountPage() {
  return (
    <div className="px-container-margin pt-md space-y-md">
      {/* Profile Card */}
      <div className="bg-surface-container-lowest rounded-xl p-md flex items-center gap-md shadow-sm">
        <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-3xl">person</span>
        </div>
        <div className="flex-1">
          <h2 className="font-title-sm text-title-sm">Welcome!</h2>
          <p className="text-sm text-secondary">Sign in to access your account</p>
        </div>
        <Link
          href="/auth/login"
          className="bg-primary text-on-primary px-lg py-2 rounded-lg font-label-bold text-sm hover:brightness-110 transition-all"
        >
          Sign In
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-sm">
        {[
          { icon: 'payments', label: 'To Pay', value: '0' },
          { icon: 'local_shipping', label: 'To Ship', value: '0' },
          { icon: 'inventory_2', label: 'To Receive', value: '1' },
          { icon: 'star', label: 'Reviews', value: '4' },
        ].map(stat => (
          <div key={stat.label} className="bg-surface-container-lowest rounded-xl p-sm text-center shadow-sm">
            <span className="material-symbols-outlined text-primary text-2xl">{stat.icon}</span>
            <p className="font-headline-md text-headline-md text-primary">{stat.value}</p>
            <p className="text-[10px] text-secondary">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Menu Items */}
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm divide-y divide-outline-variant">
        {menuItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-md px-md py-sm hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-secondary">{item.icon}</span>
            <span className="flex-1 font-body-md">{item.label}</span>
            {item.badge && (
              <span className="bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {item.badge}
              </span>
            )}
            <span className="material-symbols-outlined text-secondary text-lg">chevron_right</span>
          </Link>
        ))}
      </div>

      {/* Logout */}
      <button className="w-full py-3 text-error font-label-bold rounded-xl border border-error hover:bg-error-container transition-colors">
        Logout
      </button>
    </div>
  );
}
