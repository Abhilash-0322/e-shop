import Link from 'next/link';
import { ArrowUpRight, Heart, MapPin, Package, ShieldCheck, Sparkles } from '@/lib/icons';

const actions = [
  ['Orders', 'Track, review, and manage purchases.', '/account/orders', Package],
  ['Wishlist', 'Keep the things you love close.', '/account/wishlist', Heart],
  ['Addresses', 'Manage delivery destinations.', '/account/addresses', MapPin],
  ['Payment', 'Manage saved payment methods.', '/account/payment', ShieldCheck],
  ['Halozon Plus', 'Priority delivery and member drops.', '/prime', Sparkles],
  ['Security', 'Keep your account protected.', '/account/security', ShieldCheck],
] as const;

export default function Account() {
  return (
    <div>
      <div className="workspace-toolbar"><div><p className="eyebrow">Shopper workspace</p><h1 className="page-title mt-2">Your account</h1><p className="muted mt-3 text-sm">Everything you need to manage your Halozon experience.</p></div><span className="hidden rounded-full bg-emerald-50 px-3 py-2 text-[11px] font-extrabold text-emerald-700 sm:block">Workspace ready</span></div>
      <div className="command-board mb-6 p-6"><div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow !text-[#9af3e4]">Next best action</p><h2 className="mt-2 text-2xl font-black">Keep your orders moving.</h2><p className="mt-2 text-sm text-slate-300">Your account is the control surface for every purchase decision.</p></div><Link href="/search" className="btn bg-white text-slate-900">Continue exploring <ArrowUpRight className="h-4 w-4" /></Link></div></div>
      <div className="grid gap-3 sm:grid-cols-2">{actions.map(([title, detail, href, Icon]) => <Link key={href} href={href} className="action-tile group"><span className="action-tile-icon"><Icon className="h-4 w-4" /></span><span><h2 className="mt-3 text-sm font-black group-hover:text-indigo-700">{title}</h2><p className="muted mt-1 text-xs">{detail}</p></span><span className="mt-4 text-[11px] font-extrabold text-indigo-600">Open workspace →</span></Link>)}</div>
    </div>
  );
}
