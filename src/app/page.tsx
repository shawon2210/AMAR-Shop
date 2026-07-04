import Link from 'next/link';
import { HeroSection } from '@/components/commerce/hero-section';
import { CategoryGrid } from '@/components/commerce/category-grid';
import { FlashSaleSection } from '@/components/commerce/flash-sale-section';
import { LocalBanners } from '@/components/commerce/local-banners';
import { ProductGrid } from '@/components/commerce/product-grid';
import { getProducts } from '@/services/products';
import { products } from '@/lib/data/products';

export const dynamic = 'force-dynamic';

const brands = ['Samsung', 'Apple', 'Xiaomi', 'Nike', 'Adidas', 'Unilever', 'P&G', 'LG'];

export default async function HomePage() {
  let productsData = await getProducts(0, 16).catch(() => products.slice(0, 16));

  return (
    <div className="pb-4 md:pb-6 space-y-3 sm:space-y-4 md:space-y-6">
      {/* Hero + Campaigns */}
      <HeroSection />

      {/* Flash Sale — urgency first */}
      <FlashSaleSection />

      {/* Shop by Category */}
      <CategoryGrid />

      {/* Trending Now */}
      <ProductGrid products={productsData.slice(0, 6)} title="Trending Now" columns={6} />

      {/* Top Brands Strip */}
      <section>
        <div className="max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm md:text-base font-bold text-gray-900">Top Brands</h3>
              <Link href="/categories" className="text-[11px] md:text-xs font-semibold text-primary hover:text-primary/80 transition-colors">View All</Link>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {brands.map((brand) => (
                <Link key={brand} href="/categories" className="flex items-center justify-center h-12 sm:h-14 rounded-xl bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-600 hover:border-primary hover:text-primary hover:-translate-y-0.5 transition-all duration-300">
                  {brand}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Seller CTA Banner */}
      <section>
        <div className="max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <Link href="/seller/dashboard" className="block bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-5 md:p-7 text-white hover:brightness-110 transition-all">
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl md:text-3xl">storefront</span>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-lg md:text-2xl font-bold">Start Selling on AmarShop</h3>
                <p className="text-sm md:text-base text-white/85 mt-1">Reach millions of customers across Bangladesh. Zero listing fees.</p>
              </div>
              <span className="md:ml-auto inline-flex items-center gap-1 h-11 px-6 rounded-full bg-white text-primary font-bold text-sm hover:bg-gray-100 transition-colors whitespace-nowrap">
                Join Free
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Trust Layer */}
      <LocalBanners />

      {/* Just For You — full catalog */}
      <ProductGrid products={productsData} title="Just For You" columns={6} />
    </div>
  );
}