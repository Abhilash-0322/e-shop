'use client';

import Link from 'next/link';
import type {LucideIcon} from 'lucide-react';
import {ArrowRight, Lock, ShieldCheck, Star, Truck} from '@/lib/icons';

const highlights: [LucideIcon, string][] = [
  [Truck, 'Fast fulfillment'],
  [ShieldCheck, 'Buyer protection'],
  [Lock, 'Secure checkout'],
  [Star, 'Top-rated sellers'],
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-900 text-white">
      <div className="animate-float absolute -right-24 -top-24 h-96 w-96 rounded-full bg-fuchsia-500/25 blur-3xl" />
      <div className="animate-float absolute bottom-0 -left-24 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="shell relative grid items-center gap-10 py-20 lg:grid-cols-[1.1fr_.9fr] md:py-28">
        <div className="animate-reveal">
          <span className="pill border border-white/20 bg-white/15 text-indigo-100">A better marketplace</span>
          <h1 className="mt-5 text-5xl font-black leading-[.95] tracking-[-.06em] md:text-7xl">Discover the things that move you.</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-indigo-100">A considered shopping experience built around trusted sellers, honest value, and products worth keeping.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/search" className="btn bg-white text-indigo-700 hover:bg-indigo-50">Start exploring <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/seller/apply" className="btn border border-white/30 text-white hover:bg-white/10">Sell on Halozon</Link>
          </div>
        </div>
        <div className="animate-float grid grid-cols-2 gap-4">
          {highlights.map(([Icon, label]) => (
            <div key={label} className="surface border-white/15 bg-white/10 p-6 text-white">
              <Icon className="h-7 w-7 text-cyan-300" />
              <b className="mt-5 block">{label}</b>
              <small className="mt-1 block text-indigo-200">Built into every order</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
