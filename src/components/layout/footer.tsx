'use client';

import { useState } from 'react';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { Footer as FooterGrid } from './footer/Footer';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      setEmail('');
    }
  };

  return (
    <div className="border-b border-gray-100">
      <div className="app-container py-5 md:py-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 px-5 py-6 md:px-8 md:py-7">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-white/5 blur-3xl" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                <Mail className="text-white" size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-tight">Stay in the Loop</h3>
                <p className="text-sm text-emerald-100 mt-0.5">Exclusive deals, launches & offers — straight to your inbox.</p>
              </div>
            </div>

            {submitted ? (
              <div className="flex items-center gap-2 text-white font-semibold text-sm bg-white/20 rounded-full px-5 py-2.5 sm:min-w-[340px] justify-center">
                <CheckCircle size={16} />
                You&apos;re subscribed!
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex gap-2 w-full sm:w-auto sm:min-w-[360px]"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-200 shrink-0" size={15} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="h-11 w-full rounded-full border border-white/20 bg-white/15 pl-9 pr-3 text-white text-sm placeholder:text-emerald-100/60 outline-none focus:ring-2 focus:ring-white/30 transition-all duration-150"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="h-11 px-5 rounded-full bg-white text-emerald-700 font-bold text-sm whitespace-nowrap hover:bg-emerald-50 hover:shadow-lg transition-all duration-150 inline-flex items-center gap-1.5 shrink-0"
                >
                  Subscribe <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <Newsletter />
      <div className="app-container py-8 md:py-10">
        <FooterGrid />
      </div>
    </footer>
  );
}

export { Footer };
