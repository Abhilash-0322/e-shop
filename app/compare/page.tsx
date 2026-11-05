'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Check, Minus, ShoppingCart, Star } from '@/lib/icons';
import { useCart } from '@/hooks/useCart';

export default function Compare() {
  const sp = useSearchParams();
  const { add } = useCart();
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    const ids = (sp.get('ids') || '').split(',').filter(Boolean);
    if (ids.length > 1) fetch('/api/compare', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids }) }).then((r) => r.json()).then((data) => setItems(data.items || [])).catch(() => {});
  }, [sp]);
  const rows: [string, string][] = [['Price', 'price'], ['Brand', 'brand'], ['Rating', 'rating'], ['Plus delivery', 'plus'], ['Stock', 'stock'], ['Seller', 'sellerName']];
  async function addItem(id: string) { const ok = await add(id); toast[ok ? 'success' : 'error'](ok ? 'Added to your bag' : 'Sign in to add items'); }
  return (
    <div className="shell py-10 md:py-14">
      <div className="mb-8"><p className="eyebrow">Decision tool</p><h1 className="page-title mt-2">Compare products</h1><p className="muted mt-3 max-w-xl">Line up the details that matter, then choose the one that fits your life best.</p></div>
      {items.length < 2 ? <div className="surface p-10 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#d7f36b] text-[#405719]"><Star className="h-6 w-6 fill-current" /></div><h2 className="mt-5 text-2xl font-black">Your comparison shelf is waiting.</h2><p className="muted mx-auto mt-2 max-w-md">Select at least two products from a product card to compare them side by side.</p><Link href="/search" className="btn btn-primary mt-6">Browse products</Link></div> : <div className="surface overflow-hidden"><div className="grid min-w-[680px] grid-cols-[150px_repeat(4,minmax(170px,1fr))] overflow-auto">{<div className="border-b border-[#dfe5dc] p-4 text-xs font-black uppercase tracking-wider text-[#8b998d]">Signal</div>}{items.map((item) => <div className="border-b border-l border-[#dfe5dc] p-4" key={item._id}><div className="aspect-square overflow-hidden rounded-xl bg-[#edf1e9]"><img src={item.images?.[0] || '/placeholder-product.svg'} alt="" className="h-full w-full object-contain mix-blend-multiply" /></div><h2 className="mt-3 line-clamp-2 text-sm font-black">{item.title}</h2><button onClick={() => addItem(item._id)} className="btn btn-primary mt-3 w-full !px-2 !py-2 text-xs"><ShoppingCart className="h-3.5 w-3.5" /> Add</button></div>)}{rows.map(([label, key]) => <div key={key} className="contents"><div className="border-t border-[#dfe5dc] bg-[#edf1e9] p-4 text-sm font-black">{label}</div>{items.map((item) => <div className="border-l border-t border-[#dfe5dc] p-4 text-sm" key={`${item._id}-${key}`}>{key === 'plus' ? (item.isPrime ? <Check className="text-[#728749]" /> : <Minus className="text-[#8b998d]" />) : key === 'price' ? <b>${Number(item.price || 0).toFixed(2)}</b> : key === 'rating' ? <span className="flex items-center gap-1 text-[#b07a29]"><Star className="h-3 w-3 fill-current" />{item.rating || '—'}</span> : String(item[key] ?? '—')}</div>)}</div>)}</div></div>}
    </div>
  );
}
