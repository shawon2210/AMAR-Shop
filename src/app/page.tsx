import { HeroSection } from '@/components/commerce/hero-section';
import { CategoryGrid } from '@/components/commerce/category-grid';
import { FlashSaleSection } from '@/components/commerce/flash-sale-section';
import { LocalBanners } from '@/components/commerce/local-banners';
import { ProductGrid } from '@/components/commerce/product-grid';
import { getProducts } from '@/services/products';
import { products } from '@/lib/data/products';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let productsData = await getProducts(0, 16).catch(() => products.slice(0, 16));

  return (
    <div className="pb-24">
      <HeroSection />
      <CategoryGrid />
      <FlashSaleSection />
      <LocalBanners />
      <ProductGrid products={productsData} title="Just For You" columns={4} />
    </div>
  );
}