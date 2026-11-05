import Link from 'next/link';
import {ArrowRight,Globe,Mail} from '@/lib/icons';

const groups=[['Discover',[['New arrivals','/search'],['Deals','/deals'],['Halozon Plus','/prime'],['Categories','/search']]],['Company',[['About','/info/about'],['Careers','/info/careers'],['Sustainability','/info/sustainability'],['Press','/info/press']]],['Sell',[['Become a seller','/seller/apply'],['Seller hub','/seller/dashboard'],['Advertise','/info/advertise'],['Affiliate program','/info/affiliate']]],['Support',[['Help center','/help'],['Orders','/account/orders'],['Returns','/account/returns'],['Privacy','/privacy']]]];

export default function Footer(){
  return <footer className="mt-24 bg-[#263b3a] text-[#d8ddd3]">
    <div className="shell grid gap-10 py-14 lg:grid-cols-[1.4fr_2fr] lg:py-20">
      <div><Link href="/" className="flex items-center gap-2 text-white"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d96143] font-serif text-xl font-bold">H</span><span className="font-serif text-2xl font-bold">halozon</span></Link><p className="mt-6 max-w-sm font-serif text-2xl leading-tight text-[#f6f2ea]">A marketplace for things with a point of view.</p><p className="mt-5 max-w-sm text-sm leading-relaxed text-[#aeb9ac]">Discover thoughtful products, the people behind them, and a better way to bring them home.</p><Link href="/search" className="btn mt-7 bg-[#f6f2ea] text-[#263b3a]">Explore the edit <ArrowRight className="h-4 w-4"/></Link></div>
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">{groups.map(([title,items])=><div key={title as string}><h3 className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-[#e9b7a7]">{title}</h3><ul className="space-y-3 text-sm">{(items as string[][]).map(([label,href])=><li key={href}><Link className="transition-colors hover:text-white" href={href}>{label}</Link></li>)}</ul></div>)}</div>
    </div>
    <div className="border-t border-white/10"><div className="shell flex flex-col items-start justify-between gap-3 py-6 text-xs text-[#aeb9ac] sm:flex-row sm:items-center"><span className="flex items-center gap-2"><Mail className="h-4 w-4"/>Stories, drops, and useful things · hello@halozon.com</span><span className="flex items-center gap-4"><span className="flex items-center gap-2"><Globe className="h-4 w-4"/>English · USD</span><span>© {new Date().getFullYear()} Halozon, Inc.</span></span></div></div>
  </footer>
}
