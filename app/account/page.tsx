import Link from 'next/link';
import { ArrowRight, Heart, MapPin, Package, ShieldCheck, Sparkles } from '@/lib/icons';

const cards = [
  [Package, 'Orders', 'Track, review, and manage purchases.', '/account/orders', 'Keep every delivery in view.'],
  [Heart, 'Wishlist', 'Keep the things you love close.', '/account/wishlist', 'Your saved shortlist.'],
  [MapPin, 'Addresses', 'Manage delivery destinations.', '/account/addresses', 'Ship where life happens.'],
  [Sparkles, 'Halozon Plus', 'Priority delivery and member drops.', '/prime', 'More perks, less waiting.'],
  [ShieldCheck, 'Security', 'Keep your account protected.', '/account/security', 'Your details, your control.'],
];

export default function Account() {
  return (
    <div>
      <div className="surface overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50 p-7 md:p-9">
        <p className="eyebrow">Your workspace</p>
        <h1 className="page-title mt-2">Make shopping feel like yours.</h1>
        <p className="muted mt-3 max-w-xl">Manage orders, keep a considered wishlist, and shape the details that make every Halozon delivery easier.</p>
        <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-indigo-700"><span className="rounded-full bg-white px-3 py-2 shadow-sm">Buyer protection included</span><span className="rounded-full bg-white px-3 py-2 shadow-sm">Saved across devices</span></div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map(([Icon, title, description, href, caption]) => {
          const Component = Icon as any;
          return <Link key={href as string} href={href as string} className="card group flex gap-4 p-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><Component className="h-5 w-5" /></span>
            <span><span className="flex items-center gap-2 text-lg font-black group-hover:text-indigo-700">{title as string}<ArrowRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" /></span><span className="muted mt-2 block text-sm">{description as string}</span><span className="mt-4 block text-xs font-bold text-fuchsia-600">{caption as string}</span></span>
          </Link>;
        })}
      </div>
      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm"><b>Looking for something specific?</b><span className="muted ml-2">Start a visual search and save the edit you want to come back to.</span><Link href="/search?visual=1" className="amazon-link ml-2">Explore finds →</Link></div>
    </div>
  );
}
