'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Package, Truck } from '@/lib/icons';

export default function SellerOrders() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { fetch('/api/seller/orders').then((response) => response.json()).then((data) => setItems(data.items || [])).catch(() => {}); }, []);
  return <div><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Fulfillment</p><h1 className="page-title mt-2">Orders</h1><p className="muted mt-3">Keep every customer promise moving.</p></div><span className="pill">{items.length} orders</span></div><div className="mt-8 space-y-3">{items.map((item) => <div className="surface flex items-center gap-4 p-5" key={item._id}><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf1e9] text-[#728749]"><Package className="h-5 w-5" /></div><div className="min-w-0 flex-1"><b>{item.orderNumber || item._id}</b><p className="muted mt-1 text-sm">{item.items?.length || 0} items · {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent order'}</p></div><span className="pill">{item.status}</span><ArrowRight className="h-4 w-4 text-[#8b998d]" /></div>)}{!items.length && <div className="surface p-10 text-center"><Truck className="mx-auto h-8 w-8 text-[#c3d39d]" /><p className="muted mt-3">No seller orders yet.</p></div>}</div></div>;
}
