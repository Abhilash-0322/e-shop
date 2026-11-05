import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { AlertTriangle, ArrowLeft, LayoutDashboard, Package, Store, Users } from '@/lib/icons';

const nav = [['/admin', 'Overview', LayoutDashboard], ['/admin/users', 'Users', Users], ['/admin/products', 'Products', Package], ['/admin/sellers', 'Sellers', Store], ['/admin/reviews', 'Reviews', AlertTriangle]] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') redirect('/');
  return (
    <div className="workspace-shell shell grid gap-7 lg:grid-cols-[220px_1fr]">
      <aside className="workspace-sidebar">
        <div className="workspace-sidebar-title">Operations console</div>
        <div className="border-b border-slate-100 px-3 pb-4"><b className="block text-sm">Halozon Ops</b><p className="muted mt-1 text-[11px]">Admin workspace</p><span className="mt-3 inline-flex rounded-full bg-amber-50 px-2 py-1 text-[10px] font-extrabold text-amber-700">Elevated access</span></div>
        <nav className="mt-3 space-y-1">{nav.map(([href, label, Icon]) => <Link key={href} href={href}><Icon className="h-4 w-4" />{label}</Link>)}</nav>
        <div className="mt-4 border-t border-slate-100 pt-3"><Link href="/" className="text-slate-500"><ArrowLeft className="h-4 w-4" />Storefront</Link></div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
