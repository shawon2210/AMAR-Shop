'use client';

import Link from 'next/link';

interface NotificationButtonProps {
  variant?: 'default' | 'drawer';
}

export function NotificationButton({ variant = 'default' }: NotificationButtonProps) {
  return (
    <Link
      href="/notifications"
      className={
        variant === 'drawer'
          ? 'flex relative items-center justify-center w-11 h-11 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-primary transition-all duration-150'
          : 'flex items-center justify-center w-11 h-11 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-primary transition-all duration-150'
      }
      aria-label="Notifications"
    >
      <span className="material-symbols-outlined text-[22px]">notifications</span>
    </Link>
  );
}
