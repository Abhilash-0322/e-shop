'use client';
import Link from 'next/link';
import {ArrowRight,ShieldCheck,Truck,Lock,Star,Sparkles} from '@/lib/icons';
export default function Hero(){return <section className="relative overflow-hidden bg-zinc-950 text-white">
 <div className="absolute inset-0 opacity-70 iridescent"/><div className="absolute inset-0 bg-zinc-950/75"/>
 <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-violet-400/25 blur-3xl animate-float"/><div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-teal-300/15 blur-3xl animate-float"/>
 <div className="shell relative py-16 md:py-24">
  <div className="grid lg:grid-cols-[1.05fr_.95fr] items-end gap-12"><div className="animate-reveal"><span className="pill bg-white/10 text-zinc-200 border border-white/15"><Sparkles className="w-3 h-3 mr-2 inline"/> The new way to browse</span><h1 className="text-5xl md:text-8xl font-black tracking-[-.075em] leading-[.88] mt-6 max-w-3xl">Good things,<br/><span className="text-zinc-400">well found.</span></h1><p className="text-base md:text-lg text-zinc-300 max-w-xl mt-7 leading-relaxed">A considered marketplace for objects with a point of view — from independent sellers you can trust.</p><div className="flex flex-wrap gap-3 mt-8"><Link href="/search" className="btn bg-white text-zinc-950 hover:bg-zinc-200">Explore the collection <ArrowRight className="w-4 h-4"/></Link><Link href="/seller/apply" className="btn btn-outline hover:bg-white/10">Sell on Halozon</Link></div></div>
   <div className="grid grid-cols-2 gap-3 animate-float">{[[Truck,'Fast, thoughtful fulfillment'],[ShieldCheck,'Protected purchases'],[Lock,'Private by design'],[Star,'Trusted by design']].map(([I,label])=>{const Icon=I as any;return <div key={String(label)} className="edge-light rounded-2xl bg-white/[.08] p-5 md:p-6"><Icon className="w-6 h-6 text-teal-200"/><b className="block mt-8 text-sm">{String(label)}</b><small className="text-zinc-400 block mt-1">Built into every order</small></div>})}</div>
  </div>
  <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/15 pt-5 text-[10px] uppercase tracking-[.2em] text-zinc-400"><span>Curated daily</span><span>Independent makers</span><span>Carbon-aware delivery</span><span>Human support, always</span></div>
 </div>
</section>}
