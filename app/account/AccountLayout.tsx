'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
    <div className="page-shell grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-2 lg:sticky lg:top-28 lg:self-start">
        <div className="panel p-4">
          <div className="section-kicker">Your orbit</div>
          <div className="mb-4 mt-1 text-lg font-black">Hello, {user.name}</div>
          <nav className="space-y-1">
            {TABS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className={`block rounded-xl px-3 py-2.5 text-sm transition-all ${
                  pathname === t.href ? 'bg-amazon-navy font-semibold text-white shadow-lg' : 'text-amazon-textMuted hover:bg-amazon-bg hover:text-amazon-text'
                }`}
              >
                {t.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      <main className="min-w-0">{children}</main>
    </div>
  );
}
