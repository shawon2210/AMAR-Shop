'use client';

import { Mail, ArrowRight } from 'lucide-react';
import { Footer as NewFooter } from './footer/Footer';

const trustItems = [
  { icon: 'lock', title: 'Secure Payment', desc: 'SSL encrypted. bKash, Nagad, COD & cards' },
  { icon: 'local_shipping', title: 'Nationwide Delivery', desc: 'Free shipping over \u09F3999. 64 districts' },
  { icon: 'assignment_return', title: 'Easy Returns', desc: '7-day return & exchange. No questions' },
  { icon: 'verified', title: 'Verified Sellers', desc: '100% authentic products. Brand warranty' },
];

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* ───── Trust Section ───── */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="app-container py-5 md:py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {trustItems.map((item) => (
              <div key={item.title} className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary text-lg mt-0.5 shrink-0">{item.icon}</span>
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900">{item.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ───── Newsletter ───── */}
      <div className="border-b border-gray-100">
        <div className="app-container py-5 md:py-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-700 px-6 py-6 md:py-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_45%)]" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
              <div className="text-center lg:text-left">
                <h2 className="text-lg sm:text-xl font-bold text-white">Stay in the Loop</h2>
                <p className="mt-1 text-sm text-emerald-100">Exclusive deals, launches & offers.</p>
              </div>
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-200" size={16} />
                  <input
                    type="email"
                    placeholder="Email address"
                    className="h-11 w-full min-w-[220px] rounded-full border border-white/15 bg-white/10 pl-10 pr-4 text-white text-sm placeholder:text-emerald-100/70 outline-none backdrop-blur-xl focus:ring-2 focus:ring-white/20"
                  />
                </div>
                <button
                  type="submit"
                  className="group h-11 rounded-full bg-white px-6 font-semibold text-emerald-700 text-sm whitespace-nowrap hover:bg-emerald-50 transition-colors inline-flex items-center gap-1.5 justify-center"
                >
                  Subscribe
                  <ArrowRight size={15} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ───── Main Grid + Bottom ───── */}
      <div className="border-b border-gray-100">
        <div className="app-container py-5 md:py-6 lg:py-8">
          <NewFooter />
        </div>
      </div>
    </footer>
  );
}

export { Footer };
