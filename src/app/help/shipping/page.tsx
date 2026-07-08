import Link from 'next/link';

export const metadata = {
  title: 'Shipping Information - AmarShop Help',
  description: 'Learn about AmarShop delivery times, shipping fees, and order tracking.',
};

export default function HelpShippingPage() {
  return (
    <div className="px-container-margin pt-md space-y-md pb-24">
      <nav className="flex items-center gap-1 text-xs text-secondary">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <Link href="/help" className="hover:text-primary">Help</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface">Shipping Information</span>
      </nav>
      <h1 className="font-headline-md text-headline-md">Shipping Information</h1>
      <div className="max-w-3xl text-secondary text-sm leading-relaxed space-y-4">
        <p>Standard delivery takes 3–7 business days within Dhaka and 5–12 business days for other regions. Express delivery is available in select areas.</p>
        <p>Detailed shipping guide coming soon.</p>
      </div>
    </div>
  );
}
