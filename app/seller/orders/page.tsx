'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, Clock, Package, ShoppingBag } from '@/lib/icons';

export default function SellerOrders() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/seller/orders', { signal: controller.signal }).then((response) => response.json()).then((data) => { if (!controller.signal.aborted) setItems(data.items || []); }).catch(() => {});
    return () => controller.abort();
  }, []);
  return (
    <div>
      <div className="workspace-toolbar"><div><p className="eyebrow">Fulfillment queue</p><h1 className="page-title mt-2">Orders</h1><p className="muted mt-3 text-sm">Keep every shipment moving to the next state.</p></div><ShoppingBag className="hidden h-8 w-8 text-indigo-200 sm:block" /></div>
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3"><div className="metric-card"><span className="metric-card-label">Queue</span><b className="metric-card-value">{items.length}</b></div><div className="metric-card"><span className="metric-card-label">Dispatch target</span><b className="metric-card-value">48h</b></div><div className="metric-card hidden sm:block"><span className="metric-card-label">Signal</span><b className="metric-card-value text-emerald-600">Good</b></div></div>
      <div className="space-y-3">{items.map((item) => <div className="surface flex items-center gap-4 p-5" key={item._id}><span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-50 text-indigo-600"><Package className="h-4 w-4" /></span><div className="flex-1"><b className="text-sm">{item.orderNumber || item._id}</b><p className="muted mt-1 text-xs"><Clock className="mr-1 inline h-3.5 w-3.5" /> Fulfillment task</p></div><span className="pill">{item.status}</span><ArrowUpRight className="h-4 w-4 text-slate-300" /></div>)}{!items.length && <div className="surface p-8 text-sm muted">No seller orders yet.</div>}</div>
    </div>
  );
}
