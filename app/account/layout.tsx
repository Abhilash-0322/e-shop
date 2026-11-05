import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { Heart, LayoutDashboard, MapPin, Package, RefreshCw, ShieldCheck, Store } from '@/lib/icons';

const links = [['/account', 'Overview', LayoutDashboard], ['/account/orders', 'Orders', Package], ['/account/addresses', 'Addresses', MapPin], ['/account/payment', 'Payment', ShieldCheck], ['/account/wishlist', 'Wishlist', Heart], ['/account/returns', 'Returns', RefreshCw], ['/account/subscriptions', 'Subscriptions', RefreshCw], ['/account/security', 'Security', ShieldCheck], ['/prime', 'Halozon Plus', Store]] as const;

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/signin?redirect=/account');
  return <div className="shell grid gap-8 py-8 lg:grid-cols-[250px_1fr] lg:py-12"><aside className="surface h-fit p-4 lg:sticky lg:top-32"><div className="rounded-xl bg-[#d7f36b] p-4"><p className="eyebrow !text-[#405719]">Your space</p><b className="mt-2 block truncate text-lg">{user.name}</b><p className="mt-1 truncate text-xs text-[#526239]">{user.email}</p></div><nav className="mt-4 space-y-1">{links.map(([href, label, Icon]) => <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-[#526259] transition hover:bg-[#edf1e9] hover:text-[#405719]"><Icon className="h-4 w-4" />{label}</Link>)}</nav></aside><div className="min-w-0">{children}</div></div>;
}
