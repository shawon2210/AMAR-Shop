'use client';

import { useState } from 'react';

const mockTickets = [
  { id: '#TKT-1001', user: 'Rahima Begum', subject: 'Order not received yet', category: 'Shipping', priority: 'High', status: 'Open', date: '28 Jun 2026', assigned: '—' },
  { id: '#TKT-1002', user: 'Karim Hossain', subject: 'Payment deducted but order cancelled', category: 'Payment', priority: 'Urgent', status: 'In Progress', date: '28 Jun 2026', assigned: 'Admin' },
  { id: '#TKT-1003', user: 'Fatima Akhter', subject: 'Product quality issue', category: 'Refund', priority: 'Medium', status: 'Open', date: '27 Jun 2026', assigned: '—' },
  { id: '#TKT-1004', user: 'Nurul Islam', subject: 'Account hacked', category: 'Security', priority: 'Urgent', status: 'Resolved', date: '27 Jun 2026', assigned: 'Admin' },
  { id: '#TKT-1005', user: 'Sharmin Sultana', subject: 'How to become a seller?', category: 'General', priority: 'Low', status: 'Open', date: '26 Jun 2026', assigned: '—' },
  { id: '#TKT-1006', user: 'Jahid Hasan', subject: 'Refund not processed', category: 'Refund', priority: 'High', status: 'In Progress', date: '26 Jun 2026', assigned: 'Admin' },
  { id: '#TKT-1007', user: 'Morshed Alam', subject: 'Wrong item delivered', category: 'Returns', priority: 'Medium', status: 'Resolved', date: '25 Jun 2026', assigned: 'Admin' },
  { id: '#TKT-1008', user: 'Parvin Akhter', subject: 'Seller not responding', category: 'Seller', priority: 'High', status: 'Open', date: '25 Jun 2026', assigned: '—' },
];

const priorityStyles: Record<string, string> = {
  Low: 'bg-gray-100 text-gray-700',
  Medium: 'bg-blue-100 text-blue-700',
  High: 'bg-orange-100 text-orange-700',
  Urgent: 'bg-red-100 text-red-700',
};

const statusStyles: Record<string, string> = {
  Open: 'bg-green-100 text-green-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Resolved: 'bg-gray-100 text-gray-700',
};

const conversations: Record<string, { from: string; text: string; time: string }[]> = {
  '#TKT-1002': [
    { from: 'Karim Hossain', text: 'I paid via bKash but my order was cancelled. My money has not been refunded yet.', time: '28 Jun 2026, 10:30 AM' },
    { from: 'Admin', text: 'I apologize for the inconvenience. Let me check your payment status and get back to you shortly.', time: '28 Jun 2026, 11:00 AM' },
    { from: 'Karim Hossain', text: 'Thank you. Please resolve it as soon as possible.', time: '28 Jun 2026, 11:15 AM' },
  ],
};

export default function SupportPage() {
  const [selectedTicket, setSelectedTicket] = useState<typeof mockTickets[0] | null>(null);
  const [replyText, setReplyText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const stats = {
    open: mockTickets.filter((t) => t.status === 'Open').length,
    inProgress: mockTickets.filter((t) => t.status === 'In Progress').length,
    resolvedToday: mockTickets.filter((t) => t.status === 'Resolved' && t.date === '28 Jun 2026').length,
  };

  const filtered = statusFilter === 'All' ? mockTickets : mockTickets.filter((t) => t.status === statusFilter);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">Support Tickets</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#eee]">
          <p className="text-2xl font-bold text-green-600">{stats.open}</p>
          <p className="text-sm text-[#888] mt-1">Open Tickets</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#eee]">
          <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
          <p className="text-sm text-[#888] mt-1">In Progress</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#eee]">
          <p className="text-2xl font-bold text-green-600">{stats.resolvedToday}</p>
          <p className="text-sm text-[#888] mt-1">Resolved Today</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['All', 'Open', 'In Progress', 'Resolved'].map((t) => (
          <button key={t} onClick={() => setStatusFilter(t)} className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${statusFilter === t ? 'bg-primary text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f5f5f5]'}`}>
            {t}
          </button>
        ))}
      </div>

      {selectedTicket ? (
        <div className="bg-white rounded-xl border border-[#eee]">
          <div className="p-5 border-b border-[#eee] flex items-center justify-between">
            <div>
              <button onClick={() => setSelectedTicket(null)} className="text-sm text-primary hover:underline mb-1">&larr; Back to Tickets</button>
              <h2 className="text-lg font-semibold text-[#222]">{selectedTicket.subject}</h2>
              <p className="text-sm text-[#888]">{selectedTicket.id} by {selectedTicket.user}</p>
            </div>
            <div className="flex items-center gap-2">
              <select className="border border-[#ddd] rounded-lg px-3 py-1.5 text-sm outline-none">
                <option>Change Status</option>
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
              <select className="border border-[#ddd] rounded-lg px-3 py-1.5 text-sm outline-none">
                <option>Assign to...</option>
                <option>Admin</option>
                <option>Support Team</option>
              </select>
            </div>
          </div>

          <div className="p-5 space-y-4">
            {(conversations[selectedTicket.id] || [
              { from: selectedTicket.user, text: 'Customer inquiry regarding ' + selectedTicket.subject, time: selectedTicket.date },
            ]).map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'Admin' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-3 rounded-lg text-sm ${msg.from === 'Admin' ? 'bg-primary text-white' : 'bg-[#f5f5f5] text-[#333]'}`}>
                  <p className="text-xs font-semibold mb-1 opacity-70">{msg.from}</p>
                  <p>{msg.text}</p>
                  <p className="text-xs mt-1 opacity-60">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 border-t border-[#eee]">
            <div className="flex gap-3">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                rows={2}
                className="flex-1 border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none resize-none"
              />
              <button className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 self-end">Send</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                <th className="p-3">ID</th>
                <th className="p-3">User</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Category</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Status</th>
                <th className="p-3">Assigned</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa] cursor-pointer" onClick={() => setSelectedTicket(t)}>
                  <td className="p-3 font-medium text-[#333]">{t.id}</td>
                  <td className="p-3 text-[#555]">{t.user}</td>
                  <td className="p-3 text-[#444] max-w-[200px] truncate">{t.subject}</td>
                  <td className="p-3 text-[#666]">{t.category}</td>
                  <td className="p-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${priorityStyles[t.priority]}`}>{t.priority}</span>
                  </td>
                  <td className="p-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[t.status]}`}>{t.status}</span>
                  </td>
                  <td className="p-3 text-[#666]">{t.assigned}</td>
                  <td className="p-3 text-[#888] text-xs">{t.date}</td>
                  <td className="p-3">
                    <button className="p-1.5 rounded-lg hover:bg-[#f5f5f5]">
                      <span className="material-symbols-outlined text-[18px] text-[#666]">visibility</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
