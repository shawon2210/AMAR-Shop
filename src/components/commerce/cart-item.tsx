'use client';

import { CartItem as CartItemType } from '@/types';
import { PriceDisplay } from '@/components/ui/price-display';
import { useCartStore } from '@/stores/cart-store';
import Link from 'next/link';

interface CartItemCardProps {
  item: CartItemType;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { toggleSelect, updateQuantity, removeItem } = useCartStore();

  return (
    <div className="p-md flex gap-md">
      <div className="flex-shrink-0 flex items-center">
        <input
          type="checkbox"
          checked={item.selected}
          onChange={() => toggleSelect(item.id)}
          className="w-5 h-5 rounded border-outline text-primary focus:ring-primary-container"
        />
      </div>

      <Link href={`/product/${item.product.id}`} className="w-20 h-20 bg-surface-container rounded-lg overflow-hidden flex-shrink-0">
        <img
          className="w-full h-full object-cover"
          src={item.product.images[0]}
          alt={item.product.name}
        />
      </Link>

      <div className="flex-grow min-w-0">
        <Link href={`/product/${item.product.id}`}>
          <h3 className="font-title-sm text-title-sm truncate text-on-surface">{item.product.name}</h3>
        </Link>
        {item.product.colors && item.product.colors.length > 0 && (
          <p className="text-body-sm text-on-surface-variant mt-0.5">Color: {item.product.colors[0]}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <PriceDisplay price={item.product.price} originalPrice={item.product.originalPrice} size="sm" />

          <div className="flex items-center border border-outline rounded-lg overflow-hidden">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="px-2 py-1 hover:bg-surface-container-high transition-colors text-on-surface"
            >
              <span className="material-symbols-outlined text-base">remove</span>
            </button>
            <span className="px-3 font-label-bold border-x border-outline">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="px-2 py-1 hover:bg-surface-container-high transition-colors text-on-surface"
            >
              <span className="material-symbols-outlined text-base">add</span>
            </button>
          </div>
        </div>

        <button
          onClick={() => removeItem(item.id)}
          className="text-[10px] text-error font-label-bold mt-1 hover:underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
