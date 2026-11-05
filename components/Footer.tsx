import Link from 'next/link';
import { ExternalLink, Globe } from '@/lib/icons';

const groups = [
  ['Discover', [['New arrivals', '/search'], ['Deals', '/deals'], ['Halozon Plus', '/prime'], ['Categories', '/search']]],
  ['Company', [['About', '/info/about'], ['Careers', '/info/careers'], ['Sustainability', '/info/sustainability'], ['Press', '/info/press']]],
  ['Sell', [['Become a seller', '/seller/apply'], ['Seller hub', '/seller/dashboard'], ['Advertise', '/info/advertise'], ['Affiliate program', '/info/affiliate']]],
  ['Support', [['Help center', '/help'], ['Orders', '/account/orders'], ['Returns', '/account/returns'], ['Privacy', '/privacy']]],
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t-2 border-black bg-black text-white">
      <div className="shell grid gap-8 py-12 md:grid-cols-[1.4fr_2fr]">
        <div>
          <div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center border-2 border-white bg-[#d7ff3f] text-2xl font-black text-black">H</span><span className="text-2xl font-black uppercase tracking-[-.08em]">Halozon</span></div>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/60">A high-signal marketplace for products worth keeping. Built for curious buyers and independent sellers.</p>
          <div className="mt-8 inline-flex items-center gap-2 border-2 border-white/30 px-3 py-2 text-xs font-black uppercase"><Globe className="h-4 w-4 text-[#d7ff3f]" /> English · USD</div>
        </div>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {groups.map(([title, items]) => <div key={title as string}><h3 className="mb-4 text-xs font-black uppercase tracking-widest text-[#d7ff3f]">{title}</h3><ul className="space-y-3 text-sm text-white/70">{(items as string[][]).map(([label, href]) => <li key={href}><Link className="hover:text-[#d7ff3f]" href={href}>{label} <ExternalLink className="inline h-3 w-3" /></Link></li>)}</ul></div>)}
        </div>
      </div>
      <div className="border-t-2 border-white/20"><div className="shell flex flex-col justify-between gap-3 py-5 text-xs text-white/50 sm:flex-row"><span>© {new Date().getFullYear()} Halozon, Inc.</span><div className="flex gap-5"><Link href="/conditions" className="hover:text-white">Terms</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/help" className="hover:text-white">Help</Link></div><span>HZN / OPEN COMMERCE</span></div></div>
    </footer>
  );
}
