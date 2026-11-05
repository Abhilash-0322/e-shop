import {connectDB} from '@/lib/mongodb';
import Order from '@/models/Order';
import {getCurrentUser} from '@/lib/auth';
import {notFound} from 'next/navigation';
import {PageHeader, StatusBadge} from '@/components/ui';
import {CheckCircle2, MapPin, Package} from '@/lib/icons';

export const dynamic = 'force-dynamic';

export default async function OrderDetail({params}: {params: {id: string}}) {
  const user = await getCurrentUser();
  await connectDB();
  const order = await Order.findOne({_id: params.id, userId: user!.id}).lean() as any;
  if (!order) notFound();
  return (
    <div>
      <PageHeader eyebrow="Order detail" title={`Order ${order.orderNumber}`} description={`Placed ${new Date(order.createdAt).toLocaleDateString()} · Your order details and delivery information.`} />
      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="surface p-6 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <StatusBadge value={order.status} /><b className="text-xl">${Number(order.total || 0).toFixed(2)}</b>
          </div>
          <div className="mt-5 space-y-3">
            {order.items?.map((item: any, index: number) => (
              <div className="flex gap-3 border-b border-slate-100 pb-3 last:border-0" key={`${String(item.productId)}-${index}`}>
                <img src={item.image || '/placeholder-product.svg'} className="h-16 w-16 rounded-xl bg-brand-50 object-contain" alt="" />
                <div><b>{item.title}</b><p className="muted mt-1 text-sm">Qty {item.qty} · ${item.price}</p></div>
              </div>
            ))}
          </div>
        </div>
        <aside className="space-y-3">
          <div className="surface p-5"><div className="flex items-center gap-2 font-bold"><Package className="h-4 w-4 text-brand-600" /> Delivery progress</div><div className="mt-4 flex items-center gap-2 text-sm text-emerald-700"><CheckCircle2 className="h-4 w-4" /> {order.status}</div></div>
          <div className="surface p-5"><div className="flex items-center gap-2 font-bold"><MapPin className="h-4 w-4 text-brand-600" /> Delivering to</div><p className="muted mt-3 text-sm leading-relaxed">{order.shippingAddress?.fullName}<br />{order.shippingAddress?.street}<br />{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p></div>
        </aside>
      </div>
    </div>
  );
}
