import {redirect} from 'next/navigation';
import Link from 'next/link';
import {CheckCircle2,Heart,LayoutDashboard,Lock,MapPin,Package,RefreshCw,ShieldCheck,ShoppingBag} from '@/lib/icons';
import {getCurrentUser} from '@/lib/auth';

const links=[['/account','Overview',LayoutDashboard],['/account/orders','Orders',Package],['/account/addresses','Addresses',MapPin],['/account/payment','Payment',Lock],['/account/wishlist','Wishlist',Heart],['/account/returns','Returns',RefreshCw],['/account/subscriptions','Subscriptions',ShoppingBag],['/account/security','Security',ShieldCheck],['/prime','Halozon Plus',CheckCircle2]] as const;

export default async function AccountLayout({children}:{children:React.ReactNode}){
  const u=await getCurrentUser();
  if(!u)redirect('/signin?redirect=/account');
  return <div className="shell py-8 md:py-10 grid lg:grid-cols-[255px_1fr] gap-8">
    <aside className="surface p-4 h-fit sticky top-28">
      <div className="flex items-center gap-3 border-b border-[#dce7df] pb-4"><span className="avatar w-10 h-10 text-sm">{u.name.slice(0,1).toUpperCase()}</span><div className="min-w-0"><b className="block truncate">{u.name}</b><p className="text-xs muted truncate">{u.email}</p></div></div>
      <div className="rounded-xl bg-[#eef7f0] p-3 mt-4"><p className="text-[10px] uppercase tracking-[.14em] font-bold text-[#3d8060]">Your trust profile</p><div className="flex items-center gap-2 mt-2"><CheckCircle2 className="w-4 h-4 text-[#28704e]"/><b className="text-sm text-[#236546]">Good standing</b></div><p className="text-xs muted mt-1">Your reviews help other shoppers decide.</p></div>
      <nav className="space-y-1 mt-5">{links.map(([h,l,I])=><Link key={h} href={h} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#687a70] hover:bg-[#eef7f0] hover:text-[#28704e]"><I className="w-4 h-4"/>{l}</Link>)}</nav>
    </aside>
    <div>{children}</div>
  </div>;
}
