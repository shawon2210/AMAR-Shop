'use client';

import { useState } from 'react';
import { useChatMessages } from '@/services/seller';

export default function SellerChat() {
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState('');

  const { data: conversations, isLoading } = useChatMessages();

  const convList: Array<{ id: number; name?: string; lastMessage?: string; time?: string; unread?: number; avatar?: string; online?: boolean }> = Array.isArray(conversations) ? conversations as typeof convList : [];

  const activeConv = convList.find((c) => c.id === activeChat);

  return (
    <div className="h-[calc(100vh-8rem)]">
      <h1 className="text-xl font-bold text-on-surface mb-4">Chat</h1>
      <div className="flex h-[calc(100%-3rem)] bg-white rounded-xl border border-surface-container-high shadow-sm overflow-hidden">
        {/* Conversation List */}
        <div className="w-full sm:w-80 border-r border-surface-container-high flex flex-col">
          <div className="p-3 border-b border-surface-container-high">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-lg">search</span>
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-3 py-2 text-sm rounded-lg bg-surface-container-low border-none focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="animate-pulse text-on-surface-variant text-sm">Loading chats...</div>
              </div>
            ) : convList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-2">chat</span>
                <p className="text-sm text-on-surface-variant">No conversations yet</p>
              </div>
            ) : (
              convList.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveChat(conv.id)}
                  className={`w-full text-left p-3 flex items-start gap-3 border-b border-surface-container-high hover:bg-surface-container-low transition-colors ${
                    activeChat === conv.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={conv.avatar || `https://picsum.photos/seed/u${conv.id}/40/40`}
                      alt={conv.name || 'User'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {conv.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-on-surface truncate">{conv.name || `User #${conv.id}`}</span>
                      <span className="text-[10px] text-on-surface-variant">{conv.time || ''}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant truncate mt-0.5">{conv.lastMessage || 'No messages'}</p>
                  </div>
                  {(conv.unread || 0) > 0 && (
                    <span className="bg-primary text-on-primary text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                      {conv.unread}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden sm:flex flex-1 flex-col">
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 p-3 border-b border-surface-container-high">
                <div className="relative">
                  <img
                    src={activeConv.avatar || `https://picsum.photos/seed/u${activeConv.id}/40/40`}
                    alt={activeConv.name || 'User'}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  {activeConv.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div>
                <p className="text-sm font-medium text-on-surface">{activeConv.name || 'User'}</p>
                <p className="text-[10px] text-green-600">{activeConv.online ? 'Online' : 'Offline'}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="flex justify-start">
                  <div className="max-w-[70%] p-3 rounded-xl text-sm bg-surface-container-high text-on-surface rounded-bl-sm">
                    <p>Hello! How can I help you?</p>
                    <p className="text-[10px] mt-1 text-on-surface-variant">Start of conversation</p>
                  </div>
                </div>
              </div>

              {/* Input */}
              <div className="p-3 border-t border-surface-container-high">
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors">
                    <span className="material-symbols-outlined">add_circle</span>
                  </button>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 text-sm rounded-lg bg-surface-container-low border-none focus:ring-2 focus:ring-primary outline-none"
                  />
                  <button
                    className="p-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors"
                    onClick={() => { if (messageInput.trim()) setMessageInput(''); }}
                  >
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-3">chat</span>
                <p className="text-on-surface-variant font-medium">Select a conversation</p>
                <p className="text-xs text-on-surface-variant mt-1">Choose a customer to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
