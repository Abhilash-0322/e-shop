import Link from 'next/link';
import { ArrowUpRight, Clock, Package, Search } from '@/lib/icons';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function Orders() {
  const user = await getCurrentUser();
  await connectDB();
  const orders = await Order.find({ userId: user!.id }).sort({ createdAt: -1 }).lean();
  return (
    <div>
      <div className="workspace-toolbar"><div><p className="eyebrow">Purchase history</p><h1 className="page-title mt-2">Your orders</h1><p className="muted mt-3 text-sm">A single timeline for every delivery and decision.</p></div><Link href="/search" className="btn btn-soft hidden sm:inline-flex"><Search className="h-4 w-4" /> Shop again</Link></div>
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3"><div className="metric-card"><span className="metric-card-label">Total orders</span><b className="metric-card-value">{orders.length}</b></div><div className="metric-card"><span className="metric-card-label">In motion</span><b className="metric-card-value">{orders.filter((order: any) => !['delivered', 'cancelled'].includes(order.status)).length}</b></div><div className="metric-card hidden sm:block"><span className="metric-card-label">Fast support</span><b className="metric-card-value">24/7</b></div></div>
      <div className="space-y-3">{orders.length ? orders.map((order: any) => <Link key={order._id} href={`/account/orders/${order._id}`} className="surface group block p-5 transition hover:border-indigo-300"><div className="flex items-start justify-between gap-4"><div className="flex gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-50 text-indigo-600"><Package className="h-4 w-4" /></span><div><b className="text-sm">Order {order.orderNumber}</b><p className="muted mt-1 text-xs"><Clock className="mr-1 inline h-3.5 w-3.5" />{new Date(order.createdAt).toLocaleDateString()} · {order.items?.length || 0} items</p></div></div><div className="text-right"><span className="pill">{order.status}</span><b className="mt-2 block text-sm">${Number(order.total || 0).toFixed(2)}</b></div></div><div className="mt-4 flex items-center justify-end gap-1 text-[11px] font-extrabold text-indigo-600 opacity-0 transition group-hover:opacity-100">Open timeline <ArrowUpRight className="h-3.5 w-3.5" /></div></Link>) : <div className="surface p-10 text-center"><Package className="mx-auto h-8 w-8 text-indigo-300" /><p className="muted mt-3 text-sm">No orders yet. <Link className="font-bold text-indigo-600" href="/search">Start shopping</Link></p></div>}</div>
    </div>
  );
}
