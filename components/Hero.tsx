'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    eyebrow: 'Signal 01 · up to 60% off',
    title: 'The network for better things.',
    sub: 'Curated hardware, everyday systems, and objects worth keeping.',
    bg: 'from-[#080c14] via-[#121a2b] to-[#163f4a]',
    cta: { href: '/category/electronics', label: 'Shop Electronics' },
  },
  {
    eyebrow: 'Signal 02 · live drops',
    title: 'High-signal deals. Zero noise.',
    sub: 'Fresh price drops routed to your watchlist every hour.',
    bg: 'from-[#170d32] via-[#30205c] to-[#111827]',
    cta: { href: '/deals', label: 'See today\u2019s deals' },
  },
  {
    eyebrow: 'Signal 03 · priority route',
    title: 'Move at the speed of now.',
    sub: 'Fast, free delivery on the products your system already trusts.',
    bg: 'from-[#072c39] via-[#0d5361] to-[#080c14]',
    cta: { href: '/prime', label: 'Try Prime free' },
  },
  {
    eyebrow: 'Signal 04 · human intelligence',
    title: 'Ideas are still the ultimate upgrade.',
    sub: 'Bestsellers, indie gems, and deep reads for curious systems.',
    bg: 'from-[#120d28] via-[#1e423f] to-[#080c14]',
    cta: { href: '/category/books', label: 'Browse books' },
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
    <div className="relative w-full h-[430px] md:h-[540px] overflow-hidden scanline border-b border-amazon-border">
      <div
        key={i}
        className={`absolute inset-0 bg-gradient-to-br ${s.bg} animate-fadeIn`}
      />
      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-amazon-orange/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -left-20 w-[28rem] h-[28rem] bg-amazon-buy/20 rounded-full blur-3xl" />
        <div className="absolute top-12 right-[15%] w-32 h-32 border border-amazon-orange/30 rotate-45" />
        <div className="absolute bottom-16 right-[22%] h-px w-48 bg-gradient-to-r from-transparent via-amazon-orange to-transparent" />
      </div>
      <div className="relative max-w-screen-xl mx-auto px-6 h-full flex flex-col justify-center text-white">
        <div className="status-kicker mb-4 animate-fadeIn">
          {s.eyebrow}
        </div>
        <h1 className="text-4xl md:text-7xl font-black mb-4 animate-fadeIn max-w-3xl leading-[.98] tracking-[-.04em]">
          {s.title}
        </h1>
        <p className="text-base md:text-lg mb-7 animate-fadeIn max-w-xl text-white/70">{s.sub}</p>
        <Link
          href={s.cta.href}
          className="amazon-btn-yellow w-fit !text-sm !px-6 !py-3 animate-fadeIn"
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
