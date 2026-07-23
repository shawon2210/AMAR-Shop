'use client';

import { useGetConversations } from '@/services/messages';

export default function MessagesPage() {
  const { data } = useGetConversations();
  const conversations = data?.conversations ?? [];

  return (
    <div className="app-container py-6">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="material-symbols-outlined text-5xl text-secondary mb-4">chat</span>
          <p className="text-body-md text-secondary">No conversations yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`flex items-center gap-4 p-4 bg-surface rounded-lg shadow ${conv.unread ? 'border-l-4 border-primary' : ''}`}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">store</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className={`font-semibold ${conv.unread ? 'text-on-background' : 'text-secondary'}`}>
                    {conv.name}
                  </h3>
                  <span className="text-xs text-secondary">{conv.time}</span>
                </div>
                <p className="text-sm text-secondary truncate">{conv.lastMessage}</p>
              </div>
              {conv.unread && (
                <div className="w-3 h-3 rounded-full bg-primary shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}