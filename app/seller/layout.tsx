import {redirect} from 'next/navigation';
import Link from 'next/link';
import {getCurrentUser} from '@/lib/auth';
import {LayoutDashboard,Package,ShoppingBag,BarChart3,Store,ArrowLeft,ArrowRight} from '@/lib/icons';

const nav=[['/seller/dashboard','Overview',LayoutDashboard],['/seller/products','Catalog',Package],['/seller/orders','Orders',ShoppingBag],['/seller/analytics','Analytics',BarChart3],['/seller/store','Your storefront',Store]] as const;

export default async function SellerLayout({children}:{children:React.ReactNode}){
  const u=await getCurrentUser();
  if(!u||!['seller','admin'].includes(u.role))redirect('/seller/apply');
  return <div><div className="bg-[#263b3a] text-[#f6f2ea]"><div className="shell flex flex-col justify-between gap-3 py-5 sm:flex-row sm:items-center"><Link href="/" className="flex items-center gap-2 text-sm text-white/70 hover:text-white"><ArrowLeft className="h-4 w-4"/> Storefront</Link><div className="text-center"><p className="eyebrow !text-[#e9b7a7]">Seller studio</p><b className="font-serif text-xl">{u.sellerProfile?.storeName||u.name}</b></div><Link href="/seller/store" className="flex items-center gap-2 text-sm text-[#e9b7a7]">View store <ArrowRight className="h-3 w-3"/></Link></div></div><div className="shell grid gap-8 py-10 lg:grid-cols-[230px_1fr] lg:py-14"><aside className="surface h-fit p-3 lg:sticky lg:top-32"><div className="mb-4 border-b border-[#ddd6c9] px-3 pb-4"><p className="eyebrow">Your workspace</p><p className="muted mt-2 text-xs">Build the collection behind the storefront.</p></div><nav className="space-y-1">{nav.map(([h,l,I])=><Link href={h} key={h} className="group flex items-center justify-between rounded-lg p-3 text-sm font-bold text-[#66735f] hover:bg-[#e9e2d6] hover:text-[#d96143]"><span className="flex items-center gap-2"><I className="h-4 w-4"/>{l}</span><ArrowRight className="h-3 w-3 opacity-0 transition group-hover:opacity-100"/></Link>)}</nav></aside><div>{children}</div></div></div>
}
