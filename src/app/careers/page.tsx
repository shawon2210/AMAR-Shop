import Link from 'next/link';

export const metadata = {
  title: 'Careers - AmarShop',
  description: 'Join the AmarShop team. Explore career opportunities at Bangladesh\'s premier online marketplace.',
};

export default function CareersPage() {
  return (
    <div className="app-container py-6 space-y-6 pb-24">
      <nav className="flex items-center gap-1 text-xs text-secondary">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface">Careers</span>
      </nav>
      <h1 className="text-xl font-bold">Careers</h1>
      <div className="max-w-3xl text-secondary text-sm leading-relaxed space-y-4">
        <p>Join us in building the future of e-commerce in Bangladesh. We&apos;re always looking for passionate, talented people to grow with us.</p>
        <p>Career opportunities and application details coming soon.</p>
      </div>
    </div>
  );
}
