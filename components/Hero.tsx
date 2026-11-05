'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Pause, Play, ShieldCheck } from 'lucide-react';

const SLIDES = [
  {
    eyebrow: 'Up to 60% off',
    title: 'A new era of smart home',
    sub: 'Discover smart home products with verified seller details and clear delivery estimates.',
    bg: 'from-amazon-navy via-amazon-navylight to-amazon-orange/70',
    cta: { href: '/category/electronics', label: 'Shop Electronics' },
  },
  {
    eyebrow: 'Today only',
    title: 'Deals of the Day',
    sub: 'New deals every hour, with stock signals and returns shown before you decide.',
    bg: 'from-amazon-orange via-amazon-orangedark to-amazon-buy',
    cta: { href: '/deals', label: 'See today\u2019s deals' },
  },
  {
    eyebrow: 'Prime exclusive',
    title: 'Fast, free delivery',
    sub: 'On millions of items with Prime.',
    bg: 'from-amazon-prime via-amazon-navylight to-amazon-navy',
    cta: { href: '/prime', label: 'Try Prime free' },
  },
  {
    eyebrow: 'Featured',
    title: 'Books that inspire',
    sub: 'Bestsellers, indie gems, and more.',
    bg: 'from-amazon-navy via-emerald-900 to-amazon-navy',
    cta: { href: '/category/books', label: 'Browse books' },
  },
];

export default function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, [paused]);
  const s = SLIDES[i];
  return (
    <section
      className="relative w-full h-[420px] md:h-[520px] overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Featured shopping highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        key={i}
        className={`absolute inset-0 bg-gradient-to-br ${s.bg} animate-fadeIn`}
      />
      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -left-20 w-[28rem] h-[28rem] bg-amazon-orange/20 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-screen-xl mx-auto px-6 h-full flex flex-col justify-center text-white">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-white/80 mb-4">
          <ShieldCheck className="w-4 h-4 text-amazon-orange" aria-hidden="true" /> Shop with clear, honest signals
        </div>
        <div className="text-sm uppercase tracking-widest font-semibold mb-2 animate-fadeIn text-white/80">
          {s.eyebrow}
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-3 animate-fadeIn max-w-2xl leading-tight">
          {s.title}
        </h1>
        <p className="text-lg md:text-xl mb-6 animate-fadeIn max-w-xl text-white/90">{s.sub}</p>
        <Link
          href={s.cta.href}
          className="amazon-btn-yellow w-fit !text-base !px-6 !py-2.5 animate-fadeIn"
        >
          {s.cta.label}
        </Link>
      </div>
      {/* Arrows */}
      <button
        onClick={() => setI((v) => (v - 1 + SLIDES.length) % SLIDES.length)}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur text-white"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => setI((v) => (v + 1) % SLIDES.length)}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur text-white"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      <button
        onClick={() => setPaused((value) => !value)}
        aria-label={paused ? 'Resume featured highlights' : 'Pause featured highlights'}
        className="absolute right-14 bottom-4 p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur text-white"
      >
        {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
      </button>
      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, k) => (
          <button
            key={k}
            onClick={() => setI(k)}
            aria-label={`Show highlight ${k + 1}`}
            aria-current={k === i ? 'true' : undefined}
            className={`h-2 rounded-full transition-all ${k === i ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
          />
        ))}
      </div>
      {/* Fade strip */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-amazon-bg" />
    </section>
  );
}
