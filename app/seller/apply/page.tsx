'use client';

import {useState} from 'react';
import toast from 'react-hot-toast';

export default function Apply() {
  const [fields, setFields] = useState({storeName: '', description: '', payoutEmail: ''});
  const [error, setError] = useState('');

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch('/api/seller/apply', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(fields)});
    const message = response.ok ? 'Application submitted' : 'Please sign in first';
    setError(response.ok ? '' : message);
    toast[response.ok ? 'success' : 'error'](message);
  }

  return (
    <div className="shell flex justify-center py-16">
      <form onSubmit={submit} className="surface w-full max-w-xl p-8" aria-labelledby="seller-apply-title">
        <p className="eyebrow">Sell on Halozon</p>
        <h1 id="seller-apply-title" className="page-title mt-2">Build your store.</h1>
        <p className="mt-3 muted">Join a marketplace designed for thoughtful commerce.</p>
        {error && <p className="error-text mt-4 rounded-lg bg-red-50 p-3" role="alert">{error}</p>}
        <div className="mt-6 space-y-4">
          <div><label htmlFor="store-name" className="text-sm font-bold">Store name</label><input id="store-name" required className="input mt-2" value={fields.storeName} onChange={(event) => setFields({...fields, storeName: event.target.value})} /></div>
          <div><label htmlFor="store-description" className="text-sm font-bold">Store description</label><textarea id="store-description" required className="input mt-2 min-h-28" value={fields.description} onChange={(event) => setFields({...fields, description: event.target.value})} /></div>
          <div><label htmlFor="payout-email" className="text-sm font-bold">Payout email</label><input id="payout-email" required type="email" autoComplete="email" className="input mt-2" value={fields.payoutEmail} onChange={(event) => setFields({...fields, payoutEmail: event.target.value})} /></div>
        </div>
        <button type="submit" className="btn btn-primary mt-6">Apply to sell</button>
      </form>
    </div>
  );
}
