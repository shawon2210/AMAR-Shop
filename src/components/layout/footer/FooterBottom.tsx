import Link from 'next/link';

export function FooterBottom() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        100% Secure Payment
      </div>

      <p className="text-xs text-gray-400 text-center">
        &copy; {new Date().getFullYear()} AmarShop. All rights reserved.
      </p>

      <div className="flex items-center gap-4 text-xs text-gray-400">
        <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
        <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
        <Link href="/support/chat" className="hover:text-primary transition-colors">Support</Link>
        <Link href="/orders" className="hover:text-primary transition-colors">Track Order</Link>
      </div>
    </div>
  );
}
