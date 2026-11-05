'use client';

import Link from 'next/link';
import {ArrowRight, Lock, ShieldCheck, Star, Truck} from '@/lib/icons';

const promises = [
  [Truck, 'Fast fulfillment', 'Reliable delivery signals'],
  [ShieldCheck, 'Buyer protection', 'Support when you need it'],
  [Lock, 'Secure checkout', 'Your details stay yours'],
  [Star, 'Top-rated sellers', 'Quality you can see'],
] as const;

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl animate-float" />
      <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-emerald-400/15 blur-3xl animate-float" />
      <div className="shell relative grid items-center gap-12 py-20 md:py-28 lg:grid-cols-[1.08fr_.92fr]">
        <div className="animate-reveal">
          <span className="pill border border-white/15 bg-white/10 text-brand-100">A better marketplace</span>
          <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[.95] tracking-[-.07em] md:text-7xl">Discover the things that move you.</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">A considered shopping experience built around trusted sellers, honest value, and products worth keeping.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/search" className="btn bg-white text-brand-700 hover:bg-brand-50">Start exploring <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/seller/apply" className="btn border border-white/25 text-white hover:bg-white/10">Sell on Halozon</Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400">
            <span>10k+ products</span><span>4.9 average seller rating</span><span>24/7 support</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-4 animate-float">
          {promises.map(([Icon, title, body]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[.08] p-5 backdrop-blur-xl md:p-6">
              <Icon className="h-7 w-7 text-emerald-300" />
              <b className="mt-5 block">{title}</b>
              <small className="mt-1 block leading-relaxed text-slate-400">{body}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
