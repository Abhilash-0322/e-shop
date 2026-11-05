'use client';

import Link from 'next/link';
import {Minus, Plus, ShoppingCart, Trash2} from '@/lib/icons';
import {useCart} from '@/hooks/useCart';
import toast from 'react-hot-toast';

export default function CartPage() {
  const {items, update, remove} = useCart();
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (!items.length) {
    return (
      <div className="shell py-24 text-center">
        <ShoppingCart className="mx-auto h-12 w-12 text-indigo-400" aria-hidden="true" />
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
        <ul className="space-y-3" aria-label="Items in your cart">
          {items.map((item) => (
            <li key={String(item.productId)} className="surface flex items-center gap-4 p-4">
              <img src={item.image || '/placeholder-product.svg'} alt="" className="h-24 w-24 rounded-xl bg-indigo-50 object-contain" />
              <div className="flex-1">
                <h2 className="font-bold">{item.title}</h2>
                <p className="mt-1 text-lg font-black">${item.price.toFixed(2)}</p>
                <div className="mt-3 flex items-center gap-2" aria-label={`Quantity for ${item.title}`}>
                  <button type="button" className="flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200" onClick={() => update(String(item.productId), Math.max(1, item.qty - 1))} aria-label={`Decrease quantity of ${item.title}`} disabled={item.qty === 1}>
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <output className="w-8 text-center font-bold" aria-label={`Quantity ${item.qty}`} aria-live="polite">{item.qty}</output>
                  <button type="button" className="flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200" onClick={() => update(String(item.productId), item.qty + 1)} aria-label={`Increase quantity of ${item.title}`}>
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <button type="button" onClick={async () => { await remove(String(item.productId)); toast.success('Removed'); }} className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-600 hover:text-rose-700" aria-label={`Remove ${item.title} from cart`}>
                <Trash2 className="h-5 w-5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
        <aside className="surface h-fit p-6" aria-labelledby="cart-summary">
          <p className="eyebrow">Summary</p>
          <h2 id="cart-summary" className="sr-only">Cart summary</h2>
          <div className="mt-5 flex justify-between"><span>Subtotal</span><b>${total.toFixed(2)}</b></div>
          <div className="mt-2 flex justify-between text-sm muted"><span>Shipping</span><span>{total >= 35 ? 'Free' : '$5.99'}</span></div>
          <hr className="my-5" />
          <div className="flex justify-between text-xl"><b>Total</b><b>${(total + (total >= 35 ? 0 : 5.99)).toFixed(2)}</b></div>
          <Link href="/checkout" className="btn btn-primary mt-6 w-full">Continue to checkout</Link>
        </aside>
      </div>
    </div>
  );
}
