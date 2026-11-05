import {redirect} from 'next/navigation';
import Link from 'next/link';
import {getCurrentUser} from '@/lib/auth';

const links = [['/account', 'Overview'], ['/account/orders', 'Orders'], ['/account/addresses', 'Addresses'], ['/account/payment', 'Payment'], ['/account/wishlist', 'Wishlist'], ['/account/returns', 'Returns'], ['/account/subscriptions', 'Subscriptions'], ['/account/security', 'Security'], ['/prime', 'Halozon Plus']];

export default async function AccountLayout({children}: {children: React.ReactNode}) {
  const user = await getCurrentUser();
  if (!user) redirect('/signin?redirect=/account');

  return (
    <div className="shell grid gap-8 py-10 lg:grid-cols-[250px_1fr]">
      <aside className="surface h-fit p-4 lg:sticky lg:top-28" aria-label="Account navigation">
        <p className="eyebrow">Your space</p>
        <b className="mt-2 block truncate text-lg">{user.name}</b>
        <p className="mb-5 truncate text-xs muted">{user.email}</p>
        <nav aria-label="Account sections">
          <ul className="space-y-1">
            {links.map(([href, label]) => <li key={href}><Link href={href} className="block min-h-11 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-800">{label}</Link></li>)}
          </ul>
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
