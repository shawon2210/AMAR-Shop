import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80dvh] px-4 py-8">
      <div className="w-full max-w-md text-center">
        <span className="material-symbols-outlined text-6xl sm:text-7xl text-red-400 mb-4 inline-block">gpp_bad</span>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">
          You do not have the required permissions to view this page. If you believe this is a mistake, please contact support.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors text-center"
          >
            Go Home
          </Link>
          <Link
            href="/auth/login"
            className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors text-center"
          >
            Switch Account
          </Link>
        </div>
      </div>
    </div>
  );
}