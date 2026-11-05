'use client';

import Link from 'next/link';
import { ArrowRight, Lock, ShieldCheck, Star, Truck } from '@/lib/icons';

export default function Hero() {
  const promises = [[Truck, 'Fast fulfillment'], [ShieldCheck, 'Buyer protection'], [Lock, 'Secure checkout'], [Star, 'Top-rated sellers']] as const;
  return (
    <section className="relative overflow-hidden bg-[#102235] text-white">
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#e35d43]/25 blur-3xl animate-float" />
      <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#6cc7b6]/20 blur-3xl animate-float" />
      <div className="shell relative grid items-center gap-10 py-16 md:py-24 lg:grid-cols-[1.05fr_.95fr]">
        <div className="animate-reveal">
          <span className="pill border border-white/20 bg-white/10 text-[#d9f0e9]">A calmer marketplace</span>
          <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[.94] tracking-[-.065em] md:text-7xl">Find things worth keeping.</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">Discover thoughtful products from sellers who care about the details, with clear help whenever the journey gets bumpy.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/search" className="btn bg-[#f7c66b] text-[#102235] hover:bg-[#ffe09a]">Start exploring <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/seller/apply" className="btn border border-white/25 text-white hover:bg-white/10">Sell on Halozon</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 animate-float">
          {promises.map(([Icon, label]) => (
            <div key={label} className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <Icon className="h-7 w-7 text-[#f7c66b]" />
              <b className="mt-5 block">{label}</b>
              <small className="mt-1 block text-slate-300">Built into every order</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
