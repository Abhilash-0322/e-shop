import {connectDB} from '@/lib/mongodb';
import Order from '@/models/Order';
import {getCurrentUser} from '@/lib/auth';
import Link from 'next/link';
import {EmptyState, PageHeader, StatusBadge} from '@/components/ui';
import {Package} from '@/lib/icons';

export const dynamic = 'force-dynamic';

export default async function Orders() {
  const user = await getCurrentUser();
  await connectDB();
  const orders = await Order.find({userId: user!.id}).sort({createdAt: -1}).lean();
  return (
    <div>
      <PageHeader eyebrow="History" title="Your orders" description="A clear record of everything you have bought through Halozon." />
      <div className="mt-8 space-y-3">
        {orders.length ? orders.map((order: any) => (
          <Link key={order._id} href={`/account/orders/${order._id}`} className="card-interactive surface block p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700 sm:flex"><Package className="h-5 w-5" /></div>
                <div><b>Order {order.orderNumber}</b><p className="muted mt-1 text-sm">{new Date(order.createdAt).toLocaleDateString()} · {order.items?.length || 0} items</p></div>
              </div>
              <div className="text-left sm:text-right"><StatusBadge value={order.status} /><b className="mt-2 block">${Number(order.total || 0).toFixed(2)}</b></div>
            </div>
          </Link>
        )) : (
          <EmptyState title="No orders yet" description="When you place your first order, its delivery status and details will appear here." action={<Link className="btn btn-primary" href="/search">Start shopping</Link>} icon={<Package className="h-8 w-8" />} />
        )}
      </div>
    </div>
  );
}
