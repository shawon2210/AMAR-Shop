"use client";

import { useEffect, useRef, useState } from "react";

interface HeroSlide {
  image: string;
  imageFallback?: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaHref: string;
  hideContent?: boolean;
}

const slides: HeroSlide[] = [
  {
    image: "/images/poster.png",
    title: "Shop Smart, Live Better",
    subtitle: "Discover millions of products with fast delivery across Bangladesh.",
    cta: "Shop Now",
    ctaHref: "/categories",
    hideContent: true,
  },
  {
    image: "/images/hero-poster.png",
    title: "Eid Mubarak! Huge Savings Await",
    subtitle: "Exclusive deals on fashion, electronics & home — up to 50% off.",
    cta: "Explore Deals",
    ctaHref: "/flash-sale",
    hideContent: true,
  },
  {
    image: "/images/summer-sale.png",
    imageFallback: "/images/poster.png",
    title: "Summer Mega Sale",
    subtitle: "Up to 70% off on top brands. Limited time offers on everything you love!",
    cta: "Shop Summer Deals",
    ctaHref: "/flash-sale",
    hideContent: true,
  },
  {
    image: "/images/tech-fest.png",
    imageFallback: "/images/hero-poster.png",
    title: "Tech Fest 2026",
    subtitle: "Latest gadgets, smartphones & laptops at unbeatable prices. Free shipping!",
    cta: "Explore Tech",
    ctaHref: "/categories",
    hideContent: true,
  },
];

const AUTO_PLAY = 5000;

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const paused = useRef(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleImgError = (index: number) => {
    setImgErrors(prev => ({ ...prev, [index]: true }));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (!paused.current) {
        setCurrent((prev) => (prev + 1) % slides.length);
      }
    }, AUTO_PLAY);
    return () => clearInterval(timer);
  }, []);

  const prev = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const next = () =>
    setCurrent((prev) => (prev + 1) % slides.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-br from-gray-100 to-white w-full h-hero group"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex h-full transition-[transform] duration-700 ease-in-out will-change-transform transform-gpu"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.title}
            className="relative w-full shrink-0 h-full"
            onMouseEnter={() => { paused.current = true; }}
            onMouseLeave={() => { paused.current = false; }}
          >
            {imgErrors[i] ? (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary-fixed flex items-center justify-center">
                <div className="text-center p-4 sm:p-6">
                  <span className="material-symbols-outlined text-4xl sm:text-5xl text-primary/40">shopping_bag</span>
                  <p className="text-primary/60 font-semibold mt-1 sm:mt-2 text-xs sm:text-sm">{slide.title}</p>
                </div>
              </div>
            ) : (
              <img
                src={slide.image}
                alt={slide.title}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={i === 0 ? "high" : "auto"}
                className="absolute inset-0 h-full w-full object-cover"
                onError={() => handleImgError(i)}
              />
            )}

            {slide.hideContent ? (
              /* Poster slide: CTA at bottom-right */
              <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-10">
                <a
                  href={slide.ctaHref}
                  className="inline-flex items-center justify-center h-11 px-5 md:px-6 rounded-full bg-primary text-white text-xs md:text-sm font-semibold shadow-lg hover:brightness-110 transition-all"
                >
                  <span>{slide.cta}</span>
                  <span className="material-symbols-outlined ml-1 text-base">arrow_forward</span>
                </a>
              </div>
            ) : (
              /* Content slide: glass panel overlay */
              <div className="absolute inset-0 p-3 sm:p-4 md:p-5">
                <div className="flex h-full flex-col justify-center">
                  <div className="max-w-full sm:max-w-[520px] bg-black/30 backdrop-blur-sm rounded-2xl p-4 sm:p-5 md:p-6">
                    <div className="flex flex-col gap-2 sm:gap-3">
                      <h2 className="text-[clamp(28px,2.5vw,48px)] font-bold leading-tight text-white">
                        {slide.title}
                      </h2>
                      <p className="text-[clamp(14px,1vw,18px)] text-white/85">
                        {slide.subtitle}
                      </p>
                      <a
                        href={slide.ctaHref}
                        className="inline-flex items-center justify-center h-11 px-5 md:px-6 rounded-full bg-primary text-white text-xs md:text-sm font-semibold shadow-lg hover:brightness-110 transition-all w-fit"
                      >
                        <span>{slide.cta}</span>
                        <span className="material-symbols-outlined ml-1 text-base">arrow_forward</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prev}
        aria-label="Previous Slide"
        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 size-8 sm:size-9 md:size-10 rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-85 transition-opacity hover:bg-white/35 flex items-center justify-center"
      >
        <span className="material-symbols-outlined text-base sm:text-lg md:text-xl">chevron_left</span>
      </button>
      <button
        onClick={next}
        aria-label="Next Slide"
        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 size-8 sm:size-9 md:size-10 rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-85 transition-opacity hover:bg-white/35 flex items-center justify-center"
      >
        <span className="material-symbols-outlined text-base sm:text-lg md:text-xl">chevron_right</span>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-2 sm:bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            aria-label={`Slide ${index + 1}`}
            onClick={() => setCurrent(index)}
            className={`rounded-full transition-all duration-300 bg-white/70 hover:bg-white ${
              current === index ? "w-8" : "w-2"
            } h-2`}
          />
        ))}
      </div>
    </div>
  );
}
