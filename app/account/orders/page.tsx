import {connectDB} from '@/lib/mongodb';
import Order from '@/models/Order';
import {getCurrentUser} from '@/lib/auth';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Orders() {
  const user = await getCurrentUser();
  await connectDB();
  const orders = await Order.find({userId: user!.id}).sort({createdAt: -1}).lean();

  return (
    <div>
      <p className="eyebrow">History</p>
      <h1 className="page-title mt-2">Your orders</h1>
      <section className="mt-8 space-y-3" aria-labelledby="orders-heading">
        <h2 id="orders-heading" className="sr-only">Order history</h2>
        {orders.length ? orders.map((order: any) => <Link key={order._id} href={`/account/orders/${order._id}`} className="surface block rounded-xl p-5 hover:border-indigo-300"><div className="flex justify-between gap-4"><div><b>Order {order.orderNumber}</b><p className="mt-1 text-sm muted">{new Date(order.createdAt).toLocaleDateString()} · {order.items?.length || 0} items</p></div><div className="text-right"><span className="pill">{order.status}</span><b className="mt-2 block">${Number(order.total || 0).toFixed(2)}</b></div></div></Link>) : <div className="surface p-10 text-center muted">No orders yet. <Link className="amazon-link" href="/search">Start shopping</Link></div>}
      </section>
    </div>
  );
}
