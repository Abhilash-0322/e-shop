'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowRight, Check, Gift, Lock, ShieldCheck, Tag } from '@/lib/icons';
import { useCart } from '@/hooks/useCart';

export default function Checkout() {
  const router = useRouter();
  const { items } = useCart();
  const [busy, setBusy] = useState(false);
  const [address, setAddress] = useState({ fullName: '', street: '', city: '', state: '', zip: '', country: 'United States', phone: '' });
  const [payment, setPayment] = useState('visa');
  const [card, setCard] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const itemsTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = itemsTotal >= 35 ? 0 : 5.99;
  const tax = itemsTotal * 0.08;
  const total = itemsTotal + shipping + tax + (giftWrap ? 3.99 : 0);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const response = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ shippingAddress: address, paymentMethod: payment, cardNumber: card, couponCode, giftWrap, giftMessage }) });
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

  if (!items.length) return <div className="shell py-24 text-center"><h1 className="page-title">Your bag is empty.</h1><p className="muted mt-3">Add something good before checkout.</p><button onClick={() => router.push('/search')} className="btn btn-primary mt-6">Browse products <ArrowRight className="h-4 w-4" /></button></div>;

  return (
    <div className="shell py-10 md:py-14">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4"><div><p className="eyebrow">Almost yours</p><h1 className="page-title mt-2">A calmer checkout.</h1></div><span className="flex items-center gap-2 text-sm font-bold text-[#6d8735]"><Lock className="h-4 w-4" /> Secure and encrypted</span></div>
      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <section className="surface p-6 md:p-7"><div className="flex items-start gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d7f36b] text-sm font-black">1</span><div className="flex-1"><h2 className="text-xl font-black">Where should we deliver?</h2><p className="muted mt-1 text-sm">We&apos;ll use this to confirm the delivery estimate.</p><div className="mt-5 grid gap-3 sm:grid-cols-2">{[['fullName', 'Full name'], ['street', 'Street address'], ['city', 'City'], ['state', 'State'], ['zip', 'ZIP code'], ['phone', 'Phone']].map(([key, label]) => <label key={key} className="text-sm font-bold">{label}<input required value={(address as any)[key]} onChange={(event) => setAddress({ ...address, [key]: event.target.value })} className="input mt-2" /></label>)}</div></div></div></section>
          <section className="surface p-6 md:p-7"><div className="flex items-start gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d7f36b] text-sm font-black">2</span><div className="flex-1"><h2 className="text-xl font-black">How would you like to pay?</h2><p className="muted mt-1 text-sm">This is a secure demo payment form; no card is charged here.</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><label className="text-sm font-bold">Card type<select value={payment} onChange={(event) => setPayment(event.target.value)} className="input mt-2"><option value="visa">Visa</option><option value="mastercard">Mastercard</option><option value="amex">American Express</option></select></label><label className="text-sm font-bold">Card number<input required value={card} onChange={(event) => setCard(event.target.value)} placeholder="4242 4242 4242 4242" className="input mt-2" /></label></div></div></div></section>
          <section className="surface p-6 md:p-7"><div className="flex items-start gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#edf1e9]"><Gift className="h-4 w-4" /></span><div className="flex-1"><h2 className="text-xl font-black">Make it a little more personal</h2><label className="mt-5 flex items-center gap-3 text-sm font-bold"><input type="checkbox" checked={giftWrap} onChange={(event) => setGiftWrap(event.target.checked)} className="h-4 w-4 accent-[#728749]" /> Add gift wrapping for $3.99</label>{giftWrap && <textarea className="input mt-3 min-h-24" placeholder="Gift message (optional)" value={giftMessage} onChange={(event) => setGiftMessage(event.target.value)} />}</div></div></section>
        </div>
        <aside className="surface h-fit p-6 lg:sticky lg:top-32"><p className="eyebrow">Review order</p><div className="mt-5 max-h-52 space-y-3 overflow-auto">{items.map((item) => <div className="flex gap-3" key={String(item.productId)}><img src={item.image || '/placeholder-product.svg'} alt="" className="h-12 w-12 rounded-lg bg-[#edf1e9] object-contain" /><div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm font-bold">{item.title}</p><p className="muted text-xs">Qty {item.qty}</p></div><b className="text-sm">${(item.price * item.qty).toFixed(2)}</b></div>)}</div><div className="mt-5 border-t border-[#dfe5dc] pt-5"><label className="text-xs font-black uppercase tracking-wider text-[#8b998d]">Have a code?</label><div className="mt-2 flex gap-2"><input value={couponCode} onChange={(event) => setCouponCode(event.target.value)} className="input" placeholder="HALO10" /><span className="flex items-center justify-center rounded-xl bg-[#edf1e9] px-3"><Tag className="h-4 w-4 text-[#728749]" /></span></div></div><div className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><span>Items</span><b>${itemsTotal.toFixed(2)}</b></div><div className="flex justify-between text-[#526259]"><span>Shipping</span><span>{shipping ? `$${shipping.toFixed(2)}` : 'Free'}</span></div><div className="flex justify-between text-[#526259]"><span>Estimated tax</span><span>${tax.toFixed(2)}</span></div>{giftWrap && <div className="flex justify-between text-[#526259]"><span>Gift wrap</span><span>$3.99</span></div>}</div><div className="my-5 border-t border-[#dfe5dc] pt-5"><div className="flex justify-between text-xl"><b>Total</b><b>${total.toFixed(2)}</b></div></div><button disabled={busy} className="btn btn-primary w-full"><Check className="h-4 w-4" />{busy ? 'Placing order...' : 'Place order'}</button><p className="mt-4 flex gap-2 text-xs leading-relaxed text-[#526259]"><ShieldCheck className="h-4 w-4 shrink-0 text-[#728749]" /> You&apos;re covered by Halozon buyer protection and our easy returns policy.</p></aside>
      </form>
    </div>
  );
}
