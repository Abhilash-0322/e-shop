import {redirect} from 'next/navigation';
import {getCurrentUser} from '@/lib/auth';
import {LayoutDashboard, Package, Store, Users} from '@/lib/icons';
import WorkspaceShell from '@/components/WorkspaceShell';

const nav = [
  {href: '/admin', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" />},
  {href: '/admin/users', label: 'Users', icon: <Users className="h-4 w-4" />},
  {href: '/admin/products', label: 'Products', icon: <Package className="h-4 w-4" />},
  {href: '/admin/sellers', label: 'Sellers', icon: <Store className="h-4 w-4" />},
  {href: '/admin/reviews', label: 'Reviews', icon: <Package className="h-4 w-4" />},
];

export default async function AdminLayout({children}: {children: React.ReactNode}) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') redirect('/');
  return <WorkspaceShell title="Admin console" identity={user.email} links={nav} intro="Monitor marketplace health and keep the community moving.">{children}</WorkspaceShell>;
}
