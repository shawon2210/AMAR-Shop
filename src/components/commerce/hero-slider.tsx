"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

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
  const [[current, direction], setPage] = useState([0, 0]);
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
        paginate(1);
      }
    }, AUTO_PLAY);
    return () => clearInterval(timer);
  }, [current]);

  const paginate = (newDirection: number) => {
    setPage(([prev]) => [(prev + newDirection + slides.length) % slides.length, newDirection]);
  };

  const prev = () => paginate(-1);
  const next = () => paginate(1);

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

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.98,
    }),
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-br from-gray-100 to-white w-full h-hero group"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 180, damping: 26, mass: 0.8 }}
          className="absolute inset-0"
          onMouseEnter={() => { paused.current = true; }}
          onMouseLeave={() => { paused.current = false; }}
        >
          {imgErrors[current] ? (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary-fixed flex items-center justify-center">
              <div className="text-center p-4 sm:p-6">
                <span className="material-symbols-outlined text-4xl sm:text-5xl text-primary/40">shopping_bag</span>
                <p className="text-primary/60 font-semibold mt-1 sm:mt-2 text-xs sm:text-sm">{slides[current].title}</p>
              </div>
            </div>
          ) : (
            <img
              src={slides[current].image}
              alt={slides[current].title}
              loading={current === 0 ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={current === 0 ? "high" : "auto"}
              className="absolute inset-0 h-full w-full object-cover"
              onError={() => handleImgError(current)}
            />
          )}

          {slides[current].hideContent ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-10"
            >
              <Link
                href={slides[current].ctaHref}
                className="group inline-flex items-center justify-center h-11 px-5 md:px-6 rounded-full bg-primary text-white text-xs md:text-sm font-semibold shadow-lg hover:brightness-110 hover:shadow-xl transition-all"
              >
                <span>{slides[current].cta}</span>
                <ArrowRight size={16} className="ml-1 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          ) : (
            <div className="absolute inset-0 p-3 sm:p-4 md:p-5">
              <div className="flex h-full flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="max-w-full sm:max-w-[520px] bg-black/30 backdrop-blur-sm rounded-2xl p-4 sm:p-5 md:p-6"
                >
                  <div className="flex flex-col gap-2 sm:gap-3">
                    <h2 className="text-[clamp(28px,2.5vw,48px)] font-bold leading-tight text-white">
                      {slides[current].title}
                    </h2>
                    <p className="text-[clamp(14px,1vw,18px)] text-white/85">
                      {slides[current].subtitle}
                    </p>
                    <Link
                      href={slides[current].ctaHref}
                      className="group inline-flex items-center justify-center h-11 px-5 md:px-6 rounded-full bg-primary text-white text-xs md:text-sm font-semibold shadow-lg hover:brightness-110 transition-all w-fit"
                    >
                      <span>{slides[current].cta}</span>
                      <ArrowRight size={16} className="ml-1 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prev}
        aria-label="Previous Slide"
        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 size-8 sm:size-9 md:size-10 rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-85 transition-opacity hover:bg-white/35 flex items-center justify-center"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={next}
        aria-label="Next Slide"
        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 size-8 sm:size-9 md:size-10 rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-85 transition-opacity hover:bg-white/35 flex items-center justify-center"
      >
        <ChevronRight size={18} />
      </button>

      <div className="absolute bottom-2 sm:bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            aria-label={`Slide ${index + 1}`}
            onClick={() => setPage([index, index > current ? 1 : -1])}
            className={`rounded-full transition-all duration-300 bg-white/70 hover:bg-white ${
              current === index ? "w-8" : "w-2"
            } h-2`}
          />
        ))}
      </div>
    </div>
  );
}
