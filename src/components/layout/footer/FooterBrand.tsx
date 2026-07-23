import Link from 'next/link';
import { SocialLinks } from './SocialLinks';
import Image from 'next/image';

export function FooterBrand() {
  return (
    <div className="text-center md:text-left">
      <Link href="/" className="inline-flex items-center mb-4">
        <Image
          src="/images/amarshop-logo.png"
          alt="AmarShop"
          width={170}
          height={48}
          className="w-[170px] h-auto object-contain mx-auto md:mx-0"
          unoptimized={false}
        />
      </Link>

      <p className="text-[15px] leading-7 text-gray-500 max-w-[240px] mx-auto md:mx-0 line-clamp-3">
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
