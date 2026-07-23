'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function CartError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Cart route error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gray-50/50 dark:bg-gray-950">
      <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Something Went Wrong</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {error?.message || 'An unexpected error occurred while loading your cart.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Try Again
          </button>
          <Link href="/" className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
            Back to Home
          </Link>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-500">Show Details</summary>
            <pre className="mt-2 whitespace-pre-wrap text-xs text-gray-600 dark:text-gray-400">{error?.stack}</pre>
          </details>
        )}
      </div>
    </div>
  );
}
