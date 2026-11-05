'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    eyebrow: 'The current · 01',
    title: 'Find your next everyday essential.',
    sub: 'A calmer way to shop across independent makers, considered tech, and things built to last.',
    bg: 'from-amazon-navy via-amazon-navylight to-[#17627a]',
    cta: { href: '/search', label: 'Explore the collection' },
  },
  {
    eyebrow: 'The current · 02',
    title: 'Small upgrades. Big atmosphere.',
    sub: 'Save on pieces that make your space feel more like you.',
    bg: 'from-[#10394f] via-[#1a5970] to-amazon-orange/70',
    cta: { href: '/deals', label: 'See the current offers' },
  },
  {
    eyebrow: 'Move at your own pace',
    title: 'Good things, delivered simply.',
    sub: 'Fast, free delivery and a shopping experience with less noise.',
    bg: 'from-[#0c435f] via-amazon-navy to-[#081d35]',
    cta: { href: '/prime', label: 'Discover halozon+' },
  },
  {
    eyebrow: 'Make space for wonder',
    title: 'Stories, objects, ideas.',
    sub: 'Bestsellers, indie gems, and the details that turn a room into a feeling.',
    bg: 'from-[#132e50] via-[#2a4165] to-[#714c61]',
    cta: { href: '/category/books', label: 'Browse the shelves' },
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
    <div className="relative w-full h-[520px] md:h-[590px] overflow-hidden">
      <div
        key={i}
        className={`absolute inset-0 bg-gradient-to-br ${s.bg} animate-fadeIn`}
      />
      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -left-20 w-[28rem] h-[28rem] bg-amazon-orange/20 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-screen-xl mx-auto px-5 sm:px-8 h-full flex flex-col justify-center text-white">
        <div className="max-w-2xl">
        <div className="text-[11px] uppercase tracking-[.24em] font-bold mb-4 animate-fadeIn text-amazon-orangelight">
          {s.eyebrow}
        </div>
        <h1 className="text-4xl md:text-7xl font-black mb-5 animate-fadeIn max-w-2xl leading-[.98] tracking-[-.05em]">
          {s.title}
        </h1>
        <p className="text-base md:text-xl mb-8 animate-fadeIn max-w-xl text-white/75 leading-relaxed">{s.sub}</p>
        <Link
          href={s.cta.href}
          className="amazon-btn-yellow w-fit !text-sm !px-6 !py-3.5 animate-fadeIn"
        >
          {s.cta.label}
        </Link>
        </div>
        <div className="hidden md:block absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 w-[340px] h-[340px] animate-fadeIn">
          <div className="absolute inset-0 rounded-full border border-white/20 animate-pulse" />
          <div className="absolute inset-8 rounded-full border border-white/15" />
          <div className="absolute inset-16 rounded-full border border-white/20" />
          <div className="absolute inset-[28%] rounded-[2.25rem] rotate-12 bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl" />
          <div className="absolute right-0 top-16 w-44 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl p-4 -rotate-6">
            <div className="flex items-center justify-between text-[10px] text-white/60 uppercase tracking-widest"><span>Live drop</span><span className="w-2 h-2 rounded-full bg-amazon-lime" /></div>
            <div className="mt-5 text-2xl font-bold">12.8k</div>
            <div className="text-xs text-white/60 mt-1">good finds in motion</div>
          </div>
          <div className="absolute left-0 bottom-12 w-48 rounded-2xl bg-amazon-lime text-amazon-navy p-4 rotate-6 shadow-xl">
            <div className="text-[10px] uppercase tracking-widest font-bold opacity-70">Your orbit</div>
            <div className="mt-4 text-lg font-black">Curated for you</div>
            <div className="mt-2 h-1 w-20 bg-amazon-navy/20 rounded-full"><div className="h-full w-2/3 bg-amazon-navy rounded-full" /></div>
          </div>
        </div>
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
