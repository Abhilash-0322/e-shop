'use client';

import {useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {Check, Minus, Scale} from '@/lib/icons';
import {EmptyState, PageHeader} from '@/components/ui';

export default function Compare() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    const ids = (searchParams.get('ids') || '').split(',').filter(Boolean);
    if (ids.length > 1) fetch('/api/compare', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ids})}).then(response => response.json()).then(data => setItems(data.items || []));
  }, [searchParams]);
  const rows: [string, string][] = [['Price', 'price'], ['Brand', 'brand'], ['Rating', 'rating'], ['Plus delivery', 'plus'], ['Stock', 'stock']];
  return (
    <div className="shell py-10 md:py-14">
      <PageHeader eyebrow="Decision tool" title="Compare products" description="Put a few options side by side and choose with confidence." />
      <div className="mt-8">
        {items.length < 2 ? <EmptyState title="Select at least two products" description="Use the compare icon on product cards to build your shortlist." icon={<Scale className="h-8 w-8" />} /> : (
          <div className="table-wrap"><table className="data-table"><thead><tr><th>Specification</th>{items.map(item => <th key={item._id}>{item.title}</th>)}</tr></thead><tbody>{rows.map(([label, key]) => <tr key={key}><th>{label}</th>{items.map(item => <td key={item._id}>{key === 'plus' ? (item.isPrime ? <Check className="text-emerald-600" /> : <Minus className="text-slate-400" />) : key === 'price' ? `$${item.price}` : String(item[key] ?? '—')}</td>)}</tr>)}</tbody></table></div>
        )}
      </div>
    </div>
  );
}
