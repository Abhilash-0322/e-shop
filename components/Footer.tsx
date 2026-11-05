import Link from 'next/link';
import {ArrowRight, Globe, ShieldCheck, Sparkles} from '@/lib/icons';

const groups = [
  ['Discover', [['New arrivals', '/search'], ['Deals', '/deals'], ['Halozon Plus', '/prime'], ['Categories', '/search']]],
  ['Company', [['About', '/info/about'], ['Careers', '/info/careers'], ['Sustainability', '/info/sustainability'], ['Press', '/info/press']]],
  ['Sell', [['Become a seller', '/seller/apply'], ['Seller hub', '/seller/dashboard'], ['Advertise', '/info/advertise'], ['Affiliate program', '/info/affiliate']]],
  ['Support', [['Help center', '/help'], ['Orders', '/account/orders'], ['Returns', '/account/returns'], ['Privacy', '/privacy']]],
];

export default function Footer() {
  return (
    <footer className="mt-20 bg-slate-950 text-slate-300">
      <div className="shell grid gap-10 py-14 md:grid-cols-[1.25fr_2fr]">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="hz-logo-mark">H</span>
            <span className="text-lg font-black tracking-tight text-white">Halozon</span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-400">A calmer marketplace for discovering products worth keeping and sellers worth knowing.</p>
          <div className="mt-6 flex items-center gap-2 text-xs text-slate-400"><ShieldCheck className="h-4 w-4 text-emerald-400" /> Built around clear choices</div>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {groups.map(([title, items]) => (
            <div key={title as string}>
              <h3 className="mb-4 text-sm font-bold text-white">{title as string}</h3>
              <ul className="space-y-3 text-sm">
                {(items as string[][]).map(([label, href]) => (
                  <li key={href}>
                    <Link className="group inline-flex items-center transition-colors hover:text-white" href={href}>
                      {label}<ArrowRight className="ml-1 h-3 w-3 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="shell flex flex-col items-start justify-between gap-3 py-6 text-xs text-slate-400 sm:flex-row sm:items-center">
          <span className="flex items-center gap-2"><Globe className="h-4 w-4" /> English · USD</span>
          <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-fuchsia-300" /> © {new Date().getFullYear()} Halozon, Inc.</span>
        </div>
      </div>
    </footer>
  );
}
