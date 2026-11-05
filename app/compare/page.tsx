'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, GitCompare, Minus } from '@/lib/icons';

export default function Compare() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const ids = (searchParams.get('ids') || '').split(',').filter(Boolean);
    if (ids.length < 2) {
      setItems([]);
      return () => controller.abort();
    }
    setLoading(true);
    fetch('/api/compare', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids }), signal: controller.signal })
      .then((response) => response.json())
      .then((data) => { if (!controller.signal.aborted) setItems(data.items || []); })
      .catch(() => {})
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [searchParams]);

  const rows: [string, string][] = [['Price', 'price'], ['Brand', 'brand'], ['Rating', 'rating'], ['Plus delivery', 'plus'], ['Stock', 'stock']];

  return (
    <div className="shell py-8 md:py-10">
      <div className="workspace-toolbar">
        <div><p className="eyebrow">Decision tool</p><h1 className="page-title mt-2">Compare products</h1><p className="muted mt-3 text-sm">Line up the signals that matter before you commit.</p></div>
        <GitCompare className="hidden h-8 w-8 text-indigo-200 sm:block" />
      </div>
      {loading && <div className="surface p-8 text-sm text-slate-500">Loading comparison...</div>}
      {!loading && items.length < 2 && <div className="surface p-10 text-center"><GitCompare className="mx-auto h-8 w-8 text-indigo-300" /><h2 className="mt-4 text-lg font-black">Your comparison board is waiting.</h2><p className="muted mt-2 text-sm">Select the compare icon on at least two product cards to see them here.</p></div>}
      {!loading && items.length >= 2 && <div className="data-table overflow-auto"><table className="w-full min-w-[620px] text-sm"><thead><tr><th>Specification</th>{items.map((item) => <th key={item._id}>{item.title}</th>)}</tr></thead><tbody>{rows.map(([label, key]) => <tr key={key}><th className="bg-slate-50">{label}</th>{items.map((item) => <td key={item._id}>{key === 'plus' ? (item.isPrime ? <Check className="text-emerald-600" /> : <Minus className="text-slate-400" />) : key === 'price' ? `$${Number(item.price || 0).toFixed(2)}` : String(item[key] ?? '—')}</td>)}</tr>)}</tbody></table></div>}
    </div>
  );
}
