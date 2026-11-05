import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { getCurrentUser } from '@/lib/auth';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Check, MapPin, Package, Truck } from '@/lib/icons';

export const dynamic = 'force-dynamic';

export default async function OrderDetail({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  await connectDB();
  const order = await Order.findOne({ _id: params.id, userId: user!.id }).lean() as any;
  if (!order) notFound();
  const tracking = order.trackingEvents || [];
  return <div><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Order detail</p><h1 className="page-title mt-2">{order.orderNumber}</h1><p className="muted mt-2">Placed {new Date(order.createdAt).toLocaleDateString()}</p></div><span className="pill bg-[#d7f36b] text-[#405719]">{order.status}</span></div><div className="surface mt-8 p-6 md:p-8"><div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#dfe5dc] pb-5"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf1e9] text-[#728749]"><Package className="h-5 w-5" /></div><div><b>On its way to a good home</b><p className="muted text-sm">{order.deliveryEta ? `Estimated ${new Date(order.deliveryEta).toLocaleDateString()}` : 'Delivery estimate coming soon'}</p></div></div><b className="text-xl">${Number(order.total || 0).toFixed(2)}</b></div><div className="mt-7 grid gap-5 md:grid-cols-3">{tracking.map((event: any, index: number) => <div key={`${event.status}-${index}`} className="relative flex gap-3"><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${index === tracking.length - 1 ? 'bg-[#d7f36b] text-[#405719]' : 'bg-[#edf1e9] text-[#728749]'}`}>{index === 0 ? <Check className="h-4 w-4" /> : <Truck className="h-4 w-4" />}</span><div><b className="text-sm">{event.label || event.status}</b><p className="muted mt-1 text-xs">{event.at ? new Date(event.at).toLocaleString() : 'Scheduled'}</p></div></div>)}</div></div><div className="mt-5 grid gap-5 lg:grid-cols-[1fr_280px]"><div className="surface p-6"><p className="eyebrow">Items</p><div className="mt-4 space-y-3">{order.items?.map((item: any) => <div className="flex gap-3 border-t border-[#dfe5dc] pt-3" key={String(item.productId)}><img src={item.image || '/placeholder-product.svg'} className="h-16 w-16 rounded-lg bg-[#edf1e9] object-contain" alt="" /><div className="flex-1"><b>{item.title}</b><p className="muted mt-1 text-sm">Qty {item.qty} · ${Number(item.price || 0).toFixed(2)}</p></div></div>)}</div></div><div className="surface h-fit p-6"><p className="eyebrow">Delivering to</p><p className="mt-3 text-sm leading-relaxed"><b>{order.shippingAddress?.fullName}</b><br />{order.shippingAddress?.street}<br />{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p><div className="mt-5 flex gap-2 text-xs font-bold text-[#526259]"><MapPin className="h-4 w-4 text-[#728749]" /> Buyer protection included</div><Link href="/help" className="amazon-link mt-5 block text-sm">Need help? →</Link></div></div></div>;
}
