import { HeroSection } from '@/components/commerce/hero-section';
import { CategoryGrid } from '@/components/commerce/category-grid';
import { FlashSaleSection } from '@/components/commerce/flash-sale-section';
import { TopBrands } from '@/components/commerce/top-brands';
import { SellerCta } from '@/components/commerce/seller-cta';
import { LocalBanners } from '@/components/commerce/local-banners';
import { ProductGrid } from '@/components/commerce/product-grid';
import { getProducts } from '@/services/products';
import { products } from '@/lib/data/products';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const productsData = await getProducts(0, 16).catch(() => products.slice(0, 16));

  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-8 pb-4 md:pb-6">
      {/* Floating background glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-0 h-80 w-80 rounded-full bg-emerald-200/20 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-green-100/20 blur-[120px]" />
      </div>

      {/* Hero + Campaigns */}
      <HeroSection />

      {/* Flash Sale — urgency first */}
      <FlashSaleSection />

      {/* Shop by Category */}
      <CategoryGrid />

      {/* Trending Now */}
      <ProductGrid products={productsData.slice(0, 7)} title="Trending Now" columns={7} />

      {/* Top Brands */}
      <TopBrands />

      {/* Seller CTA */}
      <SellerCta />

      {/* Trust Layer */}
      <LocalBanners />

      {/* Just For You — full catalog */}
      <ProductGrid products={productsData} title="Just For You" columns={7} />
    </div>
  );
}
