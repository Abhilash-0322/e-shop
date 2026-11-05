import Link from 'next/link';
import {ArrowRight} from '@/lib/icons';
import LocaleSelector from './LocaleSelector';

const groups = [
  ['Discover', [['New arrivals', '/search'], ['Deals', '/deals'], ['Halozon Plus', '/prime'], ['Categories', '/search']]],
  ['Company', [['About', '/info/about'], ['Careers', '/info/careers'], ['Sustainability', '/info/sustainability'], ['Press', '/info/press']]],
  ['Sell', [['Become a seller', '/seller/apply'], ['Seller hub', '/seller/dashboard'], ['Advertise', '/info/advertise'], ['Affiliate program', '/info/affiliate']]],
  ['Support', [['Help center', '/help'], ['Orders', '/account/orders'], ['Returns', '/account/returns'], ['Privacy', '/privacy']]],
] as const;

export default function Footer() {
  return <footer className="mt-20 bg-slate-950 text-slate-300">
    <div className="shell grid gap-8 py-14 sm:grid-cols-2 md:grid-cols-4">
      {groups.map(([title, items]) => <div key={title}>
        <h3 className="mb-4 font-bold text-white">{title}</h3>
        <ul className="space-y-2 text-sm">{items.map(([label, href]) => <li key={href}><Link className="group text-wrap transition-colors hover:text-white" href={href}>{label}<ArrowRight className="ml-1 inline h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true"/></Link></li>)}</ul>
      </div>)}
    </div>
    <div className="border-t border-white/10">
      <div className="shell flex flex-col items-start gap-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-2"><span className="hz-logo-mark !h-8 !w-8">H</span><b className="text-white">Halozon</b></span>
        <LocaleSelector compact idPrefix="footer-locale"/>
        <span>© {new Date().getFullYear()} Halozon, Inc.</span>
      </div>
    </div>
  </footer>;
}
