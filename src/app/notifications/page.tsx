'use client';

import Link from 'next/link';
import { useGetNotifications, useMarkAllRead } from '@/services/notifications';

export default function NotificationsPage() {
  const { data } = useGetNotifications();
  const { mutate: markAllRead } = useMarkAllRead();
  const notifications = data?.notifications ?? [];

  return (
    <div className="app-container py-6 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-responsive-subheading font-bold">Notifications</h1>
        {notifications.length > 0 && (
          <button
            onClick={() => markAllRead()}
            className="text-primary font-label-bold text-label-bold"
          >
            Mark All Read
          </button>
        )}
      </div>

      <div className="space-y-xs">
        {notifications.map(n => (
          <Link
            key={n.id}
            href="#"
            className={`flex items-start gap-md p-md rounded-xl shadow-sm hover:brightness-95 transition-all active:scale-[0.99] ${
              n.unread ? 'bg-primary-fixed/20' : 'bg-surface-container-lowest'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              n.unread ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-secondary'
            }`}>
              <span className="material-symbols-outlined text-xl">{n.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className={`font-title-sm text-title-sm truncate ${n.unread ? 'text-on-surface' : 'text-secondary'}`}>
                  {n.title}
                </p>
                <span className="text-[10px] text-secondary shrink-0">{n.time}</span>
              </div>
              <p className="text-body-sm text-secondary mt-0.5">{n.message}</p>
            </div>
            {n.unread && (
              <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
            )}
          </Link>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="material-symbols-outlined text-5xl text-secondary mb-4">notifications</span>
          <p className="text-body-md text-secondary">No notifications yet</p>
        </div>
      )}
    </div>
  );
}
