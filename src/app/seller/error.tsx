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

      {process.env.NODE_ENV === 'development' && (error?.stack || error?.digest) && (
        <details className="mt-4 text-left border-t border-gray-100 dark:border-gray-800 pt-3">
          <summary className="cursor-pointer text-xs font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            Debug Details {error?.digest && `(Digest: ${error.digest})`}
          </summary>
          <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-950 rounded-lg overflow-x-auto text-[11px] font-mono text-red-600 dark:text-red-400 max-h-48">
            {error?.stack}
          </pre>
        </details>
      )}
    </div>
  );
}
