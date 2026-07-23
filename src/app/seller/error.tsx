'use client';

import { useEffect } from 'react';

export default function SellerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled Seller Dashboard Error:', error);
  }, [error]);

  return (
    <div className="p-8 max-w-xl mx-auto my-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm text-center space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        Seller Portal Error
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {error?.message || 'An error occurred while loading your seller panel.'}
      </p>
      <button
        onClick={() => reset()}
        className="px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-all text-sm"
      >
        Retry
      </button>
    </div>
  );
}
