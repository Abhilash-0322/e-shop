import Link from 'next/link';
import {ArrowRight,Compass,Sparkles,Gift,Home,Briefcase,Heart} from '@/lib/icons';

const prompts=[['I want to feel cozy','cozy',Home],['I need a thoughtful gift','gift',Gift],['I am upgrading my setup','workspace',Briefcase],['I want something joyful','joy',Heart]];

export default function Hero(){
  return <section className="shell pt-5 md:pt-7">
    <div className="discovery-hero">
      <div className="relative z-10 grid lg:grid-cols-[1.12fr_.88fr] gap-8 items-center px-6 py-10 md:px-12 md:py-16">
        <div className="animate-reveal">
          <span className="pill bg-white/60 text-[#2e6548]"><Compass className="w-3.5 h-3.5 mr-1"/>A gentler way to shop</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-[-.075em] leading-[.92] mt-5 max-w-2xl">Start with a feeling.</h1>
          <p className="text-lg text-[#516253] max-w-xl mt-6 leading-relaxed">You do not need the perfect search words. Follow a path, browse a mood, and find something that fits your life.</p>
          <div className="flex flex-wrap gap-2 mt-7">{prompts.map(([label,q,Icon])=>{const I=Icon as any;return <Link key={q as string} href={`/search?q=${q}`} className="discovery-chip"><I className="w-4 h-4"/>{label as string}</Link>})}</div>
          <div className="flex flex-wrap gap-3 mt-8"><Link href="#paths" className="btn btn-primary">Show me around <ArrowRight className="w-4 h-4"/></Link><Link href="/seller/apply" className="btn bg-white/60 text-[#2e6548] border border-[#b7cdb3]">Sell on Halozon</Link></div>
        </div>
        <div className="relative min-h-[18rem] animate-float">
          <div className="absolute right-3 top-3 w-[78%] rounded-[1.5rem] bg-[#fffdf9] border border-white/80 p-5 shadow-xl rotate-3"><p className="eyebrow">A path for today</p><h2 className="text-2xl font-black mt-2">Make space for good ideas.</h2><p className="muted text-sm mt-2">Small upgrades for a calmer desk, a brighter room, and a little more you.</p><div className="flex gap-2 mt-5"><span className="h-9 w-9 rounded-full bg-[#dcebd5]"/><span className="h-9 w-9 rounded-full bg-[#f1c75b]"/><span className="h-9 w-9 rounded-full bg-[#e9b09b]"/></div></div>
          <div className="absolute left-3 bottom-1 w-[60%] rounded-[1.25rem] bg-[#2e6548] text-white p-5 shadow-xl -rotate-6"><Sparkles className="w-6 h-6 text-[#f1c75b]"/><b className="block mt-7">Curated, not crowded.</b><span className="text-xs text-[#dcebd5] block mt-1">A few good places to begin.</span></div>
        </div>
      </div>
    </div>
  </section>
}
