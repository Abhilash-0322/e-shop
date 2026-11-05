'use client';

import Link from 'next/link';
import {ArrowRight,CheckCircle2,MessageCircle,ShieldCheck,Star,Truck} from '@/lib/icons';

export default function Hero(){
  const signals=[[Star,'4.8 average rating','from 12,400+ reviews'],[CheckCircle2,'94% verified buyers','purchase-backed feedback'],[MessageCircle,'8.6k answers shared','questions from shoppers'],[Truck,'97% on-time dispatch','seller performance signal']] as const;
  return <section className="relative overflow-hidden bg-[#173f32] text-white">
    <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#f2b47e]/20 blur-3xl animate-float"/>
    <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[#8bd5a8]/15 blur-3xl animate-float"/>
    <div className="shell relative grid lg:grid-cols-[1.05fr_.95fr] items-center gap-12 py-16 md:py-24">
      <div className="animate-reveal">
        <span className="pill bg-white/10 text-[#dff3e5] border border-white/15">Community-led commerce</span>
        <h1 className="text-5xl md:text-7xl font-black tracking-[-.065em] leading-[.93] mt-5">Buy with a little more confidence.</h1>
        <p className="text-lg text-[#cfe2d5] max-w-xl mt-6 leading-relaxed">Real reviews, useful answers, and sellers who stand behind what they ship. The signals you need, before you click buy.</p>
        <div className="flex flex-wrap gap-3 mt-8"><Link href="/search" className="btn bg-[#f2b47e] text-[#173f32] hover:bg-[#ffd0a8]">Explore community picks <ArrowRight className="w-4 h-4"/></Link><Link href="/seller/apply" className="btn border border-white/25 text-white hover:bg-white/10">Become a trusted seller</Link></div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-7 text-xs text-[#b7d1c0]"><span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#8bd5a8]"/> Verified-buyer reviews</span><span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#8bd5a8]"/> Buyer protection</span><span className="flex items-center gap-1.5"><MessageCircle className="w-4 h-4 text-[#8bd5a8]"/> Helpful answers</span></div>
      </div>
      <div className="relative">
        <div className="absolute -inset-5 rounded-[2rem] bg-white/5 rotate-2"/>
        <div className="relative rounded-[1.7rem] border border-white/15 bg-[#255743]/80 p-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4"><div><p className="text-xs uppercase tracking-[.18em] text-[#a9d4b7]">The community signal</p><p className="font-bold mt-1">What shoppers look for</p></div><span className="rounded-full bg-[#e5f4e9] px-2.5 py-1 text-xs font-bold text-[#236546]">Live</span></div>
          <div className="space-y-3 mt-4">{signals.map(([I,title,detail])=>{const Icon=I as any;return <div key={title} className="flex items-center gap-3 rounded-xl bg-white/8 p-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2b47e]/15 text-[#f2b47e]"><Icon className="w-5 h-5"/></span><div><b className="block text-sm">{title}</b><small className="text-[#b7d1c0]">{detail}</small></div></div>})}</div>
          <div className="mt-4 rounded-xl bg-[#173f32] p-4 text-sm text-[#dff3e5]"><span className="text-[#f2b47e]">“</span> The best marketplace experiences make the useful details easy to find. <span className="text-[#f2b47e]">”</span><small className="block mt-2 text-[#8fbca0]">— Maya, verified Halozon shopper</small></div>
        </div>
      </div>
    </div>
  </section>;
}
