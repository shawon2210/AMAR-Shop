'use client';

import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled Admin Dashboard Error:', error);
  }, [error]);

  return (
    <div className="p-8 max-w-2xl mx-auto my-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm text-center space-y-6">
      <div className="w-14 h-14 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Admin Portal Error
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {error?.message || 'Failed to load administrative data module.'}
        </p>
      </div>

      <div className="flex justify-center gap-3 pt-2">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-all text-sm"
        >
          Reload Module
        </button>
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
  );
}
