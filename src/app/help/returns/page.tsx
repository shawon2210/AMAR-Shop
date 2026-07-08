import Link from 'next/link';

export const metadata = {
  title: 'Returns & Refunds - AmarShop Help',
  description: 'Learn about AmarShop\'s return policy, return process, and refund conditions.',
};

export default function HelpReturnsPage() {
  return (
    <div className="px-container-margin pt-md space-y-md pb-24">
      <nav className="flex items-center gap-1 text-xs text-secondary">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <Link href="/help" className="hover:text-primary">Help</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface">Returns &amp; Refunds</span>
      </nav>
      <h1 className="font-headline-md text-headline-md">Returns &amp; Refunds</h1>
      <div className="max-w-3xl text-secondary text-sm leading-relaxed space-y-4">
        <p>Learn about our return policy, how to initiate a return, and how refunds are processed.</p>
        <p>You can return items within 7 days of delivery for a full refund. Items must be unused with original packaging.</p>
        <p>Detailed return guide coming soon.</p>
      </div>
    </div>
  );
}
