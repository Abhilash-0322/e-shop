'use client';

import {useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import {CreditCard, Trash2} from 'lucide-react';
import {EmptyState, FormField, PageHeader} from '@/components/ui';

export default function Payment() {
  const [user, setUser] = useState<any>();
  const [form, setForm] = useState({label: 'Personal card', cardNumber: '', expiry: '', brand: 'visa'});
  const load = () => fetch('/api/account').then(response => response.json()).then(data => setUser(data.user));
  useEffect(() => { load(); }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch('/api/account/payment', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(form)});
    if (response.ok) {
      toast.success('Payment method saved');
      load();
      setForm({...form, cardNumber: '', expiry: ''});
    } else toast.error('Could not save payment method');
  }

  async function remove(index: number) {
    await fetch('/api/account/payment', {method: 'DELETE', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({index})});
    toast.success('Payment method removed');
    load();
  }

  return (
    <div>
      <PageHeader eyebrow="Profile" title="Payment methods" description="Keep checkout quick while your card details stay protected." />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {user?.paymentMethods?.length ? user.paymentMethods.map((payment: any, index: number) => (
          <div className="surface flex items-start justify-between gap-4 p-6" key={payment._id || payment.label}>
            <div className="flex gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700"><CreditCard className="h-5 w-5" /></div><div><b>{payment.brand || 'Card'} ending in {payment.cardNumberLast4}</b><p className="muted mt-2 text-sm">Expires {payment.expiry}</p></div></div>
            <button type="button" className="rounded-lg p-2 text-rose-500 hover:bg-rose-50" onClick={() => remove(index)} aria-label="Remove payment method"><Trash2 className="h-4 w-4" /></button>
          </div>
        )) : <div className="md:col-span-2"><EmptyState title="No payment methods saved" description="Add a card when you are ready for faster checkout." icon={<CreditCard className="h-8 w-8" />} /></div>}
      </div>
      <form onSubmit={save} className="surface mt-5 max-w-xl space-y-4 p-6 md:p-7">
        <div><p className="eyebrow">New method</p><h2 className="mt-2 text-xl font-black">Add a card</h2></div>
        <FormField label="Card number"><input required className="input mt-2" placeholder="4242 4242 4242 4242" value={form.cardNumber} onChange={event => setForm({...form, cardNumber: event.target.value})} /></FormField>
        <div className="grid gap-3 sm:grid-cols-2"><FormField label="Expiry"><input required className="input mt-2" placeholder="MM/YY" value={form.expiry} onChange={event => setForm({...form, expiry: event.target.value})} /></FormField><FormField label="Card brand"><select className="input mt-2" value={form.brand} onChange={event => setForm({...form, brand: event.target.value})}><option value="visa">Visa</option><option value="mastercard">Mastercard</option></select></FormField></div>
        <button className="btn btn-primary">Save card</button>
      </form>
    </div>
  );
}
