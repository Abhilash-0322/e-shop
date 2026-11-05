'use client';
import {useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import FormField, {fieldA11y} from '@/components/FormField';

type AddressForm = {label: string; fullName: string; street: string; city: string; state: string; zip: string; country: string; phone: string};
const fields: [keyof AddressForm, string][] = [['label', 'Address label'], ['fullName', 'Full name'], ['street', 'Street address'], ['city', 'City'], ['state', 'State or region'], ['zip', 'ZIP or postal code'], ['country', 'Country'], ['phone', 'Phone']];

export default function Addresses() {
  const [user, setUser] = useState<any>();
  const [form, setForm] = useState<AddressForm>({label: 'Home', fullName: '', street: '', city: '', state: '', zip: '', country: 'United States', phone: ''});
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {fetch('/api/account').then((response) => response.json()).then((data) => setUser(data.user)).catch(() => {});}, []);
  async function save(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    (['fullName', 'street', 'city', 'state', 'zip'] as const).forEach((key) => {if (!form[key].trim()) nextErrors[key] = 'This field is required.';});
    if (Object.keys(nextErrors).length) {setErrors(nextErrors); return;}
    const response = await fetch('/api/account/addresses', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(form)});
    if (response.ok) {toast.success('Address saved'); location.reload();} else setErrors({form: 'Could not save this address. Try again.'});
  }
  return <div><p className="eyebrow">Profile</p><h1 className="page-title mt-2">Delivery addresses</h1><div className="mt-8 grid min-w-0 gap-5 lg:grid-cols-2"><div className="min-w-0 space-y-3">{user?.addresses?.map((address: any) => <div className="surface p-5" key={address._id || address.street}><b>{address.label}</b><p className="mt-2 text-sm text-wrap">{address.fullName}<br/>{address.street}<br/>{address.city}, {address.state} {address.zip}</p></div>)}{!user?.addresses?.length && <div className="surface p-8 muted">No saved addresses yet.</div>}</div><form onSubmit={save} noValidate className="surface min-w-0 space-y-4 p-5 sm:p-6"><h2 className="font-black">Add address</h2>{errors.form && <p className="error-text rounded bg-rose-50 p-2" role="alert">{errors.form}</p>}{fields.map(([key, label]) => <FormField key={key} id={`address-${key}`} label={label} error={errors[key]}><input {...fieldA11y(`address-${key}`, errors[key])} required={['fullName', 'street', 'city', 'state', 'zip'].includes(key)} value={form[key]} onChange={(event) => {setForm({...form, [key]: event.target.value}); setErrors((current) => ({...current, [key]: ''}));}} className="input"/></FormField>)}<button className="btn btn-primary">Save address</button></form></div></div>;
}
