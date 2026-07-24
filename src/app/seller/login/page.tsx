'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams, redirect } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { getErrorMessage } from '@/lib/error-helper';

function SellerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/seller/dashboard';
  const login = useAuthStore((s) => s.login);
  const user = useAuthStore((s) => s.user);

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) {
    if (user.role === 'SELLER' || user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      redirect(user.role === 'SELLER' ? '/seller/dashboard' : redirectTo);
    } else {
      redirect('/');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(`+880${phone}`, password);
      const role = useAuthStore.getState().user?.role;
      const sellerMeta = useAuthStore.getState().user as any;
      if (role !== 'SELLER' && role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
        useAuthStore.getState().logout();
        setError('Access denied. Seller credentials required.');
        setLoading(false);
        return;
      }
      if (role === 'SELLER' && !sellerMeta?.isSeller) {
        useAuthStore.getState().logout();
        setError('This account is not registered as a seller. Please contact support.');
        setLoading(false);
        return;
      }
      router.push(role === 'SELLER' ? '/seller/dashboard' : redirectTo);
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80dvh] px-3 sm:px-4 py-6 sm:py-8 bg-linear-to-br from-[#0b1a1a] via-[#0a1818] to-[#071212]">
      <div className="w-full max-w-440px">
        <div className="p-5 sm:p-6 md:p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/0.06 shadow-2xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/25">
                <span className="material-symbols-outlined text-white text-2xl sm:text-[28px]">storefront</span>
              </div>
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 leading-tight">
              Seller Center
            </h1>
            <p className="text-xs sm:text-sm text-white/50">Sign in with your seller account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 text-red-400 rounded-lg text-xs sm:text-sm flex items-start gap-2 border border-red-500/20">
                <span className="material-symbols-outlined text-base shrink-0">error</span>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="text-xs sm:text-sm font-medium block mb-1.5 text-white/70">Phone Number</label>
              <div className="grid grid-cols-[auto_1fr] border border-white/0.08 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 bg-white/0.04">
                <span className="px-3 py-2.5 sm:py-3 bg-white/0.06 text-xs sm:text-sm font-medium border-r border-white/0.08 text-white/50">+880</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 sm:py-3 bg-transparent border-none outline-none text-xs sm:text-sm text-white placeholder:text-white/20"
                  placeholder="1XXXXXXXXX"
                  disabled={loading}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="text-xs sm:text-sm font-medium block mb-1.5 text-white/70">Password</label>
              <div className="grid grid-cols-[1fr_auto] border border-white/0.08 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 bg-white/0.04">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 sm:py-3 bg-transparent border-none outline-none text-xs sm:text-sm text-white placeholder:text-white/20"
                  placeholder="Enter your password"
                  disabled={loading}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-3 text-white/40 hover:text-white/70 flex items-center justify-center"
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined text-base sm:text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3 bg-teal-600 text-white font-semibold text-xs sm:text-sm rounded-xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                  Signing in...
                </>
              ) : (
                'Sign In to Seller Center'
              )}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/0.06">
            <p className="text-center text-[10px] sm:text-xs text-white/30">
              Seller account required
            </p>
            <p className="text-center text-[10px] sm:text-xs text-white/20 mt-2">
              <a href="/auth/login" className="text-teal-400/60 hover:text-teal-400 transition-colors">Back to general login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SellerLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[80dvh] px-3 sm:px-4 py-6 sm:py-8 bg-linear-to-br from-[#0b1a1a] via-[#0a1818] to-[#071212]">
        <div className="w-full max-w-440px bg-white/0.03 backdrop-blur-sm rounded-2xl border border-white/0.06 p-8 text-center">
          <span className="material-symbols-outlined animate-spin text-teal-500 text-2xl">progress_activity</span>
          <p className="text-sm text-white/50 mt-3">Loading...</p>
        </div>
      </div>
    }>
      <SellerLoginForm />
    </Suspense>
  );
}