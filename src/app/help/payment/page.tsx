import Link from 'next/link';

export const metadata = {
  title: 'Payment Options - AmarShop Help',
  description: 'Learn about payment methods available on AmarShop — bKash, Nagad, COD, and cards.',
};

export default function HelpPaymentPage() {
  return (
    <div className="app-container py-6 space-y-6 pb-24">
      <nav className="flex items-center gap-1 text-xs text-secondary">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <Link href="/help" className="hover:text-primary">Help</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface">Payment Options</span>
      </nav>
      <h1 className="text-xl font-bold">Payment Options</h1>
      <div className="max-w-3xl text-secondary text-sm leading-relaxed space-y-4">
        <p>AmarShop accepts bKash, Nagad, Cash on Delivery (COD), and SSLCommerz (Visa/Mastercard). All transactions are secure and encrypted.</p>
        <p>Detailed payment guide coming soon.</p>
      </div>
    </div>
  );
}
