import {redirect} from 'next/navigation';
import Link from 'next/link';
import {getCurrentUser} from '@/lib/auth';
import {ArrowLeft, BarChart3, LayoutDashboard, Package, ShoppingBag, Store} from '@/lib/icons';

const nav = [['/seller/dashboard', 'Dashboard', LayoutDashboard], ['/seller/products', 'Products', Package], ['/seller/orders', 'Orders', ShoppingBag], ['/seller/analytics', 'Analytics', BarChart3], ['/seller/store', 'Store', Store]] as const;

export default async function SellerLayout({children}: {children: React.ReactNode}) {
  const user = await getCurrentUser();
  if (!user || !['seller', 'admin'].includes(user.role)) redirect('/seller/apply');

  return (
    <div>
      <div className="bg-slate-950 text-white">
        <div className="shell flex flex-wrap items-center justify-between gap-3 py-4">
          <Link href="/" className="flex min-h-11 items-center gap-2 rounded text-sm text-slate-200"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Storefront</Link>
          <b>Seller hub · {user.sellerProfile?.storeName || user.name}</b>
          <Link href="/seller/store" className="min-h-11 rounded py-3 text-indigo-200">View store <span aria-hidden="true">→</span></Link>
        </div>
      </div>
      <div className="shell grid gap-8 py-8 lg:grid-cols-[220px_1fr]">
        <aside className="surface h-fit p-3" aria-label="Seller navigation">
          <nav>
            <ul className="space-y-1">
              {nav.map(([href, label, Icon]) => <li key={href}><Link href={href} className="flex min-h-11 items-center gap-2 rounded-xl p-3 text-sm font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-800"><Icon className="h-4 w-4" aria-hidden="true" />{label}</Link></li>)}
            </ul>
          </nav>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
