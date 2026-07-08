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
    <div className="flex flex-col gap-4 md:gap-5 lg:gap-6 pb-6">
      <HeroSection />
      <FlashSaleSection />
      <CategoryGrid />
      <ProductGrid products={productsData.slice(0, 7)} title="Trending Now" columns={7} />
      <TopBrands />
      <SellerCta />
      <LocalBanners />
      <ProductGrid products={productsData} title="Just For You" columns={7} />
    </div>
  );
}
