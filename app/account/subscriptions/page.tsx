'use client';

import {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {Calendar, RefreshCw, ShieldCheck, Trash2} from '@/lib/icons';

export default function Subscriptions() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const mutation = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/subscriptions', {signal: controller.signal})
      .then((response) => response.json())
      .then((data) => {
        if (!controller.signal.aborted) setItems(data.items || []);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => {
      controller.abort();
      mutation.current?.abort();
    };
  }, []);

  async function remove(id: string) {
    mutation.current?.abort();
    const controller = new AbortController();
    mutation.current = controller;
    const response = await fetch('/api/subscriptions', {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({subscriptionId: id}),
      signal: controller.signal,
    });
    if (response.ok && !controller.signal.aborted) {
      toast.success('Subscription cancelled');
      setItems((current) => current.filter((item) => item._id !== id));
    }
  }

  return (
    <div>
      <p className="eyebrow">Automatic replenishment</p>
      <h1 className="page-title mt-2">Subscriptions</h1>
      <p className="muted mt-3">Keep essentials moving on a schedule you control.</p>
      {loading ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {[1, 2].map((row) => <div className="skeleton h-40 w-full" key={row} />)}
        </div>
      ) : items.length ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {items.map((item) => (
            <div className="surface p-6" key={item._id}>
              <div className="flex justify-between">
                <span className="pill">{item.status || 'Active'}</span>
                <button onClick={() => remove(item._id)} aria-label="Cancel subscription"><Trash2 className="h-4 w-4 text-rose-500" /></button>
              </div>
              <h2 className="mt-5 text-xl font-black">{item.title}</h2>
              <p className="muted mt-2 text-sm">Every {item.frequencyMonths} month{item.frequencyMonths === 1 ? '' : 's'} · {item.discountPercent}% subscriber saving</p>
              <div className="mt-5 flex items-center gap-2 text-sm font-bold text-indigo-700"><Calendar className="h-4 w-4" />Next delivery {item.nextDeliveryAt ? new Date(item.nextDeliveryAt).toLocaleDateString() : 'scheduled'}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[['Save automatically', 'Choose a cadence that fits your routine.'], ['Stay flexible', 'Cancel any time from this dashboard.'], ['Keep control', 'See your next delivery before it happens.']].map(([title, description]) => (
            <div className="card p-6" key={title}><RefreshCw className="h-6 w-6 text-indigo-600" /><h2 className="mt-4 font-black">{title}</h2><p className="muted mt-2 text-sm">{description}</p></div>
          ))}
        </div>
      )}
      <div className="surface mt-8 flex items-center gap-4 p-6"><ShieldCheck className="h-7 w-7 text-emerald-600" /><p className="muted text-sm">Subscriptions are opt-in and separate from one-time checkout. <Link className="amazon-link" href="/search">Find products to subscribe to.</Link></p></div>
    </div>
  );
}
