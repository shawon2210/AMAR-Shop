'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const register = useAuthStore(s => s.register);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) return;
    setError('');
    setLoading(true);
    try {
      await register(name, `+880${phone}`, password);
      router.push(redirectTo);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
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
              Create Account
            </h1>
            <p className="text-xs sm:text-sm text-secondary">Join AmarShop and start shopping</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {error && (
              <div className="p-3 bg-error-container text-error rounded-lg text-xs sm:text-sm">{error}</div>
            )}

            <div>
              <label className="text-xs sm:text-sm font-label-bold block mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2.5 border border-outline rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm"
                placeholder="Enter your full name"
                disabled={loading}
                required
              />
            </div>

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
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 border border-outline rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm"
                placeholder="Min. 8 characters"
                minLength={8}
                disabled={loading}
                required
              />
            </div>

            <label className="flex items-start gap-2 text-xs sm:text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-outline text-primary shrink-0"
                disabled={loading}
              />
              <span>
                I agree to the{' '}
                <Link href="/terms" className="text-primary hover:underline">Terms &amp; Conditions</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={!agreeTerms || loading}
              className="w-full py-2.5 sm:py-3 bg-primary text-on-primary font-label-bold text-xs sm:text-sm rounded-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="mt-5 sm:mt-6 text-center text-xs sm:text-sm text-secondary">
            Already have an account?{' '}
            <Link href={`/auth/login?redirect=${encodeURIComponent(redirectTo)}`} className="text-primary font-label-bold hover:underline whitespace-nowrap">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[80dvh] px-3 sm:px-4 py-6 sm:py-8">
        <div className="w-full max-w-[440px] bg-surface-container-lowest rounded-xl p-8 shadow-sm text-center">
          <span className="material-symbols-outlined animate-spin text-primary text-2xl">progress_activity</span>
          <p className="text-sm text-secondary mt-3">Loading...</p>
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
