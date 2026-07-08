import Link from 'next/link';

export const metadata = {
  title: 'Sitemap - AmarShop',
  description: 'Browse all pages and categories on AmarShop.',
};

export default function SitemapPage() {
  return (
    <div className="app-container py-6 space-y-6 pb-24">
      <nav className="flex items-center gap-1 text-xs text-secondary">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface">Sitemap</span>
      </nav>
      <h1 className="text-xl font-bold">Sitemap</h1>
      <div className="max-w-3xl text-secondary text-sm leading-relaxed space-y-4">
        <p>Explore all pages and categories on AmarShop. Use this sitemap to quickly find what you&apos;re looking for.</p>
        <p>Full sitemap coming soon.</p>
      </div>
    </div>
  );
}
