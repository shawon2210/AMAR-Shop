import Link from 'next/link';

export const metadata = {
  title: 'About Us - AmarShop',
  description: 'Learn about AmarShop, Bangladesh\'s premium online marketplace.',
};

export default function AboutPage() {
  return (
    <div className="px-container-margin pt-md space-y-md pb-24">
      <nav className="flex items-center gap-1 text-xs text-secondary">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface">About Us</span>
      </nav>
      <h1 className="font-headline-md text-headline-md">About Us</h1>
      <div className="max-w-3xl text-secondary text-sm leading-relaxed space-y-4">
        <p>AmarShop is Bangladesh&apos;s fastest-growing online marketplace, connecting millions of buyers with trusted sellers across the country.</p>
        <p>Our mission is to make online shopping accessible, reliable, and delightful for every Bangladeshi — from Dhaka to the remotest village.</p>
        <p>Page content coming soon.</p>
      </div>
    </div>
  );
}
