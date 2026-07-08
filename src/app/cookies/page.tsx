import Link from 'next/link';

export const metadata = {
  title: 'Cookie Policy - AmarShop',
  description: 'How AmarShop uses cookies and similar technologies on our platform.',
};

export default function CookiesPage() {
  return (
    <div className="px-container-margin pt-md space-y-md pb-24">
      <nav className="flex items-center gap-1 text-xs text-secondary">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface">Cookie Policy</span>
      </nav>
      <h1 className="font-headline-md text-headline-md">Cookie Policy</h1>
      <div className="max-w-3xl text-secondary text-sm leading-relaxed space-y-4">
        <p>AmarShop uses cookies to enhance your browsing experience, analyze site traffic, and serve personalised content and advertisements.</p>
        <p>Full cookie policy coming soon.</p>
      </div>
    </div>
  );
}
