import Link from 'next/link';
import { SocialLinks } from './SocialLinks';
import { AppDownload } from './AppDownload';
import { PaymentMethods } from './PaymentMethods';

export function FooterBrand() {
  return (
    <div className="text-center lg:text-left">
      <Link href="/" className="inline-flex items-center mb-6">
        <img
          src="/images/amarshop-logo.png"
          alt="AmarShop"
          className="w-[170px] h-auto object-contain mx-auto lg:mx-0"
        />
      </Link>

      <p className="text-base leading-[1.8] text-gray-600 max-w-[260px] mx-auto lg:mx-0">
        Bangladesh&apos;s premium online marketplace. Shop millions of products from trusted sellers with fast delivery and the best deals.
      </p>

      <div className="mt-8 space-y-8">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-gray-900 mb-4">
            Follow Us
          </p>
          <SocialLinks />
        </div>

        <div>
          <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-gray-900 mb-4">
            Download App
          </p>
          <AppDownload />
        </div>

        <PaymentMethods />
      </div>
    </div>
  );
}
