'use client';

import {useState} from 'react';
import toast from 'react-hot-toast';
import {Store} from '@/lib/icons';
import {FormField, PageHeader} from '@/components/ui';

export default function Apply() {
  const [form, setForm] = useState({storeName: '', description: '', payoutEmail: ''});
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch('/api/seller/apply', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(form)});
    toast[response.ok ? 'success' : 'error'](response.ok ? 'Application submitted' : 'Please sign in first');
  }
  return (
    <div className="shell flex justify-center py-12 md:py-20">
      <form onSubmit={submit} className="surface w-full max-w-2xl p-7 md:p-9">
        <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700"><Store className="h-6 w-6" /></div>
        <PageHeader eyebrow="Sell on Halozon" title="Build your store." description="Join a marketplace designed for thoughtful commerce." />
        <div className="mt-7 space-y-4">
          <FormField label="Store name"><input required className="input mt-2" value={form.storeName} onChange={event => setForm({...form, storeName: event.target.value})} /></FormField>
          <FormField label="Store description"><textarea required className="input mt-2 min-h-28" value={form.description} onChange={event => setForm({...form, description: event.target.value})} /></FormField>
          <FormField label="Payout email"><input required type="email" className="input mt-2" value={form.payoutEmail} onChange={event => setForm({...form, payoutEmail: event.target.value})} /></FormField>
        </div>
        <button className="btn btn-primary mt-7">Apply to sell</button>
      </form>
    </div>
  );
}
