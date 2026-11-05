'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { RecoveryState } from '@/components/RecoveryState';

const blank = { label: 'Home', fullName: '', street: '', city: '', state: '', zip: '', country: 'United States', phone: '' };

export default function Addresses() {
  const [user, setUser] = useState<any>();
  const [form, setForm] = useState(blank);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch('/api/account', { signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Addresses could not be loaded.');
      if (!signal?.aborted) setUser(data.user);
      setError('');
    } catch (caught: any) {
      if (caught?.name !== 'AbortError') setError(caught?.message || 'Addresses could not be loaded.');
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
      const response = await fetch('/api/account/addresses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Could not save address.');
      toast.success('Address saved');
      setForm(blank);
      await load();
    } catch (caught: any) {
      setError(caught?.message || 'Could not save address. Your draft is still here.');
    } finally {
      setBusy(false);
    }
  }

  return <div><p className="eyebrow">Profile</p><h1 className="page-title mt-2">Delivery addresses</h1><p className="muted mt-3">Keep delivery details ready for a faster, calmer checkout.</p>{error && <div className="mt-6"><RecoveryState title="Address changes need another try" description={`${error} Your current form is still filled in.`} onRetry={() => load()} href="/help" hrefLabel="Get help" compact /></div>}<div className="mt-8 grid gap-5 lg:grid-cols-2"><div className="space-y-3">{user?.addresses?.length ? user.addresses.map((address: any) => <div className="surface p-5" key={address._id || address.street}><b>{address.label}</b><p className="mt-2 text-sm">{address.fullName}<br />{address.street}<br />{address.city}, {address.state} {address.zip}</p></div>) : <div className="surface p-8 text-sm text-slate-500">No saved addresses yet. Add one here or enter a one-time address at checkout.</div>}</div><form onSubmit={save} className="surface space-y-3 p-6"><h2 className="font-black">Add address</h2>{Object.keys(form).map((key) => <input key={key} required={['fullName', 'street', 'city', 'state', 'zip'].includes(key)} placeholder={key} value={(form as any)[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className="input" />)}<button disabled={busy} className="btn btn-primary">{busy ? 'Saving…' : 'Save address'}</button></form></div></div>;
}
