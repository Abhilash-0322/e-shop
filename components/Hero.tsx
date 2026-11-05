'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowUpRight, Sparkles } from 'lucide-react';

const SLIDES = [
  {
    eyebrow: 'The creator marketplace',
    title: 'Small makers. Big energy.',
    sub: 'Find thoughtful goods, limited drops, and the people behind them.',
    bg: 'from-amazon-navy via-[#234b5b] to-amazon-link',
    cta: { href: '/search?q=creator', label: 'Explore the community' },
  },
  {
    eyebrow: 'Fresh drops',
    title: 'Made for the curious.',
    sub: 'A rotating edit of objects with a point of view.',
    bg: 'from-[#502d57] via-amazon-deal to-amazon-orange',
    cta: { href: '/deals', label: 'See what just landed' },
  },
  {
    eyebrow: 'Halo+ members',
    title: 'More ways to support makers.',
    sub: 'Unlock early access, free shipping, and member-only studio stories.',
    bg: 'from-[#537052] via-amazon-green to-amazon-navy',
    cta: { href: '/prime', label: 'See member perks' },
  },
  {
    eyebrow: 'Meet the makers',
    title: 'Every order tells a story.',
    sub: 'Follow your favorite sellers and find your next everyday favorite.',
    bg: 'from-[#573c27] via-amazon-orangedark to-amazon-orange',
    cta: { href: '/seller/apply', label: 'Open your studio' },
  },
];

export default function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);
  const s = SLIDES[i];
  return (
    <div className="relative w-full h-[480px] md:h-[590px] overflow-hidden">
      <div
        key={i}
        className={`absolute inset-0 bg-gradient-to-br ${s.bg} animate-fadeIn`}
      />
      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -left-20 w-[28rem] h-[28rem] bg-amazon-orange/20 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-screen-xl mx-auto px-5 h-full flex flex-col justify-center text-white">
        <div className="flex items-center gap-2 text-sm uppercase tracking-widest font-semibold mb-4 animate-fadeIn text-white/75">
          <Sparkles className="w-4 h-4 text-amazon-yellow" />
          {s.eyebrow}
        </div>
        <h1 className="display-title text-5xl md:text-8xl font-black mb-5 animate-fadeIn max-w-3xl">
          {s.title}
        </h1>
        <p className="text-lg md:text-2xl mb-8 animate-fadeIn max-w-xl text-white/80">{s.sub}</p>
        <Link
          href={s.cta.href}
          className="amazon-btn-yellow w-fit !text-base !px-6 !py-3 animate-fadeIn inline-flex items-center gap-2"
        >
          {s.cta.label} <ArrowUpRight className="w-4 h-4" />
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
      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, k) => (
          <button
            key={k}
            onClick={() => setI(k)}
            className={`h-2 rounded-full transition-all ${k === i ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
          />
        ))}
      </div>
      {/* Fade strip */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-amazon-bg" />
    </div>
  );
}
