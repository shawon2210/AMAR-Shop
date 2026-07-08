'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetProductById, useGetProducts } from '@/services/products';
import { PriceDisplay, DiscountBadge } from '@/components/ui/price-display';
import { Badge } from '@/components/ui/badge';
import { CountdownTimer } from '@/components/ui/countdown-timer';
import { ProductGrid } from '@/components/commerce/product-grid';
import { useCartStore } from '@/stores/cart-store';
import { useUIStore } from '@/stores/ui-store';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { data: product, isLoading } = useGetProductById(params.id as string);
  const { data: allProducts = [] } = useGetProducts(0, 8);
  const related = product
    ? allProducts.filter(r => r.id !== product.id).slice(0, 4)
    : [];
  const addItem = useCartStore(s => s.addItem);
  const addToast = useUIStore(s => s.addToast);

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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-lg">
        {/* Gallery */}
        <section className="md:col-span-5 space-y-md">
          <div className="overflow-hidden rounded-xl bg-white aspect-square flex items-center justify-center relative cursor-zoom-in border border-outline-variant">
            <img
              className="w-full h-full object-cover hover:scale-150 transition-transform duration-300"
              src={product.images[selectedImage]}
              alt={product.name}
            />
            {product.isFlashSale && discount > 0 && (
              <div className="absolute top-sm right-sm bg-primary text-white text-[10px] px-sm py-0.5 font-bold rounded">
                FLASH SALE
              </div>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                  idx === selectedImage ? 'border-primary' : 'border-outline-variant'
                }`}
              >
                <img className="w-full h-full object-cover" src={img} alt={`${product.name} ${idx + 1}`} />
              </button>
            ))}
          </div>
        </section>

        {/* Product Info */}
        <section className="md:col-span-7 space-y-md">
          <div className="bg-surface-container-lowest p-4 rounded-xl space-y-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              {product.isMall && <Badge variant="primary">Mall</Badge>}
              {product.isNew && <Badge variant="tertiary">New</Badge>}
              {product.freeShipping && <Badge variant="success">Free Shipping</Badge>}
              {discount > 0 && <DiscountBadge discount={discount} />}
            </div>

            <h1 className="text-xl font-bold leading-tight text-on-surface">
              {product.name}
            </h1>

            <p className="font-body-sm text-body-sm text-on-surface-variant">
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
              <div className="flex items-center gap-2 text-sm text-secondary border-t border-outline-variant pt-3">
                <span className="material-symbols-outlined text-base">store</span>
                <span>Sold by: <strong className="text-on-surface">{product.seller.name}</strong></span>
                {product.seller.isOfficial && (
                  <Badge variant="primary" size="sm">Official Store</Badge>
                )}
              </div>
            )}

            {/* Specs */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="border-t border-outline-variant pt-3">
                <h4 className="font-title-sm text-title-sm mb-2">Specifications</h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex gap-1 text-sm">
                      <span className="text-secondary min-w-[80px]">{key}:</span>
                      <span className="text-on-surface font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Actions */}
            <div className="border-t border-outline-variant pt-3 space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-semibold">Quantity:</span>
                <div className="flex items-center border border-outline rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 hover:bg-surface-container-high transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">remove</span>
                  </button>
                  <span className="px-4 font-semibold border-x border-outline">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    className="px-3 py-1.5 hover:bg-surface-container-high transition-colors"
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