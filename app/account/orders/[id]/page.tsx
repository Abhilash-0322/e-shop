import { redirect, notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function OrderDetail({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect(`/signin?redirect=/account/orders/${params.id}`);
  await connectDB();
  const order = await Order.findOne({ _id: params.id, userId: user.id }).lean() as any;
  if (!order) notFound();
  return <div><p className="eyebrow">Order detail</p><h1 className="page-title mt-2">Order {order.orderNumber}</h1><div className="surface mt-6 p-4 sm:mt-8 sm:p-6"><div className="flex justify-between gap-4"><span className="pill">{order.status}</span><b>${Number(order.total || 0).toFixed(2)}</b></div><div className="mt-6 space-y-3">{order.items?.map((item: any) => <div className="flex gap-3 border-t border-slate-100 pt-3" key={String(item.productId)}><img src={item.image || '/placeholder-product.svg'} className="h-16 w-16 rounded-lg bg-indigo-50 object-contain" alt="" /><div><b>{item.title}</b><p className="text-sm muted">Qty {item.qty} · ${item.price}</p></div></div>)}</div></div></div>;
}
