import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  LayoutDashboard,
  Package,
  ShieldCheck,
  Star,
  Store,
  Users,
} from '@/lib/icons';

const nav = [
  ['/admin', 'Overview', 'Command center', LayoutDashboard],
  ['/admin/users', 'Users', 'Access & accounts', Users],
  ['/admin/products', 'Products', 'Catalog health', Package],
  ['/admin/reviews', 'Reviews', 'Moderation queue', Star],
  ['/admin/sellers', 'Sellers', 'Applications', Store],
] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') redirect('/');

  return (
    <div className="admin-frame">
      <header className="admin-topbar">
        <div className="shell admin-topbar-inner">
          <Link href="/" className="admin-brand">
            <span className="hz-logo-mark">H</span>
            <span>Halozon <small>operations</small></span>
          </Link>
          <div className="admin-topbar-meta">
            <span className="admin-secure"><ShieldCheck className="h-3.5 w-3.5" /> Secure session</span>
            <span className="admin-user-chip"><span className="admin-user-dot" />{user.name}</span>
            <Link href="/" className="admin-storefront-link"><ArrowLeft className="h-3.5 w-3.5" /> Storefront</Link>
          </div>
        </div>
      </header>
      <div className="shell admin-content">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-heading">
            <span className="admin-sidebar-kicker">Workspace</span>
            <span className="admin-status admin-status-success"><span className="admin-live-dot" /> Online</span>
          </div>
          <nav className="admin-nav" aria-label="Admin navigation">
            {nav.map(([href, label, description, Icon]) => (
              <Link href={href} key={href} className="admin-nav-link">
                <span className="admin-nav-icon"><Icon className="h-4 w-4" /></span>
                <span className="min-w-0">
                  <b>{label}</b>
                  <small>{description}</small>
                </span>
                <ChevronRight className="admin-nav-chevron h-3.5 w-3.5" />
              </Link>
            ))}
          </nav>
          <div className="admin-sidebar-divider" />
          <div className="admin-sidebar-note">
            <Activity className="h-4 w-4 text-emerald-500" />
            <div><b>Systems healthy</b><p>All core services operational</p></div>
          </div>
          <div className="admin-sidebar-note admin-sidebar-note-alert">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <div><b>Operator principle</b><p>Review before you remove</p></div>
          </div>
        </aside>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
