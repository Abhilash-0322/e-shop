'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SellerProducts() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { fetch('/api/seller/products').then((response) => response.json()).then((data) => setItems(data.items || [])).catch(() => {}); }, []);
  return <div>
    <div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Catalog</p><h1 className="page-title mt-2">Products</h1><p className="mt-2 text-sm muted">{items.length} listing{items.length === 1 ? '' : 's'} in your store</p></div><Link href="/seller/products/new" className="btn btn-primary min-h-11 shrink-0">Add product</Link></div>
    <div className="table-wrap mt-6 hidden sm:block"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="p-4">Product</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Status</th></tr></thead><tbody>{items.map((item) => <tr className="border-t border-slate-100" key={item._id}><td className="p-4 font-bold">{item.title}</td><td className="p-4">${item.price}</td><td className="p-4">{item.stock}</td><td className="p-4"><span className="pill">Live</span><Link className="ml-3 amazon-link" href={`/seller/products/${item._id}`}>Edit</Link></td></tr>)}</tbody></table>{!items.length && <p className="p-8 muted">No products yet.</p>}</div>
    <div className="mt-5 space-y-3 sm:hidden">{items.map((item) => <div className="surface flex items-center gap-3 p-4" key={item._id}><div className="min-w-0 flex-1"><b className="line-clamp-2 block">{item.title}</b><div className="mt-2 flex gap-3 text-sm muted"><span>${item.price}</span><span>{item.stock} in stock</span></div></div><div className="text-right"><span className="pill">Live</span><Link className="mt-2 block text-sm amazon-link" href={`/seller/products/${item._id}`}>Edit →</Link></div></div>)}{!items.length && <div className="surface p-8 muted">No products yet.</div>}</div>
  </div>;
}
