import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { ArrowLeft, BarChart3, LayoutDashboard, Package, ShoppingBag, Store } from '@/lib/icons';

const nav = [['/seller/dashboard', 'Dashboard', LayoutDashboard], ['/seller/products', 'Products', Package], ['/seller/orders', 'Orders', ShoppingBag], ['/seller/analytics', 'Analytics', BarChart3], ['/seller/store', 'Store', Store]] as const;

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || !['seller', 'admin'].includes(user.role)) redirect('/seller/apply');
  return <div><div className="bg-[#17221c] text-white"><div className="shell flex flex-wrap items-center justify-between gap-3 py-4"><Link href="/" className="flex items-center gap-2 text-sm text-[#c5d0c4]"><ArrowLeft className="h-4 w-4" /> Storefront</Link><b>Seller hub · {user.sellerProfile?.storeName || user.name}</b><Link href="/seller/store" className="font-bold text-[#d7f36b]">View store →</Link></div></div><div className="shell grid gap-8 py-8 lg:grid-cols-[230px_1fr] lg:py-12"><aside className="surface h-fit p-3 lg:sticky lg:top-8"><p className="eyebrow px-3 pb-2">Manage your business</p><nav className="space-y-1">{nav.map(([href, label, Icon]) => <Link href={href} key={href} className="flex items-center gap-3 rounded-xl p-3 text-sm font-bold text-[#526259] hover:bg-[#edf1e9] hover:text-[#405719]"><Icon className="h-4 w-4" />{label}</Link>)}</nav></aside><div className="min-w-0">{children}</div></div></div>;
}
