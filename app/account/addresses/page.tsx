'use client';

import {useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import {MapPin} from '@/lib/icons';
import {EmptyState, FormField, PageHeader} from '@/components/ui';

export default function Addresses() {
  const [user, setUser] = useState<any>();
  const [form, setForm] = useState({label: 'Home', fullName: '', street: '', city: '', state: '', zip: '', country: 'United States', phone: ''});

  useEffect(() => {
    fetch('/api/account').then(response => response.json()).then(data => setUser(data.user)).catch(() => undefined);
  }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch('/api/account/addresses', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(form)});
    if (response.ok) {
      toast.success('Address saved');
      location.reload();
    } else toast.error('Could not save address');
  }

  return (
    <div>
      <PageHeader eyebrow="Profile" title="Delivery addresses" description="Save destinations once and make checkout feel effortless." />
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="space-y-3">
          {user?.addresses?.length ? user.addresses.map((address: any) => (
            <div className="surface p-5" key={address._id || address.street}>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-600" /><b>{address.label}</b></div>
              <p className="mt-3 text-sm leading-relaxed">{address.fullName}<br />{address.street}<br />{address.city}, {address.state} {address.zip}<br />{address.country}</p>
            </div>
          )) : <EmptyState title="No saved addresses" description="Add a delivery address to speed up your next order." icon={<MapPin className="h-8 w-8" />} />}
        </div>
        <form onSubmit={save} className="surface space-y-4 p-6 md:p-7">
          <div><p className="eyebrow">New destination</p><h2 className="mt-2 text-xl font-black">Add an address</h2></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Label"><input className="input mt-2" value={form.label} onChange={event => setForm({...form, label: event.target.value})} /></FormField>
            <FormField label="Full name"><input required className="input mt-2" value={form.fullName} onChange={event => setForm({...form, fullName: event.target.value})} /></FormField>
            <FormField label="Street address"><input required className="input mt-2 sm:col-span-2" value={form.street} onChange={event => setForm({...form, street: event.target.value})} /></FormField>
            <FormField label="City"><input required className="input mt-2" value={form.city} onChange={event => setForm({...form, city: event.target.value})} /></FormField>
            <FormField label="State"><input required className="input mt-2" value={form.state} onChange={event => setForm({...form, state: event.target.value})} /></FormField>
            <FormField label="ZIP code"><input required className="input mt-2" value={form.zip} onChange={event => setForm({...form, zip: event.target.value})} /></FormField>
            <FormField label="Phone"><input className="input mt-2" value={form.phone} onChange={event => setForm({...form, phone: event.target.value})} /></FormField>
          </div>
          <button className="btn btn-primary">Save address</button>
        </form>
      </div>
    </div>
  );
}
