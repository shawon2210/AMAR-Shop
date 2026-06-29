'use client';

import Link from 'next/link';
import { CountdownTimer } from '@/components/ui/countdown-timer';
import { ProductCard } from '@/components/commerce/product-card';
import { flashSaleProducts } from '@/lib/data/products';
import { useRouter } from 'next/navigation';

const FLASH_SALE_END = '2026-06-30T23:59:59Z';

export function FlashSaleSection() {
  const router = useRouter();
  const displayProducts = flashSaleProducts.slice(0, 8);

  return (
    <section className="mt-xl px-container-margin">
      <div className="bg-white rounded-xl p-md shadow-sm">
        <div className="flex items-center justify-between mb-md">
          <div className="flex items-center gap-md">
            <h3 className="font-headline-md text-headline-md text-primary">Flash Sale</h3>
            <CountdownTimer targetDate={FLASH_SALE_END} />
          </div>
          <Link
            href="/flash-sale"
            className="text-primary font-label-bold text-label-bold flex items-center hover:underline"
          >
            SHOP MORE <span className="material-symbols-outlined text-sm ml-0.5">chevron_right</span>
          </Link>
        </div>

        <div className="flex overflow-x-auto hide-scrollbar gap-md pb-1">
          {displayProducts.map(product => (
            <div key={product.id} className="min-w-[150px] md:min-w-[200px]">
              <ProductCard product={product} variant="flash-sale" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
