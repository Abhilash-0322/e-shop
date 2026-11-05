'use client';

import Link from 'next/link';
import {ArrowRight, Lock, ShieldCheck, Star, Truck} from '@/lib/icons';

const benefits = [
  [Truck, 'Fast fulfillment'],
  [ShieldCheck, 'Buyer protection'],
  [Lock, 'Secure checkout'],
  [Star, 'Top-rated sellers'],
] as const;

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white" aria-labelledby="hero-title">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-indigo-900 blur-3xl animate-float" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-cyan-950 blur-3xl animate-float" aria-hidden="true" />
      <div className="shell relative grid items-center gap-10 py-20 lg:grid-cols-[1.1fr_.9fr] md:py-28">
        <div className="animate-reveal">
          <span className="pill border border-indigo-300/40 bg-indigo-950 text-indigo-100">A better marketplace</span>
          <h1 id="hero-title" className="mt-5 text-5xl font-black leading-[.98] tracking-[-.06em] md:text-7xl">Discover the things that move you.</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-200">A considered shopping experience built around trusted sellers, honest value, and products worth keeping.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/search" className="btn bg-white text-indigo-900 hover:bg-indigo-50">Start exploring <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            <Link href="/seller/apply" className="btn border border-white/60 text-white hover:bg-white/10">Sell on Halozon</Link>
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-4 animate-float" aria-label="Halozon benefits">
          {benefits.map(([Icon, label]) => (
            <li key={label} className="rounded-2xl border border-slate-600 bg-slate-900/90 p-6 text-white">
              <Icon className="h-7 w-7 text-cyan-300" aria-hidden="true" />
              <b className="mt-5 block">{label}</b>
              <small className="mt-1 block text-slate-300">Built into every order</small>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
