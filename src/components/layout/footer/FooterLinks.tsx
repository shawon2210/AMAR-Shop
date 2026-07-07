import Link from 'next/link';

interface LinkItem {
  label: string;
  href: string;
}

interface Column {
  title: string;
  links: LinkItem[];
}

const columns: Column[] = [
  {
    title: 'Customer Service',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Returns & Refunds', href: '/help/returns' },
      { label: 'Shipping Info', href: '/help/shipping' },
      { label: 'Order Tracking', href: '/orders' },
      { label: 'Payment Methods', href: '/help/payment' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Shop Categories',
    links: [
      { label: 'Electronics', href: '/category/electronics' },
      { label: 'Fashion', href: '/category/fashion' },
      { label: 'Beauty', href: '/category/beauty' },
      { label: 'Groceries', href: '/category/groceries' },
      { label: 'Home & Living', href: '/category/home' },
      { label: 'Sports', href: '/category/sports' },
    ],
  },
  {
    title: 'Seller Center',
    links: [
      { label: 'Become a Seller', href: '/seller/dashboard' },
      { label: 'Seller Dashboard', href: '/seller/dashboard' },
      { label: 'Seller Analytics', href: '/seller/analytics' },
      { label: 'Seller Finance', href: '/seller/finance' },
      { label: 'Seller Policy', href: '/seller/policy' },
      { label: 'Seller Support', href: '/support/chat' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press & Media', href: '/press' },
      { label: 'Blog', href: '/blog' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  },
];

export function FooterLinks() {
  return (
    <>
      {columns.map((col) => (
        <div key={col.title}>
          <h3 className="text-[15px] font-bold uppercase tracking-[0.05em] text-gray-900 mb-[22px]">
            {col.title}
          </h3>
          <ul className="space-y-[14px]">
            {col.links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-[15px] text-gray-600 hover:text-primary hover:translate-x-[3px] inline-block transition-all duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
