import {connectDB} from '@/lib/mongodb';
import Order from '@/models/Order';
import {getCurrentUser} from '@/lib/auth';
import {notFound} from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function OrderDetail({params}: {params: {id: string}}) {
  const user = await getCurrentUser();
  await connectDB();
  const order = await Order.findOne({_id: params.id, userId: user!.id}).lean() as any;
  if (!order) notFound();

  return (
    <div>
      <p className="eyebrow">Order detail</p>
      <h1 className="page-title mt-2">Order {order.orderNumber}</h1>
      <section className="surface mt-8 p-6" aria-labelledby="order-items">
        <div className="flex justify-between"><span className="pill">{order.status}</span><b>${Number(order.total || 0).toFixed(2)}</b></div>
        <h2 id="order-items" className="sr-only">Items in this order</h2>
        <ul className="mt-6 space-y-3">
          {order.items?.map((item: any) => <li className="flex gap-3 border-t pt-3" key={String(item.productId)}><img src={item.image || '/placeholder-product.svg'} className="h-16 w-16 rounded-lg bg-indigo-50 object-contain" alt="" /><div><b>{item.title}</b><p className="text-sm muted">Quantity {item.qty} · ${item.price}</p></div></li>)}
        </ul>
      </section>
    </div>
  );
}
