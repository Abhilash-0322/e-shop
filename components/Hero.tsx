'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    eyebrow: 'halozon marketplace · live now',
    title: 'The smarter way to move money.',
    sub: 'Curated products, transparent pricing, and a checkout that feels as good as your balance sheet.',
    bg: 'from-amazon-navy via-amazon-navylight to-amazon-orange/70',
    cta: { href: '/deals', label: 'Explore the marketplace' },
  },
  {
    eyebrow: 'signal over noise',
    title: 'High-conviction finds.',
    sub: 'Real ratings, stock confidence, and focused collections for the next thing you bring home.',
    bg: 'from-amazon-orange via-amazon-orangedark to-amazon-buy',
    cta: { href: '/category/electronics', label: 'Browse top picks' },
  },
  {
    eyebrow: 'membership, rethought',
    title: 'More upside. Less friction.',
    sub: 'Fast, free delivery and member-only value with no dark patterns or surprise fees.',
    bg: 'from-amazon-prime via-amazon-navylight to-amazon-navy',
    cta: { href: '/prime', label: 'See membership benefits' },
  },
  {
    eyebrow: 'for independent sellers',
    title: 'Build your next growth curve.',
    sub: 'Powerful tools for makers and brands to launch, learn, and scale with confidence.',
    bg: 'from-amazon-navy via-emerald-900 to-amazon-navy',
    cta: { href: '/seller/apply', label: 'Open a seller account' },
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
    <div className="relative w-full h-[500px] md:h-[590px] overflow-hidden">
      <div
        key={i}
        className={`absolute inset-0 bg-gradient-to-br ${s.bg} animate-fadeIn`}
      />
      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-aurora-violet/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -left-20 w-[28rem] h-[28rem] bg-amazon-orange/20 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-screen-xl mx-auto px-6 h-full flex flex-col justify-center text-white">
        <div className="text-[11px] uppercase tracking-[.22em] font-bold mb-4 animate-fadeIn text-amazon-orange">
          {s.eyebrow}
        </div>
        <h1 className="text-4xl md:text-7xl font-black mb-4 animate-fadeIn max-w-3xl leading-[.98] tracking-tight">
          {s.title}
        </h1>
        <p className="text-base md:text-lg mb-8 animate-fadeIn max-w-xl text-white/75 leading-relaxed">{s.sub}</p>
        <Link
          href={s.cta.href}
          className="amazon-btn-yellow w-fit !text-sm !px-6 !py-3 animate-fadeIn"
        >
          {s.cta.label}
        </Link>
      </div>
      <div className="absolute right-[10%] bottom-20 hidden lg:block w-72 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-4 text-white animate-float">
        <div className="flex items-center justify-between text-xs text-white/60"><span>market pulse</span><span className="text-amazon-orange">● live</span></div>
        <div className="flex items-end gap-2 mt-4"><span className="text-3xl font-black">84.6</span><span className="text-amazon-orange text-xs font-bold mb-1">+12.8%</span></div>
        <div className="h-14 mt-3 flex items-end gap-1">
          {[32, 42, 36, 54, 45, 62, 57, 76, 68, 92].map((h, k) => <span key={k} className="flex-1 rounded-t bg-gradient-to-t from-amazon-orange/30 to-amazon-orange" style={{ height: `${h}%` }} />)}
        </div>
        <div className="mt-3 pt-3 border-t border-white/10 flex justify-between text-[10px] text-white/50"><span>confidence index</span><span>Q4 · 2026</span></div>
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
