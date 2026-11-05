import Link from 'next/link';
import { ArrowRight, Globe } from '@/lib/icons';

const groups = [
  ['Discover', [['New arrivals', '/search'], ['Deals', '/deals'], ['Halozon Plus', '/prime'], ['Categories', '/search']]],
  ['Company', [['About', '/info/about'], ['Careers', '/info/careers'], ['Sustainability', '/info/sustainability'], ['Press', '/info/press']]],
  ['Sell', [['Become a seller', '/seller/apply'], ['Seller hub', '/seller/dashboard'], ['Advertise', '/info/advertise'], ['Affiliate program', '/info/affiliate']]],
  ['Support', [['Help center', '/help'], ['Orders', '/account/orders'], ['Returns', '/account/returns'], ['Privacy', '/privacy']]],
];

export default function Footer() {
  return <footer className="mt-16 bg-slate-950 text-slate-300">
    <div className="shell grid grid-cols-2 gap-8 py-12 md:grid-cols-4 md:py-14">
      {groups.map(([title, items]) => <div key={title as string}>
        <h3 className="mb-4 font-black text-white">{title}</h3>
        <ul className="space-y-3 text-sm">
          {(items as string[][]).map(([label, href]) => <li key={href}><Link className="group transition-colors hover:text-white" href={href}>{label}<ArrowRight className="ml-1 inline h-3 w-3 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" /></Link></li>)}
        </ul>
      </div>)}
    </div>
    <div className="border-t border-white/10">
      <div className="shell flex flex-col items-start gap-3 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-2"><span className="hz-logo-mark !h-8 !w-8">H</span><b className="text-white">Halozon</b></span>
        <span className="flex items-center gap-2"><Globe className="h-4 w-4" /> English · USD</span>
        <span>© {new Date().getFullYear()} Halozon, Inc.</span>
      </div>
    </div>
  </footer>;
}
