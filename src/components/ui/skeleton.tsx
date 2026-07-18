'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className = '', variant = 'rect', width, height }: SkeletonProps) {
  const baseClass = 'bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer rounded';
  const variantClass = variant === 'circle' ? 'rounded-full' : variant === 'text' ? 'rounded h-4' : 'rounded-lg';
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`${baseClass} ${variantClass} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl bg-white border border-gray-100 overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-3 md:p-3.5 space-y-2.5">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center gap-1.5">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-3 h-3 rounded-full" />
          ))}
          <Skeleton className="h-3 w-8 ml-1" />
        </div>
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

// Hero Section Skeleton
export function HeroSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl w-full h-70 md:h-380px lg:h-460px bg-gray-100">
      <Skeleton className="w-full h-full" />
      <div className="absolute bottom-0 left-0 right-0 p-8 space-y-3">
        <Skeleton className="h-6 w-48 rounded-full" />
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-12 w-32 rounded-full" />
      </div>
    </div>
  );
}

// Category Grid Skeleton
export function CategoryGridSkeleton() {
  return (
    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <Skeleton variant="circle" className="w-14 h-14 md:w-16 md:h-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

// Flash Sale Section Skeleton
export function FlashSaleSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-7 w-40 rounded-full" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Brand Row Skeleton
export function BrandRowSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-32 shrink-0 rounded-xl" />
      ))}
    </div>
  );
}

// Section Skeleton (for any section with title)
export function SectionSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[...Array(count)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Seller Card Skeleton
export function SellerCardSkeleton() {
  return (
    <div className="flex flex-col items-center p-6 rounded-xl bg-white border border-gray-100">
      <Skeleton variant="circle" className="w-16 h-16 mb-3" />
      <Skeleton className="h-4 w-24 mb-1" />
      <Skeleton className="h-3 w-16 mb-3" />
      <Skeleton className="h-9 w-28 rounded-lg" />
    </div>
  );
}

export default Skeleton;