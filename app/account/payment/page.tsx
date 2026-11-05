'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CreditCard, Lock } from 'lucide-react';

export default function Payment() {
  const [user, setUser] = useState<any>();
  const [form, setForm] = useState({ label: 'Personal card', cardNumber: '', expiry: '', brand: 'visa' });
  const load = () => fetch('/api/account').then((response) => response.json()).then((data) => setUser(data.user));
  useEffect(() => { load(); }, []);
  async function save(event: React.FormEvent) { event.preventDefault(); const response = await fetch('/api/account/payment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }); if (response.ok) { toast.success('Payment method saved'); load(); setForm({ ...form, cardNumber: '', expiry: '' }); } else toast.error('Could not save payment method'); }
  return <div><div className="rounded-[1.7rem] bg-[#dcecff] p-7 md:p-9"><p className="eyebrow">Profile / payment</p><h1 className="page-title mt-2">Payment methods</h1><p className="muted mt-3">Checkout should feel quick because the details are already in the right place.</p></div><div className="mt-8 grid gap-4 md:grid-cols-2">{user?.paymentMethods?.map((payment: any, index: number) => <div className="surface relative overflow-hidden p-6" key={payment._id || payment.label}><div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-[#d7f36b]" /><CreditCard className="relative h-6 w-6 text-[#405719]" /><b className="relative mt-8 block">{payment.brand || 'Card'} ending in {payment.cardNumberLast4}</b><p className="muted mt-2 text-sm">Expires {payment.expiry}</p><button className="mt-6 text-sm font-bold text-[#ff765c]" onClick={async () => { await fetch('/api/account/payment', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ index }) }); load(); }}>Remove</button></div>)}</div><form onSubmit={save} className="surface mt-5 max-w-xl p-6"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#edf1e9]"><Lock className="h-4 w-4 text-[#728749]" /></div><div><h2 className="font-black">Add a method</h2><p className="muted text-xs">Your card details are tokenized by the secure account flow.</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><input required className="input" placeholder="Card number" value={form.cardNumber} onChange={(event) => setForm({ ...form, cardNumber: event.target.value })} /><input required className="input" placeholder="Expiry" value={form.expiry} onChange={(event) => setForm({ ...form, expiry: event.target.value })} /></div><button className="btn btn-primary mt-4">Save card</button></form></div>;
}
