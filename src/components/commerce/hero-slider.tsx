"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface HeroSlide {
  image: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaHref: string;
  accentColor: string;
}

const slides: HeroSlide[] = [
  {
    image: "/images/poster.png",
    badge: "Flash Sale",
    badgeColor: "bg-red-500/90",
    title: "Shop Smart, Live Better",
    subtitle: "Fast delivery across Bangladesh.",
    cta: "Shop Now",
    ctaHref: "/categories",
    accentColor: "from-slate-900/80 via-slate-900/50 to-transparent",
  },
  {
    image: "/images/hero-poster.png",
    badge: "Eid Specials",
    badgeColor: "bg-violet-600/90",
    title: "Huge Savings Await",
    subtitle: "Up to 50% off fashion & electronics.",
    cta: "Explore Deals",
    ctaHref: "/flash-sale",
    accentColor: "from-slate-900/80 via-slate-900/50 to-transparent",
  },
  {
    image: "/images/poster.png",
    badge: "Summer Sale",
    badgeColor: "bg-amber-500/90",
    title: "Up to 70% Off",
    subtitle: "Limited time. Free shipping included.",
    cta: "Shop Now",
    ctaHref: "/flash-sale",
    accentColor: "from-slate-900/80 via-slate-900/50 to-transparent",
  },
  {
    image: "/images/hero-poster.png",
    badge: "Tech Fest",
    badgeColor: "bg-blue-600/90",
    title: "Latest Gadgets",
    subtitle: "Free shipping on all tech.",
    cta: "Explore",
    ctaHref: "/category/electronics",
    accentColor: "from-slate-900/80 via-slate-900/50 to-transparent",
  },
];

const AUTO_PLAY_MS = 5500;

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const paused = useRef(false);
  const touchStartX = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent(c => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (!paused.current) { next(); }
    }, AUTO_PLAY_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next]);

  return (
    <div
      className="relative overflow-hidden rounded-2xl w-full h-hero bg-gray-900 group"
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 48) { if (diff > 0) { next(); } else { prev(); } }
      }}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          className={"absolute inset-0 transition-opacity duration-500 " + (i === current ? "opacity-100 z-10" : "opacity-0 z-0")}
          aria-hidden={i !== current}
        >
          {imgErrors[i] ? (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary-fixed" />
          ) : (
            <img
              src={slide.image}
              alt=""
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
              className="absolute inset-0 h-full w-full object-cover"
              onError={() => setImgErrors(p => ({ ...p, [i]: true }))}
            />
          )}

          {/* Layered gradient for depth */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.accentColor}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Content */}
          <div
            className={
              "absolute inset-0 flex flex-col justify-end pb-7 pl-6 pr-6 sm:pb-9 sm:pl-10 md:pb-11 md:pl-12 lg:pb-14 lg:pl-14 transition-all duration-[600ms] " +
              (i === current ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")
            }
          >
            <span className={`inline-flex items-center self-start mb-3 px-3 py-1.5 rounded-full ${slide.badgeColor} backdrop-blur-sm text-white text-xs font-semibold leading-none tracking-wide`}>
              {slide.badge}
            </span>
            <h2
              className="font-bold text-white leading-[1.1] mb-3 tracking-tight drop-shadow-sm"
              style={{ fontSize: "clamp(26px, 4vw, 54px)", whiteSpace: "pre-line" }}
            >
              {slide.title}
            </h2>
            <p
              className="text-white/85 mb-6 max-w-xs md:max-w-md leading-relaxed drop-shadow-sm"
              style={{ fontSize: "clamp(13px, 1.1vw, 16px)" }}
            >
              {slide.subtitle}
            </p>
            <Link
              href={slide.ctaHref}
              className="self-start inline-flex items-center gap-2.5 h-11 md:h-12 px-6 md:px-7 rounded-full bg-white text-gray-900 font-bold text-sm shadow-xl hover:bg-gray-50 hover:shadow-2xl hover:gap-3.5 transition-all duration-200 active:scale-95"
            >
              {slide.cta}
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      ))}

      {/* Nav arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/25 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/45 hover:scale-105 border border-white/10"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/25 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/45 hover:scale-105 border border-white/10"
      >
        <ChevronRight size={20} />
      </button>

      {/* Progress bar indicators */}
      <div className="absolute bottom-4 left-6 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setCurrent(i)}
            className="relative h-1 rounded-full overflow-hidden transition-all duration-300 bg-white/30"
            style={{ width: i === current ? "32px" : "8px" }}
          >
            {i === current && (
              <span
                className="absolute inset-0 bg-white rounded-full origin-left"
                style={{ animation: `slideProgress ${AUTO_PLAY_MS}ms linear forwards` }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-4 right-4 z-20 text-white/60 text-xs font-medium tabular-nums">
        {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>

      <style>{`
        @keyframes slideProgress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
