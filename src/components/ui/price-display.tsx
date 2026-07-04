interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { current: 'text-base lg:text-lg font-bold', original: 'text-xs lg:text-sm' },
  md: { current: 'text-base md:text-lg lg:text-xl font-bold', original: 'text-[11px] md:text-[12px]' },
  lg: { current: 'text-xl md:text-2xl lg:text-3xl font-bold', original: 'text-sm md:text-base' },
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
      <span className={`${s.current} text-primary`}>
        {currency}{price.toLocaleString('en-BD')}
      </span>
      {originalPrice && originalPrice > price && (
        <span className={`text-gray-400 line-through ${s.original}`}>
          {currency}{originalPrice.toLocaleString('en-BD')}
        </span>
      )}
    </div>
  );
}

export function DiscountBadge({ discount }: { discount: number }) {
  return (
    <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase">
      -{discount}%
    </span>
  );
}
