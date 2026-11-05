'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, Minus, Star } from '@/lib/icons';

export default function Compare() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const ids = (searchParams.get('ids') || '').split(',').filter(Boolean);
    if (ids.length < 2) {
      setItems([]);
      return;
    }
    const controller = new AbortController();
    fetch('/api/compare', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids }), signal: controller.signal })
      .then((response) => response.json())
      .then((data) => setItems(data.items || []))
      .catch((error) => {
        if (error?.name !== 'AbortError') setItems([]);
      });
    return () => controller.abort();
  }, [searchParams]);

  const rows: [string, string][] = [['Price', 'price'], ['Brand', 'brand'], ['Rating', 'rating'], ['Plus delivery', 'plus'], ['Stock', 'stock']];

  return (
    <div className="shell py-10 md:py-14">
      <div className="max-w-2xl"><p className="eyebrow">Decision tool</p><h1 className="page-title mt-2">Compare products with less guesswork.</h1><p className="muted mt-3">Put the details that matter next to each other, then choose with confidence.</p></div>
      {items.length < 2 ? (
        <div className="surface mt-8 flex flex-col items-center p-12 text-center"><div className="text-4xl">↔</div><h2 className="mt-4 text-2xl font-black">Your comparison is waiting.</h2><p className="muted mt-2 max-w-md">Select the compare icon on two to four product cards and they will appear here.</p><Link href="/search" className="btn btn-primary mt-6">Browse products</Link></div>
      ) : (
        <div className="surface mt-8 overflow-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead><tr className="border-b border-slate-200"><th className="w-40 p-5 text-left align-top text-xs uppercase tracking-widest text-slate-400">Specification</th>{items.map((item) => <th className="min-w-48 p-5 text-left align-top" key={item._id}><Link href={`/product/${item._id}`} className="group block"><div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-indigo-50"><img src={item.images?.[0] || '/placeholder-product.svg'} alt="" className="max-h-full max-w-full object-contain" /></div><span className="line-clamp-2 font-black group-hover:text-indigo-700">{item.title}</span><span className="mt-2 block text-lg font-black">${Number(item.price || 0).toFixed(2)}</span><span className="mt-1 flex items-center gap-1 text-xs text-amber-500"><Star className="h-3 w-3 fill-current" />{Number(item.rating || 0).toFixed(1)}</span></Link></th>)}</tr></thead>
            <tbody>{rows.map(([label, key]) => <tr className="border-t border-slate-200" key={key}><th className="bg-slate-50 p-5 text-left font-bold">{label}</th>{items.map((item) => <td className="p-5" key={item._id}>{key === 'plus' ? (item.isPrime ? <span className="flex items-center gap-2 text-emerald-600"><Check className="h-4 w-4" />Included</span> : <span className="flex items-center gap-2 text-slate-400"><Minus className="h-4 w-4" />Standard</span>) : key === 'price' ? `$${Number(item.price || 0).toFixed(2)}` : key === 'rating' ? `${Number(item.rating || 0).toFixed(1)} / 5` : String(item[key] ?? '—')}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
