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
    <footer className="mt-20 bg-[#101828] text-slate-400">
      <div className="shell grid gap-10 py-12 md:grid-cols-[1.2fr_2fr]">
        <div>
          <div className="flex items-center gap-2 text-white">
            <span className="command-brand-mark">H</span>
            <b className="text-lg tracking-tight">Halozon</b>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">A calm command center for discovering, deciding, and keeping every order moving.</p>
          <Link href="/help" className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[#9af3e4]">Open support <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {groups.map(([title, items]) => (
            <div key={title as string}>
              <h3 className="mb-4 text-xs font-extrabold uppercase tracking-[.14em] text-white">{title}</h3>
              <ul className="space-y-2.5 text-xs">
                {(items as string[][]).map(([label, href]) => <li key={href}><Link className="transition hover:text-white" href={href}>{label}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="shell flex flex-col items-center justify-between gap-3 py-5 text-[11px] sm:flex-row">
          <span className="flex items-center gap-2"><Globe className="h-3.5 w-3.5" /> English · USD</span>
          <span>© {new Date().getFullYear()} Halozon, Inc.</span>
        </div>
      </div>
    </footer>
  );
}
