'use client';

import Link from 'next/link';

const notifications = [
  { id: '1', icon: 'local_shipping', title: 'Order Shipped', message: 'Your order #12345 has been shipped and is on its way!', time: '2m ago', unread: true },
  { id: '2', icon: 'sell', title: 'Flash Sale Alert', message: '50% off on Electronics starting in 2 hours. Don\'t miss out!', time: '1h ago', unread: true },
  { id: '3', icon: 'confirmation_number', title: 'Voucher Received', message: 'You\'ve received a free shipping voucher. Use code FREESHIP.', time: '3h ago', unread: false },
  { id: '4', icon: 'star', title: 'Review Reminder', message: 'How was your recent purchase? Share your experience!', time: '1d ago', unread: false },
  { id: '5', icon: 'account_balance_wallet', title: 'Payment Successful', message: 'Payment of ৳1,250 for order #12340 was successful.', time: '2d ago', unread: false },
  { id: '6', icon: 'campaign', title: 'Trending Now', message: 'Check out what\'s trending this week in Fashion.', time: '3d ago', unread: false },
];

export default function NotificationsPage() {
  return (
    <div className="px-container-margin pt-md space-y-md pb-24">
      <div className="flex items-center justify-between">
        <h1 className="font-headline-md text-headline-md">Notifications</h1>
        <button className="text-primary font-label-bold text-label-bold">Mark All Read</button>
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
