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
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEmail = identity.includes('@');
  const identityError =
    identity.length > 0 && !isEmail && !/^(\+?88)?01[3-9]\d{8}$/.test(identity)
      ? 'Enter a valid email or Bangladeshi phone number'
      : '';
  const passwordError =
    password.length > 0 && password.length < 6
      ? 'Password must be at least 6 characters'
      : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (identityError || passwordError) return;
    setLoading(true);
    try {
      await login(identity, password);
      if (redirectTo !== '/') {
        router.push(redirectTo);
      } else {
        const state = useAuthStore.getState();
        if (state.user?.role === 'ADMIN' || state.user?.role === 'SUPER_ADMIN') {
          router.push('/admin/dashboard');
        } else {
          router.push('/account');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (typeof window !== 'undefined' && isAuthenticated) {
    const state = useAuthStore.getState();
    if (state.user?.role === 'ADMIN' || state.user?.role === 'SUPER_ADMIN') {
      router.push('/admin/dashboard');
    } else {
      router.push('/account');
    }
    return null;
  }

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

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
            {error && (
              <div className="p-3 bg-error-container text-error rounded-lg text-xs sm:text-sm flex items-start gap-2">
                <span className="material-symbols-outlined text-base shrink-0">error</span>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="text-xs sm:text-sm font-label-bold block mb-1.5">
                Email or Phone Number
              </label>
              <input
                type="text"
                value={identity}
                onChange={e => setIdentity(e.target.value)}
                className={`w-full px-3 py-2.5 border ${identityError ? 'border-error' : 'border-outline'} rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm`}
                placeholder="admin@amarshop.com or 01712345678"
                disabled={loading}
                required
                autoComplete="username"
                inputMode={identity.includes('@') ? 'email' : 'tel'}
              />
              {identityError && (
                <p className="text-error text-[10px] mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">info</span>
                  {identityError}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs sm:text-sm font-label-bold block mb-1.5">Password</label>
              <div className={`grid grid-cols-[1fr_auto] border ${passwordError ? 'border-error' : 'border-outline'} rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-transparent border-none outline-none text-xs sm:text-sm"
                  placeholder="Enter your password"
                  disabled={loading}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-3 text-secondary flex items-center justify-center"
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined text-base sm:text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {passwordError && (
                <p className="text-error text-[10px] mt-1">{passwordError}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-outline text-primary"
                />
                Remember me
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs sm:text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading || !!identityError || !!passwordError}
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
            <Link
              href={`/auth/register?redirect=${encodeURIComponent(redirectTo)}`}
              className="text-primary font-label-bold hover:underline whitespace-nowrap"
            >
              Register
            </Link>
          </p>

          <div className="mt-5 sm:mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface-container-lowest px-2 text-[10px] sm:text-xs text-secondary">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => { setIdentity('01712345678'); setPassword('admin123'); }}
              className="flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 border border-outline rounded-lg hover:bg-surface-container transition-colors text-[11px] sm:text-sm"
            >
              <span className="material-symbols-outlined text-sm sm:text-base">admin_panel_settings</span>
              <span className="whitespace-nowrap">Demo Admin</span>
            </button>
            <button
              type="button"
              onClick={() => { setIdentity('01700000000'); setPassword('customer123'); }}
              className="flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 border border-outline rounded-lg hover:bg-surface-container transition-colors text-[11px] sm:text-sm"
            >
              <span className="material-symbols-outlined text-sm sm:text-base">person</span>
              <span className="whitespace-nowrap">Demo Customer</span>
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
