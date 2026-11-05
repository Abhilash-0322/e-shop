'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Package, Plus } from '@/lib/icons';

export default function SellerProducts() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { fetch('/api/seller/products').then((response) => response.json()).then((data) => setItems(data.items || [])).catch(() => {}); }, []);
  return <div><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Catalog</p><h1 className="page-title mt-2">Products</h1><p className="muted mt-3">Your storefront starts with a clear, cared-for catalog.</p></div><Link href="/seller/products/new" className="btn btn-primary"><Plus className="h-4 w-4" /> Add product</Link></div><div className="surface mt-8 overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="bg-[#edf1e9] text-xs uppercase tracking-wider text-[#526259]"><tr><th className="p-4">Product</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Status</th><th /></tr></thead><tbody>{items.map((item) => <tr className="border-t border-[#dfe5dc]" key={item._id}><td className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#edf1e9]"><Package className="h-4 w-4 text-[#728749]" /></div><b>{item.title}</b></div></td><td className="p-4 font-bold">${Number(item.price || 0).toFixed(2)}</td><td className="p-4">{item.stock}</td><td className="p-4"><span className={`pill ${item.stock > 0 ? 'bg-[#d7f36b] text-[#405719]' : 'bg-[#ffe2dc] text-[#a23b25]'}`}>{item.stock > 0 ? 'Live' : 'Out of stock'}</span></td><td className="p-4 text-right"><Link className="amazon-link inline-flex items-center gap-1 text-sm" href={`/seller/products/${item._id}`}>Edit <ArrowUpRight className="h-3 w-3" /></Link></td></tr>)}</tbody></table></div>{!items.length && <div className="p-10 text-center"><p className="muted">No products yet.</p><Link href="/seller/products/new" className="amazon-link mt-3 inline-block">Add your first product →</Link></div>}</div></div>;
}
