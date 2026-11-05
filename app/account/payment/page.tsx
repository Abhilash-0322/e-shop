'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { RecoveryState } from '@/components/RecoveryState';

export default function Payment() {
  const [user, setUser] = useState<any>();
  const [form, setForm] = useState({ label: 'Personal card', cardNumber: '', expiry: '', brand: 'visa' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch('/api/account', { signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Payment methods could not be loaded.');
      if (!signal?.aborted) setUser(data.user);
      setError('');
    } catch (caught: any) {
      if (caught?.name !== 'AbortError') setError(caught?.message || 'Payment methods could not be loaded.');
    }
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);
  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/account/payment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Could not save payment method.');
      toast.success('Payment method saved');
      setForm({ ...form, cardNumber: '', expiry: '' });
      await load();
    } catch (caught: any) {
      setError(caught?.message || 'Could not save payment method. Your draft is still here.');
    } finally {
      setBusy(false);
    }
  }
  async function remove(index: number) {
    try {
      const response = await fetch('/api/account/payment', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ index }) });
      if (!response.ok) throw new Error('Could not remove that payment method.');
      await load();
    } catch (caught: any) {
      setError(caught?.message || 'Could not remove payment method.');
    }
  }
  return <div><p className="eyebrow">Profile</p><h1 className="page-title mt-2">Payment methods</h1><p className="muted mt-3">Save a method for convenience. Checkout still keeps payment details secure.</p>{error && <div className="mt-6"><RecoveryState title="Payment settings need another try" description={`${error} Any form details are still here.`} onRetry={() => load()} href="/help" hrefLabel="Get help" compact /></div>}<div className="mt-8 grid gap-4 md:grid-cols-2">{user?.paymentMethods?.map((payment: any, index: number) => <div className="surface flex justify-between p-6" key={payment._id || payment.label}><div><b>{payment.brand || 'Card'} ending in {payment.cardNumberLast4}</b><p className="muted mt-2 text-sm">Expires {payment.expiry}</p></div><button className="font-bold text-[#bd4532]" onClick={() => remove(index)}>Remove</button></div>)}</div><form onSubmit={save} className="surface mt-5 max-w-xl space-y-4 p-6"><h2 className="font-black">Add a method</h2><div className="grid gap-3 sm:grid-cols-2"><input required className="input" placeholder="Card number" value={form.cardNumber} onChange={(event) => setForm({ ...form, cardNumber: event.target.value })} autoComplete="cc-number" /><input required className="input" placeholder="Expiry" value={form.expiry} onChange={(event) => setForm({ ...form, expiry: event.target.value })} autoComplete="cc-exp" /></div><button disabled={busy} className="btn btn-primary">{busy ? 'Saving…' : 'Save card'}</button></form></div>;
}
