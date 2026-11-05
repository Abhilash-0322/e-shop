import {redirect} from 'next/navigation';
import Link from 'next/link';
import {getCurrentUser} from '@/lib/auth';
import {ArrowLeft,BarChart3,CheckCircle2,LayoutDashboard,Package,ShoppingBag,Store} from '@/lib/icons';

const nav=[['/seller/dashboard','Dashboard',LayoutDashboard],['/seller/products','Products',Package],['/seller/orders','Orders',ShoppingBag],['/seller/analytics','Analytics',BarChart3],['/seller/store','Store',Store]] as const;

export default async function SellerLayout({children}:{children:React.ReactNode}){
  const u=await getCurrentUser();
  if(!u||!['seller','admin'].includes(u.role))redirect('/seller/apply');
  return <div>
    <div className="bg-[#173f32] text-white"><div className="shell py-4 flex flex-col sm:flex-row gap-3 sm:items-center justify-between"><Link href="/" className="flex items-center gap-2 text-sm text-[#cfe2d5]"><ArrowLeft className="w-4 h-4"/> Storefront</Link><div className="flex items-center gap-2"><span className="avatar !bg-[#e5f4e9] !text-[#28704e] w-7 h-7">{(u.sellerProfile?.storeName||u.name).slice(0,1)}</span><b>Seller hub · {u.sellerProfile?.storeName||u.name}</b><span className="status-chip !bg-white/10 !text-[#dff3e5] hidden sm:inline-flex"><CheckCircle2 className="w-3 h-3 mr-1"/> Trusted account</span></div><Link href="/seller/store" className="text-[#f2b47e] text-sm">View store →</Link></div></div>
    <div className="shell py-8 grid lg:grid-cols-[235px_1fr] gap-8"><aside className="surface p-3 h-fit space-y-1 sticky top-28">{nav.map(([h,l,I])=><Link href={h} key={h} className="flex items-center gap-3 rounded-xl p-3 text-sm font-bold text-[#687a70] hover:bg-[#eef7f0] hover:text-[#28704e]"><I className="w-4 h-4"/>{l}</Link>)}<div className="section-rule my-3"/><p className="px-3 text-[10px] uppercase tracking-[.14em] font-bold text-[#84958b]">Seller promise</p><p className="px-3 text-xs muted leading-relaxed mt-2">Clear listings and thoughtful replies build trust.</p></aside><div>{children}</div></div>
  </div>;
}
