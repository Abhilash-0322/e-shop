import {connectDB} from '@/lib/mongodb';
import Order from '@/models/Order';
import {getCurrentUser} from '@/lib/auth';
import {notFound} from 'next/navigation';
import Link from 'next/link';
import {ArrowLeft,CheckCircle2,Package} from '@/lib/icons';

export const dynamic='force-dynamic';

export default async function OrderDetail({params}:{params:{id:string}}){
  const u=await getCurrentUser();
  await connectDB();
  const o=await Order.findOne({_id:params.id,userId:u!.id}).lean() as any;
  if(!o)notFound();
  return <div><Link href="/account/orders" className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#66735f]"><ArrowLeft className="h-3 w-3"/>All orders</Link><p className="eyebrow">Order detail</p><h2 className="display-serif mt-3 text-5xl">Order {o.orderNumber}</h2><div className="mt-8 grid gap-5 lg:grid-cols-[1fr_280px]"><div className="surface p-6 md:p-8"><div className="flex items-center justify-between border-b border-[#ddd6c9] pb-5"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d9e1df]"><CheckCircle2 className="h-5 w-5 text-[#66735f]"/></span><div><b>Order received</b><p className="muted text-sm">We are taking care of it.</p></div></div><span className="pill">{o.status}</span></div><div className="mt-6 space-y-4">{o.items?.map((i:any)=><div className="flex gap-4 border-b border-[#ddd6c9] pb-4" key={String(i.productId)}><img src={i.image||'/placeholder-product.svg'} className="h-16 w-16 rounded-lg bg-[#e9e2d6] object-contain" alt=""/><div className="flex-1"><b>{i.title}</b><p className="muted mt-1 text-sm">Qty {i.qty} · ${i.price}</p></div></div>)}</div></div><aside className="surface h-fit p-6"><Package className="h-6 w-6 text-[#d96143]"/><p className="eyebrow mt-5">Order total</p><b className="mt-2 block font-serif text-3xl">${Number(o.total||0).toFixed(2)}</b><p className="muted mt-5 text-sm">Placed {new Date(o.createdAt).toLocaleDateString()}</p><Link href="/help" className="mt-6 inline-block text-sm font-bold text-[#d96143]">Need help? →</Link></aside></div></div>
}
