import Link from 'next/link';

export const metadata = {
  title: 'Seller Policy - AmarShop',
  description: 'AmarShop seller policies, guidelines, and requirements for selling on our platform.',
};

export default function SellerPolicyPage() {
  return (
    <div className="px-container-margin pt-md space-y-md pb-24">
      <nav className="flex items-center gap-1 text-xs text-secondary">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface">Seller Policy</span>
      </nav>
      <h1 className="font-headline-md text-headline-md">Seller Policy</h1>
      <div className="max-w-3xl text-secondary text-sm leading-relaxed space-y-4">
        <p>Our seller policies ensure a fair, transparent, and reliable marketplace for everyone. Review the guidelines before listing your products.</p>
        <p>Full seller policy coming soon.</p>
      </div>
    </div>
  );
}
