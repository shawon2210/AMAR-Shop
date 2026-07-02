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
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const nameError = name.length > 0 && name.length < 2 ? 'Name must be at least 2 characters' : '';
  const emailError =
    email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? 'Enter a valid email address'
      : '';
  const phoneError =
    phone.length > 0 && !/^(\+?88)?01[3-9]\d{8}$/.test(phone)
      ? 'Enter a valid Bangladeshi phone number (01XXXXXXXXX)'
      : '';
  const passwordError =
    password.length > 0 && password.length < 8
      ? 'Password must be at least 8 characters'
      : '';
  const confirmError =
    confirmPassword.length > 0 && password !== confirmPassword
      ? 'Passwords do not match'
      : '';

  const passwordStrength =
    password.length >= 8
      ? /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)
        ? 'strong'
        : /[A-Z]/.test(password) || /[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)
          ? 'medium'
          : 'weak'
      : password.length > 0
        ? 'weak'
        : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (nameError || emailError || phoneError || passwordError || confirmError) return;
    if (!agreeTerms) {
      setError('You must agree to the Terms & Conditions');
      return;
    }
    setLoading(true);
    try {
      await register({
        name,
        email: email || undefined,
        phone: `+880${phone.replace(/^(\+?88|0)/, '')}`,
        password,
      });
      setSuccess('Account created successfully!');
      setTimeout(() => {
        const state = useAuthStore.getState();
        if (state.user?.role === 'ADMIN' || state.user?.role === 'SUPER_ADMIN') {
          router.push('/admin/dashboard');
        } else {
          router.push(redirectTo === '/' ? '/account' : redirectTo);
        }
      }, 500);
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

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4" noValidate>
            {error && (
              <div className="p-3 bg-error-container text-error rounded-lg text-xs sm:text-sm flex items-start gap-2">
                <span className="material-symbols-outlined text-base shrink-0">error</span>
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="p-3 bg-tertiary-container text-tertiary rounded-lg text-xs sm:text-sm flex items-start gap-2">
                <span className="material-symbols-outlined text-base shrink-0">check_circle</span>
                <span>{success}</span>
              </div>
            )}

            <div>
              <label className="text-xs sm:text-sm font-label-bold block mb-1.5">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className={`w-full px-3 py-2.5 border ${nameError ? 'border-error' : 'border-outline'} rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm`}
                placeholder="John Doe"
                disabled={loading}
                required
                autoComplete="name"
              />
              {nameError && <p className="text-error text-[10px] mt-1">{nameError}</p>}
            </div>

            <div>
              <label className="text-xs sm:text-sm font-label-bold block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={`w-full px-3 py-2.5 border ${emailError ? 'border-error' : 'border-outline'} rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm`}
                placeholder="john@example.com"
                disabled={loading}
                autoComplete="email"
              />
              {emailError && <p className="text-error text-[10px] mt-1">{emailError}</p>}
            </div>

            <div>
              <label className="text-xs sm:text-sm font-label-bold block mb-1.5">Phone Number *</label>
              <div className={`grid grid-cols-[auto_1fr] border ${phoneError ? 'border-error' : 'border-outline'} rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary`}>
                <span className="px-3 py-2.5 bg-surface-container text-xs sm:text-sm font-label-bold border-r border-outline whitespace-nowrap">+880</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-transparent border-none outline-none text-xs sm:text-sm"
                  placeholder="1XXXXXXXXX"
                  disabled={loading}
                  required
                  autoComplete="tel"
                />
              </div>
              {phoneError && <p className="text-error text-[10px] mt-1">{phoneError}</p>}
            </div>

            <div>
              <label className="text-xs sm:text-sm font-label-bold block mb-1.5">Password *</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`w-full px-3 py-2.5 border ${passwordError ? 'border-error' : 'border-outline'} rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm`}
                placeholder="Min. 8 characters"
                minLength={8}
                disabled={loading}
                required
                autoComplete="new-password"
              />
              {passwordError && <p className="text-error text-[10px] mt-1">{passwordError}</p>}
              {passwordStrength && (
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {['weak', 'medium', 'strong'].map(level => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          (level === 'weak' && (passwordStrength === 'weak' || passwordStrength === 'medium' || passwordStrength === 'strong')) ||
                          (level === 'medium' && (passwordStrength === 'medium' || passwordStrength === 'strong')) ||
                          (level === 'strong' && passwordStrength === 'strong')
                            ? passwordStrength === 'strong'
                              ? 'bg-tertiary'
                              : passwordStrength === 'medium'
                                ? 'bg-warning'
                                : 'bg-error'
                            : 'bg-outline-variant'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-[10px] capitalize ${
                    passwordStrength === 'strong' ? 'text-tertiary' : passwordStrength === 'medium' ? 'text-warning' : 'text-error'
                  }`}>
                    {passwordStrength}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs sm:text-sm font-label-bold block mb-1.5">Confirm Password *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className={`w-full px-3 py-2.5 border ${confirmError ? 'border-error' : 'border-outline'} rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm`}
                placeholder="Re-enter your password"
                disabled={loading}
                required
                autoComplete="new-password"
              />
              {confirmError && <p className="text-error text-[10px] mt-1">{confirmError}</p>}
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
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> *
              </span>
            </label>

            <button
              type="submit"
              disabled={!agreeTerms || loading || !!nameError || !!emailError || !!phoneError || !!passwordError || !!confirmError}
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
