'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {Calendar, RefreshCw, ShieldCheck, Trash2} from '@/lib/icons';
import toast from 'react-hot-toast';

export default function Subscriptions() {
  const [items, setItems] = useState<any[]>([]);
  const [status, setStatus] = useState('');
  const load = () => fetch('/api/subscriptions').then((response) => response.json()).then((data) => setItems(data.items || []));
  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    const response = await fetch('/api/subscriptions', {method: 'DELETE', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({subscriptionId: id})});
    if (response.ok) {
      setStatus('Subscription cancelled.');
      toast.success('Subscription cancelled');
      load();
    } else {
      setStatus('Could not cancel subscription.');
      toast.error('Could not cancel subscription');
    }
  }

  return (
    <div>
      <p className="eyebrow">Automatic replenishment</p>
      <h1 className="page-title mt-2">Subscriptions</h1>
      <p className="mt-3 muted">Keep essentials moving on a schedule you control.</p>
      {status && <p className="mt-3 text-sm muted" role="status">{status}</p>}
      {items.length ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {items.map((item) => <article className="surface p-6" key={item._id}><div className="flex justify-between"><span className="pill">{item.status || 'Active'}</span><button type="button" onClick={() => remove(item._id)} className="flex min-h-11 min-w-11 items-center justify-center rounded text-rose-700" aria-label={`Cancel ${item.title} subscription`}><Trash2 className="h-4 w-4" aria-hidden="true" /></button></div><h2 className="mt-5 text-xl font-black">{item.title}</h2><p className="mt-2 text-sm muted">Every {item.frequencyMonths} month{item.frequencyMonths === 1 ? '' : 's'} · {item.discountPercent}% subscriber saving</p><div className="mt-5 flex items-center gap-2 text-sm font-bold text-indigo-800"><Calendar className="h-4 w-4" aria-hidden="true" />Next delivery {item.nextDeliveryAt ? new Date(item.nextDeliveryAt).toLocaleDateString() : 'scheduled'}</div></article>)}
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[['Save automatically', 'Choose a cadence that fits your routine.'], ['Stay flexible', 'Cancel any time from this dashboard.'], ['Keep control', 'See your next delivery before it happens.']].map(([title, description]) => <article className="card p-6" key={title}><RefreshCw className="h-6 w-6 text-indigo-700" aria-hidden="true" /><h2 className="mt-4 font-black">{title}</h2><p className="mt-2 text-sm muted">{description}</p></article>)}
        </div>
      )}
      <div className="surface mt-8 flex items-center gap-4 p-6"><ShieldCheck className="h-7 w-7 text-emerald-700" aria-hidden="true" /><p className="text-sm muted">Subscriptions are opt-in and separate from one-time checkout. <Link className="amazon-link" href="/search">Find products to subscribe to.</Link></p></div>
    </div>
  );
}
