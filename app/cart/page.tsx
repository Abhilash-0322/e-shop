'use client';

import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowRight, Minus, Plus, RefreshCw, ShoppingCart, Trash2 } from '@/lib/icons';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const { items, update, remove } = useCart();
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (!items.length) {
    return (
      <div className="shell py-24 text-center">
        <ShoppingCart className="w-12 h-12 mx-auto text-indigo-300" />
        <h1 className="page-title mt-5">Your cart is ready for something good.</h1>
        <p className="muted max-w-md mx-auto mt-4">
          Add a one-time purchase now, or visit a product page to set up a repeat delivery.
        </p>
        <Link href="/search" className="btn btn-primary mt-7">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="shell py-12">
      <p className="eyebrow">Your bag</p>
      <h1 className="page-title mt-2 mb-8">Ready when you are.</h1>
      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={String(item.productId)} className="surface p-4 flex gap-4 items-center">
              <img
                src={item.image || '/placeholder-product.svg'}
                alt={item.title}
                className="w-24 h-24 rounded-xl bg-indigo-50 object-contain"
              />
              <div className="flex-1 min-w-0">
                <h2 className="font-bold truncate">{item.title}</h2>
                <p className="text-lg font-black mt-1">${item.price.toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    className="p-1 rounded bg-slate-100"
                    onClick={() => update(String(item.productId), Math.max(1, item.qty - 1))}
                    aria-label={`Decrease quantity for ${item.title}`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <b>{item.qty}</b>
                  <button
                    className="p-1 rounded bg-slate-100"
                    onClick={() => update(String(item.productId), item.qty + 1)}
                    aria-label={`Increase quantity for ${item.title}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <Link
                  href={`/product/${String(item.productId)}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 mt-3"
                >
                  <RefreshCw className="w-3 h-3" />
                  Set up repeat delivery
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <button
                onClick={async () => {
                  await remove(String(item.productId));
                  toast.success('Removed');
                }}
                aria-label={`Remove ${item.title}`}
              >
                <Trash2 className="w-5 h-5 text-slate-400 hover:text-rose-500" />
              </button>
            </div>
          ))}
        </div>

        <aside className="space-y-4 h-fit">
          <div className="surface p-6">
            <p className="eyebrow">One-time order</p>
            <div className="flex justify-between mt-5">
              <span>Subtotal</span>
              <b>${total.toFixed(2)}</b>
            </div>
            <div className="flex justify-between mt-2 muted text-sm">
              <span>Shipping</span>
              <span>{total >= 35 ? 'Free' : '$5.99'}</span>
            </div>
            <hr className="my-5" />
            <div className="flex justify-between text-xl">
              <b>Total</b>
              <b>${(total + (total >= 35 ? 0 : 5.99)).toFixed(2)}</b>
            </div>
            <Link href="/checkout" className="btn btn-primary w-full mt-6">
              Continue to checkout
            </Link>
          </div>
          <div className="surface border-indigo-200 bg-indigo-50/70 p-5">
            <RefreshCw className="w-5 h-5 text-indigo-600" />
            <h2 className="font-black mt-3">Build a replenishment routine</h2>
            <p className="muted text-sm mt-2">
              Subscriptions are opt-in. Choose a cadence and see your exact savings on the product page.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
