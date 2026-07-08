'use client';

import { useState } from 'react';

interface ChatConversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  isOnline: boolean;
  isSupport: boolean;
}

interface ChatMessage {
  id: string;
  text: string;
  fromUser: boolean;
  time: string;
  isTyping?: boolean;
}

const conversations: ChatConversation[] = [
  { id: 'conv-1', name: 'AmarShop Support', avatar: 'support_agent', lastMessage: 'We\'re checking with the courier partner.', lastTime: '2m ago', unread: 1, isOnline: true, isSupport: true },
  { id: 'conv-2', name: 'TechTrendz Store', avatar: 'store', lastMessage: 'Your item has been shipped!', lastTime: '1h ago', unread: 0, isOnline: false, isSupport: false },
  { id: 'conv-3', name: 'Payment Support', avatar: 'payments', lastMessage: 'Refund processed successfully.', lastTime: '1d ago', unread: 0, isOnline: false, isSupport: true },
];

const quickReplies = [
  'Track my order',
  'Return request',
  'Payment issue',
  'Cancel order',
  'Shipping info',
  'Talk to agent',
];

const sampleMessages: Record<string, ChatMessage[]> = {
  'conv-1': [
    { id: 'm1', text: 'Hi! My order is delayed. Can you help?', fromUser: true, time: '10:32 AM' },
    { id: 'm2', text: 'Hello! I\'m sorry to hear that. Let me check your order status.', fromUser: false, time: '10:33 AM' },
    { id: 'm3', text: 'Order #ORD-20260625-001', fromUser: true, time: '10:34 AM' },
    { id: 'm4', text: 'We\'re checking with the courier partner.', fromUser: false, time: '10:35 AM' },
  ],
  'conv-2': [
    { id: 'm5', text: 'When will my order arrive?', fromUser: true, time: '9:00 AM' },
    { id: 'm6', text: 'Your item has been shipped!', fromUser: false, time: '9:30 AM' },
  ],
  'conv-3': [
    { id: 'm7', text: 'I requested a refund 3 days ago.', fromUser: true, time: 'Yesterday' },
    { id: 'm8', text: 'Refund processed successfully.', fromUser: false, time: 'Yesterday' },
  ],
};

export default function ChatPage() {
  const [activeConv, setActiveConv] = useState(conversations[0].id);
  const [messageText, setMessageText] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>(sampleMessages[activeConv] || []);

  const activeConversation = conversations.find(c => c.id === activeConv);

  const handleSend = () => {
    if (!messageText.trim()) return;
    const newMsg: ChatMessage = {
      id: `m${Date.now()}`,
      text: messageText.trim(),
      fromUser: true,
      time: 'Now',
    };
    setMessages(prev => [...prev, newMsg]);
    setMessageText('');
    setShowQuickReplies(false);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `m${Date.now()}`,
        text: 'Thank you for your message. A support agent will be with you shortly.',
        fromUser: false,
        time: 'Just now',
      }]);
    }, 1500);
  };

  const handleQuickReply = (text: string) => {
    setMessageText(text);
    setShowQuickReplies(false);
  };

  const switchConversation = (id: string) => {
    setActiveConv(id);
    setMessages(sampleMessages[id] || []);
    setShowQuickReplies(true);
    setMessageText('');
  };

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      {/* Chat History Sidebar - Desktop */}
      <div className="hidden md:flex w-80 flex-shrink-0 border-r border-outline-variant flex-col bg-surface-container-low">
        <div className="p-4 border-b border-outline-variant">
          <h2 className="text-xl font-bold">Chats</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => switchConversation(conv.id)}
              className={`w-full flex items-center gap-3 p-4 text-left hover:bg-surface-container transition-colors ${
                activeConv === conv.id ? 'bg-surface-container-highest' : ''
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">{conv.avatar}</span>
                </div>
                {conv.isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm truncate">{conv.name}</span>
                  <span className="text-[10px] text-secondary flex-shrink-0">{conv.lastTime}</span>
                </div>
                <p className="text-xs text-secondary truncate mt-0.5">{conv.lastMessage}</p>
              </div>
              {conv.unread > 0 && (
                <span className="bg-primary text-on-primary text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center flex-shrink-0">
                  {conv.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Active Chat */}
      <div className="flex-1 flex flex-col bg-surface-container-lowest">
        {/* Chat Header */}
        <div className="flex items-center gap-3 p-4 border-b border-outline-variant bg-surface">
          <button className="md:hidden p-1" onClick={() => {}}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-lg">{activeConversation?.avatar}</span>
            </div>
            {activeConversation?.isOnline && (
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{activeConversation?.name}</p>
            <p className="text-[10px] text-secondary">
              {activeConversation?.isOnline ? 'Online' : 'Offline'}
              {activeConversation?.isSupport ? ' · Support' : ' · Store'}
            </p>
          </div>
          <button className="p-1">
            <span className="material-symbols-outlined text-secondary">more_vert</span>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.fromUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  msg.fromUser
                    ? 'bg-primary text-on-primary rounded-br-sm'
                    : 'bg-surface-container-high rounded-bl-sm'
                }`}
              >
                {msg.text}
                <div className={`text-[10px] mt-0.5 ${msg.fromUser ? 'text-on-primary/60' : 'text-secondary'}`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {false && (
            <div className="flex justify-start">
              <div className="bg-surface-container-high rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Quick Replies */}
        {showQuickReplies && (
          <div className="px-md pb-2">
            <div className="flex flex-wrap gap-2">
              {quickReplies.map(qr => (
                <button
                  key={qr}
                  onClick={() => handleQuickReply(qr)}
                  className="text-xs px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-highest rounded-full transition-colors"
                >
                  {qr}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-outline-variant bg-surface">
          <div className="flex items-end gap-2">
            <button className="p-2 flex-shrink-0">
              <span className="material-symbols-outlined text-secondary">attach_file</span>
            </button>
            <textarea
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 px-3 py-2 border border-outline-variant rounded-xl text-sm bg-transparent outline-none focus:ring-2 focus:ring-primary resize-none max-h-24"
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              onClick={handleSend}
              disabled={!messageText.trim()}
              className="p-2.5 bg-primary text-on-primary rounded-xl disabled:opacity-50 hover:brightness-110 transition-all flex-shrink-0"
            >
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
