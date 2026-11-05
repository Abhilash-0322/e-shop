'use client';

import {useEffect, useState} from 'react';
import toast from 'react-hot-toast';

export default function Addresses() {
  const [user, setUser] = useState<any>();
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({label: 'Home', fullName: '', street: '', city: '', state: '', zip: '', country: 'United States', phone: ''});

  useEffect(() => {
    fetch('/api/account').then((response) => response.json()).then((data) => setUser(data.user)).catch(() => {});
  }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch('/api/account/addresses', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(form)});
    if (response.ok) {
      setStatus('Address saved.');
      toast.success('Address saved');
      location.reload();
    } else {
      setStatus('Could not save address.');
      toast.error('Could not save address');
    }
  }

  return (
    <div>
      <p className="eyebrow">Profile</p>
      <h1 className="page-title mt-2">Delivery addresses</h1>
      {status && <p className="mt-3 text-sm muted" role="status">{status}</p>}
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <section className="space-y-3" aria-labelledby="saved-addresses">
          <h2 id="saved-addresses" className="sr-only">Saved addresses</h2>
          {user?.addresses?.map((address: any) => <article className="surface p-5" key={address._id || address.street}><b>{address.label}</b><p className="mt-2 text-sm">{address.fullName}<br />{address.street}<br />{address.city}, {address.state} {address.zip}</p></article>)}
          {!user?.addresses?.length && <p className="surface p-8 muted">No saved addresses yet.</p>}
        </section>
        <form onSubmit={save} className="surface space-y-3 p-6" aria-labelledby="add-address">
          <h2 id="add-address" className="font-black">Add address</h2>
          <div><label htmlFor="address-label" className="text-sm font-bold">Address label</label><input id="address-label" className="input mt-1" value={form.label} onChange={(event) => setForm({...form, label: event.target.value})} /></div>
          {[
            ['fullName', 'Full name'], ['street', 'Street address'], ['city', 'City'], ['state', 'State'], ['zip', 'ZIP code'], ['phone', 'Phone'],
          ].map(([key, label]) => <div key={key}><label htmlFor={`address-${key}`} className="text-sm font-bold">{label}</label><input id={`address-${key}`} required={['fullName', 'street', 'city', 'state', 'zip'].includes(key)} type={key === 'phone' ? 'tel' : 'text'} className="input mt-1" value={(form as any)[key]} onChange={(event) => setForm({...form, [key]: event.target.value})} /></div>)}
          <div><label htmlFor="address-country" className="text-sm font-bold">Country</label><select id="address-country" className="input mt-1" value={form.country} onChange={(event) => setForm({...form, country: event.target.value})}><option>United States</option><option>Canada</option><option>United Kingdom</option></select></div>
          <button type="submit" className="btn btn-primary">Save address</button>
        </form>
      </div>
    </div>
  );
}
