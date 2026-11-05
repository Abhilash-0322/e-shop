import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { CreditCard, Heart, LayoutDashboard, MapPin, Package, RefreshCw, ShieldCheck, Sparkles } from '@/lib/icons';

const links = [
  ['/account', 'Overview', LayoutDashboard],
  ['/account/orders', 'Orders', Package],
  ['/account/wishlist', 'Wishlist', Heart],
  ['/account/addresses', 'Addresses', MapPin],
  ['/account/payment', 'Payment', CreditCard],
  ['/account/returns', 'Returns', RefreshCw],
  ['/account/subscriptions', 'Subscriptions', Sparkles],
  ['/account/security', 'Security', ShieldCheck],
  ['/prime', 'Halozon Plus', Sparkles],
] as const;

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/signin?redirect=/account');
  return (
    <div className="workspace-shell shell grid gap-7 lg:grid-cols-[220px_1fr]">
      <aside className="workspace-sidebar">
        <div className="workspace-sidebar-title">Your workspace</div>
        <div className="border-b border-slate-100 px-3 pb-4"><b className="block truncate text-sm">{user.name}</b><p className="muted mt-1 truncate text-[11px]">{user.email}</p><span className="mt-3 inline-flex rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-extrabold text-emerald-700">Shopper mode</span></div>
        <nav className="mt-3 space-y-1">{links.map(([href, label, Icon]) => <Link key={href} href={href}><Icon className="h-4 w-4" />{label}</Link>)}</nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
