'use client';

import { useState } from 'react';

const conversations = [
  { id: 1, name: 'Rahim Miah', lastMessage: 'When will my order arrive?', time: '2 min ago', unread: 2, avatar: 'https://picsum.photos/seed/u1/40/40', online: true },
  { id: 2, name: 'Fatima Begum', lastMessage: 'Thanks for the quick delivery!', time: '15 min ago', unread: 0, avatar: 'https://picsum.photos/seed/u2/40/40', online: true },
  { id: 3, name: 'Karim Hossain', lastMessage: 'Is the shoe available in size 42?', time: '1 hour ago', unread: 1, avatar: 'https://picsum.photos/seed/u3/40/40', online: false },
  { id: 4, name: 'Nasrin Akter', lastMessage: 'Can I return this product?', time: '3 hours ago', unread: 0, avatar: 'https://picsum.photos/seed/u4/40/40', online: false },
  { id: 5, name: 'Jamil Ahmed', lastMessage: 'The earbuds are amazing!', time: '1 day ago', unread: 0, avatar: 'https://picsum.photos/seed/u5/40/40', online: true },
  { id: 6, name: 'Shahin Alam', lastMessage: 'Any discount on bulk orders?', time: '2 days ago', unread: 0, avatar: 'https://picsum.photos/seed/u6/40/40', online: false },
];

const messages = [
  { id: 1, from: 'customer', text: 'Hi, I ordered an iPhone 15 Pro Max. When will it arrive?', time: '10:30 AM' },
  { id: 2, from: 'seller', text: 'Hello Rahim! Your order has been shipped and should arrive within 2-3 business days.', time: '10:32 AM' },
  { id: 3, from: 'customer', text: 'Can you share the tracking number?', time: '10:33 AM' },
  { id: 4, from: 'seller', text: 'Sure! Your tracking number is BD-789-123456. You can track it on our website.', time: '10:35 AM' },
  { id: 5, from: 'customer', text: 'Thank you so much!', time: '10:36 AM' },
];

export default function SellerChat() {
  const [activeChat, setActiveChat] = useState(1);
  const [messageInput, setMessageInput] = useState('');

  const activeConv = conversations.find((c) => c.id === activeChat);

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
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveChat(conv.id)}
                className={`w-full text-left p-3 flex items-start gap-3 border-b border-surface-container-high hover:bg-surface-container-low transition-colors ${
                  activeChat === conv.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img src={conv.avatar} alt={conv.name} className="w-10 h-10 rounded-full object-cover" />
                  {conv.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-on-surface truncate">{conv.name}</span>
                    <span className="text-[10px] text-on-surface-variant">{conv.time}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant truncate mt-0.5">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="bg-primary text-on-primary text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                    {conv.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {activeConv ? (
          <div className="hidden sm:flex flex-1 flex-col">
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-3 border-b border-surface-container-high">
              <div className="relative">
                <img src={activeConv.avatar} alt={activeConv.name} className="w-9 h-9 rounded-full object-cover" />
                {activeConv.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface">{activeConv.name}</p>
                <p className="text-[10px] text-green-600">{activeConv.online ? 'Online' : 'Offline'}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.from === 'seller' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[70%] p-3 rounded-xl text-sm ${
                      msg.from === 'seller'
                        ? 'bg-primary text-on-primary rounded-br-sm'
                        : 'bg-surface-container-high text-on-surface rounded-bl-sm'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${msg.from === 'seller' ? 'text-on-primary/70' : 'text-on-surface-variant'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
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
          </div>
        ) : (
          <div className="hidden sm:flex flex-1 items-center justify-center">
            <div className="text-center">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-3">chat</span>
              <p className="text-on-surface-variant font-medium">Select a conversation</p>
              <p className="text-xs text-on-surface-variant mt-1">Choose a customer to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
