'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Minus, Plus, AlertTriangle } from 'lucide-react';
import { CartItem as CartItemType } from '@/types';
import { PriceDisplay } from '@/components/ui/price-display';
import { useCartStore } from '@/stores/cart-store';
import { cardItem, fastTransition } from '@/lib/motion-variants';
import { useLanguage } from '@/contexts/language-context';

interface CartItemCardProps {
  item: CartItemType;
}

const STOCK_LIMIT = 999;

export function CartItemCard({ item }: CartItemCardProps) {
  const { toggleSelect, updateQuantity, removeItem } = useCartStore();
  const [qtyDraft, setQtyDraft] = useState<number | null>(null);
  const { t } = useLanguage();

  const stockLimit = item.product.stockCount > 0 ? item.product.stockCount : STOCK_LIMIT;
  const variantLabel = [
    item.product.colors && item.product.colors.length > 0 ? item.product.colors[0] : null,
    item.product.sizes && item.product.sizes.length > 0 ? item.product.sizes[0] : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const lowStock = item.product.stockCount > 0 && item.product.stockCount <= 3;

  const commitQuantity = (raw: number) => {
    setQtyDraft(null);
    const next = Math.max(1, Math.min(raw, stockLimit));
    if (next !== item.quantity) updateQuantity(item.id, next);
  };

  return (
    <motion.div
      variants={cardItem}
      layout
      exit={{
        opacity: 0,
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0,
        transition: { duration: 0.2 },
      }}
      className="rounded-2xl bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] md:rounded-none md:border-0 md:shadow-none md:hover:bg-gray-50/60 transition-colors overflow-hidden"
    >
      <div className="p-3.5 md:p-5 flex gap-3 md:gap-4">
        <div className="hidden md:flex items-center flex-shrink-0">
        <input
          type="checkbox"
          checked={item.selected}
          onChange={() => toggleSelect(item.id)}
          className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
          aria-label={`Select ${item.product.name}`}
        />
      </div>

      <Link
        href={'/product/' + item.product.id}
        className="w-[88px] h-[88px] md:w-24 md:h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0"
      >
        <Image
          src={item.product.images[0]}
          alt={item.product.name}
          width={96}
          height={96}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </Link>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start gap-2">
          <Link href={'/product/' + item.product.id} className="flex-1 min-w-0">
            <h3
              className="font-semibold text-[13px] md:text-sm text-gray-900 leading-snug line-clamp-2"
              title={item.product.name}
            >
              {item.product.name}
            </h3>
          </Link>
          <button
            onClick={() => removeItem(item.id)}
            className="w-11 h-11 -mt-1 -mr-2 md:-mr-1 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 active:scale-90 transition-all flex-shrink-0"
            aria-label={`Remove ${item.product.name} from cart`}
            title="Remove from cart"
          >
            <Trash2 className="w-[18px] h-[18px]" />
          </button>
        </div>

        {variantLabel && (
          <p className="text-xs text-gray-500 mt-0.5 truncate" title={variantLabel}>
            {variantLabel}
          </p>
        )}

        {lowStock && item.product.inStock !== false && (
          <p className="flex items-center gap-1 text-[11px] text-amber-600 font-medium mt-1">
            <AlertTriangle className="w-3 h-3" />
            {t('product.onlyLeft').replace('{count}', String(item.product.stockCount))}
          </p>
        )}

        <div className="mt-2">
          <PriceDisplay price={item.product.price} originalPrice={item.product.originalPrice} size="sm" />
        </div>

        <div className="flex items-center justify-between gap-3 mt-auto pt-2.5 md:pt-3 flex-wrap">
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shrink-0">
            <motion.button
              whileTap={{ scale: 0.85 }}
              transition={fastTransition}
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:pointer-events-none shrink-0"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </motion.button>
            <input
              value={qtyDraft ?? item.quantity}
              onChange={e => setQtyDraft(Math.max(0, Number(e.target.value.replace(/[^\d]/g, '')) || 0))}
              onFocus={e => e.target.select()}
              onBlur={() => qtyDraft !== null && commitQuantity(qtyDraft)}
              onKeyDown={e => {
                if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
              }}
              inputMode="numeric"
              aria-label={`Quantity for ${item.product.name}`}
              className="w-10 h-11 text-center font-semibold text-sm text-gray-900 border-x border-gray-200 focus:outline-none focus:bg-primary/5"
            />
            <motion.button
              whileTap={{ scale: 0.85 }}
              transition={fastTransition}
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= stockLimit}
              className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:pointer-events-none shrink-0"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="text-right shrink-0 ml-auto">
            <p className="text-[11px] text-gray-400 leading-none">{t('cart.total')}</p>
            <p className="text-primary font-bold text-sm md:text-base leading-tight whitespace-nowrap">
              ৳{(item.product.price * item.quantity).toLocaleString('en-BD')}
            </p>
          </div>
        </div>
      </div>
      </div>
    </motion.div>
  );
}
