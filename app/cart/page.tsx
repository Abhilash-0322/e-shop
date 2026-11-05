'use client';

import Link from 'next/link';
import { Minus, Plus, ShoppingCart, Trash2, Truck } from '@/lib/icons';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, update, remove } = useCart();
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = total >= 35 ? 0 : 5.99;
  const progress = Math.min(100, Math.round((total / 35) * 100));

  if (!items.length) {
    return <div className="shell py-24 text-center"><ShoppingCart className="mx-auto h-12 w-12 text-indigo-300" /><h1 className="page-title mt-5">Your cart is ready for something good.</h1><p className="muted mx-auto mt-3 max-w-md">Build a shortlist from visual discovery, then come back when you are ready.</p><Link href="/search" className="btn btn-primary mt-7">Start shopping</Link></div>;
  }

  return (
    <div className="shell py-10 md:py-14">
      <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end"><div><p className="eyebrow">Your bag</p><h1 className="page-title mt-2">Ready when you are.</h1></div><Link href="/search" className="amazon-link text-sm">Keep browsing →</Link></div>
      {shipping > 0 ? <div className="surface mb-6 flex items-center gap-3 p-4 text-sm"><Truck className="h-5 w-5 shrink-0 text-indigo-600" /><div className="flex-1"><div className="flex justify-between gap-4"><span>Add <b>${(35 - total).toFixed(2)}</b> for free shipping</span><span className="font-bold text-indigo-600">{progress}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" style={{ width: `${progress}%` }} /></div></div></div> : <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">Free shipping unlocked for this order.</div>}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">{items.map((item) => <div key={String(item.productId)} className="surface flex items-center gap-4 p-4"><img src={item.image || '/placeholder-product.svg'} alt={item.title} className="h-24 w-24 rounded-xl bg-indigo-50 object-contain" /><div className="min-w-0 flex-1"><h2 className="truncate font-bold">{item.title}</h2><p className="mt-1 text-lg font-black">${item.price.toFixed(2)}</p><div className="mt-3 flex items-center gap-3"><div className="flex items-center gap-3 rounded-lg bg-slate-100 px-2 py-1"><button onClick={() => update(String(item.productId), Math.max(1, item.qty - 1))} aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button><b className="text-sm">{item.qty}</b><button onClick={() => update(String(item.productId), item.qty + 1)} aria-label="Increase quantity"><Plus className="h-4 w-4" /></button></div><span className="text-xs text-slate-500">Ships fast</span></div></div><button onClick={async () => { await remove(String(item.productId)); toast.success('Removed'); }} aria-label="Remove item"><Trash2 className="h-5 w-5 text-slate-400 hover:text-rose-500" /></button></div>)}</div>
        <aside className="surface h-fit p-6 lg:sticky lg:top-28"><p className="eyebrow">Order summary</p><div className="mt-5 flex justify-between"><span>Subtotal</span><b>${total.toFixed(2)}</b></div><div className="muted mt-2 flex justify-between text-sm"><span>Shipping</span><span>{shipping ? `$${shipping.toFixed(2)}` : 'Free'}</span></div><hr className="my-5" /><div className="flex justify-between text-xl"><b>Total</b><b>${(total + shipping).toFixed(2)}</b></div><Link href="/checkout" className="btn btn-primary mt-6 w-full">Continue to checkout</Link><p className="muted mt-4 text-center text-xs">Secure checkout · Buyer protection included</p></aside>
      </div>
    </div>
  );
}
