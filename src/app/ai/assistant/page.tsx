'use client';

import { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
  products?: Array<{ id: string; name: string; price: number }>;
  timestamp: Date;
}

const quickActions = [
  { label: 'Track Order', icon: 'local_shipping', query: 'I want to track my order' },
  { label: 'Find Products', icon: 'search', query: 'Show me popular products' },
  { label: 'Return Policy', icon: 'assignment_return', query: 'What is your return policy?' },
  { label: 'Flash Sales', icon: 'bolt', query: 'What flash sales are active?' },
  { label: 'Payment Methods', icon: 'payments', query: 'What payment methods do you accept?' },
  { label: 'Contact Support', icon: 'support_agent', query: 'I need to contact customer support' },
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Assalamu Alaikum! I\'m your AmarShop shopping assistant. How can I help you today? I can help you find products, track orders, or answer any questions!',
      suggestions: ['Track my order', 'Find popular products', 'Return policy'],
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const idCounterRef = useRef(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${++idCounterRef.current}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const history = messages
        .filter(m => m.id !== 'welcome')
        .slice(-10)
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, history }),
      });

      if (!res.ok) throw new Error('Failed to get response');

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${++idCounterRef.current}`,
        role: 'assistant',
        content: data.message || 'Sorry, I couldn\'t process that. Please try again.',
        suggestions: data.suggestions,
        products: data.products,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch {
      setMessages(prev => [...prev, {
        id: `assistant-${++idCounterRef.current}`,
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting. Please try again later.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleQuickAction = (query: string) => {
    handleSend(query);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto px-4">
      <div className="text-center py-6">
        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="material-symbols-outlined text-primary text-3xl">smart_toy</span>
        </div>
        <h1 className="font-headline-md text-headline-md text-on-surface">AI Shopping Assistant</h1>
        <p className="text-body-md text-on-surface-variant mt-1">Ask me anything about shopping on AmarShop</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-4 px-1">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-primary text-on-primary rounded-br-md'
                : 'bg-surface-container-high text-on-surface rounded-bl-md'
            }`}>
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-sm text-primary">smart_toy</span>
                  <span className="text-xs font-label-bold text-primary">AmarShop AI</span>
                </div>
              )}
              <p className="text-body-md whitespace-pre-wrap">{msg.content}</p>

              {msg.products && msg.products.length > 0 && (
                <div className="mt-3 space-y-2">
                  {msg.products.map(p => (
                    <div key={p.id} className="flex items-center gap-3 bg-white/20 rounded-lg p-2">
                      <span className="material-symbols-outlined text-sm">inventory_2</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{p.name}</p>
                        <p className="text-xs opacity-80">৳{p.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {msg.suggestions.map(s => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="text-xs px-3 py-1.5 rounded-full border border-outline-variant bg-surface text-on-surface hover:bg-surface-container-high transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-surface-container-high rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">smart_toy</span>
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 bg-background pb-4 pt-2 space-y-3">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {quickActions.map(action => (
            <button
              key={action.label}
              onClick={() => handleQuickAction(action.query)}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors whitespace-nowrap shrink-0"
            >
              <span className="material-symbols-outlined text-sm">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-surface-container-high rounded-2xl p-1">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend(input)}
            placeholder="Type your message..."
            className="flex-1 bg-transparent px-3 py-2.5 text-body-md text-on-surface outline-none placeholder:text-on-surface-variant"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-primary text-on-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-container transition-colors"
          >
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
