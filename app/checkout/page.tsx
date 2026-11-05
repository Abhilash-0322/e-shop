'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Calendar, Check, Lock, RefreshCw, ShieldCheck, Truck } from '@/lib/icons';
import { useCart } from '@/hooks/useCart';

export default function Checkout() {
  const router = useRouter();
  const { items } = useCart();
  const [busy, setBusy] = useState(false);
  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    phone: '',
  });
  const [payment, setPayment] = useState('visa');
  const [card, setCard] = useState('');

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shippingAddress: address, paymentMethod: payment, cardNumber: card }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      toast.success('Order placed');
      router.push(`/account/orders/${data.order._id}`);
    } catch (error: any) {
      toast.error(error.message || 'Checkout failed');
    } finally {
      setBusy(false);
    }
  }

  if (!items.length) {
    return (
      <div className="shell py-20 text-center">
        <h1 className="page-title">Your cart is empty</h1>
        <p className="muted mt-4">Add something before starting checkout.</p>
        <Link href="/search" className="btn btn-primary mt-6">
          Browse products
        </Link>
      </div>
    );
  }

  const firstItem = items[0];

  return (
    <div className="shell py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 text-sm muted">
          <Lock className="w-4 h-4 text-emerald-600" />
          Secure checkout
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <span className="text-indigo-700">1 Details</span>
          <span>→</span>
          <span>2 Payment</span>
          <span>→</span>
          <span>3 Confirmation</span>
        </div>
      </div>

      <form onSubmit={submit} className="grid lg:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-5">
          <section className="surface p-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black">1</span>
              <div>
                <h2 className="text-xl font-black">Delivery details</h2>
                <p className="muted text-sm mt-1">Where should this one-time order go?</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mt-5">
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
                  <input
                    required
                    value={(address as any)[key]}
                    onChange={(event) => setAddress({ ...address, [key]: event.target.value })}
                    className="input mt-2"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="surface p-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black">2</span>
              <div>
                <h2 className="text-xl font-black">Payment</h2>
                <p className="muted text-sm mt-1">Your payment details are used for this order only.</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mt-5">
              <label className="text-sm font-bold">
                Card type
                <select value={payment} onChange={(event) => setPayment(event.target.value)} className="input mt-2">
                  <option value="visa">Visa</option>
                  <option value="mastercard">Mastercard</option>
                </select>
              </label>
              <label className="text-sm font-bold">
                Card number
                <input
                  required
                  value={card}
                  onChange={(event) => setCard(event.target.value)}
                  placeholder="4242 4242 4242 4242"
                  className="input mt-2"
                />
              </label>
            </div>
          </section>

          <section className="surface p-6">
            <p className="eyebrow">What happens next</p>
            <div className="grid sm:grid-cols-3 gap-4 mt-5">
              {[
                [Check, 'Order placed', 'We confirm your details.'],
                [Truck, 'Seller prepares', 'Tracking starts after handoff.'],
                [Calendar, 'Delivery updates', 'Follow events from Orders.'],
              ].map(([Icon, title, description]) => {
                const TimelineIcon = Icon as any;
                return (
                  <div key={title as string} className="flex gap-2">
                    <TimelineIcon className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">{title as string}</p>
                      <p className="muted text-xs mt-1">{description as string}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="space-y-4 h-fit">
          <div className="surface p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-xl">Review order</h2>
              <span className="pill">One-time</span>
            </div>
            <div className="space-y-3 mt-5">
              {items.map((item) => (
                <div className="flex gap-3 text-sm" key={String(item.productId)}>
                  <img
                    src={item.image || '/placeholder-product.svg'}
                    alt=""
                    className="w-12 h-12 rounded-lg bg-indigo-50 object-contain"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{item.title}</p>
                    <p className="muted mt-1">
                      Qty {item.qty} · ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <hr className="my-5" />
            <p className="muted text-sm">
              {items.length} item{items.length !== 1 ? 's' : ''} · Shipping calculated at checkout
            </p>
            <button disabled={busy} className="btn btn-primary w-full mt-6">
              <Check className="w-4 h-4" />
              {busy ? 'Placing order…' : 'Place order'}
            </button>
          </div>

          <div className="surface border-indigo-200 bg-indigo-50/70 p-5">
            <div className="flex gap-3">
              <RefreshCw className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <h2 className="font-black">Need this again later?</h2>
                <p className="muted text-sm mt-2">
                  This checkout is one-time. Choose a cadence and see savings on the product page.
                </p>
                <Link href={`/product/${String(firstItem.productId)}`} className="amazon-link text-sm inline-block mt-3">
                  Set up repeat delivery →
                </Link>
              </div>
            </div>
          </div>

          <div className="flex gap-2 items-center text-xs muted px-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Your subscription choices are never added without consent.
          </div>
        </aside>
      </form>
    </div>
  );
}
