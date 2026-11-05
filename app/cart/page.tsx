'use client';

import Link from 'next/link';
import toast from 'react-hot-toast';
import {useCart} from '@/hooks/useCart';
import {Minus, Plus, ShoppingCart, Trash2} from '@/lib/icons';

export default function CartPage() {
  const {items, loading, update, remove} = useCart();
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (loading) {
    return (
      <div className="shell py-12">
        <div className="skeleton h-4 w-24" />
        <div className="skeleton mt-4 h-12 w-64" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">{[1, 2, 3].map((row) => <div className="skeleton h-28 w-full" key={row} />)}</div>
          <div className="skeleton h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="shell py-24 text-center">
        <ShoppingCart className="mx-auto h-12 w-12 text-indigo-300" />
        <h1 className="page-title mt-5">Your cart is ready for something good.</h1>
        <Link href="/search" className="btn btn-primary mt-7">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="shell py-12">
      <p className="eyebrow">Your bag</p>
      <h1 className="page-title mb-8 mt-2">Ready when you are.</h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={String(item.productId)} className="surface flex items-center gap-4 p-4">
              <img src={item.image || '/placeholder-product.svg'} alt={item.title} className="h-24 w-24 rounded-xl bg-indigo-50 object-contain" loading="lazy" decoding="async" />
              <div className="flex-1">
                <h2 className="font-bold">{item.title}</h2>
                <p className="mt-1 text-lg font-black">${item.price.toFixed(2)}</p>
                <div className="mt-3 flex items-center gap-2">
                  <button className="rounded bg-slate-100 p-1" onClick={() => update(String(item.productId), Math.max(1, item.qty - 1))} aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button>
                  <b>{item.qty}</b>
                  <button className="rounded bg-slate-100 p-1" onClick={() => update(String(item.productId), item.qty + 1)} aria-label="Increase quantity"><Plus className="h-4 w-4" /></button>
                </div>
              </div>
              <button onClick={async () => { await remove(String(item.productId)); toast.success('Removed'); }} aria-label="Remove item">
                <Trash2 className="h-5 w-5 text-slate-400 hover:text-rose-500" />
              </button>
            </div>
          ))}
        </div>
        <aside className="surface h-fit p-6">
          <p className="eyebrow">Summary</p>
          <div className="mt-5 flex justify-between"><span>Subtotal</span><b>${total.toFixed(2)}</b></div>
          <div className="muted mt-2 flex justify-between text-sm"><span>Shipping</span><span>{total >= 35 ? 'Free' : '$5.99'}</span></div>
          <hr className="my-5" />
          <div className="flex justify-between text-xl"><b>Total</b><b>${(total + (total >= 35 ? 0 : 5.99)).toFixed(2)}</b></div>
          <Link href="/checkout" className="btn btn-primary mt-6 w-full">Continue to checkout</Link>
        </aside>
      </div>
    </div>
  );
}
