'use client';

import { motion } from 'framer-motion';
import { CartItem as CartItemType } from '@/types';
import { PriceDisplay } from '@/components/ui/price-display';
import { useCartStore } from '@/stores/cart-store';
import Link from 'next/link';
import { cardItem, fastTransition } from '@/lib/motion-variants';

interface CartItemCardProps {
  item: CartItemType;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { toggleSelect, updateQuantity, removeItem } = useCartStore();

  return (
    <motion.div
      variants={cardItem}
      layout
      className="p-4 flex gap-4"
    >
      <div className="flex-shrink-0 flex items-center">
        <input
          type="checkbox"
          checked={item.selected}
          onChange={() => toggleSelect(item.id)}
          className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
        />
      </div>

      <Link href={'/product/' + item.product.id} className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <img
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          src={item.product.images[0]}
          alt={item.product.name}
        />
      </Link>

      <div className="flex-1 min-w-0">
        <Link href={'/product/' + item.product.id}>
          <h3 className="font-semibold text-sm truncate">{item.product.name}</h3>
        </Link>
        {item.product.colors && item.product.colors.length > 0 && (
          <p className="text-xs text-gray-500 mt-0.5">Color: {item.product.colors[0]}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <PriceDisplay price={item.product.price} originalPrice={item.product.originalPrice} size="sm" />

          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <motion.button
              whileTap={{ scale: 0.85 }}
              transition={fastTransition}
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="px-2 py-1 hover:bg-gray-100 transition-colors"
            >
              <span className="material-symbols-outlined text-base">remove</span>
            </motion.button>
            <span className="px-3 font-semibold border-x border-gray-200 text-sm">{item.quantity}</span>
            <motion.button
              whileTap={{ scale: 0.85 }}
              transition={fastTransition}
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="px-2 py-1 hover:bg-gray-100 transition-colors"
            >
              <span className="material-symbols-outlined text-base">add</span>
            </motion.button>
          </div>
        </div>

        <button
          onClick={() => removeItem(item.id)}
          className="text-[10px] text-red-500 font-semibold mt-1 hover:underline"
        >
          Remove
        </button>
      </div>
    </motion.div>
  );
}
