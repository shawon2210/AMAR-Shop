'use client';

import { useState } from 'react';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  description: string;
  messages: { from: string; text: string; time: string }[];
  lastUpdated: string;
}

const mockTickets: Ticket[] = [
  {
    id: 'TKT-1001',
    subject: 'Order not delivered yet',
    category: 'Orders',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    description: 'My order #ORD-20260625-001 was supposed to arrive yesterday but still shows in transit.',
    messages: [
      { from: 'You', text: 'My order is late. Can you check?', time: '2h ago' },
      { from: 'Support', text: 'We apologize for the delay. Let me check with the courier partner.', time: '1h ago' },
    ],
    lastUpdated: '1h ago',
  },
  {
    id: 'TKT-1002',
    subject: 'Refund not processed',
    category: 'Payments',
    status: 'OPEN',
    priority: 'MEDIUM',
    description: 'I cancelled order #ORD-20260620-002 but haven\'t received my refund yet.',
    messages: [],
    lastUpdated: '1d ago',
  },
  {
    id: 'TKT-1003',
    subject: 'Wrong item received',
    category: 'Returns',
    status: 'RESOLVED',
    priority: 'HIGH',
    description: 'Received a different color variant than what I ordered.',
    messages: [
      { from: 'You', text: 'I ordered black but got white.', time: '3d ago' },
      { from: 'Support', text: 'We\'ve initiated a return. Pickup scheduled for tomorrow.', time: '2d ago' },
      { from: 'You', text: 'Thank you, picked up successfully.', time: '1d ago' },
      { from: 'Support', text: 'Refund has been processed. You\'ll receive it within 3-5 business days.', time: '12h ago' },
    ],
    lastUpdated: '12h ago',
  },
  {
    id: 'TKT-1004',
    subject: 'Account login issue',
    category: 'Account',
    status: 'CLOSED',
    priority: 'LOW',
    description: 'Unable to login with my phone number after updating the app.',
    messages: [
      { from: 'You', text: 'Login keeps failing after app update.', time: '5d ago' },
      { from: 'Support', text: 'Please clear app cache and try again. We\'ve also pushed a fix.', time: '4d ago' },
      { from: 'You', text: 'Works now, thank you!', time: '3d ago' },
    ],
    lastUpdated: '3d ago',
  },
];

const statusConfig: Record<string, { label: string; class: string }> = {
  OPEN: { label: 'Open', class: 'bg-blue-50 text-blue-700' },
  IN_PROGRESS: { label: 'In Progress', class: 'bg-amber-50 text-amber-700' },
  RESOLVED: { label: 'Resolved', class: 'bg-green-50 text-green-700' },
  CLOSED: { label: 'Closed', class: 'bg-surface-container-highest text-secondary' },
};

const priorityConfig: Record<string, { label: string; class: string }> = {
  LOW: { label: 'Low', class: 'text-secondary' },
  MEDIUM: { label: 'Medium', class: 'text-amber-600' },
  HIGH: { label: 'High', class: 'text-error' },
  URGENT: { label: 'Urgent', class: 'text-error font-bold' },
};

export default function TicketsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    setReplyText('');
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    setReplyText('');
  };

  return (
    <div className="px-container-margin pt-md space-y-md pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-headline-md text-headline-md">My Tickets</h1>
        <button className="flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 rounded-lg font-label-bold text-sm hover:brightness-110 transition-all active:scale-95">
          <span className="material-symbols-outlined text-lg">add</span>
          Create Ticket
        </button>
      </div>

      {/* Ticket List */}
      <div className="space-y-3">
        {mockTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="material-symbols-outlined text-5xl text-secondary mb-3">confirmation_number</span>
            <p className="text-secondary">No tickets yet</p>
          </div>
        ) : (
          mockTickets.map(ticket => {
            const status = statusConfig[ticket.status];
            const priority = priorityConfig[ticket.priority];
            const isExpanded = expandedId === ticket.id;

            return (
              <div
                key={ticket.id}
                className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleExpand(ticket.id)}
                  className="w-full p-md text-left"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-secondary font-mono">{ticket.id}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-label-bold px-2 py-0.5 rounded-full ${status.class}`}>
                        {status.label}
                      </span>
                      <span className={`text-[10px] font-label-bold ${priority.class}`}>
                        {priority.label}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-title-sm text-title-sm mb-1">{ticket.subject}</h3>
                  <div className="flex items-center gap-2 text-xs text-secondary">
                    <span className="material-symbols-outlined text-xs">category</span>
                    <span>{ticket.category}</span>
                    <span className="mx-1">·</span>
                    <span className="material-symbols-outlined text-xs">schedule</span>
                    <span>{ticket.lastUpdated}</span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-outline-variant">
                    {/* Description */}
                    <div className="p-md bg-surface-container-low">
                      <p className="text-sm text-secondary">{ticket.description}</p>
                    </div>

                    {/* Messages */}
                    {ticket.messages.length > 0 && (
                      <div className="p-md space-y-3">
                        {ticket.messages.map((msg, i) => (
                          <div
                            key={i}
                            className={`flex flex-col ${msg.from === 'You' ? 'items-end' : 'items-start'}`}
                          >
                            <div
                              className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                                msg.from === 'You'
                                  ? 'bg-primary text-on-primary rounded-br-sm'
                                  : 'bg-surface-container-high rounded-bl-sm'
                              }`}
                            >
                              {msg.text}
                            </div>
                            <span className="text-[10px] text-secondary mt-0.5 px-1">{msg.time}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Form */}
                    <div className="border-t border-outline-variant p-md">
                      <div className="flex items-end gap-2">
                        <textarea
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          placeholder="Type your reply..."
                          rows={2}
                          className="flex-1 px-3 py-2 border border-outline-variant rounded-lg text-sm bg-transparent outline-none focus:ring-2 focus:ring-primary resize-none"
                        />
                        <button
                          onClick={handleSendReply}
                          disabled={!replyText.trim()}
                          className="p-2.5 bg-primary text-on-primary rounded-lg disabled:opacity-50 hover:brightness-110 transition-all"
                        >
                          <span className="material-symbols-outlined text-lg">send</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
