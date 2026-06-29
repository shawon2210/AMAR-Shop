'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for auth logic
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80dvh] px-container-margin">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-xl p-lg shadow-sm">
        <div className="text-center mb-lg">
          <h1 className="font-display-lg-mobile text-display-lg-mobile text-primary mb-1">Welcome Back</h1>
          <p className="text-sm text-secondary">Sign in to your AmarShop account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-md">
          <div>
            <label className="font-label-bold text-sm block mb-1">Phone Number</label>
            <div className="flex items-center border border-outline rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary">
              <span className="px-3 py-2 bg-surface-container text-sm font-label-bold border-r border-outline">+880</span>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="flex-1 px-3 py-2 bg-transparent border-none outline-none text-sm"
                placeholder="1XXXXXXXXX"
              />
            </div>
          </div>

          <div>
            <label className="font-label-bold text-sm block mb-1">Password</label>
            <div className="flex items-center border border-outline rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="flex-1 px-3 py-2 bg-transparent border-none outline-none text-sm"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-3 text-secondary"
              >
                <span className="material-symbols-outlined text-base">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" className="rounded border-outline text-primary" />
              <span>Remember me</span>
            </label>
            <Link href="/auth/forgot-password" className="text-primary hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-on-primary font-label-bold rounded-lg hover:brightness-110 transition-all active:scale-95"
          >
            Sign In
          </button>
        </form>

        <div className="mt-md text-center text-sm">
          <span className="text-secondary">Don&apos;t have an account? </span>
          <Link href="/auth/register" className="text-primary font-label-bold hover:underline">
            Register
          </Link>
        </div>

        <div className="mt-md relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-surface-container-lowest px-2 text-secondary">Or continue with</span>
          </div>
        </div>

        <div className="mt-md grid grid-cols-2 gap-sm">
          <button className="flex items-center justify-center gap-2 py-2.5 border border-outline rounded-lg hover:bg-surface-container transition-colors text-sm">
            <span className="material-symbols-outlined text-base">call</span>
            Phone OTP
          </button>
          <button className="flex items-center justify-center gap-2 py-2.5 border border-outline rounded-lg hover:bg-surface-container transition-colors text-sm">
            <span className="material-symbols-outlined text-base">fingerprint</span>
            Fingerprint
          </button>
        </div>
      </div>
    </div>
  );
}
