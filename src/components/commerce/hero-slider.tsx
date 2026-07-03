"use client";

import { useEffect, useRef, useState } from "react";

interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaHref: string;
}

const slides: HeroSlide[] = [
  {
    image:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&q=80",
    title: "Biggest Online Marketplace in Bangladesh",
    subtitle: "Shop millions of products with fast delivery nationwide.",
    cta: "Shop Now",
    ctaHref: "/categories",
  },
  {
    image:
      "https://images.unsplash.com/photo-1607082350899-7e105aa7aecc?w=1200&q=80",
    title: "Festival Mega Sale — Up to 70% OFF",
    subtitle: "Limited-time deals across fashion, electronics & home.",
    cta: "Explore Deals",
    ctaHref: "/flash-sale",
  },
  {
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
    title: "Launch Your Store on AmarShop",
    subtitle: "Reach customers across Bangladesh. Start selling today.",
    cta: "Become a Seller",
    ctaHref: "/seller/dashboard",
  },
  {
    image:
      "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=1200&q=80",
    title: "Fashion Collection 2026",
    subtitle: "Trending styles with free delivery available.",
    cta: "Shop Fashion",
    ctaHref: "/category/fashion",
  },
];

const AUTO_PLAY = 5000;

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const paused = useRef(false);

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

  return (
    <div className="relative overflow-hidden rounded-2xl md:rounded-[28px] bg-surface-container-high w-full h-full group">
      {/* Slides track */}
      <div
        className="flex h-full transition-[transform] duration-700 ease-in-out will-change-transform transform-gpu"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.title}
            className="relative w-full shrink-0 h-full"
            onMouseEnter={() => {
              paused.current = true;
            }}
            onMouseLeave={() => {
              paused.current = false;
            }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col justify-center px-6 sm:px-10 md:px-14">
              <div className="max-w-[520px] flex flex-col gap-6">
                <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold leading-tight text-white">
                  {slide.title}
                </h2>
                <p className="text-base sm:text-lg text-white/80 max-w-[440px]">
                  {slide.subtitle}
                </p>
                <a
                  href={slide.ctaHref}
                  className="inline-flex items-center justify-center h-[52px] px-8 rounded-full bg-primary text-white text-[15px] font-semibold shadow-lg hover:brightness-110 transition-all w-fit"
                >
                  {slide.cta}
                  <span className="material-symbols-outlined ml-2 text-[20px]">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons — glassmorphism */}
      <button
        onClick={prev}
        aria-label="Previous Slide"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 size-14 rounded-full bg-white/15 backdrop-blur-md text-white opacity-0 group-hover:opacity-85 transition-opacity hover:bg-white/30 flex items-center justify-center"
      >
        <span className="material-symbols-outlined text-[28px]">
          chevron_left
        </span>
      </button>
      <button
        onClick={next}
        aria-label="Next Slide"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 size-14 rounded-full bg-white/15 backdrop-blur-md text-white opacity-0 group-hover:opacity-85 transition-opacity hover:bg-white/30 flex items-center justify-center"
      >
        <span className="material-symbols-outlined text-[28px]">
          chevron_right
        </span>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2.5">
        {slides.map((_, index) => (
          <button
            key={index}
            aria-label={`Slide ${index + 1}`}
            onClick={() => setCurrent(index)}
            className="h-3 rounded-full transition-all duration-300 bg-white/60 hover:bg-white/80"
            style={{
              width: current === index ? "32px" : "12px",
            }}
          />
        ))}
      </div>
    </div>
  );
}
