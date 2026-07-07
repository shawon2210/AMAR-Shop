import Link from 'next/link';

export function FooterBottom() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm text-gray-400 text-center sm:text-left">
        &copy; {new Date().getFullYear()} AmarShop. All rights reserved.
      </p>
      <div className="flex flex-wrap justify-center gap-5 text-sm text-gray-400">
        <Link href="/terms" className="hover:text-primary transition-colors duration-200">Terms</Link>
        <Link href="/privacy" className="hover:text-primary transition-colors duration-200">Privacy</Link>
        <Link href="/cookies" className="hover:text-primary transition-colors duration-200">Cookies</Link>
        <Link href="/sitemap" className="hover:text-primary transition-colors duration-200">Sitemap</Link>
      </div>
    </div>
  );
}
