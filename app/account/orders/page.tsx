import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { CheckCircle2, Package, Truck } from '@/lib/icons';

export const dynamic = 'force-dynamic';

export default async function Orders() {
  const user = await getCurrentUser();
  await connectDB();
  const orders = await Order.find({ userId: user!.id }).sort({ createdAt: -1 }).lean();

  return (
    <div>
      <p className="eyebrow">History · delivery milestones</p>
      <h1 className="page-title mt-2">Your orders</h1>
      <p className="muted mt-3">Follow every order from placed to delivered, with the next step always clear.</p>

      <div className="surface mt-7 grid grid-cols-3 gap-3 p-5 text-center">
        {[
          [CheckCircle2, 'Placed'],
          [Package, 'Packed'],
          [Truck, 'Delivered'],
        ].map(([Icon, label]) => {
          const StepIcon = Icon as any;
          return (
            <div key={label as string}>
              <StepIcon className="mx-auto h-5 w-5 text-indigo-600" />
              <b className="mt-2 block text-sm">{label as string}</b>
              <small className="muted">milestone</small>
            </div>
          );
        })}
      </div>

      <div className="mt-8 space-y-3">
        {orders.length ? (
          orders.map((order: any) => (
            <Link
              key={order._id}
              href={`/account/orders/${order._id}`}
              className="surface block p-5 hover:border-indigo-300"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <b>Order {order.orderNumber}</b>
                  <p className="muted mt-1 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()} · {order.items?.length || 0} items
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    {order.status === 'delivered'
                      ? 'Delivered and done'
                      : order.status === 'shipped'
                        ? 'On the way to you'
                        : 'We are getting it ready'}
                  </div>
                </div>
                <div className="text-right">
                  <span className="pill">{order.status}</span>
                  <b className="mt-2 block">${Number(order.total || 0).toFixed(2)}</b>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="surface p-10 text-center muted">
            No orders yet. <Link className="amazon-link" href="/search">Start shopping</Link>
          </div>
        )}
      </div>
    </div>
  );
}
