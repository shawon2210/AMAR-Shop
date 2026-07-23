import Link from 'next/link';

export const metadata = {
  title: 'Seller Policy - AmarShop',
  description: 'AmarShop seller policies, guidelines, and requirements for selling on our platform.',
};

const policySections = [
  {
    id: 'eligibility',
    title: 'Eligibility & Registration',
    icon: 'assignment_ind',
    content: [
      'To register as a seller on AmarShop, you must be a legally registered business entity or an individual seller with a valid Tax Identification Number (TIN) or Business Identification Number (BIN) issued by the Government of Bangladesh.',
      'All sellers must provide accurate and complete information during registration, including legal business name, address, contact details, bank account information for settlements, and valid trade license where applicable.',
      'AmarShop reserves the right to verify submitted documents through third-party verification services. Any falsified information will result in immediate rejection or account suspension.',
      'Each seller is permitted to operate one store account unless prior written approval is obtained for multiple stores.',
      'Registration is subject to approval by AmarShop&apos;s seller onboarding team. The process typically takes 3–5 business days.',
    ],
  },
  {
    id: 'listing',
    title: 'Product Listing Guidelines',
    icon: 'inventory_2',
    content: [
      'All product listings must include accurate, clear, and truthful information including product title, description, specifications, high-quality images (minimum 800x800 px), and price in Bangladeshi Taka (BDT).',
      'Product titles must not exceed 150 characters and should clearly describe the product without keyword stuffing or promotional text.',
      'Sellers must assign products to the correct categories and subcategories. Mis-categorisation may result in listing removal.',
      'Each SKU must have a unique product identifier. Duplicate listings for the same product are prohibited.',
      'Listings must include accurate stock quantities. AmarShop may delist products that are consistently out of stock for more than 30 days.',
      'All prices must be all-inclusive of applicable VAT and taxes. Sellers may not display contact information, external links, or watermarks on product images.',
    ],
  },
  {
    id: 'prohibited',
    title: 'Prohibited Items',
    icon: 'gavel',
    content: [
      'The following items are strictly prohibited from being listed on AmarShop: counterfeit or replica goods, illegal drugs and paraphernalia, weapons and explosives, alcohol and tobacco products (unless licensed), prescription medications, adult content, stolen goods, hazardous materials, and any items that infringe on intellectual property rights.',
      'AmarShop maintains a comprehensive prohibited items list which is updated periodically. Sellers are responsible for reviewing this list before listing products.',
      'Listing prohibited items will result in immediate delisting, account suspension, and potential legal action. Repeat offenders may face permanent ban from the platform.',
      'If you are unsure whether a product is permitted, contact seller support for clarification before listing.',
    ],
  },
  {
    id: 'pricing',
    title: 'Pricing & Fees',
    icon: 'payments',
    content: [
      'AmarShop operates on a commission-based fee structure. Commission rates vary by product category and are disclosed at the time of registration. Standard commission rates range from 5% to 15% of the product selling price.',
      'A listing fee of BDT 10 per SKU applies for each new product listing. Listing fees are non-refundable.',
      'Payment processing fees of 1.5% + BDT 5 per transaction are applicable on all successful orders.',
      'Sellers may be charged a late fulfillment penalty of BDT 50 per order for orders shipped after the promised delivery date.',
      'All fees are exclusive of VAT and other applicable taxes, which will be added to invoices as required by law.',
      'AmarShop reserves the right to revise fee structures with 30 days&apos; prior written notice to sellers.',
    ],
  },
  {
    id: 'fulfillment',
    title: 'Order Fulfillment',
    icon: 'local_shipping',
    content: [
      'Sellers must process and ship orders within 24–48 hours of order confirmation, unless otherwise specified in the listing.',
      'All orders must be shipped with a valid tracking number. Sellers are responsible for updating tracking information on the AmarShop platform within 24 hours of shipment.',
      'Delivery timelines must be clearly stated in each product listing. Standard domestic delivery should not exceed 5–7 business days.',
      'Sellers must use reliable courier services approved by AmarShop. A list of approved couriers is available in the seller dashboard.',
      'In case of shipping delays, sellers must proactively notify the buyer and AmarShop support within 24 hours of becoming aware of the delay.',
      'Sellers bear all shipping costs unless the listing specifies free delivery, in which case the cost is borne by the seller.',
    ],
  },
  {
    id: 'returns',
    title: 'Returns & Refunds',
    icon: 'assignment_return',
    content: [
      'Buyers may request returns within 7 days of delivery for defective, damaged, or incorrectly shipped products. Sellers must accept valid return requests within 48 hours.',
      'Refunds must be processed within 5 business days of receiving the returned product in original condition.',
      'For returns due to seller error (wrong item, defect, damage), the seller bears all return shipping costs and must process a full refund including original shipping charges.',
      'Change-of-mind returns are at the seller&apos;s discretion. If offered, the buyer may be required to pay return shipping and a restocking fee of up to 10%.',
      'AmarShop may intervene in dispute cases and issue refunds from seller accounts if the seller fails to respond within the stipulated timeframe.',
      'Sellers with high return rates (above 15%) may be subject to additional performance review and possible account restrictions.',
    ],
  },
  {
    id: 'customer-service',
    title: 'Customer Service Standards',
    icon: 'headset_mic',
    content: [
      'Sellers must respond to customer inquiries within 24 hours during business days (Saturday through Thursday).',
      'All communication with customers must be professional, courteous, and conducted through the AmarShop messaging platform.',
      'Sellers must not solicit direct contact with buyers outside the AmarShop platform (phone, email, social media) for order-related communication.',
      'Sellers are expected to resolve customer complaints amicably. If a resolution cannot be reached, sellers may escalate the matter to AmarShop support.',
      'AmarShop monitors response times and customer satisfaction ratings. Sellers failing to meet minimum standards may face account restrictions.',
    ],
  },
  {
    id: 'performance',
    title: 'Performance Metrics',
    icon: 'analytics',
    content: [
      'Seller performance is evaluated monthly based on the following key metrics: Order Defect Rate (&lt; 2%), Cancellation Rate (&lt; 5%), Late Shipment Rate (&lt; 5%), Customer Response Time (&lt; 12 hours), and Overall Rating (&ge; 4.0 stars).',
      'Sellers who consistently meet or exceed performance benchmarks may qualify for reduced commission rates, featured placement, and badge awards.',
      'Sellers failing to meet minimum performance standards for two consecutive months will receive a warning notice and a 30-day improvement plan.',
      'Performance data is available in real-time through the seller dashboard analytics section.',
    ],
  },
  {
    id: 'suspension',
    title: 'Account Suspension & Termination',
    icon: 'block',
    content: [
      'AmarShop may temporarily suspend a seller account for violations of these policies, including but not limited to: selling prohibited items, repeated customer complaints, fraudulent activity, performance below minimum thresholds, or providing false information.',
      'Sellers will receive a written notice of suspension detailing the reason and the steps required for reinstatement.',
      'Account termination may occur after repeated violations or for severe breaches such as fraud, counterfeit sales, or illegal activity.',
      'Upon termination, all pending orders must be fulfilled, and outstanding dues will be settled after a 90-day holding period to account for potential returns or disputes.',
      'Sellers have the right to appeal suspension or termination decisions within 14 days of notice by submitting a written appeal to the seller support team.',
    ],
  },
  {
    id: 'dispute',
    title: 'Dispute Resolution',
    icon: 'balance',
    content: [
      'Any disputes arising between sellers and buyers should first be attempted to be resolved mutually through the AmarShop messaging system.',
      'If mutual resolution is not possible, either party may escalate the dispute to AmarShop&apos;s dispute resolution team within 7 days.',
      'AmarShop will review all evidence submitted by both parties and make a decision based on platform policies and applicable laws. The decision is binding and final.',
      'Disputes between sellers and AmarShop regarding policy interpretation, fee disputes, or account actions will be handled through escalation to the seller operations manager.',
      'For unresolved legal disputes, the courts of Dhaka, Bangladesh shall have exclusive jurisdiction.',
    ],
  },
  {
    id: 'updates',
    title: 'Policy Updates',
    icon: 'update',
    content: [
      'AmarShop reserves the right to modify these seller policies at any time. Sellers will be notified of material changes via email and dashboard notification at least 14 days before the changes take effect.',
      'Continued use of the AmarShop seller platform after policy changes constitute acceptance of the updated terms.',
      'It is the seller&apos;s responsibility to periodically review the seller policy page for any updates.',
      'If a seller does not agree with policy changes, they may close their account before the changes take effect without penalty.',
    ],
  },
];

export default function SellerPolicyPage() {
  return (
    <div className="app-container py-6 pb-24">
      <nav className="flex items-center gap-1 text-xs text-secondary mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface">Seller Policy</span>
      </nav>

      <h1 className="text-responsive-subheading font-bold mb-2">Seller Policy</h1>
      <p className="text-sm text-on-surface-variant mb-8">
        Our seller policies ensure a fair, transparent, and reliable marketplace for everyone. Review the guidelines before listing your products.
      </p>

      <div className="max-w-4xl space-y-5">
        {policySections.map((section) => (
          <section key={section.id} id={section.id} className="bg-white rounded-xl border border-[#eee] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-[22px]">{section.icon}</span>
              </div>
              <h2 className="text-lg font-semibold text-on-surface">{section.title}</h2>
            </div>
            <ul className="space-y-2">
              {section.content.map((item, i) => (
                <li key={i} className="text-sm text-on-surface-variant leading-relaxed flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <div className="bg-primary/5 rounded-xl border border-primary/20 p-6 text-center">
          <p className="text-sm text-on-surface-variant mb-2">Have questions about our seller policies?</p>
          <Link href="/contact" className="text-sm text-primary font-medium hover:underline">
            Contact Seller Support &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}