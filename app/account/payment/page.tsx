'use client';

import {useEffect, useState} from 'react';
import toast from 'react-hot-toast';

export default function Payment() {
  const [user, setUser] = useState<any>();
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({label: 'Personal card', cardNumber: '', expiry: '', brand: 'visa'});
  const load = () => fetch('/api/account').then((response) => response.json()).then((data) => setUser(data.user));
  useEffect(() => { load(); }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch('/api/account/payment', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(form)});
    if (response.ok) {
      setStatus('Payment method saved.');
      toast.success('Payment method saved');
      load();
      setForm({...form, cardNumber: '', expiry: ''});
    } else {
      setStatus('Could not save payment method.');
      toast.error('Could not save payment method');
    }
  }

  return (
    <div>
      <p className="eyebrow">Profile</p>
      <h1 className="page-title mt-2">Payment methods</h1>
      {status && <p className="mt-3 text-sm muted" role="status">{status}</p>}
      <section className="mt-8 grid gap-4 md:grid-cols-2" aria-labelledby="saved-payments">
        <h2 id="saved-payments" className="sr-only">Saved payment methods</h2>
        {user?.paymentMethods?.map((payment: any, index: number) => <article className="surface flex justify-between gap-4 p-6" key={payment._id || payment.label}><div><b>{payment.brand || 'Card'} ending in {payment.cardNumberLast4}</b><p className="mt-2 text-sm muted">Expires {payment.expiry}</p></div><button type="button" className="min-h-11 rounded text-rose-700 underline underline-offset-2" onClick={async () => { await fetch('/api/account/payment', {method: 'DELETE', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({index})}); setStatus('Payment method removed.'); load(); }} aria-label={`Remove ${payment.brand || 'card'} ending in ${payment.cardNumberLast4}`}>Remove</button></article>)}
        {!user?.paymentMethods?.length && <p className="surface p-8 muted">No saved payment methods yet.</p>}
      </section>
      <form onSubmit={save} className="surface mt-5 max-w-xl p-6" aria-labelledby="add-payment">
        <h2 id="add-payment" className="font-black">Add a method</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div><label htmlFor="payment-card" className="text-sm font-bold">Card number</label><input id="payment-card" required inputMode="numeric" autoComplete="cc-number" className="input mt-1" value={form.cardNumber} onChange={(event) => setForm({...form, cardNumber: event.target.value})} /></div>
          <div><label htmlFor="payment-expiry" className="text-sm font-bold">Expiry</label><input id="payment-expiry" required autoComplete="cc-exp" placeholder="MM/YY" className="input mt-1" value={form.expiry} onChange={(event) => setForm({...form, expiry: event.target.value})} /></div>
        </div>
        <button type="submit" className="btn btn-primary mt-4">Save card</button>
      </form>
    </div>
  );
}
