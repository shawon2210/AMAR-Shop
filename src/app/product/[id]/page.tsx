'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetProductById, useGetProducts } from '@/services/products';
import { PriceDisplay, DiscountBadge } from '@/components/ui/price-display';
import { Badge } from '@/components/ui/badge';
import { CountdownTimer } from '@/components/ui/countdown-timer';
import { ProductGrid } from '@/components/commerce/product-grid';
import { ProductGallery } from '@/components/commerce/product-gallery';
import { useCartStore } from '@/stores/cart-store';
import { useUIStore } from '@/stores/ui-store';
import { useRecentlyViewedStore } from '@/stores/recently-viewed-store';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const { data: product, isLoading } = useGetProductById(params.id as string);
  const { data: allProducts = [] } = useGetProducts(0, 8);
  const related = product
    ? allProducts.filter(r => r.id !== product.id).slice(0, 4)
    : [];
  const addItem = useCartStore(s => s.addItem);
  const addToast = useUIStore(s => s.addToast);
  const addToRecentlyViewed = useRecentlyViewedStore(s => s.addItem);

  // Track recently viewed
  if (product) {
    addToRecentlyViewed(product);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 app-container">
        <span className="material-symbols-outlined animate-spin text-3xl text-secondary mb-3">progress_activity</span>
        <p className="text-secondary">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-32 app-container">
        <span className="material-symbols-outlined text-6xl text-secondary mb-4">block</span>
        <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
        <p className="text-secondary mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link
          href="/"
          className="bg-primary text-on-primary px-lg py-4 rounded-lg font-semibold hover:brightness-110 transition-all"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    addToast(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push('/checkout');
  };

  return (
    <div className="app-container py-6 space-y-6 pb-24">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-secondary">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <Link href={`/category/${product.categoryId}`} className="hover:text-primary">{product.category}</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Product Gallery + Info */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        {/* Gallery */}
        <section className="md:col-span-5">
          <ProductGallery
            images={product.images}
            productName={product.name}
            isFlashSale={product.isFlashSale}
            discount={discount}
          />
        </section>

        {/* Product Info */}
        <section className="md:col-span-7 space-y-md">
          <div className="bg-white p-4 md:p-5 rounded-xl space-y-4 border border-gray-100">
            <div className="flex items-center gap-1.5 flex-wrap">
              {product.isMall && <Badge variant="primary">Mall</Badge>}
              {product.isNew && <Badge variant="tertiary">New</Badge>}
              {product.freeShipping && <Badge variant="success">Free Shipping</Badge>}
              {discount > 0 && <DiscountBadge discount={discount} />}
            </div>

            <h1 className="text-xl md:text-2xl font-bold leading-tight text-gray-900">
              {product.name}
            </h1>

            <p className="text-sm text-gray-500">
              {product.description}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-sm"
                    style={{
                      fontVariationSettings: `'FILL' ${i < Math.round(product.rating) ? 1 : 0}`,
                      color: i < Math.round(product.rating) ? '#a63600' : '#c8c6c5',
                    }}
                  >
                    star
                  </span>
                ))}
              </div>
              <span className="text-sm text-secondary font-semibold">
                {product.rating} ({product.reviewCount.toLocaleString()} reviews)
              </span>
            </div>

            {/* Price */}
            <PriceDisplay
              price={product.price}
              originalPrice={product.originalPrice}
              size="lg"
            />

            {/* Flash Sale Timer */}
            {product.isFlashSale && product.flashSaleEndsAt && (
              <div className="bg-primary-fixed rounded-lg p-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  bolt
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-primary">Flash Sale ends in</p>
                </div>
                <CountdownTimer targetDate={product.flashSaleEndsAt} />
              </div>
            )}

            {/* Seller */}
            {product.seller && (
              <div className="flex items-center gap-2 text-sm text-gray-500 border-t border-gray-100 pt-3">
                <span className="material-symbols-outlined text-base">store</span>
                <span>Sold by: <strong className="text-gray-900">{product.seller.name}</strong></span>
                {product.seller.isOfficial && (
                  <Badge variant="primary" size="sm">Official Store</Badge>
                )}
              </div>
            )}

            {/* Specs */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="border-t border-gray-100 pt-3">
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Specifications</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex gap-1 text-sm min-w-0">
                      <span className="text-gray-500 shrink-0 min-w-[80px]">{key}:</span>
                      <span className="text-gray-900 font-medium break-words">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Actions */}
            <div className="border-t border-gray-100 pt-3 space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-semibold">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 hover:bg-gray-100 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <span className="material-symbols-outlined text-base">remove</span>
                  </button>
                  <span className="px-4 font-semibold border-x border-outline">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    className="px-3 py-1.5 hover:bg-gray-100 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <span className="material-symbols-outlined text-base">add</span>
                  </button>
                </div>
                <span className="text-xs text-secondary">({product.stockCount} available)</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary-fixed transition-all active:scale-95"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3 bg-primary text-on-primary font-semibold rounded-lg hover:bg-primary-container transition-all active:scale-95"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <ProductGrid
          products={related}
          title="You May Also Like"
          columns={4}
          showLoadMore={false}
        />
      )}
    </div>
  );
}