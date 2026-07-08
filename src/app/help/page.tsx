'use client';

import { useState } from 'react';

const categories = [
  { id: 'orders', icon: 'local_shipping', title: 'Orders', desc: 'Track, cancel, or return orders' },
  { id: 'payments', icon: 'payments', title: 'Payments', desc: 'bKash, Nagad, COD, refunds' },
  { id: 'account', icon: 'person', title: 'Account', desc: 'Login, password, profile settings' },
  { id: 'shipping', icon: 'package_2', title: 'Shipping', desc: 'Delivery times, fees, tracking' },
  { id: 'returns', icon: 'replay', title: 'Returns', desc: 'Return policy, process, conditions' },
  { id: 'technical', icon: 'settings', title: 'Technical', desc: 'App issues, errors, troubleshooting' },
];

const faqs = [
  {
    q: 'How do I track my order?',
    a: 'Go to My Orders and tap on the order you want to track. You\'ll see real-time updates on your shipment status, including pickup, in-transit, and out-for-delivery notifications.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept bKash, Nagad, Cash on Delivery (COD), and SSLCommerz (Visa/Mastercard). All transactions are secure and encrypted.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery takes 3-7 business days within Dhaka city and 5-12 business days for other regions. Express delivery is available in select areas.',
  },
  {
    q: 'What is the return policy?',
    a: 'You can return items within 7 days of delivery for a full refund. Items must be unused with original packaging. Some categories like electronics may have different policies.',
  },
  {
    q: 'How do I cancel my order?',
    a: 'Orders can be cancelled within 1 hour of placement. Go to My Orders, select the order, and tap Cancel. Once shipped, cancellation is not possible.',
  },
  {
    q: 'Is Cash on Delivery available everywhere?',
    a: 'COD is available in most areas of Bangladesh. Check your pincode/area availability during checkout. A small COD fee may apply for certain locations.',
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const filteredFaqs = faqs.filter(
    f => f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
         f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container py-6 space-y-6 pb-24">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">How can we help you?</h1>
        <p className="text-secondary text-sm">Find answers and support for everything AmarShop</p>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">search</span>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search for help articles..."
          className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary transition-shadow"
        />
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-2 gap-4">
        {categories.map(cat => (
          <button
            key={cat.id}
            className="bg-surface-container-lowest rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-primary">{cat.icon}</span>
            </div>
            <h3 className="font-title-sm text-title-sm">{cat.title}</h3>
            <p className="text-xs text-secondary mt-0.5">{cat.desc}</p>
          </button>
        ))}
      </div>

      {/* Popular FAQs */}
      <div>
        <h2 className="text-xl font-bold mb-3">Popular FAQs</h2>
        <div className="space-y-2">
          {filteredFaqs.map(faq => (
            <div
              key={faq.q}
              className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === faq.q ? null : faq.q)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-semibold text-sm flex-1 pr-2">{faq.q}</span>
                <span className={`material-symbols-outlined text-secondary transition-transform ${
                  openFaq === faq.q ? 'rotate-180' : ''
                }`}>
                  expand_more
                </span>
              </button>
              {openFaq === faq.q && (
                <div className="px-4 pb-4 text-sm text-secondary border-t border-outline-variant pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Options */}
      <div>
        <h2 className="text-xl font-bold mb-3">Still need help?</h2>
        <div className="grid grid-cols-1 gap-4">
          <button className="flex items-center gap-3 bg-surface-container-lowest rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">chat</span>
            </div>
            <div className="text-left flex-1">
              <p className="font-semibold text-sm">Live Chat</p>
              <p className="text-xs text-secondary">Chat with our support team</p>
            </div>
            <span className="material-symbols-outlined text-secondary">chevron_right</span>
          </button>
          <button className="flex items-center gap-3 bg-surface-container-lowest rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary">mail</span>
            </div>
            <div className="text-left flex-1">
              <p className="font-semibold text-sm">Email Support</p>
              <p className="text-xs text-secondary">support@amarshop.com</p>
            </div>
            <span className="material-symbols-outlined text-secondary">chevron_right</span>
          </button>
          <button className="flex items-center gap-3 bg-surface-container-lowest rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-error">call</span>
            </div>
            <div className="text-left flex-1">
              <p className="font-semibold text-sm">Call Center</p>
              <p className="text-xs text-secondary">09612-XXXXXX (10AM - 10PM)</p>
            </div>
            <span className="material-symbols-outlined text-secondary">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
