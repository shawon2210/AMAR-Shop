'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  isFlashSale?: boolean;
  discount?: number;
}

export function ProductGallery({ images, productName, isFlashSale, discount }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());
  const imageRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // Progressive loading
  useEffect(() => {
    const preload = (idx: number) => {
      if (loadedImages.has(idx) || idx < 0 || idx >= images.length) return;
      const img = new Image();
      img.onload = () => setLoadedImages(prev => new Set(prev).add(idx));
      img.onerror = () => setImgErrors(prev => new Set(prev).add(idx));
      img.src = images[idx];
    };

    // Preload current, next, and previous
    preload(selectedIndex);
    preload(selectedIndex + 1);
    preload(selectedIndex - 1);
    // Preload thumbnails
    images.forEach((_, i) => preload(i));
  }, [selectedIndex, images, loadedImages]);

  const handlePrev = useCallback(() => {
    setSelectedIndex(prev => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
  }, [images.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex(prev => (prev + 1) % images.length);
    setIsZoomed(false);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isFullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'Escape') setIsFullscreen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isFullscreen, handlePrev, handleNext]);

  // Scroll lock + focus save/restore
  useEffect(() => {
    if (!isFullscreen) return;
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      prev?.focus();
    };
  }, [isFullscreen]);

  // Touch/swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) handleNext();
      else handlePrev();
    }
  };

  // Mouse position for zoom
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isZoomed || !imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const mainImage = images[selectedIndex];
  const hasError = imgErrors.has(selectedIndex);

  return (
    <>
      {/* Main Gallery */}
      <div className="space-y-3 md:space-y-4">
        {/* Main Image */}
        <div
          ref={imageRef}
          className="relative overflow-hidden rounded-xl bg-gray-50 aspect-square border border-gray-100 group cursor-crosshair"
          onMouseEnter={() => window.innerWidth >= 1024 && setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => setIsFullscreen(true)}
        >
          {/* Skeleton loader */}
          {!loadedImages.has(selectedIndex) && !hasError && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse">
              <div className="w-full h-full bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer" />
            </div>
          )}

          {hasError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="material-symbols-outlined text-5xl text-gray-300">image</span>
            </div>
          ) : (
            <img
              src={mainImage}
              alt={`${productName} - Image ${selectedIndex + 1}`}
              className={`w-full h-full object-cover transition-opacity duration-300 ${loadedImages.has(selectedIndex) ? 'opacity-100' : 'opacity-0'}`}
              style={isZoomed ? {
                transform: 'scale(2)',
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                transition: 'transform 0.1s ease-out',
              } : undefined}
              loading={selectedIndex === 0 ? 'eager' : 'lazy'}
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {isFlashSale && discount && discount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                -{discount}% FLASH SALE
              </span>
            )}
          </div>

          {/* Nav arrows (desktop) */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-105"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-105"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </>
          )}

          {/* Zoom indicator */}
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm">
            <ZoomIn className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-[10px] text-gray-500 font-medium">Hover to zoom</span>
          </div>

          {/* Image counter */}
          <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
            <span className="text-white text-xs font-medium tabular-nums">
              {selectedIndex + 1}/{images.length}
            </span>
          </div>
        </div>

        {/* Thumbnail Gallery */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => { setSelectedIndex(idx); setIsZoomed(false); }}
                className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  idx === selectedIndex
                    ? 'border-primary ring-2 ring-primary/20 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {!loadedImages.has(idx) && !imgErrors.has(idx) ? (
                  <div className="w-full h-full bg-gray-100 animate-pulse" />
                ) : imgErrors.has(idx) ? (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg text-gray-300">image</span>
                  </div>
                ) : (
                  <img
                    className="w-full h-full object-cover"
                    src={img}
                    alt={`${productName} thumbnail ${idx + 1}`}
                    loading="lazy"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Gallery */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-70 bg-black/95 flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={`${productName} image gallery`}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
              aria-label="Close fullscreen"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="absolute top-4 left-4 text-white/60 text-sm font-medium">
              {selectedIndex + 1} / {images.length}
            </div>

            <motion.img
              key={selectedIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              src={images[selectedIndex]}
              alt={`${productName} - Fullscreen ${selectedIndex + 1}`}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                  aria-label="Next"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </>
            )}

            {/* Thumbnails in fullscreen */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setSelectedIndex(idx); }}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    idx === selectedIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}