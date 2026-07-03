"use client";

import { useEffect, useRef, useState } from "react";

interface HeroSlide {
  image: string;
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
];

const AUTO_PLAY = 5000;

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const paused = useRef(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

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
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-gray-50 to-white w-full h-[320px] sm:h-[360px] md:h-[440px] lg:h-[520px] xl:h-[580px] 2xl:h-[640px] group"
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
            <img
              src={slide.image}
              alt={slide.title}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={i === 0 ? "high" : "auto"}
              className="absolute inset-0 h-full w-full object-scale-down p-2 sm:p-3 md:p-4"
            />

            {slide.hideContent ? (
              /* Poster slide: CTA at bottom-right */
              <div className="absolute bottom-4 sm:bottom-5 md:bottom-6 right-4 sm:right-5 md:right-6 z-10">
                <a
                  href={slide.ctaHref}
                  className="inline-flex items-center justify-center h-11 md:h-12 lg:h-14 px-5 md:px-6 lg:px-7 rounded-full bg-primary text-white text-[13px] sm:text-[14px] md:text-[15px] font-semibold shadow-lg hover:brightness-110 transition-all"
                >
                  <span>{slide.cta}</span>
                  <span className="material-symbols-outlined ml-1.5 text-[16px] sm:text-[18px]">
                    arrow_forward
                  </span>
                </a>
              </div>
            ) : (
              /* Content slide: glass panel overlay */
              <div className="absolute inset-0 p-3 sm:p-4 md:p-5 lg:p-6">
                <div className="flex h-full flex-col justify-center">
                  <div className="max-w-full sm:max-w-[420px] md:max-w-[520px] lg:max-w-[560px] bg-black/30 backdrop-blur-sm rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8">
                    <div className="flex flex-col gap-3 sm:gap-4">
                      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold leading-tight text-white">
                        {slide.title}
                      </h2>
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/85">
                        {slide.subtitle}
                      </p>
                      <a
                        href={slide.ctaHref}
                        className="inline-flex items-center justify-center h-11 md:h-12 lg:h-14 px-5 md:px-6 lg:px-7 rounded-full bg-primary text-white text-[13px] sm:text-[14px] md:text-[15px] font-semibold shadow-lg hover:brightness-110 transition-all w-fit mt-1"
                      >
                        <span>{slide.cta}</span>
                        <span className="material-symbols-outlined ml-1.5 md:ml-2 text-[16px] sm:text-[18px] md:text-[20px]">
                          arrow_forward
                        </span>
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
        className="absolute left-3 sm:left-4 md:left-5 top-1/2 -translate-y-1/2 size-9 sm:size-10 md:size-12 lg:size-14 rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-85 transition-opacity hover:bg-white/35 flex items-center justify-center"
      >
        <span className="material-symbols-outlined text-[18px] sm:text-[20px] md:text-[24px] lg:text-[28px]">
          chevron_left
        </span>
      </button>
      <button
        onClick={next}
        aria-label="Next Slide"
        className="absolute right-3 sm:right-4 md:right-5 top-1/2 -translate-y-1/2 size-9 sm:size-10 md:size-12 lg:size-14 rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-85 transition-opacity hover:bg-white/35 flex items-center justify-center"
      >
        <span className="material-symbols-outlined text-[18px] sm:text-[20px] md:text-[24px] lg:text-[28px]">
          chevron_right
        </span>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-5 lg:bottom-6 left-1/2 flex -translate-x-1/2 gap-2 sm:gap-2.5 md:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            aria-label={`Slide ${index + 1}`}
            onClick={() => setCurrent(index)}
            className={`rounded-full transition-all duration-300 bg-white/70 hover:bg-white ${
              current === index
                ? "w-6 sm:w-7 md:w-8"
                : "w-2 sm:w-2.5 md:w-3"
            } h-2 sm:h-2.5 md:h-3`}
          />
        ))}
      </div>
    </div>
  );
}
