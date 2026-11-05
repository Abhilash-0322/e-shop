'use client';
import {useEffect, useState} from 'react';
import Link from 'next/link';
import {Calendar, RefreshCw, ShieldCheck, Trash2} from '@/lib/icons';
import {useLocale} from '@/components/LocaleProvider';
import toast from 'react-hot-toast';

export default function Subscriptions() {
  const [items, setItems] = useState<any[]>([]);
  const {formatDate, formatNumber} = useLocale();
  const load = () => fetch('/api/subscriptions').then((response) => response.json()).then((data) => setItems(data.items || []));
  useEffect(() => {load();}, []);
  async function remove(id: string) {const response = await fetch('/api/subscriptions', {method: 'DELETE', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({subscriptionId: id})}); if (response.ok) {toast.success('Subscription cancelled'); load();}}
  return <div><p className="eyebrow">Automatic replenishment</p><h1 className="page-title mt-2">Subscriptions</h1><p className="mt-3 muted">Keep essentials moving on a schedule you control.</p>{items.length ? <div className="mt-8 grid min-w-0 gap-5 md:grid-cols-2">{items.map((item) => <div className="surface min-w-0 p-5 sm:p-6" key={item._id}><div className="flex flex-wrap justify-between gap-3"><span className="pill">{item.status || 'Active'}</span><button onClick={() => remove(item._id)} aria-label={`Cancel subscription for ${item.title}`}><Trash2 className="h-4 w-4 text-rose-500" aria-hidden="true"/></button></div><h2 className="mt-5 text-wrap text-xl font-black">{item.title}</h2><p className="mt-2 text-sm muted">Every {formatNumber(item.frequencyMonths)} month{item.frequencyMonths === 1 ? '' : 's'} · {formatNumber(item.discountPercent)}% subscriber saving</p><div className="mt-5 flex flex-wrap items-center gap-2 text-sm font-bold text-indigo-700"><Calendar className="h-4 w-4" aria-hidden="true"/>Next delivery {item.nextDeliveryAt ? formatDate(item.nextDeliveryAt) : 'scheduled'}</div></div>)}</div> : <div className="mt-8 grid gap-4 md:grid-cols-3">{[['Save automatically', 'Choose a cadence that fits your routine.'], ['Stay flexible', 'Cancel any time from this dashboard.'], ['Keep control', 'See your next delivery before it happens.']].map(([title, body]) => <div className="card p-6" key={title}><RefreshCw className="h-6 w-6 text-indigo-600" aria-hidden="true"/><h2 className="mt-4 font-black">{title}</h2><p className="mt-2 text-sm muted">{body}</p></div>)}</div>}<div className="surface mt-8 flex flex-wrap items-center gap-4 p-5 sm:p-6"><ShieldCheck className="h-7 w-7 text-emerald-600" aria-hidden="true"/><p className="text-sm muted">Subscriptions are opt-in and separate from one-time checkout. <Link className="amazon-link" href="/search">Find products to subscribe to.</Link></p></div></div>;
}
