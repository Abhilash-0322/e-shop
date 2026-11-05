'use client';

import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import toast from 'react-hot-toast';
import {Check, Lock} from '@/lib/icons';
import {useCart} from '@/hooks/useCart';

export default function Checkout() {
  const router = useRouter();
  const {items, loading: cartLoading} = useCart();
  const [busy, setBusy] = useState(false);
  const [address, setAddress] = useState({fullName: '', street: '', city: '', state: '', zip: '', country: 'United States', phone: ''});
  const [payment, setPayment] = useState('visa');
  const [card, setCard] = useState('');
  const request = useRef<AbortController | null>(null);

  useEffect(() => () => request.current?.abort(), []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setBusy(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({shippingAddress: address, paymentMethod: payment, cardNumber: card}),
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error);
      toast.success('Order placed');
      router.push(`/account/orders/${data.order._id}`);
    } catch (error: any) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) toast.error(error.message || 'Checkout failed');
    } finally {
      if (!controller.signal.aborted) setBusy(false);
    }
  }

  if (cartLoading) return <div className="shell py-12"><div className="skeleton h-8 w-48" /><div className="skeleton mt-8 h-96 w-full" /></div>;
  if (!items.length) return <div className="shell py-20 text-center"><h1 className="page-title">Your cart is empty</h1></div>;

  return (
    <div className="shell py-12">
      <div className="muted mb-8 flex items-center gap-2 text-sm"><Lock className="h-4 w-4 text-emerald-600" /> Secure checkout</div>
      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <section className="surface p-6">
            <h2 className="text-xl font-black">1. Delivery details</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ['fullName', 'Full name'],
                ['street', 'Street address'],
                ['city', 'City'],
                ['state', 'State'],
                ['zip', 'ZIP code'],
                ['phone', 'Phone'],
              ].map(([key, label]) => (
                <label key={key} className="text-sm font-bold">
                  {label}
                  <input required value={(address as any)[key]} onChange={(event) => setAddress({...address, [key]: event.target.value})} className="input mt-2" />
                </label>
              ))}
            </div>
          </section>
          <section className="surface p-6">
            <h2 className="text-xl font-black">2. Payment</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-bold">Card type<select value={payment} onChange={(event) => setPayment(event.target.value)} className="input mt-2"><option value="visa">Visa</option><option value="mastercard">Mastercard</option></select></label>
              <label className="text-sm font-bold">Card number<input required value={card} onChange={(event) => setCard(event.target.value)} placeholder="4242 4242 4242 4242" className="input mt-2" /></label>
            </div>
          </section>
        </div>
        <aside className="surface h-fit p-6">
          <h2 className="text-xl font-black">Review order</h2>
          <p className="muted mt-3 text-sm">{items.length} item{items.length !== 1 ? 's' : ''} · Shipping calculated at checkout</p>
          <button disabled={busy} className="btn btn-primary mt-6 w-full"><Check className="h-4 w-4" />{busy ? 'Placing order...' : 'Place order'}</button>
        </aside>
      </form>
    </div>
  );
}
