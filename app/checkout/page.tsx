'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Lock, Check} from '@/lib/icons';
import {useCart} from '@/hooks/useCart';
import {useLocale} from '@/components/LocaleProvider';
import FormField, {fieldA11y} from '@/components/FormField';
import toast from 'react-hot-toast';

type Address = {fullName: string; street: string; city: string; state: string; zip: string; country: string; phone: string};

export default function Checkout() {
  const router = useRouter();
  const {items} = useCart();
  const {formatMoney, formatNumber} = useLocale();
  const [busy, setBusy] = useState(false);
  const [address, setAddress] = useState<Address>({fullName: '', street: '', city: '', state: '', zip: '', country: 'United States', phone: ''});
  const [payment, setPayment] = useState('visa');
  const [card, setCard] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const itemsTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    (['fullName', 'street', 'city', 'state', 'zip', 'phone'] as const).forEach((key) => {
      if (!address[key].trim()) nextErrors[key] = 'This field is required.';
    });
    if (!card.trim()) nextErrors.card = 'Enter your card number.';
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      const response = await fetch('/api/checkout', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({shippingAddress: address, paymentMethod: payment, cardNumber: card})});
      const data = await response.json();
      if (!response.ok) {
        setErrors({form: data.error || 'Checkout could not be completed.'});
        return;
      }
      toast.success('Order placed');
      router.push(`/account/orders/${data.order._id}`);
    } catch {
      setErrors({form: 'The service is unavailable. Try again shortly.'});
    } finally {
      setBusy(false);
    }
  }

  if (!items.length) return <div className="shell py-20 text-center"><h1 className="page-title mx-auto">Your cart is empty</h1></div>;
  const updateAddress = (key: keyof Address, value: string) => {setAddress({...address, [key]: value}); setErrors((current) => ({...current, [key]: ''}));};

  return <div className="shell py-8 md:py-12"><div className="mb-8 flex items-center gap-2 text-sm muted"><Lock className="h-4 w-4 text-emerald-600" aria-hidden="true"/> Secure checkout</div><form onSubmit={submit} noValidate className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)]">
    <div className="min-w-0 space-y-5">
      <section className="surface p-5 sm:p-6"><h2 className="text-xl font-black">1. Delivery details</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">
        {([['fullName', 'Full name'], ['street', 'Street address'], ['city', 'City'], ['state', 'State'], ['zip', 'ZIP or postal code'], ['phone', 'Phone']] as [keyof Address, string][]).map(([key, label]) => <FormField id={`checkout-${key}`} label={label} error={errors[key]} key={key}><input {...fieldA11y(`checkout-${key}`, errors[key])} required value={address[key]} onChange={(event) => updateAddress(key, event.target.value)} className="input"/></FormField>)}
      </div></section>
      <section className="surface p-5 sm:p-6"><h2 className="text-xl font-black">2. Payment</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><FormField id="checkout-payment" label="Card type"><select id="checkout-payment" value={payment} onChange={(event) => setPayment(event.target.value)} className="input"><option value="visa">Visa</option><option value="mastercard">Mastercard</option></select></FormField><FormField id="checkout-card" label="Card number" error={errors.card} hint="Use a test card number in development."><input {...fieldA11y('checkout-card', errors.card, 'checkout-card-description')} required value={card} onChange={(event) => {setCard(event.target.value); setErrors((current) => ({...current, card: ''}))}} placeholder="4242 4242 4242 4242" className="input"/></FormField></div></section>
    </div>
    <aside className="surface h-fit min-w-0 p-5 sm:p-6"><h2 className="text-xl font-black">Review order</h2>{errors.form && <p className="error-text mt-3 rounded bg-rose-50 p-2" role="alert">{errors.form}</p>}<p className="mt-3 text-sm muted">{formatNumber(items.length)} {items.length !== 1 ? 'items' : 'item'} · Shipping calculated at checkout</p><div className="mt-5 flex justify-between gap-4 text-sm"><span>Items</span><b>{formatMoney(itemsTotal)}</b></div><button disabled={busy} className="btn btn-primary mt-6 w-full"><Check className="h-4 w-4" aria-hidden="true"/>{busy ? 'Placing order…' : 'Place order'}</button></aside>
  </form></div>;
}
