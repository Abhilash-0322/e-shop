import {redirect} from 'next/navigation';
import Link from 'next/link';
import {getCurrentUser} from '@/lib/auth';
import {AlertTriangle,ArrowLeft,CheckCircle2,LayoutDashboard,Package,Store,Users} from '@/lib/icons';

const nav=[['/admin','Overview',LayoutDashboard],['/admin/users','Users',Users],['/admin/products','Products',Package],['/admin/sellers','Sellers',Store],['/admin/reviews','Reviews',CheckCircle2]] as const;

export default async function AdminLayout({children}:{children:React.ReactNode}){
  const u=await getCurrentUser();
  if(!u||u.role!=='admin')redirect('/');
  return <div>
    <div className="bg-[#17231f] text-white"><div className="shell py-4 flex flex-col sm:flex-row gap-3 sm:items-center justify-between"><Link href="/" className="flex gap-2 items-center text-[#cfe2d5] text-sm"><ArrowLeft className="w-4 h-4"/>Storefront</Link><div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f2b47e] text-[#173f32] font-black text-xs">A</span><b>Trust & safety console</b></div><span className="text-xs text-[#b7d1c0]">Moderation workspace</span></div></div>
    <div className="shell py-8 grid lg:grid-cols-[235px_1fr] gap-8"><aside className="surface p-3 space-y-1 h-fit sticky top-28">{nav.map(([h,l,I])=><Link href={h} key={h} className="flex gap-3 items-center p-3 rounded-xl font-bold text-sm text-[#687a70] hover:bg-[#eef7f0] hover:text-[#28704e]"><I className="w-4 h-4"/>{l}</Link>)}<div className="section-rule my-3"/><div className="rounded-xl bg-[#fff7ee] p-3 text-xs text-[#80624d]"><AlertTriangle className="w-4 h-4 text-[#a45b27]"/><p className="font-bold mt-2">Moderate with context.</p><p className="mt-1">Protect useful community voices.</p></div></aside><div>{children}</div></div>
  </div>;
}
