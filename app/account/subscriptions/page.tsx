'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Calendar, CheckCircle2, Clock, RefreshCw, ShieldCheck, Trash2 } from '@/lib/icons';

type LoadState = 'loading' | 'ready' | 'error';

function formatDate(value?: string | Date) {
  if (!value) return 'Not scheduled';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Not scheduled'
    : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

export default function Subscriptions() {
  const [items, setItems] = useState<any[]>([]);
  const [state, setState] = useState<LoadState>('loading');
  const [error, setError] = useState('');
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [cancelBusy, setCancelBusy] = useState<string | null>(null);
  const [cancelledTitle, setCancelledTitle] = useState('');

  const load = useCallback(async (signal?: AbortSignal) => {
    setState('loading');
    setError('');
    try {
      const response = await fetch('/api/subscriptions', { signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not load subscriptions');
      setItems(Array.isArray(data.items) ? data.items : []);
      setState('ready');
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      setError(err.message || 'Could not load subscriptions');
      setState('error');
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  async function cancel(subscription: any) {
    setCancelBusy(subscription._id);
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: subscription._id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not cancel subscription');
      setCancelledTitle(subscription.title);
      setCancelTarget(null);
      toast.success('Subscription cancelled');
      await load();
    } catch (err: any) {
      toast.error(err.message || 'Could not cancel subscription');
    } finally {
      setCancelBusy(null);
    }
  }

  const nextDelivery = items
    .filter((item) => item.nextDeliveryAt)
    .sort((a, b) => new Date(a.nextDeliveryAt).getTime() - new Date(b.nextDeliveryAt).getTime())[0];

  return (
    <div>
      <p className="eyebrow">Automatic replenishment</p>
      <h1 className="page-title mt-2">Subscriptions</h1>
      <p className="muted mt-3 max-w-2xl">
        Keep essentials moving on a cadence you choose. Each subscription stays separate from your one-time orders.
      </p>

      {cancelledTitle && (
        <div className="surface border-emerald-200 bg-emerald-50 p-4 mt-6 flex items-start gap-3" role="status">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <b className="text-emerald-950">{cancelledTitle} was cancelled.</b>
            <p className="text-emerald-900/75 mt-1">No future replenishment will be created for this subscription.</p>
          </div>
        </div>
      )}

      {state === 'loading' && (
        <div className="grid md:grid-cols-2 gap-5 mt-8" aria-label="Loading subscriptions">
          {[1, 2].map((item) => (
            <div className="surface p-6 animate-pulse" key={item}>
              <div className="h-5 w-20 rounded bg-slate-200" />
              <div className="h-6 w-2/3 rounded bg-slate-200 mt-6" />
              <div className="h-4 w-1/2 rounded bg-slate-200 mt-3" />
              <div className="h-12 rounded-xl bg-slate-100 mt-6" />
            </div>
          ))}
        </div>
      )}

      {state === 'error' && (
        <div className="surface border-rose-200 bg-rose-50 p-8 mt-8 text-center" role="alert">
          <p className="font-bold text-rose-900">We couldn&apos;t load your subscriptions.</p>
          <p className="text-sm text-rose-800/75 mt-2">{error}</p>
          <button type="button" onClick={() => load()} className="btn btn-soft mt-5">
            Try again
          </button>
        </div>
      )}

      {state === 'ready' && items.length > 0 && (
        <>
          <div className="grid sm:grid-cols-2 gap-3 mt-8">
            <div className="surface p-5">
              <p className="text-sm muted">Active replenishments</p>
              <b className="text-3xl block mt-2">{items.filter((item) => item.active !== false).length}</b>
              <p className="text-xs muted mt-1">Only subscriptions returned by your account</p>
            </div>
            <div className="surface p-5">
              <p className="text-sm muted">Next delivery</p>
              <b className="text-xl block mt-3">{nextDelivery ? formatDate(nextDelivery.nextDeliveryAt) : 'Not scheduled'}</b>
              <p className="text-xs muted mt-1">{nextDelivery?.title || 'No upcoming delivery date'}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mt-5">
            {items.map((item) => {
              const paused = item.active === false || item.status === 'paused';
              const confirming = cancelTarget === item._id;
              return (
                <article className="surface p-6" key={item._id}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3 min-w-0">
                      <img
                        src={item.image || '/placeholder-product.svg'}
                        alt=""
                        className="w-16 h-16 rounded-xl bg-indigo-50 object-contain shrink-0"
                      />
                      <div className="min-w-0">
                        <span className={`pill ${paused ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {paused ? 'Paused' : 'Active'}
                        </span>
                        <h2 className="font-black text-lg mt-2 truncate">{item.title}</h2>
                      </div>
                    </div>
                    <RefreshCw className={`w-5 h-5 shrink-0 ${paused ? 'text-amber-500' : 'text-indigo-500'}`} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs muted">Cadence</p>
                      <p className="font-bold mt-1">
                        Every {item.frequencyMonths} month{item.frequencyMonths === 1 ? '' : 's'}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs muted">Savings</p>
                      <p className="font-bold mt-1">{item.discountPercent || 0}% each delivery</p>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 mt-5 pt-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Delivery timeline</p>
                    <ol className="mt-3 space-y-3">
                      <li className="flex items-center gap-3 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="flex-1">Subscription started</span>
                        <span className="muted text-xs">{formatDate(item.createdAt)}</span>
                      </li>
                      <li className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="flex-1">Next delivery</span>
                        <span className="font-bold text-xs">{formatDate(item.nextDeliveryAt)}</span>
                      </li>
                      <li className="flex items-center gap-3 text-sm">
                        <Clock className={`w-4 h-4 shrink-0 ${paused ? 'text-amber-600' : 'text-slate-400'}`} />
                        <span className="flex-1">{paused ? 'Delivery paused' : 'Ready for the next cycle'}</span>
                      </li>
                    </ol>
                  </div>

                  {confirming ? (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 mt-5" role="alert">
                      <p className="text-sm font-bold text-rose-950">Cancel future deliveries?</p>
                      <p className="text-xs text-rose-900/75 mt-1">
                        This removes the subscription. You can start it again from any product page.
                      </p>
                      <div className="flex gap-2 mt-3">
                        <button
                          type="button"
                          onClick={() => cancel(item)}
                          disabled={cancelBusy === item._id}
                          className="btn !bg-rose-600 !text-white !py-2 text-xs"
                        >
                          {cancelBusy === item._id ? 'Cancelling…' : 'Yes, cancel'}
                        </button>
                        <button type="button" onClick={() => setCancelTarget(null)} className="btn btn-soft !py-2 text-xs">
                          Keep subscription
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3 mt-5">
                      <p className="text-xs muted">
                        {paused ? 'Paused state returned by the subscription service.' : 'Cancel any time before the next cycle.'}
                      </p>
                      {!paused && (
                        <button
                          type="button"
                          onClick={() => setCancelTarget(item._id)}
                          className="inline-flex items-center gap-1 text-sm font-bold text-rose-600 hover:text-rose-800"
                        >
                          <Trash2 className="w-4 h-4" />
                          Cancel
                        </button>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </>
      )}

      {state === 'ready' && items.length === 0 && (
        <div className="surface p-8 md:p-10 mt-8">
          <div className="max-w-xl">
            <RefreshCw className="w-8 h-8 text-indigo-600" />
            <h2 className="text-2xl font-black mt-5">Your replenishment list is empty.</h2>
            <p className="muted mt-3">
              When you find an everyday essential, choose a cadence on its product page. We&apos;ll show the next delivery
              here after the subscription is created.
            </p>
            <Link href="/search" className="btn btn-primary mt-6">
              Find products to repeat
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-3 mt-8">
            {[
              ['Choose a cadence', 'Monthly through every six months, based on what fits your routine.'],
              ['See the savings', 'The product page shows your per-delivery savings before signup.'],
              ['Keep control', 'Cancel from this dashboard when you no longer need a repeat delivery.'],
            ].map(([title, description]) => (
              <div className="card p-5" key={title}>
                <h3 className="font-black">{title}</h3>
                <p className="muted text-sm mt-2">{description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="surface p-5 mt-8 flex gap-3 items-start">
        <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
        <p className="text-sm muted">
          Subscriptions are opt-in and never silently added to one-time checkout.{' '}
          <Link className="amazon-link" href="/help">
            Need help with a delivery?
          </Link>
        </p>
      </div>
    </div>
  );
}
