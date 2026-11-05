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
    <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-2">
        <div className="ops-card p-4">
          <div className="ops-kicker">Your workspace</div>
          <div className="mb-1 mt-1 text-lg font-bold">Hello, {user.name}</div>
          <nav className="mt-2 space-y-1">
            {TABS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className={`block px-2 py-1.5 rounded text-sm ${
                  pathname === t.href ? 'bg-amazon-orange/10 font-semibold text-amazon-orangedark' : 'text-amazon-link hover:bg-amazon-panel'
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
