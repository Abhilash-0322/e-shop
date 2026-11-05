'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    eyebrow: 'The thoughtful edit',
    title: 'Find the things that make your day better.',
    sub: 'A more considered way to shop useful, joyful, and beautifully made products.',
    bg: 'from-amazon-navy via-amazon-navylight to-amazon-orange/70',
    cta: { href: '/category/electronics', label: 'Explore the edit' },
  },
  {
    eyebrow: 'Small price, big feeling',
    title: 'Good finds, better prices.',
    sub: 'Fresh offers selected to help you spend well and discover more.',
    bg: 'from-amazon-orange via-amazon-orangedark to-amazon-buy',
    cta: { href: '/deals', label: 'See today\u2019s picks' },
  },
  {
    eyebrow: 'More time for what matters',
    title: 'Fast delivery, less to think about.',
    sub: 'Get the essentials moving quickly with Prime.',
    bg: 'from-amazon-prime via-amazon-navylight to-amazon-navy',
    cta: { href: '/prime', label: 'Try Prime free' },
  },
  {
    eyebrow: 'Make space for wonder',
    title: 'Stories for every kind of curious.',
    sub: 'Bestsellers, indie gems, and the next book you cannot put down.',
    bg: 'from-amazon-navy via-emerald-900 to-amazon-navy',
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
    <div className="relative w-full h-[390px] md:h-[500px] overflow-hidden">
      <div
        key={i}
        className={`absolute inset-0 bg-gradient-to-br ${s.bg} animate-fadeIn`}
      />
      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -left-20 w-[28rem] h-[28rem] bg-amazon-orange/20 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 h-full flex flex-col justify-center text-white">
        <div className="text-xs uppercase tracking-[.22em] font-semibold mb-3 animate-fadeIn text-white/75">
          {s.eyebrow}
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 animate-fadeIn max-w-2xl leading-[.98] tracking-tight">
          {s.title}
        </h1>
        <p className="text-base md:text-xl mb-7 animate-fadeIn max-w-xl text-white/85 leading-relaxed">{s.sub}</p>
        <Link
          href={s.cta.href}
          className="amazon-btn-yellow w-fit !text-base !px-6 !py-3 animate-fadeIn"
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
