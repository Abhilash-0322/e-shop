'use client';

import Link from 'next/link';
import { Minus, Plus, ShoppingCart, Trash2 } from '@/lib/icons';
import { useCart } from '@/hooks/useCart';
import { EmptyState, RecoveryState } from '@/components/RecoveryState';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, update, remove, refresh, syncing, error, clearError } = useCart();
  const subtotal = items.reduce((total, item) => total + item.price * item.qty, 0);
  const shipping = subtotal >= 35 ? 0 : 5.99;

  if (!items.length && !error) {
    return (
      <div className="shell py-20">
        <div className="mx-auto max-w-2xl">
          <p className="eyebrow">Your bag</p>
          <h1 className="page-title mt-2">A little room for something good.</h1>
          <div className="mt-8"><EmptyState title="Your cart is empty" description="Save something you love, and it will be waiting here when you are ready." /></div>
        </div>
      </div>
    );
  }

  async function removeItem(productId: string) {
    const ok = await remove(productId);
    if (ok) toast.success('Removed from cart');
  }

  return (
    <div className="shell py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow">Your bag</p><h1 className="page-title mt-2">Ready when you are.</h1><p className="muted mt-3">{items.length} saved item{items.length === 1 ? '' : 's'} · Changes sync automatically</p></div>
        <Link href="/help" className="amazon-link text-sm">Need help with an item?</Link>
      </div>
      {error && (
        <div className="mb-6">
          <RecoveryState
            title={error.conflict ? 'Your cart changed elsewhere' : 'Cart sync paused'}
            description={`${error.message} Your current view is still here; refresh to reconcile it with the latest server state.`}
            onRetry={async () => { clearError(); await refresh(); }}
            retryLabel="Refresh cart"
            href="/help"
            hrefLabel="Contact support"
            compact
          />
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={String(item.productId)} className="surface flex items-center gap-4 p-4">
              <img src={item.image || '/placeholder-product.svg'} alt="" className="h-24 w-24 rounded-xl bg-[#e3f1ed] object-contain" />
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-black">{item.title}</h2>
                <p className="mt-1 text-lg font-black">${item.price.toFixed(2)}</p>
                <div className="mt-3 flex items-center gap-2">
                  <button disabled={syncing} className="rounded-lg bg-[#e3f1ed] p-1.5 hover:bg-[#cde6e0] disabled:opacity-50" onClick={() => update(String(item.productId), Math.max(1, item.qty - 1))} aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button>
                  <b className="w-7 text-center">{item.qty}</b>
                  <button disabled={syncing} className="rounded-lg bg-[#e3f1ed] p-1.5 hover:bg-[#cde6e0] disabled:opacity-50" onClick={() => update(String(item.productId), item.qty + 1)} aria-label="Increase quantity"><Plus className="h-4 w-4" /></button>
                </div>
              </div>
              <button onClick={() => removeItem(String(item.productId))} aria-label={`Remove ${item.title}`} className="rounded-lg p-2 text-slate-400 hover:bg-[#fff0e9] hover:text-[#bd4532]"><Trash2 className="h-5 w-5" /></button>
            </div>
          ))}
        </div>
        <aside className="surface h-fit p-6 lg:sticky lg:top-32">
          <p className="eyebrow">Order preview</p>
          <div className="mt-5 flex justify-between"><span>Subtotal</span><b>${subtotal.toFixed(2)}</b></div>
          <div className="muted mt-2 flex justify-between text-sm"><span>Shipping</span><span>{shipping ? `$${shipping.toFixed(2)}` : 'Free'}</span></div>
          {subtotal < 35 && <p className="mt-3 rounded-lg bg-[#fff4ed] p-2 text-xs font-bold text-[#92452f]">Add ${(35 - subtotal).toFixed(2)} more for free shipping.</p>}
          <hr className="my-5 border-[#dce4e5]" />
          <div className="flex justify-between text-xl"><b>Total</b><b>${(subtotal + shipping).toFixed(2)}</b></div>
          <Link href="/checkout" className="btn btn-primary mt-6 w-full">Continue to checkout</Link>
          <p className="mt-3 text-center text-xs text-slate-400">You can review everything before paying.</p>
        </aside>
      </div>
    </div>
  );
}
