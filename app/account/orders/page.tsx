import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { ArrowRight, Package } from '@/lib/icons';

export const dynamic = 'force-dynamic';

export default async function Orders() {
  const user = await getCurrentUser();
  await connectDB();
  const orders = await Order.find({ userId: user!.id }).sort({ createdAt: -1 }).lean();
  return <div><div className="rounded-[1.7rem] bg-[#17221c] p-7 text-white md:p-9"><p className="eyebrow !text-[#d7f36b]">Your history</p><h1 className="mt-2 text-4xl font-black tracking-tight">Orders that stay in view.</h1><p className="mt-3 max-w-xl text-[#c5d0c4]">Track deliveries, revisit a product, or get help when something does not feel right.</p></div><div className="mt-8 space-y-3">{orders.length ? orders.map((order: any) => <Link key={order._id} href={`/account/orders/${order._id}`} className="surface group block p-5 transition hover:border-[#9bb85c]"><div className="flex items-center gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf1e9] text-[#728749]"><Package className="h-5 w-5" /></div><div className="min-w-0 flex-1"><b>Order {order.orderNumber}</b><p className="muted mt-1 text-sm">{new Date(order.createdAt).toLocaleDateString()} · {order.items?.length || 0} items</p></div><div className="text-right"><span className="pill">{order.status}</span><b className="mt-2 block">${Number(order.total || 0).toFixed(2)}</b></div><ArrowRight className="h-4 w-4 text-[#8b998d] transition group-hover:translate-x-1" /></div></Link>) : <div className="surface p-10 text-center"><p className="muted">No orders yet.</p><Link className="amazon-link mt-3 inline-block" href="/search">Start shopping →</Link></div>}</div></div>;
}
