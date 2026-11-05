'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import toast from 'react-hot-toast';

export default function Payment() {
  const [user, setUser] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({label: 'Personal card', cardNumber: '', expiry: '', brand: 'visa'});
  const mounted = useRef(true);
  const accountRequest = useRef<AbortController | null>(null);
  const mutation = useRef<AbortController | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    accountRequest.current?.abort();
    const controller = signal ? null : new AbortController();
    accountRequest.current = controller;
    try {
      const response = await fetch('/api/account', {signal: signal || controller?.signal});
      const data = await response.json();
      if (mounted.current && response.ok) setUser(data.user);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) undefined;
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    const controller = new AbortController();
    load(controller.signal);
    return () => {
      mounted.current = false;
      controller.abort();
      accountRequest.current?.abort();
      mutation.current?.abort();
    };
  }, [load]);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    mutation.current?.abort();
    const controller = new AbortController();
    mutation.current = controller;
    const response = await fetch('/api/account/payment', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(form),
      signal: controller.signal,
    });
    if (response.ok && mounted.current) {
      toast.success('Payment method saved');
      await load();
      setForm({...form, cardNumber: '', expiry: ''});
    } else if (!controller.signal.aborted) {
      toast.error('Could not save payment method');
    }
  }

  async function remove(index: number) {
    mutation.current?.abort();
    const controller = new AbortController();
    mutation.current = controller;
    const response = await fetch('/api/account/payment', {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({index}),
      signal: controller.signal,
    });
    if (response.ok && mounted.current) await load();
  }

  return (
    <div>
      <p className="eyebrow">Profile</p>
      <h1 className="page-title mt-2">Payment methods</h1>
      {loading ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2"><div className="skeleton h-24 w-full" /><div className="skeleton h-24 w-full" /></div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {user?.paymentMethods?.map((payment: any, index: number) => (
            <div className="surface flex justify-between p-6" key={payment._id || payment.label}>
              <div><b>{payment.brand || 'Card'} ending in {payment.cardNumberLast4}</b><p className="muted mt-2 text-sm">Expires {payment.expiry}</p></div>
              <button className="text-rose-500" onClick={() => remove(index)}>Remove</button>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={save} className="surface mt-5 max-w-xl p-6">
        <h2 className="font-black">Add a method</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input required className="input" placeholder="Card number" value={form.cardNumber} onChange={(event) => setForm({...form, cardNumber: event.target.value})} />
          <input required className="input" placeholder="Expiry" value={form.expiry} onChange={(event) => setForm({...form, expiry: event.target.value})} />
        </div>
        <button className="btn btn-primary mt-4">Save card</button>
      </form>
    </div>
  );
}
