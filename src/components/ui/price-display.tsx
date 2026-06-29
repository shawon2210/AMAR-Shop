interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { current: 'text-base', original: 'text-[11px]' },
  md: { current: 'text-price-lg', original: 'text-[12px]' },
  lg: { current: 'text-2xl', original: 'text-sm' },
};

export function PriceDisplay({
  price,
  originalPrice,
  currency = '৳',
  size = 'md',
  className = '',
}: PriceDisplayProps) {
  const s = sizeMap[size];

  return (
    <div className={`flex items-baseline gap-1.5 ${className}`}>
      <span className={`font-price-lg ${s.current} text-primary`}>
        {currency}{price.toLocaleString('en-BD')}
      </span>
      {originalPrice && originalPrice > price && (
        <span className={`text-secondary line-through ${s.original}`}>
          {currency}{originalPrice.toLocaleString('en-BD')}
        </span>
      )}
    </div>
  );
}

export function DiscountBadge({ discount }: { discount: number }) {
  return (
    <span className="bg-primary text-white text-[10px] font-label-bold px-1.5 py-0.5 rounded-full uppercase">
      -{discount}% OFF
    </span>
  );
}
