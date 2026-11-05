import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';

const links = [['/account', 'Overview'], ['/account/orders', 'Orders'], ['/account/addresses', 'Addresses'], ['/account/payment', 'Payment'], ['/account/wishlist', 'Wishlist'], ['/account/returns', 'Returns'], ['/account/subscriptions', 'Subscriptions'], ['/account/security', 'Security'], ['/prime', 'Halozon Plus']];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const u = await getCurrentUser();
  if (!u) redirect('/signin?redirect=/account');
  return <div className="shell grid gap-8 py-10 lg:grid-cols-[250px_1fr]">
    <aside className="surface h-fit p-4 lg:sticky lg:top-28"><p className="eyebrow">Account / 00</p><b className="mt-2 block truncate text-lg uppercase">{u.name}</b><p className="muted mb-5 truncate text-xs">{u.email}</p><nav className="space-y-1">{links.map(([h, l], i) => <Link key={h} href={h} className="block border-b-2 border-black px-2 py-2.5 text-sm font-black uppercase hover:bg-[#d7ff3f]"><span className="mr-2 text-[#ff5c35]">{String(i + 1).padStart(2, '0')}</span>{l}</Link>)}</nav></aside>
    <div>{children}</div>
  </div>;
}
