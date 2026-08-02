'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import { TranslationKey } from '@/translations';

interface LinkItem {
  labelKey: TranslationKey;
  href: string;
}

interface Column {
  titleKey: TranslationKey;
  links: LinkItem[];
}

const columns: Column[] = [
  {
    titleKey: 'footer.customerCare',
    links: [
      { labelKey: 'nav.help', href: '/help' },
      { labelKey: 'footer.returnsRefunds', href: '/help/returns' },
      { labelKey: 'footer.shippingInfo', href: '/help/shipping' },
      { labelKey: 'footer.orderTracking', href: '/orders' },
      { labelKey: 'footer.paymentMethods', href: '/help/payment' },
      { labelKey: 'footer.contactUs', href: '/contact' },
    ],
  },
  {
    titleKey: 'footer.shopCategories',
    links: [
      { labelKey: 'cat.electronics', href: '/category/electronics' },
      { labelKey: 'cat.fashion', href: '/category/fashion' },
      { labelKey: 'cat.beauty', href: '/category/beauty' },
      { labelKey: 'cat.groceries', href: '/category/groceries' },
      { labelKey: 'cat.homeLiving', href: '/category/home' },
      { labelKey: 'cat.sports', href: '/category/sports' },
    ],
  },
  {
    titleKey: 'footer.sellerCenter',
    links: [
      { labelKey: 'footer.becomeSeller', href: '/seller/dashboard' },
      { labelKey: 'footer.sellerDashboard', href: '/seller/dashboard' },
      { labelKey: 'footer.sellerAnalytics', href: '/seller/analytics' },
      { labelKey: 'footer.sellerFinance', href: '/seller/finance' },
      { labelKey: 'footer.sellerPolicy', href: '/seller/policy' },
      { labelKey: 'footer.sellerSupport', href: '/support/chat' },
    ],
  },
  {
    titleKey: 'footer.company',
    links: [
      { labelKey: 'footer.aboutUs', href: '/about' },
      { labelKey: 'footer.careers', href: '/careers' },
      { labelKey: 'footer.pressMedia', href: '/press' },
      { labelKey: 'footer.blog', href: '/blog' },
      { labelKey: 'footer.termsOfService', href: '/terms' },
      { labelKey: 'footer.privacyPolicy', href: '/privacy' },
    ],
  },
];

export function FooterLinks() {
  const { t } = useLanguage();

  return (
    <>
      {columns.map((col) => (
        <div key={col.titleKey}>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-gray-100 mb-5">
            {t(col.titleKey)}
          </h3>
          <ul className="space-y-3">
            {col.links.map((link) => (
              <li key={link.labelKey}>
                <Link
                  href={link.href}
                  className="text-sm text-gray-500 dark:text-gray-400 leading-6 hover:text-primary transition-colors"
                >
                  {t(link.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
