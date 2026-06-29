'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for registration logic
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80dvh] px-container-margin py-lg">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-xl p-lg shadow-sm">
        <div className="text-center mb-lg">
          <h1 className="font-display-lg-mobile text-display-lg-mobile text-primary mb-1">Create Account</h1>
          <p className="text-sm text-secondary">Join AmarShop and start shopping</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-md">
          <div>
            <label className="font-label-bold text-sm block mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-outline rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-primary text-sm"
              placeholder="Enter your full name"
              required
            />
          </div>

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
                required
              />
            </div>
          </div>

          <div>
            <label className="font-label-bold text-sm block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-outline rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-primary text-sm"
              placeholder="Min. 8 characters"
              minLength={8}
              required
            />
          </div>

          <div className="flex items-start gap-1.5 text-sm">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={e => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded border-outline text-primary"
            />
            <label>
              I agree to the{' '}
              <Link href="/terms" className="text-primary hover:underline">Terms & Conditions</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={!agreeTerms}
            className="w-full py-3 bg-primary text-on-primary font-label-bold rounded-lg hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Account
          </button>
        </form>

        <div className="mt-md text-center text-sm">
          <span className="text-secondary">Already have an account? </span>
          <Link href="/auth/login" className="text-primary font-label-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
