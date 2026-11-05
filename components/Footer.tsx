import Link from 'next/link';
import { ArrowRight, Globe, ShieldCheck } from '@/lib/icons';

const groups = [
  ['Discover', [['New arrivals', '/search'], ['Deals', '/deals'], ['Halozon Plus', '/prime'], ['Compare', '/compare']]],
  ['Company', [['About', '/info/about'], ['Careers', '/info/careers'], ['Sustainability', '/info/sustainability'], ['Press', '/info/press']]],
  ['Sell', [['Become a seller', '/seller/apply'], ['Seller hub', '/seller/dashboard'], ['Advertise', '/info/advertise'], ['Affiliate program', '/info/affiliate']]],
  ['Support', [['Help center', '/help'], ['Orders', '/account/orders'], ['Returns', '/account/returns'], ['Privacy', '/privacy']]],
];

export default function Footer() {
  return (
    <footer className="mt-20 bg-[#17221c] text-[#c5d0c4]">
      <div className="shell grid gap-10 py-14 md:grid-cols-[1.4fr_2fr]">
        <div>
          <span className="hz-logo-mark">H</span>
          <h2 className="mt-5 text-2xl font-black tracking-tight text-white">Commerce with a point of view.</h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#9cae9c]">Find products worth keeping, sellers worth knowing, and a shopping experience with fewer surprises.</p>
          <div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#d7f36b]"><ShieldCheck className="h-4 w-4" /> Buyer protection on every order</div>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {groups.map(([title, items]) => (
            <div key={title as string}>
              <h3 className="mb-4 font-black text-white">{title}</h3>
              <ul className="space-y-3 text-sm">
                {(items as string[][]).map(([label, href]) => <li key={href}><Link className="group transition-colors hover:text-white" href={href}>{label}<ArrowRight className="ml-1 inline h-3 w-3 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" /></Link></li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="shell flex flex-col items-center justify-between gap-3 py-6 text-xs sm:flex-row">
          <span className="flex items-center gap-2"><b className="text-white">Halozon</b><span>© {new Date().getFullYear()} Halozon, Inc.</span></span>
          <span className="flex items-center gap-2"><Globe className="h-4 w-4" />English · USD</span>
          <span>Built for better everyday decisions.</span>
        </div>
      </div>
    </footer>
  );
}
