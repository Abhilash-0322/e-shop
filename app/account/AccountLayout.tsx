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
    <div className="confidence-shell py-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
      <aside className="space-y-2">
        <div className="panel p-4 lg:sticky lg:top-28">
          <div className="section-kicker">Your account</div>
          <div className="font-bold text-lg mb-1 mt-1">Hello, {user.name}</div>
          <p className="text-xs text-amazon-textMuted mb-3">Manage orders, delivery, and preferences.</p>
          <nav className="mt-2 space-y-1">
            {TABS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className={`block px-2 py-1.5 rounded text-sm ${
                  pathname === t.href ? 'bg-amazon-orange/15 text-amazon-linkHover font-semibold' : 'text-amazon-link hover:bg-amazon-bg'
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
