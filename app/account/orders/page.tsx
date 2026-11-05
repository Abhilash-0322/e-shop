import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import AccountLayout from '../AccountLayout';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { serialize } from '@/lib/serialize';
import { AccountPageHeader, EmptyState, Notice, StatusBadge } from '@/components/AccountPrimitives';
import { ArrowRight, PackageOpen, RotateCcw, Truck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin?redirect=/account/orders');
  await connectDB();
  const orders = serialize(await Order.find({ userId: user.id }).sort({ createdAt: -1 }).lean()) as any;
  const activeOrders = orders.filter((o: any) => ['pending', 'processing', 'shipped', 'out_for_delivery'].includes(o.status));

  return (
    <AccountLayout user={user}>
      <AccountPageHeader eyebrow="Activity" title="Orders & tracking" description="Follow every delivery, reorder what worked, and find help when you need it." action={{ href: '/', label: 'Keep shopping' }} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Summary value={orders.length} label="Total orders" />
        <Summary value={activeOrders.length} label="On the way" />
        <Summary value={orders.filter((o: any) => o.status === 'delivered').length} label="Delivered" />
        <Summary value={orders.filter((o: any) => o.status === 'cancelled').length} label="Cancelled" />
      </div>
      <div className="panel p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div><h2 className="text-lg font-bold">All orders</h2><p className="text-sm text-muted">{orders.length} order{orders.length !== 1 ? 's' : ''} in your history</p></div>
          <Link href="/account/returns" className="btn-quiet"><RotateCcw className="w-4 h-4" /> Returns</Link>
        </div>
        {orders.length === 0 ? (
          <EmptyState icon={PackageOpen} title="Your order history is ready for its first story" description="Explore the store, discover something useful, and we&apos;ll keep the delivery details here." action={{ href: '/', label: 'Start shopping' }} />
        ) : (
          <div className="space-y-4">
            {orders.map((o: any) => (
              <div key={String(o._id)} className="border border-amazon-border rounded-2xl overflow-hidden hover:border-amazon-orange/60 transition-colors">
                <div className="bg-amazon-bg/70 px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <Meta label="ORDER PLACED" value={new Date(o.createdAt).toLocaleDateString()} />
                  <Meta label="TOTAL" value={formatPrice(o.total)} />
                  <Meta label="SHIP TO" value={o.shippingAddress?.fullName || 'Saved address'} />
                  <div><div className="text-amazon-textMuted">ORDER #{o.orderNumber}</div><Link className="amazon-link font-semibold" href={`/account/orders/${o._id}`}>View details</Link></div>
                </div>
                <div className="divide-y divide-amazon-border">
                  {(o.items as any[]).map((it, i) => (
                    <div key={i} className="p-4 flex flex-col sm:flex-row gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={it.image} alt={it.title} className="w-24 h-24 object-contain bg-white rounded-xl border border-amazon-border" />
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${it.productId}`} className="text-base text-amazon-link hover:text-amazon-linkHover hover:underline line-clamp-2">{it.title}</Link>
                        <div className="text-xs text-muted mt-1">Qty: {it.qty}</div>
                        <div className="text-sm font-bold mt-1">{formatPrice(it.price * it.qty)}</div>
                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                          <StatusBadge status={o.status} tone={o.status === 'delivered' ? 'success' : o.status === 'cancelled' ? 'danger' : 'info'} />
                          {o.deliveryEta && <span className="text-xs text-muted">Arriving by {new Date(o.deliveryEta).toLocaleDateString()}</span>}
                        </div>
                        <div className="mt-3 flex gap-2 flex-wrap">
                          <Link href={`/product/${it.productId}`} className="amazon-btn-yellow !text-xs !py-2">Buy it again</Link>
                          <Link href={`/account/orders/${o._id}`} className="btn-secondary !text-xs !py-2">Track order <ArrowRight className="w-3 h-3" /></Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {activeOrders.length > 0 && <Notice tone="info" icon={Truck}><span className="font-semibold">A delivery is moving.</span><span className="ml-1">Open an order to see its latest scan and estimated arrival.</span></Notice>}
    </AccountLayout>
  );
}

function Summary({ value, label }: { value: number; label: string }) {
  return <div className="panel p-4"><div className="text-2xl font-bold">{value}</div><div className="text-xs text-muted mt-1">{label}</div></div>;
}

function Meta({ label, value }: { label: string; value: string }) {
  return <div><div className="text-amazon-textMuted">{label}</div><div className="font-semibold">{value}</div></div>;
}
