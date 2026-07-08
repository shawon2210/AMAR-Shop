import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions - AmarShop',
  description: 'AmarShop terms and conditions governing the use of our marketplace platform.',
};

export default function TermsPage() {
  return (
    <div className="app-container py-6 space-y-6 pb-24">
      <nav className="flex items-center gap-1 text-xs text-secondary">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface">Terms &amp; Conditions</span>
      </nav>
      <h1 className="text-xl font-bold">Terms &amp; Conditions</h1>
      <div className="max-w-3xl text-secondary text-sm leading-relaxed space-y-4">
        <p>These terms and conditions govern your use of the AmarShop platform. By using our services, you agree to these terms.</p>
        <p>Full terms and conditions coming soon.</p>
      </div>
    </div>
  );
}
