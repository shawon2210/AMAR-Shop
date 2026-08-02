'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

interface LinkItem {
  labelKey: string;
  href: string;
}

interface Column {
  titleKey: string;
  links: LinkItem[];
}

const columns: Column[] = [
  {
    titleKey: 'footer.customerService',
    links: [
      { labelKey: 'footer.helpCenter', href: '/help' },
      { labelKey: 'footer.returnsRefundsLabel', href: '/help/returns' },
      { labelKey: 'footer.shippingInfoLabel', href: '/help/shipping' },
      { labelKey: 'footer.orderTrackingLabel', href: '/orders' },
      { labelKey: 'footer.paymentMethodsLabel', href: '/help/payment' },
      { labelKey: 'footer.contactUsLabel', href: '/contact' },
    ],
  },
  {
    titleKey: 'footer.shopCategoriesLabel',
    links: [
      { labelKey: 'footer.electronicsLabel', href: '/category/electronics' },
      { labelKey: 'footer.fashionLabel', href: '/category/fashion' },
      { labelKey: 'footer.beautyLabel', href: '/category/beauty' },
      { labelKey: 'footer.groceriesLabel', href: '/category/groceries' },
      { labelKey: 'footer.homeLivingLabel', href: '/category/home' },
      { labelKey: 'footer.sportsLabel', href: '/category/sports' },
    ],
  },
  {
    titleKey: 'footer.sellerCenterLabel',
    links: [
      { labelKey: 'footer.becomeSellerLabel', href: '/seller/dashboard' },
      { labelKey: 'footer.sellerDashboardLabel', href: '/seller/dashboard' },
      { labelKey: 'footer.sellerAnalyticsLabel', href: '/seller/analytics' },
      { labelKey: 'footer.sellerFinanceLabel', href: '/seller/finance' },
      { labelKey: 'footer.sellerPolicyLabel', href: '/seller/policy' },
      { labelKey: 'footer.sellerSupportLabel', href: '/support/chat' },
    ],
  },
  {
    titleKey: 'footer.companyLabel',
    links: [
      { labelKey: 'footer.aboutUsLabel', href: '/about' },
      { labelKey: 'footer.careersLabel', href: '/careers' },
      { labelKey: 'footer.pressMediaLabel', href: '/press' },
      { labelKey: 'footer.blogLabel', href: '/blog' },
      { labelKey: 'footer.termsLabel', href: '/terms' },
      { labelKey: 'footer.privacyLabel', href: '/privacy' },
    ],
  },
];

function AccordionItem({ titleKey, links }: Column) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full min-h-[44px] py-3 text-sm font-semibold text-gray-900"
        aria-expanded={open}
      >
        {t(titleKey as Parameters<typeof t>[0])}
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <ul className="space-y-2.5 pb-4">
          {links.map((link) => (
            <li key={link.labelKey}>
              <Link
                href={link.href}
                className="inline-flex items-center min-h-11 w-full py-1 text-sm text-gray-500 hover:text-primary transition-colors"
              >
                {t(link.labelKey as Parameters<typeof t>[0])}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function AccordionFooter() {
  return (
    <div>
      {columns.map((col) => (
        <AccordionItem key={col.titleKey} titleKey={col.titleKey} links={col.links} />
      ))}
    </div>
  );
}
