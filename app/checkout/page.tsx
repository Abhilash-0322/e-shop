'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Lock } from '@/lib/icons';
import { useCart } from '@/hooks/useCart';
import { EmptyState, RecoveryState } from '@/components/RecoveryState';
import toast from 'react-hot-toast';

const DRAFT_KEY = 'halozon-checkout-draft';
type Address = { fullName: string; street: string; city: string; state: string; zip: string; country: string; phone: string };
const blankAddress: Address = { fullName: '', street: '', city: '', state: '', zip: '', country: 'United States', phone: '' };

export default function Checkout() {
  const router = useRouter();
  const { items } = useCart();
  const [busy, setBusy] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState<Address>(blankAddress);
  const [payment, setPayment] = useState('visa');
  const [card, setCard] = useState('');
  const request = useRef<AbortController | null>(null);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.address) setAddress({ ...blankAddress, ...parsed.address });
        if (parsed.payment) setPayment(parsed.payment);
      }
    } catch {
      // An invalid local draft should never block checkout.
    } finally {
      setHydrated(true);
    }
    return () => request.current?.abort();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ address, payment }));
  }, [address, hydrated, payment]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shippingAddress: address, paymentMethod: payment, cardNumber: card }),
        signal: controller.signal,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Checkout could not be completed.');
      window.localStorage.removeItem(DRAFT_KEY);
      toast.success('Order placed');
      router.push(`/account/orders/${data.order._id}`);
    } catch (caught: any) {
      if (caught?.name !== 'AbortError') {
        setError(caught?.message || 'Checkout could not be completed. Your details are still here.');
      }
    } finally {
      if (!controller.signal.aborted) setBusy(false);
    }
  }

  if (!items.length) {
    return <div className="shell py-20"><div className="mx-auto max-w-2xl"><p className="eyebrow">Checkout</p><h1 className="page-title mt-2">Nothing to check out yet.</h1><div className="mt-8"><EmptyState title="Your cart is empty" description="Add something to your cart first, then come back whenever you are ready." /></div></div></div>;
  }

  return (
    <div className="shell py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[#0f766e]"><Lock className="h-4 w-4" /> Secure checkout</div>
        <span className="text-xs font-bold text-slate-400">Your delivery draft saves automatically</span>
      </div>
      {error && <div className="mb-6"><RecoveryState title="We could not place that order" description={`${error} Nothing was charged. Check the details and try again, or contact support if the problem continues.`} onRetry={() => form.current?.requestSubmit()} retryLabel="Try checkout again" href="/help" hrefLabel="Get checkout help" compact /></div>}
      <form ref={form} onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <section className="surface p-6 md:p-7">
            <div className="flex items-start gap-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#e3f1ed] font-black text-[#0f766e]">1</span><div><h2 className="text-xl font-black">Where should we deliver?</h2><p className="muted mt-1 text-sm">We&apos;ll use this for order updates too.</p></div></div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {([['fullName', 'Full name'], ['street', 'Street address'], ['city', 'City'], ['state', 'State'], ['zip', 'ZIP code'], ['phone', 'Phone']] as const).map(([key, label]) => <label key={key} className="text-sm font-bold">{label}<input required value={address[key]} onChange={(event) => setAddress((current) => ({ ...current, [key]: event.target.value }))} className="input mt-2" /></label>)}
            </div>
          </section>
          <section className="surface p-6 md:p-7">
            <div className="flex items-start gap-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#e3f1ed] font-black text-[#0f766e]">2</span><div><h2 className="text-xl font-black">How would you like to pay?</h2><p className="muted mt-1 text-sm">Use a test card such as 4242 4242 4242 4242.</p></div></div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-bold">Card type<select value={payment} onChange={(event) => setPayment(event.target.value)} className="input mt-2"><option value="visa">Visa</option><option value="mastercard">Mastercard</option></select></label>
              <label className="text-sm font-bold">Card number<input required value={card} onChange={(event) => setCard(event.target.value)} placeholder="4242 4242 4242 4242" className="input mt-2" autoComplete="cc-number" /></label>
            </div>
            <p className="mt-4 text-xs text-slate-400">For your safety, the card number is never saved in your local draft.</p>
          </section>
        </div>
        <aside className="surface h-fit p-6 lg:sticky lg:top-32">
          <h2 className="text-xl font-black">Review order</h2>
          <p className="muted mt-2 text-sm">{items.length} item{items.length !== 1 ? 's' : ''} · Final shipping and tax are calculated securely.</p>
          <div className="mt-6 space-y-3 border-t border-[#dce4e5] pt-5 text-sm">{items.slice(0, 3).map((item) => <div className="flex justify-between gap-3" key={String(item.productId)}><span className="truncate">{item.qty} × {item.title}</span><b>${(item.price * item.qty).toFixed(2)}</b></div>)}{items.length > 3 && <p className="text-xs text-slate-400">+ {items.length - 3} more items</p>}</div>
          <button disabled={busy} className="btn btn-primary mt-7 w-full"><Check className="h-4 w-4" />{busy ? 'Placing order…' : 'Place order'}</button>
          <p className="mt-3 text-center text-xs text-slate-400">If anything goes wrong, your details remain available to retry.</p>
        </aside>
      </form>
    </div>
  );
}
