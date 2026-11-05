import Link from 'next/link';
import {ArrowRight,Globe,ShieldCheck} from '@/lib/icons';

const groups=[['Discover',[['New arrivals','/search'],['Deals','/deals'],['Halozon Plus','/prime'],['Categories','/search']]],['Company',[['About','/info/about'],['Careers','/info/careers'],['Sustainability','/info/sustainability'],['Press','/info/press']]],['Sell',[['Become a seller','/seller/apply'],['Seller hub','/seller/dashboard'],['Advertise','/info/advertise'],['Affiliate program','/info/affiliate']]],['Support',[['Help center','/help'],['Orders','/account/orders'],['Returns','/account/returns'],['Privacy','/privacy']]]];

export default function Footer(){
  return <footer className="mt-20 bg-[#173f32] text-[#cfe2d5]">
    <div className="shell py-12 grid lg:grid-cols-[1.4fr_2fr] gap-12">
      <div><div className="flex items-center gap-2"><span className="hz-logo-mark !h-9 !w-9 !bg-[#e5f4e9] !text-[#173f32]">H</span><b className="text-white text-xl tracking-tight">Halozon</b></div><p className="text-sm leading-relaxed mt-5 max-w-sm text-[#b7d1c0]">A marketplace shaped by real people. Clear signals, good sellers, and better decisions for everyday shopping.</p><div className="flex items-center gap-2 mt-6 text-xs text-[#dff3e5]"><ShieldCheck className="w-4 h-4 text-[#f2b47e]"/> Buyer protection is built into every order.</div></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">{groups.map(([title,items])=><div key={title as string}><h3 className="text-white font-bold mb-4">{title}</h3><ul className="space-y-3 text-sm">{(items as string[][]).map(([label,href])=><li key={href}><Link className="hover:text-white transition-colors" href={href}>{label}<ArrowRight className="inline w-3 h-3 ml-1 opacity-0 group-hover:opacity-100"/></Link></li>)}</ul></div>)}</div>
    </div>
    <div className="border-t border-white/10"><div className="shell py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs"><span className="flex items-center gap-2"><Globe className="w-4 h-4"/>English · USD</span><span>© {new Date().getFullYear()} Halozon, Inc. · Made for confident shopping.</span></div></div>
  </footer>;
}
