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
    <div className="max-w-screen-xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-7">
      <aside className="space-y-2">
        <div className="panel p-4 lg:sticky lg:top-32">
          <div className="eyebrow mb-2">Your space</div>
          <div className="font-black text-xl mb-1">Hello, {user.name}</div>
          <p className="text-xs text-amazon-textMuted mb-4">Your orders, saves, and maker connections.</p>
          <nav className="mt-2 space-y-1">
            {TABS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className={`block px-2 py-1.5 rounded text-sm ${
                  pathname === t.href ? 'bg-amazon-yellow text-amazon-navy font-bold' : 'text-amazon-textMuted hover:bg-amazon-bg hover:text-amazon-text'
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
