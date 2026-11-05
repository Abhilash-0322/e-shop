'use client';

import Link from 'next/link';
import { ArrowRight, Lock, ShieldCheck, Star, Truck } from '@/lib/icons';

export default function Hero() {
  const promises = [[Truck, 'Fast fulfillment'], [ShieldCheck, 'Buyer protection'], [Lock, 'Secure checkout'], [Star, 'Top-rated sellers']] as const;
  return <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-900 text-white">
    <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-fuchsia-500/25 blur-3xl animate-float" aria-hidden="true" />
    <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl animate-float" aria-hidden="true" />
    <div className="shell relative grid items-center gap-10 py-14 md:py-24 lg:grid-cols-[1.1fr_.9fr]">
      <div className="animate-reveal">
        <span className="pill border border-white/20 bg-white/15 text-indigo-100">A better marketplace</span>
        <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[.97] tracking-[-.07em] sm:text-5xl md:text-7xl">Discover the things that move you.</h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-indigo-100 sm:text-lg">A considered shopping experience built around trusted sellers, honest value, and products worth keeping.</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link href="/search" className="btn min-h-12 bg-white text-indigo-700 hover:bg-indigo-50">Start exploring <ArrowRight className="h-4 w-4" /></Link>
          <Link href="/seller/apply" className="btn min-h-12 border border-white/30 text-white hover:bg-white/10">Sell on Halozon</Link>
        </div>
        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-indigo-100"><span>✓ Curated sellers</span><span>✓ Clear returns</span><span>✓ Human support</span></div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 animate-float">
        {promises.map(([Icon, label]) => <div key={label} className="surface border-white/15 bg-white/10 p-4 text-white sm:p-6"><Icon className="h-6 w-6 text-cyan-300 sm:h-7 sm:w-7" /><b className="mt-4 block text-sm sm:mt-5 sm:text-base">{label}</b><small className="mt-1 block text-xs text-indigo-200">Built into every order</small></div>)}
      </div>
    </div>
  </section>;
}
