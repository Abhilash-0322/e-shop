import {connectDB} from '@/lib/mongodb';
import Order from '@/models/Order';
import {getCurrentUser} from '@/lib/auth';
import Link from 'next/link';
import {ArrowRight,Package} from '@/lib/icons';

export const dynamic='force-dynamic';

export default async function Orders(){
  const u=await getCurrentUser();
  await connectDB();
  const orders=await Order.find({userId:u!.id}).sort({createdAt:-1}).lean();
  return <div><p className="eyebrow">Your history</p><h2 className="display-serif mt-3 text-5xl">Orders worth remembering.</h2><p className="muted mt-4">Track deliveries, revisit details, and keep a clear record of what is on its way.</p><div className="mt-8 space-y-3">{orders.length?orders.map((o:any)=><Link key={o._id} href={`/account/orders/${o._id}`} className="surface group block p-5 transition hover:border-[#d96143]"><div className="flex items-center justify-between gap-4"><div className="flex min-w-0 items-center gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e9e2d6]"><Package className="h-4 w-4 text-[#d96143]"/></span><div><b>Order {o.orderNumber}</b><p className="muted mt-1 text-sm">{new Date(o.createdAt).toLocaleDateString()} · {o.items?.length||0} item{o.items?.length===1?'':'s'}</p></div></div><div className="flex items-center gap-4 text-right"><span className="pill">{o.status}</span><b className="hidden sm:block">${Number(o.total||0).toFixed(2)}</b><ArrowRight className="h-4 w-4 text-[#a29a8e] transition group-hover:translate-x-1"/></div></div></Link>):<div className="surface p-10 text-center"><p className="font-serif text-2xl">No orders yet.</p><Link className="mt-4 inline-block text-sm font-bold text-[#d96143]" href="/search">Start exploring →</Link></div>}</div></div>
}
