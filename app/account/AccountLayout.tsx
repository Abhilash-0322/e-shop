'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, UserRound } from 'lucide-react';

const TABS = [
  { href: '/account', label: 'Your Account' },
  { href: '/account/orders', label: 'Your Orders' },
  { href: '/account/returns', label: 'Your Returns' },
  { href: '/account/subscriptions', label: 'Subscriptions' },
  { href: '/account/security', label: 'Login & Security' },
  { href: '/account/addresses', label: 'Your Addresses' },
  { href: '/account/payment', label: 'Payment Options' },
  { href: '/account/wishlist', label: 'Wish List' },
  { href: '/prime', label: 'Prime' },
];

export default function AccountLayout({ user, children }: { user: { name: string; email: string }; children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
      <aside className="space-y-3">
        <div className="panel p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-amazon-orange/15 grid place-items-center text-amazon-orange"><UserRound className="w-5 h-5" /></div>
            <div><div className="status-kicker">Identity node</div><div className="font-bold">{user.name}</div></div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-amazon-green mb-4"><Activity className="w-3 h-3" /> account secure · synced</div>
          <nav className="space-y-1">
            {TABS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className={`block px-2 py-1.5 rounded text-sm ${
                  pathname === t.href ? 'bg-amazon-orange/10 text-amazon-orange font-medium border-l-2 border-amazon-orange' : 'text-amazon-textMuted hover:bg-amazon-bg hover:text-white'
                }`}
              >
                {t.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      <div>{children}</div>
    </div>
  );
}
