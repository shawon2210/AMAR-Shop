"use client";

import { useEffect, useRef, useState } from "react";

interface HeroSlide {
  image: string;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
}

const slides: HeroSlide[] = [
  {
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    title: "Top Electronics & Gadgets",
    badge: "ELECTRONICS",
    badgeColor: "bg-primary",
    subtitle: "Smartphones, laptops & accessories — up to 40% off",
  },
  {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
    title: "Curated Fashion for Every Style",
    badge: "FASHION",
    badgeColor: "bg-primary",
    subtitle: "Premium clothing & accessories collection",
  },
  {
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e",
    title: "Farm-Fresh Groceries Daily",
    badge: "GROCERY",
    badgeColor: "bg-tertiary-container",
    subtitle: "Organic produce & essentials delivered to you",
  },
  {
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    title: "Make Your Home Truly Comfortable",
    badge: "HOME & LIVING",
    badgeColor: "bg-primary",
    subtitle: "Furniture, decor & kitchen essentials",
  },
  {
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
    title: "Beauty & Self-Care Essentials",
    badge: "BEAUTY",
    badgeColor: "bg-tertiary-container",
    subtitle: "Skincare, makeup & wellness must-haves",
  },
  {
    image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a",
    title: "Mega Sale — Everything You Need",
    badge: "MEGA SALE",
    badgeColor: "bg-primary",
    subtitle: "Exclusive deals across all categories",
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

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);

  const prev = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="px-container-margin md:mt-md">
      <div
        className="relative overflow-hidden rounded-2xl shadow-xl bg-surface-container-high h-64 sm:h-80 md:h-[420px] lg:h-[520px]"
        onMouseEnter={() => { paused.current = true; }}
        onMouseLeave={() => { paused.current = false; }}
      >
        <div
          className="flex h-full transition-transform duration-700 ease-in-out will-change-transform"
          style={{
            transform: `translateX(-${current * 100}%)`,
          }}
        >
          {slides.map((slide) => (
            <div
              key={slide.title}
              className="relative w-full shrink-0 h-full"
            >
              <img
                src={slide.image}
                alt={slide.title}
                loading="eager"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />

              <div className="relative z-10 flex h-full flex-col justify-center px-6 sm:px-10 lg:px-14">
                {slide.badge && (
                  <span
                    className={`${slide.badgeColor} mb-3 w-fit rounded-full px-3 py-1 text-xs font-semibold tracking-wide text-white`}
                  >
                    {slide.badge}
                  </span>
                )}

                <h2 className="max-w-xl text-2xl font-bold text-white sm:text-3xl md:text-5xl">
                  {slide.title}
                </h2>

                {slide.subtitle && (
                  <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/90 sm:text-base">
                    {slide.subtitle}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Previous */}
        <button
          onClick={prev}
          aria-label="Previous Slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white backdrop-blur transition hover:bg-black/60"
        >
          ←
        </button>

        {/* Next */}
        <button
          onClick={next}
          aria-label="Next Slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white backdrop-blur transition hover:bg-black/60"
        >
          →
        </button>

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              aria-label={`Slide ${index + 1}`}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === index
                  ? "w-8 bg-white"
                  : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}