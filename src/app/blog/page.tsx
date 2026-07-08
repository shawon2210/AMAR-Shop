import Link from 'next/link';

export const metadata = {
  title: 'Blog - AmarShop',
  description: 'Read the latest articles, tips, and news from AmarShop.',
};

export default function BlogPage() {
  return (
    <div className="app-container py-6 space-y-6 pb-24">
      <nav className="flex items-center gap-1 text-xs text-secondary">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface">Blog</span>
      </nav>
      <h1 className="text-xl font-bold">Blog</h1>
      <div className="max-w-3xl text-secondary text-sm leading-relaxed space-y-4">
        <p>Discover shopping tips, product guides, and the latest updates from the AmarShop team.</p>
        <p>Blog posts coming soon.</p>
      </div>
    </div>
  );
}
