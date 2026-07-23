'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function AccountError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Account route error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gray-50/50 dark:bg-gray-950">
      <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Account Error
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {error?.message || 'An unexpected error occurred while loading your account details.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            Back to Home
          </Link>
        </div>

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
    </div>
  );
}
