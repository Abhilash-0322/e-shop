'use client';

import {useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {Check, Minus} from '@/lib/icons';

export default function Compare() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get('ids') || '';
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ids = idsParam.split(',').filter(Boolean);
    if (ids.length < 2) {
      setItems([]);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    fetch('/api/compare', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ids}),
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((data) => {
        if (!controller.signal.aborted) setItems(data.items || []);
      })
      .catch((error) => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) setItems([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [idsParam]);

  const rows: [string, string][] = [
    ['Price', 'price'],
    ['Brand', 'brand'],
    ['Rating', 'rating'],
    ['Plus delivery', 'plus'],
    ['Stock', 'stock'],
  ];

  return (
    <div className="shell py-12">
      <p className="eyebrow">Decision tool</p>
      <h1 className="page-title mt-2">Compare products</h1>
      {loading ? (
        <div className="surface mt-8 p-10" aria-live="polite">
          <div className="skeleton h-5 w-48" />
          <div className="skeleton mt-4 h-4 w-72" />
        </div>
      ) : items.length < 2 ? (
        <div className="surface muted mt-8 p-10">Select at least two products from a product card to compare them.</div>
      ) : (
        <div className="surface mt-8 overflow-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead>
              <tr>
                <th className="p-5 text-left">Specification</th>
                {items.map((item) => <th className="p-5 text-left" key={item._id}>{item.title}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, key]) => (
                <tr className="border-t" key={key}>
                  <th className="bg-slate-50 p-5 text-left">{label}</th>
                  {items.map((item) => (
                    <td className="p-5" key={item._id}>
                      {key === 'plus'
                        ? item.isPrime
                          ? <Check className="text-emerald-600" />
                          : <Minus className="text-slate-400" />
                        : key === 'price'
                          ? `$${item.price}`
                          : String(item[key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
