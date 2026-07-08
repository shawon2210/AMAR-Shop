'use client';

import { Mail, ArrowRight } from 'lucide-react';
import { Footer as FooterGrid } from './footer/Footer';

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">

      {/* ── Newsletter ── */}
      <div className="border-b border-gray-100">
        <div className="app-container py-5 md:py-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-700 to-green-600 px-5 py-5 md:px-8 md:py-6">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_50%)]" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white leading-tight">Stay in the Loop</h3>
                <p className="text-sm text-emerald-100 mt-0.5">Exclusive deals, launches & offers — straight to your inbox.</p>
              </div>
              <form
                onSubmit={e => e.preventDefault()}
                className="flex gap-2 w-full sm:w-auto sm:min-w-[340px]"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-200 shrink-0" size={15} />
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="h-10 w-full rounded-full border border-white/20 bg-white/15 pl-9 pr-3 text-white text-sm placeholder:text-emerald-100/60 outline-none focus:ring-2 focus:ring-white/25 transition-all duration-150"
                  />
                </div>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-full bg-white text-emerald-700 font-semibold text-sm whitespace-nowrap hover:bg-emerald-50 transition-colors duration-150 inline-flex items-center gap-1.5 shrink-0"
                >
                  Subscribe <ArrowRight size={14} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main footer grid ── */}
      <div className="app-container py-6 md:py-8">
        <FooterGrid />
      </div>
    </footer>
  );
}

export { Footer };
