'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Lock, ShieldCheck } from '@/lib/icons';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';

export default function Checkout() {
  const router = useRouter();
  const { items } = useCart();
  const [busy, setBusy] = useState(false);
  const [address, setAddress] = useState({ fullName: '', street: '', city: '', state: '', zip: '', country: 'United States', phone: '' });
  const [payment, setPayment] = useState('visa');
  const [card, setCard] = useState('');

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const response = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ shippingAddress: address, paymentMethod: payment, cardNumber: card }) });
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

  if (!items.length) return <div className="shell py-20 text-center"><p className="eyebrow">Checkout queue</p><h1 className="page-title mt-3">Your cart is empty</h1><a href="/search" className="mt-5 inline-block text-sm font-bold text-indigo-600">Return to discovery →</a></div>;

  return (
    <div className="shell py-8 md:py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3"><div><p className="eyebrow">Checkout flow</p><h1 className="page-title mt-2">Finish with confidence.</h1></div><span className="flex items-center gap-2 text-xs font-bold text-emerald-700"><Lock className="h-4 w-4" /> Secure checkout</span></div>
      <div className="mb-6 flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[.13em] text-indigo-600"><span className="rounded-full bg-indigo-100 px-3 py-1.5">01 Delivery</span><span className="h-px w-8 bg-slate-300" /><span className="rounded-full bg-slate-200 px-3 py-1.5 text-slate-500">02 Payment</span><span className="h-px w-8 bg-slate-300" /><span className="rounded-full bg-slate-200 px-3 py-1.5 text-slate-500">03 Confirm</span></div>
      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_350px]">
        <div className="space-y-4">
          <section className="surface p-5 md:p-6"><div className="flex items-center gap-3"><span className="grid h-7 w-7 place-items-center rounded-full bg-indigo-100 text-xs font-black text-indigo-700">1</span><div><h2 className="font-black">Delivery details</h2><p className="muted mt-0.5 text-xs">Where should we send this?</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2">{[['fullName', 'Full name'], ['street', 'Street address'], ['city', 'City'], ['state', 'State'], ['zip', 'ZIP code'], ['phone', 'Phone']].map(([key, label]) => <label key={key} className="text-xs font-bold">{label}<input required value={(address as any)[key]} onChange={(event) => setAddress({ ...address, [key]: event.target.value })} className="input mt-2" /></label>)}</div></section>
          <section className="surface p-5 md:p-6"><div className="flex items-center gap-3"><span className="grid h-7 w-7 place-items-center rounded-full bg-indigo-100 text-xs font-black text-indigo-700">2</span><div><h2 className="font-black">Payment method</h2><p className="muted mt-0.5 text-xs">Use a card to complete the order.</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><label className="text-xs font-bold">Card type<select value={payment} onChange={(event) => setPayment(event.target.value)} className="input mt-2"><option value="visa">Visa</option><option value="mastercard">Mastercard</option></select></label><label className="text-xs font-bold">Card number<input required value={card} onChange={(event) => setCard(event.target.value)} placeholder="4242 4242 4242 4242" className="input mt-2" /></label></div></section>
        </div>
        <aside className="surface h-fit p-6"><div className="flex items-center justify-between"><h2 className="font-black">Review order</h2><span className="pill">{items.length} item{items.length !== 1 ? 's' : ''}</span></div><div className="mt-5 space-y-3">{items.slice(0, 3).map((item) => <div key={String(item.productId)} className="flex items-center gap-3 text-xs"><img src={item.image || '/placeholder-product.svg'} alt="" className="h-10 w-10 rounded bg-indigo-50 object-contain" /><span className="flex-1 truncate font-semibold">{item.title}</span><b>${(item.price * item.qty).toFixed(2)}</b></div>)}</div><div className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500"><div className="flex justify-between"><span>Items</span><span>${items.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2)}</span></div><div className="mt-2 flex justify-between"><span>Shipping</span><span>Calculated at checkout</span></div></div><button disabled={busy} className="btn btn-primary mt-6 w-full"><Check className="h-4 w-4" />{busy ? 'Placing order...' : 'Place order'}</button><div className="mt-4 flex gap-2 text-[11px] text-slate-500"><ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" /> Your payment details are sent securely.</div><a href="/cart" className="mt-5 flex items-center justify-center gap-1 text-xs font-bold text-slate-500"><ArrowLeft className="h-3.5 w-3.5" /> Back to cart</a></aside>
      </form>
    </div>
  );
}
