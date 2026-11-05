'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MapPin } from '@/lib/icons';

export default function Addresses() {
  const [user, setUser] = useState<any>();
  const [form, setForm] = useState({ label: 'Home', fullName: '', street: '', city: '', state: '', zip: '', country: 'United States', phone: '' });
  useEffect(() => { fetch('/api/account').then((response) => response.json()).then((data) => setUser(data.user)).catch(() => {}); }, []);
  async function save(event: React.FormEvent) { event.preventDefault(); const response = await fetch('/api/account/addresses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }); if (response.ok) { toast.success('Address saved'); location.reload(); } else toast.error('Could not save address'); }
  return <div><p className="eyebrow">Profile / delivery</p><h1 className="page-title mt-2">Delivery addresses</h1><p className="muted mt-3">Keep the places your good finds need to go.</p><div className="mt-8 grid gap-5 lg:grid-cols-2"><div className="space-y-3">{user?.addresses?.map((address: any) => <div className="surface p-5" key={address._id || address.street}><div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#728749]" /><b>{address.label || 'Saved address'}</b></div><p className="mt-3 text-sm leading-relaxed">{address.fullName}<br />{address.street}<br />{address.city}, {address.state} {address.zip}</p></div>)}{!user?.addresses?.length && <div className="surface p-8 text-center"><MapPin className="mx-auto h-7 w-7 text-[#c3d39d]" /><p className="muted mt-3 text-sm">No saved addresses yet.</p></div>}</div><form onSubmit={save} className="surface space-y-3 p-6"><h2 className="text-xl font-black">Add an address</h2>{Object.keys(form).map((key) => <input key={key} required={['fullName', 'street', 'city', 'state', 'zip'].includes(key)} placeholder={key === 'label' ? 'Label (Home, Work...)' : key} value={(form as any)[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className="input" />)}<button className="btn btn-primary mt-2">Save address</button></form></div></div>;
}
