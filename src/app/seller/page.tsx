'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SellerPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/seller/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
        <p className="text-sm text-on-surface-variant mt-3">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}