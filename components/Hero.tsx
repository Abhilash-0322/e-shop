'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const SLIDES = [
  {
    eyebrow: 'THE WEEKEND EDIT',
    title: 'Small joys, beautifully found.',
    sub: 'A playful mix of maker goods, clever tech, and everyday magic — all in one happy scroll.',
    gradient: 'from-[#dcd1f5] via-[#efe8fc] to-[#d8f1e9]',
    ink: 'text-amazon-navy',
    href: '/deals',
    label: 'Explore the edit',
    orb: 'bg-amazon-orange',
  },
  {
    eyebrow: 'MAKER SPOTLIGHT',
    title: 'Good things have a point of view.',
    sub: 'Meet independent sellers creating objects you will want to keep, gift, and talk about.',
    gradient: 'from-[#ffe0d7] via-[#fff2e9] to-[#f8e7f6]',
    ink: 'text-amazon-navy',
    href: '/seller/apply',
    label: 'Become a maker',
    orb: 'bg-amazon-prime',
  },
  {
    eyebrow: 'FRESH FOR YOU',
    title: 'Your next favorite is closer than you think.',
    sub: 'Personalized picks, low-key luxuries, and instant mood boosts from the halozon community.',
    gradient: 'from-[#d5efe9] via-[#e9f8f2] to-[#f6edce]',
    ink: 'text-amazon-navy',
    href: '/search?q=trending',
    label: 'See what is trending',
    orb: 'bg-amazon-yellow',
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % SLIDES.length), 7000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className={`relative min-h-[470px] overflow-hidden bg-gradient-to-br ${slide.gradient}`}>
      <div className="floating-shape -right-16 top-10 h-72 w-72 bg-white/50" />
      <div className={`floating-shape -bottom-24 right-[18%] h-48 w-48 ${slide.orb} opacity-25`} />
      <div className="absolute left-[42%] top-20 h-6 w-6 rotate-45 rounded-lg border-4 border-white/70" />
      <div className={`relative mx-auto grid min-h-[470px] max-w-screen-xl items-center gap-8 px-6 py-16 lg:grid-cols-[1.1fr_.9fr] ${slide.ink}`}>
        <div key={index} className="animate-fadeIn">
          <div className="mb-4 flex items-center gap-2 text-xs font-black tracking-[.24em] text-amazon-link"><Sparkles className="h-4 w-4" /> {slide.eyebrow}</div>
          <h1 className="text-balance max-w-2xl text-5xl font-black leading-[.96] tracking-[-.055em] md:text-7xl">{slide.title}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-amazon-textMuted md:text-xl">{slide.sub}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href={slide.href} className="amazon-btn-primary !px-6 !py-3">{slide.label} <ArrowUpRight className="ml-1 inline h-4 w-4" /></Link>
            <Link href="/category/all" className="rounded-full border border-amazon-navy/20 px-5 py-3 text-sm font-bold hover:bg-white/60">Browse all categories</Link>
          </div>
          <div className="mt-10 flex items-center gap-4 text-xs font-semibold text-amazon-textMuted">
            <span className="rounded-full bg-white/70 px-3 py-1.5">Free delivery $35+</span>
            <span className="rounded-full bg-white/70 px-3 py-1.5">Easy returns</span>
            <span className="hidden rounded-full bg-white/70 px-3 py-1.5 sm:inline">Maker-first</span>
          </div>
        </div>
        <div className="relative hidden h-72 lg:block" aria-hidden="true">
          <div className="absolute right-12 top-2 h-56 w-56 rotate-6 rounded-[35%] bg-white/80 shadow-[20px_25px_0_rgba(81,68,122,.12)]" />
          <div className="absolute right-24 top-16 h-44 w-44 -rotate-12 rounded-[43%] bg-amazon-orange/80" />
          <div className="absolute right-4 top-28 grid h-32 w-32 rotate-12 place-items-center rounded-[40%] bg-amazon-prime/80 text-white shadow-xl"><Sparkles className="h-12 w-12" /></div>
          <div className="absolute bottom-0 right-44 rounded-2xl bg-white px-4 py-3 text-sm font-bold shadow-xl"><span className="block text-[10px] font-medium text-amazon-textMuted">today's vibe</span> joyfully useful ✦</div>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3">
        <button type="button" onClick={() => setIndex((value) => (value - 1 + SLIDES.length) % SLIDES.length)} className="grid h-8 w-8 place-items-center rounded-full bg-white/70 hover:bg-white" aria-label="Previous story"><ChevronLeft className="h-4 w-4" /></button>
        {SLIDES.map((item, itemIndex) => <button key={item.eyebrow} type="button" onClick={() => setIndex(itemIndex)} aria-label={`Show story ${itemIndex + 1}`} className={`h-2 rounded-full transition-all ${itemIndex === index ? 'w-8 bg-amazon-navy' : 'w-2 bg-amazon-navy/30'}`} />)}
        <button type="button" onClick={() => setIndex((value) => (value + 1) % SLIDES.length)} className="grid h-8 w-8 place-items-center rounded-full bg-white/70 hover:bg-white" aria-label="Next story"><ChevronRight className="h-4 w-4" /></button>
      </div>
    </section>
  );
}
