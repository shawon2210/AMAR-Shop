import Link from 'next/link';

export const metadata = {
  title: 'Press - AmarShop',
  description: 'Press resources, media kit, and news about AmarShop.',
};

export default function PressPage() {
  return (
    <div className="px-container-margin pt-md space-y-md pb-24">
      <nav className="flex items-center gap-1 text-xs text-secondary">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface">Press</span>
      </nav>
      <h1 className="font-headline-md text-headline-md">Press</h1>
      <div className="max-w-3xl text-secondary text-sm leading-relaxed space-y-4">
        <p>Welcome to the AmarShop Press Room. Find the latest news, media resources, and company announcements.</p>
        <p>Press materials and media kit coming soon.</p>
      </div>
    </div>
  );
}
