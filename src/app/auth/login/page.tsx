'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';

const DEMO_ACCOUNTS = [
  { label: 'Admin', icon: 'admin_panel_settings', phone: '01712345678', password: 'admin123', route: '/admin/dashboard' },
  { label: 'Seller', icon: 'storefront', phone: '01711111111', password: 'seller123', route: '/seller/dashboard' },
  { label: 'Customer', icon: 'person', phone: '01700000000', password: 'customer123', route: '/account' },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const { login, logout, isAuthenticated, user } = useAuthStore();

  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEmail = identity.includes('@');
  const identityError = identity.length > 0 && !isEmail && !/^(\+?88|88)?0?1[3-9]\d{8}$/.test(identity.replace(/\s/g, ''));

  function dashboardRoute(): string {
    const s = useAuthStore.getState();
    if (s.user?.role === 'ADMIN' || s.user?.role === 'SUPER_ADMIN') return '/admin/dashboard';
    if (s.user?.isSeller || s.user?.role === 'SELLER') return '/seller/dashboard';
    return '/account';
  }

  useEffect(() => {
    if (isAuthenticated && user) router.push(dashboardRoute());
  }, [isAuthenticated, user]);

  async function handleLogin(phone: string, pw: string) {
    setLoading(true);
    setError('');
    try {
      await login(phone, pw);
      router.push(redirectTo !== '/' ? redirectTo : dashboardRoute());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (identityError) return;
    await handleLogin(identity, password);
  }

  return (
    <div className="min-h-[80dvh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[400px]">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {isAuthenticated && user && (
            <div className="p-4 bg-orange-50 border-b border-orange-100 text-center">
              <p className="text-sm text-orange-700 font-medium">Signed in as <span className="font-bold">{user.name}</span></p>
              <div className="flex justify-center gap-4 mt-2">
                <button onClick={() => router.push(dashboardRoute())} className="text-xs text-orange-600 underline">Go to dashboard</button>
                <button onClick={() => { logout(); setIdentity(''); setPassword(''); }} className="text-xs text-red-600 underline">Sign out</button>
              </div>
            </div>
          )}

          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-white text-xl">shopping_bag</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Welcome Back</h1>
              <p className="text-sm text-gray-500 mt-1">Sign in to your AmarShop account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm flex items-start gap-2 border border-red-200">
                  <span className="material-symbols-outlined text-base shrink-0 mt-0.5">error</span>
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Email or Phone</label>
                <input
                  type="text"
                  value={identity}
                  onChange={e => setIdentity(e.target.value)}
                  className={`w-full px-3.5 py-2.5 border ${identityError ? 'border-red-300' : 'border-gray-200'} rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-all`}
                  placeholder="admin@amarshop.com or 01712345678"
                  disabled={loading}
                  required
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Password</label>
                <div className="flex border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-orange-500 bg-gray-50">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-transparent border-none outline-none text-sm"
                    placeholder="Enter your password"
                    disabled={loading}
                    required
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="px-3 text-gray-400 hover:text-gray-600 flex items-center justify-center" tabIndex={-1} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
                  <input type="checkbox" className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                  Remember me
                </label>
                <Link href="/auth/forgot-password" className="text-orange-600 hover:underline font-medium">Forgot password?</Link>
              </div>

              <button type="submit" disabled={loading} className="w-full py-2.5 bg-orange-500 text-white font-semibold text-sm rounded-xl hover:bg-orange-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm">
                {loading ? <><span className="material-symbols-outlined animate-spin text-base">progress_activity</span> Signing in...</> : 'Sign In'}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-gray-500">
              No account?{' '}
              <Link href={`/auth/register?redirect=${encodeURIComponent(redirectTo)}`} className="text-orange-600 font-medium hover:underline">Register</Link>
            </p>

            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">Quick demo login</span></div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2.5">
              {DEMO_ACCOUNTS.map(acc => (
                <button key={acc.label} type="button" onClick={() => handleLogin(acc.phone, acc.password)} disabled={loading}
                  className="flex flex-col items-center gap-1.5 py-3 px-2 border border-gray-200 rounded-xl hover:bg-gray-50 active:scale-[0.97] transition-all disabled:opacity-50">
                  <span className={`material-symbols-outlined text-2xl ${acc.label === 'Admin' ? 'text-orange-500' : acc.label === 'Seller' ? 'text-emerald-600' : 'text-blue-600'}`}>{acc.icon}</span>
                  <span className="text-xs font-semibold text-gray-700">{acc.label}</span>
                  <span className="text-[9px] text-gray-400 leading-tight text-center">{acc.phone}</span>
                  <span className="text-[8px] text-gray-300 -mt-0.5">{acc.password}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80dvh] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[400px] bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <span className="material-symbols-outlined animate-spin text-orange-500 text-2xl">progress_activity</span>
          <p className="text-sm text-gray-500 mt-3">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
