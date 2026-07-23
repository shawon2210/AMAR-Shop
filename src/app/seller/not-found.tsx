import Link from 'next/link';

export default function SellerNotFound() {
  return (
    <div className="p-8 max-w-md mx-auto my-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm text-center space-y-6">
      <div className="text-6xl font-extrabold tracking-tight text-primary">
        404
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Seller Page Not Found
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          The seller module or feature page you requested could not be found.
        </p>
      </div>

      <div className="pt-2">
        <Link
          href="/seller"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-all text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          Return to Seller Portal
        </Link>
      </div>
    </div>
  );
}
