import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { getCurrentUser } from '@/lib/auth';
import { notFound } from 'next/navigation';
import DeliveryTimeline from '@/components/DeliveryTimeline';

export const dynamic = 'force-dynamic';

export default async function OrderDetail({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  await connectDB();
  const order = (await Order.findOne({ _id: params.id, userId: user!.id }).lean()) as any;
  if (!order) notFound();

  return (
    <div>
      <p className="eyebrow">Order detail</p>
      <h1 className="page-title mt-2">Order {order.orderNumber}</h1>
      <p className="muted mt-3">
        Placed {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'date unavailable'}
      </p>

      <div className="surface p-6 mt-8">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <span className="pill">{order.status}</span>
            <p className="muted text-sm mt-3">
              {order.shippingAddress?.city
                ? `Delivering to ${order.shippingAddress.city}, ${order.shippingAddress.state || order.shippingAddress.country || ''}`
                : 'Delivery address saved with this order'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs muted">Order total</p>
            <b className="text-2xl block mt-1">${Number(order.total || 0).toFixed(2)}</b>
          </div>
        </div>

        <div className="space-y-3 mt-6">
          {order.items?.map((item: any) => (
            <div className="flex gap-3 border-t pt-3" key={String(item.productId)}>
              <img
                src={item.image || '/placeholder-product.svg'}
                className="w-16 h-16 rounded-lg bg-indigo-50 object-contain"
                alt=""
              />
              <div>
                <b>{item.title}</b>
                <p className="text-sm muted mt-1">
                  Qty {item.qty} · ${Number(item.price || 0).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DeliveryTimeline status={order.status} events={order.trackingEvents} eta={order.deliveryEta} />
    </div>
  );
}
