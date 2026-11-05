import Link from 'next/link';
import {ArrowRight, Globe} from '@/lib/icons';

const groups = [
  ['Discover', [['New arrivals', '/search'], ['Deals', '/deals'], ['Halozon Plus', '/prime'], ['Categories', '/search']]],
  ['Company', [['About', '/info/about'], ['Careers', '/info/careers'], ['Sustainability', '/info/sustainability'], ['Press', '/info/press']]],
  ['Sell', [['Become a seller', '/seller/apply'], ['Seller hub', '/seller/dashboard'], ['Advertise', '/info/advertise'], ['Affiliate program', '/info/affiliate']]],
  ['Support', [['Help center', '/help'], ['Orders', '/account/orders'], ['Returns', '/account/returns'], ['Privacy', '/privacy']]],
] as const;

export default function Footer() {
  return (
    <footer className="mt-20 bg-slate-950 text-slate-200">
      <div className="shell grid grid-cols-2 gap-8 py-14 md:grid-cols-4">
        {groups.map(([title, items]) => (
          <nav key={title} aria-labelledby={`footer-${title.toLowerCase()}`}>
            <h2 id={`footer-${title.toLowerCase()}`} className="mb-4 text-base font-bold text-white">{title}</h2>
            <ul className="space-y-3 text-sm">
              {items.map(([label, href]) => (
                <li key={href}>
                  <Link className="group inline-flex min-h-8 items-center gap-1 rounded hover:text-white" href={href}>
                    {label}<ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-white/15">
        <div className="shell flex flex-col items-center justify-between gap-3 py-6 text-xs sm:flex-row">
          <Link href="/" className="flex min-h-8 items-center gap-2 rounded" aria-label="Halozon home">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-black text-white" aria-hidden="true">H</span>
            <b className="text-white">Halozon</b>
          </Link>
          <span className="flex items-center gap-2"><Globe className="h-4 w-4" aria-hidden="true" /> English · USD</span>
          <span>© {new Date().getFullYear()} Halozon, Inc.</span>
        </div>
      </div>
    </footer>
  );
}
