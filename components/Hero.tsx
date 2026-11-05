import Link from 'next/link';
import {ArrowRight,Heart,Leaf,Sun,Users} from '@/lib/icons';

export default function Hero(){
  return <section className="relative overflow-hidden bg-[#263b3a] text-[#f6f2ea]">
    <div className="absolute -right-20 -top-28 h-96 w-96 rounded-full border-[38px] border-[#d96143]/25"/>
    <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[#66735f]/40 blur-3xl"/>
    <div className="shell relative grid gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
      <div className="animate-reveal"><span className="pill bg-white/10 text-[#e9b7a7]">The Halozon edit · 01</span><h1 className="display-serif mt-6 max-w-3xl text-6xl md:text-8xl">Things worth making room for.</h1><p className="mt-7 max-w-xl text-lg leading-relaxed text-[#c5d0c4]">A slower, more considered way to shop: find beautiful, useful things and the people who bring them to life.</p><div className="mt-9 flex flex-wrap gap-3"><Link href="/search" className="btn bg-[#f6f2ea] text-[#263b3a]">Enter the edit <ArrowRight className="h-4 w-4"/></Link><Link href="/seller/apply" className="btn border border-white/25 text-white hover:bg-white/10">Tell your story</Link></div></div>
      <div className="story-grid animate-float">
        <div className="story-panel col-span-7 bg-[#d96143] p-5"><Sun className="relative z-10 h-7 w-7 text-[#f6f2ea]"/><div className="absolute bottom-5 left-5 z-10"><p className="text-xs uppercase tracking-[.18em] text-white/70">A new ritual</p><p className="mt-1 font-serif text-3xl leading-none">Make everyday feel intentional.</p></div></div>
        <div className="story-panel col-span-5 bg-[#e9e2d6] p-5 text-[#263b3a]"><Leaf className="relative z-10 h-7 w-7"/><div className="absolute bottom-5 left-5 z-10"><p className="text-xs uppercase tracking-[.18em] text-[#66735f]">Good to keep</p><p className="mt-1 font-serif text-2xl leading-none">Objects with a longer life.</p></div></div>
        <div className="story-panel col-span-5 min-h-[190px] bg-[#66735f] p-5"><Heart className="relative z-10 h-7 w-7 text-[#e9b7a7]"/><div className="absolute bottom-5 left-5 z-10"><p className="text-xs uppercase tracking-[.18em] text-white/70">People first</p><p className="mt-1 font-serif text-2xl leading-none">Meet the makers.</p></div></div>
        <div className="story-panel col-span-7 min-h-[190px] bg-[#b8c6c0] p-5 text-[#263b3a]"><Users className="relative z-10 h-7 w-7"/><div className="absolute bottom-5 left-5 z-10"><p className="text-xs uppercase tracking-[.18em] text-[#263b3a]/60">Curated discovery</p><p className="mt-1 font-serif text-2xl leading-none">A little less noise.</p></div></div>
      </div>
    </div>
  </section>
}
