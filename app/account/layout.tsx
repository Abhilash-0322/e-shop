import {redirect} from 'next/navigation';
import Link from 'next/link';
import {getCurrentUser} from '@/lib/auth';
import {ArrowRight,User} from '@/lib/icons';

const links=[['/account','Overview'],['/account/orders','Orders'],['/account/addresses','Addresses'],['/account/payment','Payment'],['/account/wishlist','Wishlist'],['/account/returns','Returns'],['/account/subscriptions','Subscriptions'],['/account/security','Security'],['/prime','Halozon Plus']];

export default async function AccountLayout({children}:{children:React.ReactNode}){
  const u=await getCurrentUser();
  if(!u)redirect('/signin?redirect=/account');
  return <div className="shell py-10 md:py-16"><div className="mb-10 border-b border-[#ddd6c9] pb-8"><p className="eyebrow">Your Halozon</p><h1 className="display-serif mt-3 text-6xl">A space for your things.</h1><p className="muted mt-4 max-w-xl">Orders, saved pieces, and the practical details that make the experience yours.</p></div><div className="grid gap-8 lg:grid-cols-[240px_1fr]"><aside className="surface h-fit p-4 lg:sticky lg:top-32"><div className="mb-5 flex items-center gap-3 border-b border-[#ddd6c9] pb-4"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e9e2d6]"><User className="h-4 w-4 text-[#d96143]"/></span><div className="min-w-0"><b className="block truncate text-sm">{u.name}</b><p className="muted truncate text-xs">{u.email}</p></div></div><nav className="space-y-1">{links.map(([h,l])=><Link key={h} href={h} className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-[#66735f] hover:bg-[#e9e2d6] hover:text-[#d96143]"><span>{l}</span><ArrowRight className="h-3 w-3 opacity-0 transition group-hover:opacity-100"/></Link>)}</nav></aside><div>{children}</div></div></div>
}
