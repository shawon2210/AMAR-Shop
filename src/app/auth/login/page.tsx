'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const login = useAuthStore(s => s.login);

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(`+880${phone}`, password);
      router.push(redirectTo);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80dvh] px-3 sm:px-4 py-6 sm:py-8">
      <div className="w-full max-w-[440px] bg-surface-container-lowest rounded-xl shadow-sm">
        <div className="p-5 sm:p-6 md:p-8">
          <div className="text-center mb-5 sm:mb-6">
            <h1 className="text-xl sm:text-2xl md:text-[28px] font-bold text-primary mb-1 leading-tight text-balance">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-secondary">Sign in to your AmarShop account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {error && (
              <div className="p-3 bg-error-container text-error rounded-lg text-xs sm:text-sm">{error}</div>
            )}

            <div>
              <label className="text-xs sm:text-sm font-label-bold block mb-1.5">Phone Number</label>
              <div className="grid grid-cols-[auto_1fr] border border-outline rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary">
                <span className="px-3 py-2.5 bg-surface-container text-xs sm:text-sm font-label-bold border-r border-outline whitespace-nowrap">+880</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-transparent border-none outline-none text-xs sm:text-sm"
                  placeholder="1XXXXXXXXX"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs sm:text-sm font-label-bold block mb-1.5">Password</label>
              <div className="grid grid-cols-[1fr_auto] border border-outline rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-transparent border-none outline-none text-xs sm:text-sm"
                  placeholder="Enter your password"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-3 text-secondary flex items-center justify-center"
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
              className="w-full py-2.5 sm:py-3 bg-primary text-on-primary font-label-bold text-xs sm:text-sm rounded-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="mt-5 sm:mt-6 text-center text-xs sm:text-sm text-secondary">
            Don&apos;t have an account?{' '}
            <Link href={`/auth/register?redirect=${encodeURIComponent(redirectTo)}`} className="text-primary font-label-bold hover:underline whitespace-nowrap">
              Register
            </Link>
          </p>

          <div className="mt-5 sm:mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface-container-lowest px-2 text-[10px] sm:text-xs text-secondary">Or continue with</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
            <button className="flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 border border-outline rounded-lg hover:bg-surface-container transition-colors text-[11px] sm:text-sm">
              <span className="material-symbols-outlined text-sm sm:text-base">call</span>
              <span className="whitespace-nowrap">Phone OTP</span>
            </button>
            <button className="flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 border border-outline rounded-lg hover:bg-surface-container transition-colors text-[11px] sm:text-sm">
              <span className="material-symbols-outlined text-sm sm:text-base">fingerprint</span>
              <span className="whitespace-nowrap">Fingerprint</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[80dvh] px-3 sm:px-4 py-6 sm:py-8">
        <div className="w-full max-w-[440px] bg-surface-container-lowest rounded-xl p-8 shadow-sm text-center">
          <span className="material-symbols-outlined animate-spin text-primary text-2xl">progress_activity</span>
          <p className="text-sm text-secondary mt-3">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
