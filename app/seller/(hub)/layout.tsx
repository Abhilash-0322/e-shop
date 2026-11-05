import {redirect} from 'next/navigation';
import {getCurrentUser} from '@/lib/auth';
import {BarChart3, LayoutDashboard, Package, ShoppingBag, Store} from '@/lib/icons';
import WorkspaceShell from '@/components/WorkspaceShell';

const nav = [
  {href: '/seller/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" />},
  {href: '/seller/products', label: 'Products', icon: <Package className="h-4 w-4" />},
  {href: '/seller/orders', label: 'Orders', icon: <ShoppingBag className="h-4 w-4" />},
  {href: '/seller/analytics', label: 'Analytics', icon: <BarChart3 className="h-4 w-4" />},
  {href: '/seller/store', label: 'Store', icon: <Store className="h-4 w-4" />},
];

export default async function SellerHubLayout({children}: {children: React.ReactNode}) {
  const user = await getCurrentUser();
  if (!user) redirect('/signin?redirect=/seller/dashboard');
  if (!['seller', 'admin'].includes(user.role)) redirect('/seller/apply');
  return (
    <WorkspaceShell
      title="Seller hub"
      identity={user.sellerProfile?.storeName || user.name}
      links={nav}
      intro="Keep your catalog, fulfillment, and storefront moving in one clear workspace."
    >
      {children}
    </WorkspaceShell>
  );
}
