'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, RefreshCw, ShieldCheck, Trash2 } from '@/lib/icons';
import toast from 'react-hot-toast';

export default function Subscriptions() {
  const [items, setItems] = useState<any[]>([]);
  const load = () => fetch('/api/subscriptions').then((response) => response.json()).then((data) => setItems(data.items || []));
  useEffect(() => { load(); }, []);
  async function remove(id: string) { const response = await fetch('/api/subscriptions', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subscriptionId: id }) }); if (response.ok) { toast.success('Subscription cancelled'); load(); } }
  return <div><div className="rounded-[1.7rem] bg-[#d7f36b] p-7 md:p-9"><p className="eyebrow !text-[#405719]">Automatic replenishment</p><h1 className="page-title mt-2">Subscriptions</h1><p className="mt-3 max-w-xl text-[#526239]">Keep essentials moving on a schedule you control.</p></div>{items.length ? <div className="mt-8 grid gap-5 md:grid-cols-2">{items.map((item) => <div className="surface p-6" key={item._id}><div className="flex justify-between"><span className="pill bg-[#d7f36b] text-[#405719]">{item.status || 'Active'}</span><button onClick={() => remove(item._id)} aria-label="Cancel subscription"><Trash2 className="h-4 w-4 text-[#ff765c]" /></button></div><h2 className="mt-5 text-xl font-black">{item.title}</h2><p className="muted mt-2 text-sm">Every {item.frequencyMonths} month{item.frequencyMonths === 1 ? '' : 's'} · {item.discountPercent}% subscriber saving</p><div className="mt-5 flex items-center gap-2 text-sm font-bold text-[#6d8735]"><Calendar className="h-4 w-4" />Next delivery {item.nextDeliveryAt ? new Date(item.nextDeliveryAt).toLocaleDateString() : 'scheduled'}</div></div>)}</div> : <div className="mt-8 grid gap-4 md:grid-cols-3">{[['Save automatically', 'Choose a cadence that fits your routine.'], ['Stay flexible', 'Cancel any time from this dashboard.'], ['Keep control', 'See your next delivery before it happens.']].map(([title, description]) => <div className="card p-6" key={title}><RefreshCw className="h-6 w-6 text-[#728749]" /><h2 className="mt-4 font-black">{title}</h2><p className="muted mt-2 text-sm">{description}</p></div>)}</div>}<div className="surface mt-8 flex gap-4 p-6"><ShieldCheck className="h-7 w-7 text-[#728749]" /><p className="muted text-sm">Subscriptions are opt-in and separate from one-time checkout. <Link className="amazon-link" href="/search">Find products to subscribe to.</Link></p></div></div>;
}
