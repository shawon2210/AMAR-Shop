import Link from 'next/link';
import { SocialLinks } from './SocialLinks';

export function FooterBrand() {
  return (
    <div className="text-center lg:text-left">
      <Link href="/" className="inline-flex items-center mb-4">
        <img
          src="/images/amarshop-logo.png"
          alt="AmarShop"
          className="w-[170px] h-auto object-contain mx-auto lg:mx-0"
        />
      </Link>

      <p className="text-[15px] leading-7 text-gray-500 max-w-[240px] mx-auto lg:mx-0 line-clamp-3">
        Bangladesh&apos;s premium online marketplace. Shop millions of products from trusted sellers with fast delivery and the best deals.
      </p>

      <div className="mt-5">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-900 mb-2.5">
          Follow Us
        </h4>
        <SocialLinks />
      </div>
    </div>
  );
}
