'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const SLIDES = [
  {
    eyebrow: 'Up to 60% off',
    title: 'A new era of smart home',
    sub: 'Discover Echo, Fire TV and Ring devices.',
    bg: 'from-[#17182a] via-[#3d327a] to-[#7c5cff]',
    cta: { href: '/category/electronics', label: 'Shop Electronics' },
  },
  {
    eyebrow: 'Today only',
    title: 'Deals of the Day',
    sub: 'New deals every hour. Refresh often.',
    bg: 'from-[#26330b] via-[#789d1d] to-[#d8ff3e]',
    cta: { href: '/deals', label: 'See today\u2019s deals' },
  },
  {
    eyebrow: 'Prime exclusive',
    title: 'Fast, free delivery',
    sub: 'On millions of items with Prime.',
    bg: 'from-[#0b343a] via-[#13626a] to-[#34d6de]',
    cta: { href: '/prime', label: 'Try Prime free' },
  },
  {
    eyebrow: 'Featured',
    title: 'Books that inspire',
    sub: 'Bestsellers, indie gems, and more.',
    bg: 'from-[#24182e] via-[#77305e] to-[#ff5ca8]',
    cta: { href: '/category/books', label: 'Browse books' },
  },
];

export default function Hero() {
  const [i, setI] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (reduceMotion) return;
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, [reduceMotion]);
  const s = SLIDES[i];
  return (
    <div className="relative h-[500px] w-full overflow-hidden bg-[#11121a] md:h-[570px]">
      <div
        key={i}
        className={`absolute inset-0 bg-gradient-to-br ${s.bg} ${reduceMotion ? '' : 'animate-fadeIn'}`}
      />
      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -left-20 h-[28rem] w-[28rem] rounded-full bg-amazon-orange/20 blur-3xl" />
        <div className="absolute right-[12%] top-[18%] h-40 w-40 rotate-12 rounded-[2.5rem] border border-white/20 bg-white/10 backdrop-blur-sm animate-float" />
      </div>
      <div className="relative mx-auto grid h-full max-w-[1440px] grid-cols-1 items-center gap-8 px-6 text-white lg:grid-cols-[1.2fr_.8fr] lg:px-12">
        <div className="max-w-2xl">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-white/70 animate-fadeIn">
            <Sparkles className="h-4 w-4 text-amazon-orange" /> {s.eyebrow}
          </div>
          <h1 className="mb-4 max-w-2xl text-5xl font-black leading-[0.95] tracking-[-0.06em] md:text-7xl animate-fadeIn">
            {s.title}
          </h1>
          <p className="mb-8 max-w-xl text-base text-white/75 md:text-xl animate-fadeIn">{s.sub}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href={s.cta.href} className="amazon-btn-yellow flex w-fit items-center gap-2 !px-6 !py-3 !text-base animate-fadeIn">
              {s.cta.label} <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/deals" className="rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-white/60">
              Explore the drop
            </Link>
          </div>
        </div>
        <div className="hidden justify-end lg:flex">
          <div className="w-[330px] rounded-[2rem] border border-white/20 bg-black/20 p-4 backdrop-blur-xl animate-float">
            <div className="mb-4 flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-white/55">
              <span>Live signal</span><span className="flex items-center gap-1 text-amazon-orange"><span className="h-1.5 w-1.5 rounded-full bg-amazon-orange" /> Active</span>
            </div>
            <div className="mb-3 rounded-2xl bg-white/10 p-4">
              <div className="text-4xl font-black tracking-[-0.06em]">24.8k</div>
              <div className="mt-1 text-xs text-white/60">curious shoppers browsing now</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-white/10 p-3"><div className="text-lg font-bold">+18%</div><div className="text-[10px] text-white/55">velocity</div></div>
              <div className="rounded-xl bg-amazon-orange p-3 text-amazon-navy"><div className="text-lg font-bold">04:12</div><div className="text-[10px] opacity-70">drop timer</div></div>
            </div>
          </div>
        </div>
      </div>
      {/* Arrows */}
      <button
        onClick={() => setI((v) => (v - 1 + SLIDES.length) % SLIDES.length)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-2 text-white backdrop-blur transition-colors hover:bg-white/30"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => setI((v) => (v + 1) % SLIDES.length)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-2 text-white backdrop-blur transition-colors hover:bg-white/30"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, k) => (
          <button
            key={k}
            onClick={() => setI(k)}
            aria-label={`Show slide ${k + 1}`}
            className={`h-2 rounded-full transition-all ${k === i ? 'w-10 bg-white' : 'w-2 bg-white/50'}`}
          />
        ))}
      </div>
      {/* Fade strip */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#f4f6f8]" />
    </div>
  );
}
