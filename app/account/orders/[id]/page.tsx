import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Clock, Package, ShieldCheck } from '@/lib/icons';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { getCurrentUser } from '@/lib/auth';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function OrderDetail({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  await connectDB();
  const order = await Order.findOne({ _id: params.id, userId: user!.id }).lean() as any;
  if (!order) notFound();
  return (
    <div>
      <Link href="/account/orders" className="mb-5 inline-flex items-center gap-1 text-xs font-bold text-slate-500"><ArrowLeft className="h-3.5 w-3.5" /> All orders</Link>
      <div className="workspace-toolbar"><div><p className="eyebrow">Order timeline</p><h1 className="page-title mt-2">{order.orderNumber}</h1><p className="muted mt-3 text-sm">Placed {new Date(order.createdAt).toLocaleDateString()}</p></div><span className="pill">{order.status}</span></div>
      <div className="grid gap-5 lg:grid-cols-[1fr_270px]">
        <div className="surface p-5 md:p-6"><div className="flex items-center gap-3 border-b border-slate-100 pb-5"><span className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-50 text-indigo-600"><Package className="h-5 w-5" /></span><div><b className="text-sm">{order.items?.length || 0} items in this order</b><p className="muted mt-1 text-xs">Your fulfillment timeline updates here.</p></div></div><div className="space-y-4 pt-5">{order.items?.map((item: any) => <div className="flex gap-3 border-b border-slate-100 pb-4" key={String(item.productId)}><img src={item.image || '/placeholder-product.svg'} className="h-16 w-16 rounded-lg bg-indigo-50 object-contain" alt="" /><div><b className="text-sm">{item.title}</b><p className="muted mt-1 text-xs">Qty {item.qty} · ${item.price}</p></div></div>)}</div></div>
        <aside className="space-y-3"><div className="surface p-5"><p className="eyebrow">Order total</p><b className="mt-2 block text-2xl">${Number(order.total || 0).toFixed(2)}</b><div className="mt-4 flex items-center gap-2 text-xs text-slate-500"><Clock className="h-4 w-4 text-indigo-600" /> {order.status}</div></div><div className="surface p-5 text-xs text-slate-500"><div className="flex gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" /><span>Buyer protection is active for this order.</span></div><div className="mt-3 flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /><span>Need help? <Link href="/help" className="font-bold text-indigo-600">Open support</Link></span></div></div></aside>
      </div>
    </div>
  );
}
