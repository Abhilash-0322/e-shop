import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { ArrowLeft, BarChart3, LayoutDashboard, Package, ShoppingBag, Store } from '@/lib/icons';
import SellerAccessGate from '@/components/SellerAccessGate';

const nav = [['/seller/dashboard', 'Overview', LayoutDashboard], ['/seller/products', 'Products', Package], ['/seller/orders', 'Orders', ShoppingBag], ['/seller/analytics', 'Analytics', BarChart3], ['/seller/store', 'Storefront', Store]] as const;

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  // The public application lives inside this route tree; keep it reachable
  // while seller APIs continue to enforce authentication and role checks.
  if (!user) return <SellerAccessGate>{children}</SellerAccessGate>;
  if (!['seller', 'admin'].includes(user.role)) redirect('/seller/apply');
  return (
    <div className="workspace-shell shell grid gap-7 lg:grid-cols-[220px_1fr]">
      <aside className="workspace-sidebar">
        <div className="workspace-sidebar-title">Seller command</div>
        <div className="border-b border-slate-100 px-3 pb-4"><b className="block truncate text-sm">{user.sellerProfile?.storeName || user.name}</b><p className="muted mt-1 text-[11px]">Seller workspace</p><Link href="/seller/store" className="mt-3 inline-flex text-[10px] font-extrabold text-indigo-600">View storefront →</Link></div>
        <nav className="mt-3 space-y-1">{nav.map(([href, label, Icon]) => <Link key={href} href={href}><Icon className="h-4 w-4" />{label}</Link>)}</nav>
        <div className="mt-4 border-t border-slate-100 pt-3"><Link href="/" className="text-slate-500"><ArrowLeft className="h-4 w-4" />Storefront</Link></div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
