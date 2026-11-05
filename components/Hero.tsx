'use client';

import Link from 'next/link';
import { ArrowRight, Lock, ShieldCheck, Star, Truck } from '@/lib/icons';

export default function Hero() {
  const proof = [[Truck, 'Fast fulfillment'], [ShieldCheck, 'Buyer protection'], [Lock, 'Secure checkout'], [Star, 'Top-rated sellers']] as const;
  return (
    <section className="border-b-2 border-black bg-black text-white">
      <div className="shell grid items-center gap-10 py-16 md:py-24 lg:grid-cols-[1.15fr_.85fr]">
        <div className="animate-reveal">
          <span className="pill">A better marketplace</span>
          <h1 className="mt-6 max-w-3xl text-5xl font-black uppercase leading-[.88] tracking-[-.08em] md:text-8xl">Buy less.<br /><span className="text-[#d7ff3f]">Choose better.</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/70">A high-signal shopping experience built around trusted sellers, honest value, and products worth keeping.</p>
          <div className="mt-8 flex flex-wrap gap-4"><Link href="/search" className="btn border-white bg-[#d7ff3f] text-black">Start exploring <ArrowRight className="h-4 w-4" /></Link><Link href="/seller/apply" className="btn border-white bg-transparent text-white hover:bg-white hover:text-black">Sell on Halozon</Link></div>
          <div className="mt-10 border-t-2 border-white/20 pt-4 text-xs font-black uppercase tracking-widest text-white/50">Independent commerce / shipping worldwide</div>
        </div>
        <div className="grid grid-cols-2 gap-3 animate-float">
          {proof.map(([Icon, label], index) => <div key={label} className={`border-2 border-white p-5 ${index === 0 ? 'bg-[#ff5c35] text-black' : 'bg-white/5'}`}><Icon className="h-7 w-7 text-[#d7ff3f]" /><b className="mt-8 block text-sm uppercase">{label}</b><small className="mt-1 block text-xs text-white/50">Built into every order</small></div>)}
        </div>
      </div>
    </section>
  );
}
