'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, MapPin, Package, ShieldCheck, Sparkles, UserRound } from 'lucide-react';

const TABS = [
  { href: '/account', label: 'Overview', icon: UserRound },
  { href: '/account/orders', label: 'Order constellation', icon: Package },
  { href: '/account/returns', label: 'Returns', icon: Sparkles },
  { href: '/account/subscriptions', label: 'Memberships', icon: Sparkles },
  { href: '/account/security', label: 'Login & security', icon: ShieldCheck },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/payment', label: 'Payment options', icon: Sparkles },
  { href: '/account/wishlist', label: 'Saved finds', icon: Heart },
];

export default function AccountLayout({ user, children }: { user: { name: string; email: string }; children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-[250px_1fr]">
      <aside className="self-start">
        <div className="mb-3 rounded-3xl bg-amazon-navy p-5 text-white">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-amazon-yellow text-xl font-black text-amazon-navy">{user.name[0]}</div>
          <div className="text-xs text-white/60">Your little corner</div>
          <div className="mt-1 text-xl font-black">{user.name}</div>
          <div className="mt-1 truncate text-xs text-white/60">{user.email}</div>
        </div>
        <nav className="rounded-3xl border border-amazon-border bg-white/80 p-2 shadow-card">
          {TABS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return <Link key={href} href={href} className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-colors ${active ? 'bg-amazon-mint text-amazon-navy' : 'text-amazon-textMuted hover:bg-amazon-bg hover:text-amazon-text'}`}><Icon className="h-4 w-4" />{label}</Link>;
          })}
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
