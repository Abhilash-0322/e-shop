'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Check, Lock} from '@/lib/icons';
import {useCart} from '@/hooks/useCart';
import toast from 'react-hot-toast';
import {EmptyState, FormField, PageHeader} from '@/components/ui';
import Link from 'next/link';

export default function Checkout() {
  const router = useRouter();
  const {items} = useCart();
  const [busy, setBusy] = useState(false);
  const [address, setAddress] = useState({fullName: '', street: '', city: '', state: '', zip: '', country: 'United States', phone: ''});
  const [payment, setPayment] = useState('visa');
  const [card, setCard] = useState('');

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const response = await fetch('/api/checkout', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({shippingAddress: address, paymentMethod: payment, cardNumber: card})});
      const data = await response.json();
      if (!response.ok) throw Error(data.error);
      toast.success('Order placed');
      router.push(`/account/orders/${data.order._id}`);
    } catch (error: any) {
      toast.error(error.message || 'Checkout failed');
    } finally {
      setBusy(false);
    }
  }

  if (!items.length) return <div className="shell py-20"><EmptyState title="Your cart is empty" description="Add a few products before starting checkout." action={<Link href="/search" className="btn btn-primary">Continue shopping</Link>} /></div>;

  return (
    <div className="shell py-10 md:py-14">
      <PageHeader eyebrow="Checkout" title="A clear path to done." description="Review your details and place your order securely." />
      <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-emerald-700"><Lock className="h-4 w-4" /> Secure checkout</div>
      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <section className="surface p-6 md:p-7">
            <div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-black text-brand-700">1</span><div><p className="eyebrow">Delivery</p><h2 className="mt-1 text-xl font-black">Where should we send it?</h2></div></div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {([['fullName', 'Full name'], ['street', 'Street address'], ['city', 'City'], ['state', 'State'], ['zip', 'ZIP code'], ['phone', 'Phone']] as const).map(([key, label]) => <FormField key={key} label={label}><input required value={address[key]} onChange={event => setAddress({...address, [key]: event.target.value})} className="input mt-2" /></FormField>)}
            </div>
          </section>
          <section className="surface p-6 md:p-7">
            <div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-black text-brand-700">2</span><div><p className="eyebrow">Payment</p><h2 className="mt-1 text-xl font-black">How would you like to pay?</h2></div></div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <FormField label="Card type"><select value={payment} onChange={event => setPayment(event.target.value)} className="input mt-2"><option value="visa">Visa</option><option value="mastercard">Mastercard</option></select></FormField>
              <FormField label="Card number"><input required value={card} onChange={event => setCard(event.target.value)} placeholder="4242 4242 4242 4242" className="input mt-2" /></FormField>
            </div>
          </section>
        </div>
        <aside className="surface h-fit p-6 lg:sticky lg:top-28">
          <p className="eyebrow">Review order</p>
          <h2 className="mt-2 text-xl font-black">Ready to place</h2>
          <div className="mt-5 space-y-3 border-y border-slate-100 py-4">
            {items.map(item => <div className="flex justify-between gap-3 text-sm" key={String(item.productId)}><span className="line-clamp-2">{item.qty} × {item.title}</span><b>${(item.price * item.qty).toFixed(2)}</b></div>)}
          </div>
          <p className="muted mt-4 text-sm">{items.length} item{items.length !== 1 ? 's' : ''} · Shipping calculated at checkout</p>
          <button disabled={busy} className="btn btn-primary mt-6 w-full"><Check className="h-4 w-4" />{busy ? 'Placing order...' : 'Place order'}</button>
        </aside>
      </form>
    </div>
  );
}
