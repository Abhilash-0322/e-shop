'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, BarChart3, LayoutDashboard, Package, ShoppingBag, Sparkles, Store } from 'lucide-react';

const TABS = [
  { href: '/seller/dashboard', label: 'Studio overview', icon: LayoutDashboard },
  { href: '/seller/products', label: 'Your products', icon: Package },
  { href: '/seller/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/seller/analytics', label: 'Insights', icon: BarChart3 },
  { href: '/seller/store', label: 'Store profile', icon: Store },
];

export default function SellerLayout({ user, children }: { user: any; children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen">
      <div className="bg-amazon-navy text-white">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-4"><Link href="/" className="flex items-center gap-1 text-sm text-white/60 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to shop</Link><div className="hidden h-5 w-px bg-white/20 sm:block" /><div className="flex items-center gap-2 text-sm font-bold"><Sparkles className="h-4 w-4 text-amazon-yellow" /> Maker studio <span className="font-normal text-white/50">· {user.sellerProfile?.storeName || user.name}</span></div></div>
          <Link href="/seller/store" className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold hover:border-white/60">View public store ↗</Link>
        </div>
      </div>
      <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-[230px_1fr]">
        <aside className="self-start rounded-3xl border border-amazon-border bg-white/80 p-2 shadow-card">
          <div className="mb-2 rounded-2xl bg-amazon-mint p-4"><div className="text-xs font-bold uppercase tracking-widest text-amazon-textMuted">Your little business</div><div className="mt-1 text-lg font-black">{user.sellerProfile?.storeName || user.name}</div></div>
          {TABS.map(({ href, label, icon: Icon }) => { const active = pathname === href; return <Link key={href} href={href} className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold ${active ? 'bg-amazon-navy text-white' : 'text-amazon-textMuted hover:bg-amazon-bg hover:text-amazon-text'}`}><Icon className="h-4 w-4" />{label}</Link>; })}
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
