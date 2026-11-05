import Link from 'next/link';
import { ArrowRight, Globe } from '@/lib/icons';

const groups = [
  ['Discover', [['New arrivals', '/search'], ['Deals', '/deals'], ['Halozon Plus', '/prime'], ['Categories', '/search']]],
  ['Company', [['About', '/info/about'], ['Careers', '/info/careers'], ['Sustainability', '/info/sustainability'], ['Press', '/info/press']]],
  ['Sell', [['Become a seller', '/seller/apply'], ['Seller hub', '/seller/dashboard'], ['Advertise', '/info/advertise'], ['Affiliate program', '/info/affiliate']]],
  ['Support', [['Help center', '/help'], ['Orders', '/account/orders'], ['Returns', '/account/returns'], ['Privacy', '/privacy']]],
];

export default function Footer() {
  return (
    <footer className="mt-20 bg-[#102235] text-slate-300">
      <div className="shell grid gap-10 py-14 md:grid-cols-[1.3fr_2fr]">
        <div>
          <span className="hz-logo-mark">H</span>
          <h2 className="mt-5 text-2xl font-black text-white">Good shopping, with a way back.</h2>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">Clear products, trusted sellers, and support that helps you recover when plans change.</p>
          <Link href="/help" className="btn mt-6 bg-[#f7c66b] text-[#102235] hover:bg-[#ffe09a]">Visit support <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {groups.map(([title, items]) => <div key={title as string}><h3 className="mb-4 font-bold text-white">{title as string}</h3><ul className="space-y-3 text-sm">{(items as string[][]).map(([label, href]) => <li key={href}><Link className="transition-colors hover:text-white" href={href}>{label}<ArrowRight className="ml-1 inline h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" /></Link></li>)}</ul></div>)}
        </div>
      </div>
      <div className="border-t border-white/10"><div className="shell flex flex-col items-center justify-between gap-3 py-6 text-xs sm:flex-row"><span className="flex items-center gap-2"><b className="text-white">Halozon</b><span>· Considered commerce</span></span><span className="flex items-center gap-2"><Globe className="h-4 w-4" /> English · USD</span><span>© {new Date().getFullYear()} Halozon, Inc.</span></div></div>
    </footer>
  );
}
