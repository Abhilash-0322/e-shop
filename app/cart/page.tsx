'use client';

import Link from 'next/link';
import toast from 'react-hot-toast';
import { Minus, Plus, ShoppingCart, Trash2 } from '@/lib/icons';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const { items, update, remove } = useCart();
  const subtotal = items.reduce((total, item) => total + item.price * item.qty, 0);
  const shipping = subtotal >= 35 ? 0 : 5.99;
  const total = subtotal + shipping;

  if (!items.length) return <div className="shell flex min-h-[62vh] flex-col items-center justify-center py-20 text-center"><ShoppingCart className="h-12 w-12 text-indigo-300" /><h1 className="page-title mt-5">Your cart is ready for something good.</h1><p className="mt-3 max-w-md muted">Save a few favorites here and we’ll keep them ready for your next decision.</p><Link href="/search" className="btn btn-primary mt-7 min-h-12">Start shopping</Link></div>;

  return <div className="shell py-7 sm:py-12">
    <div className="mb-7 flex items-end justify-between gap-4"><div><p className="eyebrow">Your bag</p><h1 className="page-title mt-2">Ready when you are.</h1><p className="mt-2 text-sm muted">{items.reduce((count, item) => count + item.qty, 0)} item{items.reduce((count, item) => count + item.qty, 0) !== 1 ? 's' : ''} · Free shipping over $35</p></div><Link href="/search" className="hidden text-sm amazon-link sm:block">Keep shopping →</Link></div>
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-3">{items.map((item) => <div key={String(item.productId)} className="surface flex gap-3 p-3 sm:gap-4 sm:p-4">
        <img src={item.image || '/placeholder-product.svg'} alt={item.title} className="h-24 w-24 shrink-0 rounded-xl bg-indigo-50 object-contain sm:h-28 sm:w-28" />
        <div className="min-w-0 flex-1"><h2 className="line-clamp-2 text-sm font-extrabold sm:text-base">{item.title}</h2><p className="mt-1 text-lg font-black">${item.price.toFixed(2)}</p><div className="mt-2 flex items-center gap-1.5"><div className="flex items-center rounded-lg border border-slate-200"><button className="tap-target h-9 w-9" onClick={() => update(String(item.productId), Math.max(1, item.qty - 1))} aria-label={`Decrease quantity for ${item.title}`}><Minus className="h-4 w-4" /></button><b className="w-7 text-center text-sm" aria-live="polite">{item.qty}</b><button className="tap-target h-9 w-9" onClick={() => update(String(item.productId), item.qty + 1)} aria-label={`Increase quantity for ${item.title}`}><Plus className="h-4 w-4" /></button></div><span className="text-xs text-slate-400">Quantity</span></div></div>
        <button onClick={async () => { await remove(String(item.productId)); toast.success('Removed'); }} className="tap-target h-10 w-10 shrink-0 self-start rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500" aria-label={`Remove ${item.title} from cart`}><Trash2 className="h-5 w-5" /></button>
      </div>)}</div>
      <aside className="surface h-fit p-5 lg:sticky lg:top-28"><p className="eyebrow">Order summary</p><div className="mt-5 flex justify-between"><span>Subtotal</span><b>${subtotal.toFixed(2)}</b></div><div className="mt-2 flex justify-between text-sm muted"><span>Shipping</span><span>{shipping ? '$5.99' : 'Free'}</span></div><hr className="my-5" /><div className="flex justify-between text-xl"><b>Total</b><b>${total.toFixed(2)}</b></div><Link href="/checkout" className="btn btn-primary mt-6 hidden w-full min-h-12 lg:inline-flex">Continue to checkout</Link><p className="mt-3 text-center text-xs muted">Secure checkout · Buyer protection included</p></aside>
    </div>
    <div className="fixed inset-x-3 bottom-[5.4rem] z-40 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 p-2.5 shadow-2xl backdrop-blur lg:hidden"><div className="min-w-0 flex-1"><span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Total</span><b className="text-lg">${total.toFixed(2)}</b></div><Link href="/checkout" className="btn btn-primary min-h-11 flex-1">Checkout</Link></div>
  </div>;
}
