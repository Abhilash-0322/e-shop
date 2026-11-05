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
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
      <aside className="space-y-2">
        <div className="aurora-surface p-5">
          <div className="eyebrow !text-amazon-orange mb-2">Personal cockpit</div>
          <div className="font-black text-lg mb-1">Hello, {user.name}</div>
          <div className="text-xs text-white/60 truncate">{user.email}</div>
          <nav className="mt-2 space-y-1">
            {TABS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className={`block px-2 py-1.5 rounded text-sm ${
                  pathname === t.href ? 'bg-white/15 text-white font-semibold' : 'text-white/65 hover:bg-white/10 hover:text-white'
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
