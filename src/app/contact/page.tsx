import Link from 'next/link';

export const metadata = {
  title: 'Contact Us - AmarShop',
  description: 'Get in touch with AmarShop. Customer support, business inquiries, and more.',
};

export default function ContactPage() {
  return (
    <div className="app-container py-6 space-y-6 pb-24">
      <nav className="flex items-center gap-1 text-xs text-secondary">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface">Contact Us</span>
      </nav>
      <h1 className="text-responsive-subheading font-bold">Contact Us</h1>
      <div className="max-w-3xl text-secondary text-sm leading-relaxed space-y-4">
        <p>We&apos;d love to hear from you. Whether you have a question, feedback, or business inquiry, our team is here to help.</p>
        <p>Contact form and details coming soon.</p>
      </div>
    </div>
  );
}
