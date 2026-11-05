'use client';
import {useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import FormField, {fieldA11y} from '@/components/FormField';

export default function Payment() {
  const [user, setUser] = useState<any>();
  const [form, setForm] = useState({label: 'Personal card', cardNumber: '', expiry: '', brand: 'visa'});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const load = () => fetch('/api/account').then((response) => response.json()).then((data) => setUser(data.user));
  useEffect(() => {load();}, []);
  async function save(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (form.cardNumber.replace(/\s/g, '').length < 12) nextErrors.cardNumber = 'Enter a valid card number.';
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) nextErrors.expiry = 'Use MM/YY format.';
    if (Object.keys(nextErrors).length) {setErrors(nextErrors); return;}
    const response = await fetch('/api/account/payment', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(form)});
    if (response.ok) {toast.success('Payment method saved'); load(); setForm({...form, cardNumber: '', expiry: ''});} else setErrors({form: 'Could not save this payment method.'});
  }
  return <div><p className="eyebrow">Profile</p><h1 className="page-title mt-2">Payment methods</h1><div className="mt-8 grid min-w-0 gap-4 md:grid-cols-2">{user?.paymentMethods?.map((payment: any, index: number) => <div className="surface flex min-w-0 flex-wrap justify-between gap-4 p-5 sm:p-6" key={payment._id || payment.label}><div className="min-w-0"><b className="text-wrap">{payment.brand || 'Card'} ending in {payment.cardNumberLast4}</b><p className="mt-2 text-sm muted">Expires {payment.expiry}</p></div><button className="text-rose-500" onClick={async () => {await fetch('/api/account/payment', {method: 'DELETE', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({index})}); load();}}>Remove</button></div>)}</div><form onSubmit={save} noValidate className="surface mt-5 max-w-xl space-y-4 p-5 sm:p-6"><h2 className="font-black">Add a method</h2>{errors.form && <p className="error-text rounded bg-rose-50 p-2" role="alert">{errors.form}</p>}<div className="grid gap-4 sm:grid-cols-2"><FormField id="payment-card" label="Card number" error={errors.cardNumber}><input {...fieldA11y('payment-card', errors.cardNumber)} required className="input" placeholder="Card number" value={form.cardNumber} onChange={(event) => {setForm({...form, cardNumber: event.target.value}); setErrors((current) => ({...current, cardNumber: ''}));}}/></FormField><FormField id="payment-expiry" label="Expiry" error={errors.expiry} hint="Use MM/YY."><input {...fieldA11y('payment-expiry', errors.expiry, 'payment-expiry-description')} required className="input" placeholder="MM/YY" value={form.expiry} onChange={(event) => {setForm({...form, expiry: event.target.value}); setErrors((current) => ({...current, expiry: ''}));}}/></FormField></div><button className="btn btn-primary">Save card</button></form></div>;
}
