import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { ArrowLeft, ClipboardList, LayoutDashboard, Package, Store, Users } from '@/lib/icons';

const nav = [['/admin', 'Overview', LayoutDashboard], ['/admin/users', 'Users', Users], ['/admin/products', 'Products', Package], ['/admin/reviews', 'Reviews', ClipboardList], ['/admin/sellers', 'Sellers', Store]] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') redirect('/');
  return <div><div className="bg-[#17221c] text-white"><div className="shell flex flex-wrap items-center gap-5 py-4"><Link href="/" className="flex items-center gap-2 text-sm text-[#c5d0c4]"><ArrowLeft className="h-4 w-4" />Storefront</Link><span className="h-4 w-px bg-white/20" /><b>Admin console</b><span className="pill ml-auto bg-[#d7f36b] text-[#405719]">Live operations</span></div></div><div className="shell grid gap-8 py-8 lg:grid-cols-[230px_1fr] lg:py-12"><aside className="surface h-fit p-3 lg:sticky lg:top-8"><p className="eyebrow px-3 pb-2">Platform controls</p><nav className="space-y-1">{nav.map(([href, label, Icon]) => <Link href={href} key={href} className="flex items-center gap-3 rounded-xl p-3 text-sm font-bold text-[#526259] hover:bg-[#edf1e9] hover:text-[#405719]"><Icon className="h-4 w-4" />{label}</Link>)}</nav></aside><div className="min-w-0">{children}</div></div></div>;
}
