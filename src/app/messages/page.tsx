'use client';

import Link from 'next/link';

const conversations = [
  { id: '1', name: 'Seller Support', avatar: 'support_agent', lastMessage: 'Your order #12345 has been shipped!', time: '2m ago', unread: 2, online: true },
  { id: '2', name: 'TechMart BD', avatar: 'store', lastMessage: 'Yes, the item is available in stock.', time: '1h ago', unread: 0, online: true },
  { id: '3', name: 'Fashion Hub', avatar: 'store', lastMessage: 'Thank you for your purchase!', time: '3h ago', unread: 0, online: false },
  { id: '4', name: 'AmarShop Support', avatar: 'support_agent', lastMessage: 'How can we help you today?', time: '1d ago', unread: 0, online: true },
  { id: '5', name: 'Gadget World', avatar: 'store', lastMessage: 'Your return request has been approved.', time: '2d ago', unread: 0, online: false },
];

export default function MessagesPage() {
  return (
    <div className="px-container-margin pt-md space-y-md pb-24">
      <div className="flex items-center justify-between">
        <h1 className="font-headline-md text-headline-md">Messages</h1>
        <span className="material-symbols-outlined text-primary">edit_note</span>
      </div>

      <div className="space-y-xs">
        {conversations.map(conv => (
          <Link
            key={conv.id}
            href={`/messages/${conv.id}`}
            className="flex items-center gap-md p-md bg-surface-container-lowest rounded-xl shadow-sm hover:brightness-95 transition-all active:scale-[0.99]"
          >
            <div className="relative shrink-0">
              <div className="w-12 h-12 bg-primary-fixed rounded-full flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl">{conv.avatar}</span>
              </div>
              {conv.online && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#34a853] border-2 border-surface-container-lowest rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-title-sm text-title-sm truncate">{conv.name}</p>
                <span className="text-[10px] text-secondary shrink-0">{conv.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-body-sm text-secondary truncate flex-1">{conv.lastMessage}</p>
                {conv.unread > 0 && (
                  <span className="bg-primary text-on-primary text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold shrink-0">
                    {conv.unread}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {conversations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="material-symbols-outlined text-5xl text-secondary mb-4">chat</span>
          <p className="text-body-md text-secondary">No messages yet</p>
        </div>
      )}
    </div>
  );
}
