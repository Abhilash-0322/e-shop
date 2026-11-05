'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Plus, Search } from '@/lib/icons';

export default function SellerProducts() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/seller/products', { signal: controller.signal }).then((response) => response.json()).then((data) => { if (!controller.signal.aborted) setItems(data.items || []); }).catch(() => {});
    return () => controller.abort();
  }, []);
  return (
    <div>
      <div className="workspace-toolbar"><div><p className="eyebrow">Catalog control</p><h1 className="page-title mt-2">Products</h1><p className="muted mt-3 text-sm">{items.length} listings in your storefront.</p></div><Link href="/seller/products/new" className="btn btn-primary"><Plus className="h-4 w-4" /> Add product</Link></div>
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-400"><Search className="h-4 w-4" /> Filter catalog from the command launcher</div>
      <div className="data-table overflow-auto"><table className="w-full min-w-[600px] text-sm"><thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Status</th><th /></tr></thead><tbody>{items.map((item) => <tr key={item._id}><td><div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded bg-indigo-50 text-indigo-600"><Package className="h-4 w-4" /></span><b>{item.title}</b></div></td><td>${item.price}</td><td>{item.stock}</td><td><span className="pill">Live</span></td><td><Link className="text-xs font-extrabold text-indigo-600" href={`/seller/products/${item._id}`}>Edit →</Link></td></tr>)}</tbody></table>{!items.length && <p className="p-8 text-sm muted">No products yet. Add your first listing to start the signal.</p>}</div>
    </div>
  );
}
