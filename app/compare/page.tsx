'use client';

import {useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {Check, Minus} from '@/lib/icons';

export default function Compare() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const ids = (searchParams.get('ids') || '').split(',').filter(Boolean);
    if (ids.length > 1) fetch('/api/compare', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ids})}).then((response) => response.json()).then((data) => setItems(data.items || []));
  }, [searchParams]);

  const rows: [string, string][] = [['Price', 'price'], ['Brand', 'brand'], ['Rating', 'rating'], ['Plus delivery', 'plus'], ['Stock', 'stock']];

  return (
    <div className="shell py-12">
      <p className="eyebrow">Decision tool</p>
      <h1 className="page-title mt-2">Compare products</h1>
      {items.length < 2 ? (
        <div className="surface mt-8 p-10 muted" role="status">Select at least two products from a product card to compare them.</div>
      ) : (
        <div className="surface table-wrap mt-8">
          <table className="w-full text-sm">
            <caption className="sr-only">Product comparison</caption>
            <thead>
              <tr>
                <th scope="col" className="p-5 text-left">Specification</th>
                {items.map((item) => <th scope="col" className="p-5 text-left" key={item._id}>{item.title}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, key]) => (
                <tr className="border-t" key={key}>
                  <th scope="row" className="bg-slate-50 p-5 text-left">{label}</th>
                  {items.map((item) => (
                    <td className="p-5" key={item._id}>
                      {key === 'plus'
                        ? item.isPrime ? <><Check className="inline text-emerald-700" aria-hidden="true" /><span className="sr-only">Included</span></> : <><Minus className="inline text-slate-500" aria-hidden="true" /><span className="sr-only">Not included</span></>
                        : key === 'price' ? `$${item.price}` : String(item[key] ?? '—')}
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
