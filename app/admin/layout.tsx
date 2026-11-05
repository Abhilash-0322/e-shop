import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { ArrowLeft, LayoutDashboard, Package, Store, Users } from '@/lib/icons';

const nav = [['/admin', 'Overview', LayoutDashboard], ['/admin/users', 'Users', Users], ['/admin/products', 'Products', Package], ['/admin/sellers', 'Sellers', Store]] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const u = await getCurrentUser();
  if (!u || u.role !== 'admin') redirect('/');
  return <div><div className="border-b-2 border-black bg-[#ff5c35]"><div className="shell flex flex-wrap items-center gap-5 py-4"><Link href="/" className="flex items-center gap-2 text-sm font-black uppercase"><ArrowLeft className="h-4 w-4" />Storefront</Link><b className="text-xl uppercase">Admin / Control room</b><span className="ml-auto border-2 border-black bg-black px-2 py-1 text-xs font-black text-white">PRIVILEGED</span></div></div><div className="shell grid gap-8 py-8 lg:grid-cols-[220px_1fr]"><aside className="surface h-fit space-y-1 p-3">{nav.map(([h, l, I], i) => <Link href={h} key={h} className="flex items-center gap-2 border-b-2 border-black p-3 text-sm font-black uppercase hover:bg-[#d7ff3f]"><span className="text-[#ff5c35]">{String(i + 1).padStart(2, '0')}</span><I className="h-4 w-4" />{l}</Link>)}</aside><div>{children}</div></div></div>;
}
