'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {Calendar, RefreshCw, ShieldCheck, Trash2} from '@/lib/icons';
import toast from 'react-hot-toast';
import {PageHeader, StatusBadge} from '@/components/ui';

export default function Subscriptions() {
  const [items, setItems] = useState<any[]>([]);
  const load = () => fetch('/api/subscriptions').then(response => response.json()).then(data => setItems(data.items || []));
  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    const response = await fetch('/api/subscriptions', {method: 'DELETE', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({subscriptionId: id})});
    if (response.ok) { toast.success('Subscription cancelled'); load(); }
  }

  return (
    <div>
      <PageHeader eyebrow="Automatic replenishment" title="Subscriptions" description="Keep essentials moving on a schedule you control." />
      {items.length ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {items.map(item => (
            <div className="surface p-6" key={item._id}>
              <div className="flex justify-between"><StatusBadge value={item.status || 'Active'} /><button type="button" onClick={() => remove(item._id)} aria-label="Cancel subscription" className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button></div>
              <h2 className="mt-5 text-xl font-black">{item.title}</h2>
              <p className="muted mt-2 text-sm">Every {item.frequencyMonths} month{item.frequencyMonths === 1 ? '' : 's'} · {item.discountPercent}% subscriber saving</p>
              <div className="mt-5 flex items-center gap-2 text-sm font-bold text-brand-700"><Calendar className="h-4 w-4" />Next delivery {item.nextDeliveryAt ? new Date(item.nextDeliveryAt).toLocaleDateString() : 'scheduled'}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[['Save automatically', 'Choose a cadence that fits your routine.'], ['Stay flexible', 'Cancel any time from this dashboard.'], ['Keep control', 'See your next delivery before it happens.']].map(([title, description]) => <div className="card p-6" key={title}><RefreshCw className="h-6 w-6 text-brand-600" /><h2 className="mt-4 font-black">{title}</h2><p className="muted mt-2 text-sm">{description}</p></div>)}
        </div>
      )}
      <div className="surface mt-8 flex items-center gap-4 p-6"><ShieldCheck className="h-7 w-7 shrink-0 text-emerald-600" /><p className="muted text-sm">Subscriptions are opt-in and separate from one-time checkout. <Link className="amazon-link" href="/search">Find products to subscribe to.</Link></p></div>
    </div>
  );
}
