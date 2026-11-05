import Link from 'next/link';

export default function Account() {
  const cards = [['Orders', 'Track, review, and manage purchases.', '/account/orders'], ['Wishlist', 'Keep the things you love close.', '/account/wishlist'], ['Addresses', 'Manage delivery destinations.', '/account/addresses'], ['Payment', 'Manage saved payment methods.', '/account/payment'], ['Halozon Plus', 'Priority delivery and member drops.', '/prime'], ['Security', 'Keep your account protected.', '/account/security']];
  return <div><p className="eyebrow">Workspace / overview</p><h1 className="page-title mt-2">Your account</h1><p className="muted mt-3">Everything you need to manage your Halozon experience.</p><div className="mt-8 grid gap-4 sm:grid-cols-2">{cards.map(([t, d, h], i) => <Link key={h} href={h} className="card group p-6"><span className="text-xs font-black text-[#ff5c35]">0{i + 1} / ACCOUNT</span><h2 className="mt-5 text-lg font-black uppercase group-hover:text-[#ff5c35]">{t}</h2><p className="muted mt-2 text-sm">{d}</p><span className="amazon-link mt-5 block text-sm">Open ↗</span></Link>)}</div></div>;
}
