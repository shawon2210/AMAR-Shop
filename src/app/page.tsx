import { HeroSlider } from '@/components/commerce/hero-slider';
import { CategoryGrid } from '@/components/commerce/category-grid';
import { FlashSaleSection } from '@/components/commerce/flash-sale-section';
import { LocalBanners } from '@/components/commerce/local-banners';
import { ProductGrid } from '@/components/commerce/product-grid';
import { products } from '@/lib/data/products';

export default function HomePage() {
  return (
    <div className="pb-24">
      <HeroSlider />
      <CategoryGrid />
      <FlashSaleSection />
      <LocalBanners />
      <ProductGrid products={products} title="Just For You" columns={4} />
    </div>
  );
}
