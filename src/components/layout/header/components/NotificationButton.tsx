'use client';

import Link from 'next/link';

export function NotificationButton() {
  return (
    <Link
      href="/notifications"
      className="hidden md:flex relative items-center justify-center w-11 h-11 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-primary transition-all duration-150"
      aria-label="Notifications"
    >
      <span className="material-symbols-outlined text-[22px]">notifications</span>
    </Link>
  );
}
