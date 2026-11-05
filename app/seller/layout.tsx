import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { ArrowLeft, BarChart3, LayoutDashboard, Package, ShoppingBag, Store } from '@/lib/icons';

const nav = [['/seller/dashboard', 'Dashboard', LayoutDashboard], ['/seller/products', 'Products', Package], ['/seller/orders', 'Orders', ShoppingBag], ['/seller/analytics', 'Analytics', BarChart3], ['/seller/store', 'Store', Store]] as const;

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const u = await getCurrentUser();
  if (!u || !['seller', 'admin'].includes(u.role)) redirect('/seller/apply');
  return <div><div className="border-b-2 border-black bg-[#d7ff3f]"><div className="shell flex flex-wrap items-center justify-between gap-4 py-4"><Link href="/" className="flex items-center gap-2 text-sm font-black uppercase"><ArrowLeft className="h-4 w-4" /> Storefront</Link><b className="uppercase">Seller hub / {u.sellerProfile?.storeName || u.name}</b><Link href="/seller/store" className="font-black uppercase underline">View store ↗</Link></div></div><div className="shell grid gap-8 py-8 lg:grid-cols-[220px_1fr]"><aside className="surface h-fit space-y-1 p-3">{nav.map(([h, l, I], i) => <Link href={h} key={h} className="flex items-center gap-2 border-b-2 border-black p-3 text-sm font-black uppercase hover:bg-[#ff5c35]"><span className="text-[#ff5c35]">{String(i + 1).padStart(2, '0')}</span><I className="h-4 w-4" />{l}</Link>)}</aside><div>{children}</div></div></div>;
}
