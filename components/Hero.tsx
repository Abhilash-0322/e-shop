'use client';

import Link from 'next/link';
import { ArrowRight, Check, ShieldCheck, Star, Truck } from '@/lib/icons';

const signals = [
  ['01', 'Curated, not crowded', 'Product stories with the details that help you decide.'],
  ['02', 'Sellers with a signal', 'Independent makers and trusted operators in one place.'],
  ['03', 'A calmer checkout', 'Clear delivery, payment, and returns information.'],
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#17221c] text-white">
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#d7f36b]/20 blur-3xl animate-float" />
      <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-[#ff765c]/20 blur-3xl" />
      <div className="shell relative grid items-center gap-10 py-12 md:py-20 lg:grid-cols-[.92fr_1.08fr] lg:py-24">
        <div className="animate-reveal">
          <span className="pill border border-white/15 bg-white/10 text-[#d7f36b]">A marketplace with a point of view</span>
          <h1 className="mt-5 max-w-2xl text-5xl font-black leading-[.92] tracking-[-.07em] md:text-7xl">Find the next thing you&apos;ll love living with.</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#c5d0c4]">A more visual way to shop from sellers with something worth saying, and products with a reason to be here.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/search" className="btn btn-primary">Start exploring <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/deals" className="btn border border-white/20 bg-white/10 text-white hover:bg-white/15">See the drops</Link>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 border-t border-white/15 pt-5">
            {signals.map(([number, title, copy]) => <div key={number}><span className="text-xs font-black text-[#d7f36b]">{number}</span><b className="mt-2 block text-sm">{title}</b><p className="mt-1 text-xs leading-relaxed text-[#9cae9c]">{copy}</p></div>)}
          </div>
        </div>
        <div className="relative min-h-[25rem] animate-float sm:min-h-[34rem]">
          <div className="absolute inset-4 overflow-hidden rounded-[2rem] border border-white/15 bg-[#26382a] shadow-2xl md:inset-8">
            <img src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=85" alt="A camera and everyday objects styled for discovery" className="h-full w-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#17221c]/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
              <div><p className="text-xs font-black uppercase tracking-[.2em] text-[#d7f36b]">The edit</p><p className="mt-2 text-2xl font-black tracking-tight">Objects that earn their place.</p></div>
              <span className="rounded-full bg-white/15 p-3 backdrop-blur"><Check className="h-5 w-5 text-[#d7f36b]" /></span>
            </div>
          </div>
          <div className="surface absolute -bottom-2 left-0 w-52 border-white/20 bg-white/10 p-4 text-white backdrop-blur-xl sm:bottom-6 sm:left-2">
            <div className="flex items-center gap-2 text-[#d7f36b]"><Star className="h-4 w-4 fill-current" /><b>4.9 average</b></div>
            <p className="mt-2 text-xs leading-relaxed text-[#c5d0c4]">Loved by shoppers who prefer fewer, better decisions.</p>
          </div>
          <div className="surface absolute right-0 top-4 w-44 border-white/20 bg-[#d7f36b] p-4 text-[#17221c] sm:right-2 sm:top-10">
            <Truck className="h-5 w-5" />
            <b className="mt-3 block text-sm">Fast, clear delivery</b>
            <p className="mt-1 text-xs text-[#526259]">No guessing at checkout.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
