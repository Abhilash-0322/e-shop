'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    eyebrow: 'New season',
    title: 'Tech that pops',
    sub: 'Curated electronics, smart home, and audio — picked for color and quality.',
    bg: 'from-violet-600 via-fuchsia-500 to-pink-500',
    cta: { href: '/category/electronics', label: 'Shop electronics' },
  },
  {
    eyebrow: 'Limited time',
    title: 'Flash deals',
    sub: 'Fresh price drops every day. Grab them before they’re gone.',
    bg: 'from-rose-500 via-orange-400 to-amber-400',
    cta: { href: '/deals', label: 'View flash deals' },
  },
  {
    eyebrow: 'Halozon Plus',
    title: 'Delivery on your schedule',
    sub: 'Members get fast shipping and exclusive perks.',
    bg: 'from-cyan-500 via-sky-600 to-indigo-700',
    cta: { href: '/prime', label: 'Explore Plus' },
  },
  {
    eyebrow: 'Curated reads',
    title: 'Stories worth keeping',
    sub: 'Bestsellers, indie picks, and beautiful editions.',
    bg: 'from-emerald-600 via-teal-600 to-violet-700',
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
    <div className="relative w-full h-[400px] md:h-[480px] overflow-hidden rounded-b-[2.5rem] md:rounded-b-[3rem] shadow-glow mx-auto max-w-[100vw]">
      <div key={i} className={`absolute inset-0 bg-gradient-to-br ${s.bg} animate-fadeIn`} />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA4Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+')] opacity-40" />
      </div>
      <div className="relative max-w-screen-xl mx-auto px-6 md:px-10 h-full flex flex-col justify-center text-white">
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-3">
          {s.eyebrow}
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-3 animate-fadeIn max-w-2xl leading-[1.05] drop-shadow-sm">
          {s.title}
        </h1>
        <p className="text-lg md:text-xl mb-8 animate-fadeIn max-w-xl text-white/90">{s.sub}</p>
        <Link href={s.cta.href} className="amazon-btn-yellow w-fit !text-base animate-fadeIn shadow-lg">
          {s.cta.label}
        </Link>
      </div>
      <button
        type="button"
        onClick={() => setI((v) => (v - 1 + SLIDES.length) % SLIDES.length)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/25 hover:bg-white/40 backdrop-blur-md text-white border border-white/30"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        type="button"
        onClick={() => setI((v) => (v + 1) % SLIDES.length)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/25 hover:bg-white/40 backdrop-blur-md text-white border border-white/30"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, k) => (
          <button
            key={k}
            type="button"
            onClick={() => setI(k)}
            aria-label={`Go to slide ${k + 1}`}
            className={`h-2 rounded-full transition-all ${k === i ? 'w-10 bg-white' : 'w-2 bg-white/45 hover:bg-white/70'}`}
          />
        ))}
      </div>
    </div>
  );
}
