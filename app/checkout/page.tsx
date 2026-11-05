'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Check, Lock} from '@/lib/icons';
import {useCart} from '@/hooks/useCart';
import toast from 'react-hot-toast';

type Address = {fullName: string; street: string; city: string; state: string; zip: string; country: string; phone: string};

export default function Checkout() {
  const router = useRouter();
  const {items} = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState<Address>({fullName: '', street: '', city: '', state: '', zip: '', country: 'United States', phone: ''});
  const [payment, setPayment] = useState('visa');
  const [card, setCard] = useState('');

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/checkout', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({shippingAddress: address, paymentMethod: payment, cardNumber: card})});
      const data = await response.json();
      if (!response.ok) throw Error(data.error);
      toast.success('Order placed');
      router.push(`/account/orders/${data.order._id}`);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Checkout failed';
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  if (!items.length) return <div className="shell py-20 text-center"><h1 className="page-title">Your cart is empty</h1></div>;

  const addressFields: [keyof Address, string, string][] = [
    ['fullName', 'Full name', 'name'],
    ['street', 'Street address', 'street-address'],
    ['city', 'City', 'address-level2'],
    ['state', 'State', 'address-level1'],
    ['zip', 'ZIP code', 'postal-code'],
    ['phone', 'Phone', 'tel'],
  ];

  return (
    <div className="shell py-12">
      <div className="mb-8 flex items-center gap-2 text-sm muted"><Lock className="h-4 w-4 text-emerald-700" aria-hidden="true" /> Secure checkout</div>
      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_360px]" aria-labelledby="checkout-title">
        <div className="space-y-5">
          <h1 id="checkout-title" className="sr-only">Checkout</h1>
          {error && <div className="error-text rounded-lg bg-red-50 p-4" role="alert">{error}</div>}
          <fieldset className="surface p-6">
            <legend className="text-xl font-black">1. Delivery details</legend>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {addressFields.map(([key, label, autocomplete]) => {
                const id = `checkout-${key}`;
                return (
                  <div key={key}>
                    <label htmlFor={id} className="text-sm font-bold">{label}</label>
                    <input id={id} required type={key === 'phone' ? 'tel' : 'text'} autoComplete={autocomplete} value={address[key]} onChange={(event) => setAddress({...address, [key]: event.target.value})} className="input mt-2" aria-invalid={Boolean(error)} />
                  </div>
                );
              })}
              <div>
                <label htmlFor="checkout-country" className="text-sm font-bold">Country</label>
                <select id="checkout-country" value={address.country} onChange={(event) => setAddress({...address, country: event.target.value})} className="input mt-2" autoComplete="country">
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                </select>
              </div>
            </div>
          </fieldset>
          <fieldset className="surface p-6">
            <legend className="text-xl font-black">2. Payment</legend>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="payment-type" className="text-sm font-bold">Card type</label>
                <select id="payment-type" value={payment} onChange={(event) => setPayment(event.target.value)} className="input mt-2">
                  <option value="visa">Visa</option>
                  <option value="mastercard">Mastercard</option>
                </select>
              </div>
              <div>
                <label htmlFor="card-number" className="text-sm font-bold">Card number</label>
                <input id="card-number" required inputMode="numeric" autoComplete="cc-number" value={card} onChange={(event) => setCard(event.target.value)} placeholder="4242 4242 4242 4242" className="input mt-2" aria-describedby="card-help" aria-invalid={Boolean(error)} />
                <p id="card-help" className="mt-1 text-xs muted">Use the payment number provided by your card issuer.</p>
              </div>
            </div>
          </fieldset>
        </div>
        <aside className="surface h-fit p-6" aria-labelledby="review-order">
          <h2 id="review-order" className="text-xl font-black">Review order</h2>
          <p className="mt-3 text-sm muted">{items.length} item{items.length !== 1 ? 's' : ''} · Shipping calculated at checkout</p>
          <button type="submit" disabled={busy} className="btn btn-primary mt-6 w-full" aria-busy={busy}><Check className="h-4 w-4" aria-hidden="true" />{busy ? 'Placing order…' : 'Place order'}</button>
        </aside>
      </form>
    </div>
  );
}
