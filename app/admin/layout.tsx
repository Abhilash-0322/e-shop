import {redirect} from 'next/navigation';
import Link from 'next/link';
import {getCurrentUser} from '@/lib/auth';
import {ArrowLeft, LayoutDashboard, Package, Store, Users} from '@/lib/icons';

const nav = [['/admin', 'Overview', LayoutDashboard], ['/admin/users', 'Users', Users], ['/admin/products', 'Products', Package], ['/admin/sellers', 'Sellers', Store]] as const;

export default async function AdminLayout({children}: {children: React.ReactNode}) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') redirect('/');

  return (
    <div>
      <div className="bg-slate-950 text-white">
        <div className="shell flex flex-wrap items-center gap-5 py-4">
          <Link href="/" className="flex min-h-11 items-center gap-2 rounded text-slate-200"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Storefront</Link>
          <b>Admin console</b>
        </div>
      </div>
      <div className="shell grid gap-8 py-8 lg:grid-cols-[220px_1fr]">
        <aside className="surface h-fit p-3" aria-label="Administration navigation">
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
