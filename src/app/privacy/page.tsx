import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - AmarShop',
  description: 'AmarShop privacy policy — how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="px-container-margin pt-md space-y-md pb-24">
      <nav className="flex items-center gap-1 text-xs text-secondary">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface">Privacy Policy</span>
      </nav>
      <h1 className="font-headline-md text-headline-md">Privacy Policy</h1>
      <div className="max-w-3xl text-secondary text-sm leading-relaxed space-y-4">
        <p>Your privacy matters to us. This policy outlines how AmarShop collects, uses, stores, and protects your personal data when you use our platform.</p>
        <p>Full privacy policy coming soon.</p>
      </div>
    </div>
  );
}
