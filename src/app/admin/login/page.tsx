'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

export default function AdminLoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const user = useAuthStore((s) => s.user);

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) {
    if (user.role === 'ADMIN') {
      router.replace('/admin');
    } else {
      router.replace('/');
    }
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(`+880${phone}`, password);
      const stored = localStorage.getItem('amarshop-auth');
      let role = '';
      if (stored) {
        const parsed = JSON.parse(stored);
        role = parsed?.state?.user?.role || '';
      }
      if (role !== 'ADMIN') {
        useAuthStore.getState().logout();
        setError('Access denied. Admin credentials required.');
        setLoading(false);
        return;
      }
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a2e] px-4">
      <div className="w-full max-w-[400px] bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <img src="/images/amarshop-logo.png" alt="AmarShop" className="h-32 md:h-36 w-auto object-contain" />
          </div>
          <h1 className="text-lg font-semibold text-[#333]">Admin Panel</h1>
          <p className="text-sm text-[#888] mt-1">Sign in with admin credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium block mb-1.5 text-[#555]">Phone Number</label>
            <div className="grid grid-cols-[auto_1fr] border border-[#ddd] rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary">
              <span className="px-3 py-2.5 bg-[#f5f5f5] text-sm font-medium border-r border-[#ddd] text-[#555]">+880</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 bg-transparent border-none outline-none text-sm"
                placeholder="1XXXXXXXXX"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5 text-[#555]">Password</label>
            <div className="grid grid-cols-[1fr_auto] border border-[#ddd] rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 bg-transparent border-none outline-none text-sm"
                placeholder="Enter your password"
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-3 text-[#888] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-base">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-on-primary font-medium text-sm rounded-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                Signing in...
              </>
            ) : (
              'Sign In to Admin'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#888]">
          Protected area — admin access only
        </p>
      </div>
    </div>
  );
}
