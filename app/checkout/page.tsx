'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Check, Lock } from '@/lib/icons';
import { useCart } from '@/hooks/useCart';

export default function Checkout() {
  const router = useRouter();
  const { items } = useCart();
  const [busy, setBusy] = useState(false);
  const [address, setAddress] = useState({ fullName: '', street: '', city: '', state: '', zip: '', country: 'United States', phone: '' });
  const [payment, setPayment] = useState('visa');
  const [card, setCard] = useState('');
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

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

  if (!items.length) return <div className="shell flex min-h-[62vh] flex-col items-center justify-center py-20 text-center"><h1 className="page-title">Your cart is empty</h1><p className="mt-3 muted">Add something you love before checking out.</p></div>;

  const fields = [['fullName', 'Full name'], ['street', 'Street address'], ['city', 'City'], ['state', 'State'], ['zip', 'ZIP code'], ['phone', 'Phone']] as const;
  return <div className="shell py-6 sm:py-10">
    <div className="mb-6 flex items-center justify-between gap-4"><div><p className="eyebrow">Checkout</p><h1 className="page-title mt-2">A few details, then done.</h1></div><div className="flex items-center gap-1 text-xs font-bold text-emerald-700"><Lock className="h-4 w-4" /> Secure</div></div>
    <div className="sticky top-[5.6rem] z-30 -mx-4 mb-6 border-y border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:rounded-2xl sm:border sm:px-5"><ol className="flex items-center justify-between gap-2 text-xs font-black sm:text-sm"><li className="flex items-center gap-1.5 text-violet-700"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100">1</span> Delivery</li><span className="h-px flex-1 bg-slate-200" /><li className="flex items-center gap-1.5 text-slate-500"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">2</span> Payment</li><span className="h-px flex-1 bg-slate-200" /><li className="flex items-center gap-1.5 text-slate-500"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">3</span> Confirm</li></ol></div>
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4 sm:space-y-5">
        <section className="surface p-4 sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Step 1</p><h2 className="mt-1 text-xl font-black">Delivery details</h2></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">Required</span></div><div className="mt-5 grid gap-3 sm:grid-cols-2">{fields.map(([key, label]) => <label key={key} className="text-sm font-bold">{label}<input required value={(address as any)[key]} onChange={(event) => setAddress({ ...address, [key]: event.target.value })} className="input mt-2" /></label>)}</div></section>
        <section className="surface p-4 sm:p-6"><p className="eyebrow">Step 2</p><h2 className="mt-1 text-xl font-black">Payment</h2><div className="mt-5 grid gap-3 sm:grid-cols-2"><label className="text-sm font-bold">Card type<select value={payment} onChange={(event) => setPayment(event.target.value)} className="input mt-2"><option value="visa">Visa</option><option value="mastercard">Mastercard</option></select></label><label className="text-sm font-bold">Card number<input required value={card} onChange={(event) => setCard(event.target.value)} placeholder="4242 4242 4242 4242" inputMode="numeric" autoComplete="cc-number" className="input mt-2" /></label></div><p className="mt-3 text-xs muted">This demo checkout never stores card details.</p></section>
      </div>
      <aside className="surface hidden h-fit p-6 lg:sticky lg:top-28 lg:block"><p className="eyebrow">Step 3</p><h2 className="mt-1 text-xl font-black">Review order</h2><div className="mt-5 space-y-3">{items.map((item) => <div className="flex gap-3 text-sm" key={String(item.productId)}><span className="flex-1 line-clamp-2">{item.title} × {item.qty}</span><b>${(item.price * item.qty).toFixed(2)}</b></div>)}</div><hr className="my-5" /><div className="flex justify-between text-lg"><b>Total</b><b>${total.toFixed(2)}</b></div><button disabled={busy} className="btn btn-primary mt-6 w-full min-h-12"><Check className="h-4 w-4" />{busy ? 'Placing order...' : 'Place order'}</button><p className="mt-3 text-center text-xs muted">Buyer protection included</p></aside>
      <div className="fixed inset-x-3 bottom-[5.4rem] z-40 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 p-2.5 shadow-2xl backdrop-blur lg:hidden"><div className="min-w-0 flex-1"><span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Total</span><b className="text-lg">${total.toFixed(2)}</b></div><button disabled={busy} className="btn btn-primary min-h-11 flex-1">{busy ? 'Placing...' : 'Place order'}</button></div>
    </form>
  </div>;
}
