'use client';

import Link from 'next/link';
import { ArrowRight, Lock, ShieldCheck, Star, Truck } from '@/lib/icons';

const promises = [[Truck, 'Fast fulfillment', 'Arrives when promised'], [ShieldCheck, 'Buyer protection', 'Clarity at every step'], [Lock, 'Secure checkout', 'Your details stay yours'], [Star, 'Top-rated sellers', 'People worth buying from']] as const;

export default function Hero() {
  return <section className="relative overflow-hidden bg-[#11142f] text-white">
    <div className="glow-orb -right-24 -top-28 h-96 w-96 bg-fuchsia-500/30 blur-3xl animate-float" />
    <div className="glow-orb -left-24 bottom-0 h-80 w-80 bg-cyan-400/20 blur-3xl animate-drift" />
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
    <div className="shell relative grid lg:grid-cols-[1.02fr_.98fr] items-center gap-10 py-16 md:py-24">
      <div className="animate-reveal">
        <span className="pill bg-white/10 text-indigo-100 border border-white/15">The marketplace with a point of view</span>
        <h1 className="text-5xl md:text-7xl font-black tracking-[-.07em] leading-[.92] mt-5 max-w-3xl">Good finds.<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-200 to-fuchsia-300">Better energy.</span></h1>
        <p className="text-lg text-indigo-100 max-w-xl mt-6 leading-relaxed">Discover products, people, and little upgrades that fit the way you live. Thoughtful shopping, without the noise.</p>
        <div className="flex flex-wrap gap-3 mt-8"><Link href="/search" className="btn bg-white text-indigo-700 hover:bg-indigo-50">Start exploring <ArrowRight className="w-4 h-4" /></Link><Link href="/seller/apply" className="btn border border-white/25 text-white hover:bg-white/10">Open a store</Link></div>
        <div className="flex items-center gap-3 mt-9 text-xs text-indigo-200"><span className="flex -space-x-2">{['#f7c6a3', '#b7d8ff', '#e9b7e9', '#c8e7c1'].map((color) => <span key={color} className="w-7 h-7 rounded-full border-2 border-[#11142f]" style={{ background: color }} />)}</span><span><b className="text-white">12k+</b> independent sellers are building here</span></div>
      </div>
      <div className="relative min-h-[360px] lg:min-h-[440px]">
        <div className="absolute right-2 top-5 md:right-10 w-[80%] h-[78%] rounded-[2.2rem] bg-gradient-to-br from-indigo-500/80 via-violet-500/50 to-fuchsia-500/40 rotate-3 shadow-[0_35px_80px_rgba(0,0,0,.35)]" />
        <div className="bento absolute inset-5 md:inset-8 p-5 md:p-7 rotate-[-3deg] animate-float">
          <div className="flex justify-between items-start"><div><p className="eyebrow !text-cyan-200">Curated signal</p><h2 className="text-3xl font-black mt-2">Find your next<br />favorite thing.</h2></div><span className="h-11 w-11 rounded-2xl bg-white/10 flex items-center justify-center text-cyan-200">✦</span></div>
          <div className="grid grid-cols-2 gap-3 mt-8">{promises.map(([Icon, label, detail]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[.07] p-4"><Icon className="w-6 h-6 text-cyan-300" /><b className="block mt-5 text-sm">{label}</b><small className="text-indigo-200 block mt-1">{detail}</small></div>)}</div>
          <div className="flex items-center justify-between mt-5 text-xs text-indigo-200"><span>Live marketplace pulse</span><span className="flex items-center gap-1 text-emerald-300"><i className="w-1.5 h-1.5 rounded-full bg-emerald-300" />All systems bright</span></div>
        </div>
      </div>
    </div>
  </section>;
}
