'use client';

import Link from 'next/link';
import {Minus, Plus, ShoppingCart, Trash2} from '@/lib/icons';
import {useCart} from '@/hooks/useCart';
import toast from 'react-hot-toast';
import {EmptyState, PageHeader} from '@/components/ui';

export default function CartPage() {
  const {items, update, remove} = useCart();
  const subtotal = items.reduce((total, item) => total + item.price * item.qty, 0);
  const shipping = subtotal >= 35 ? 0 : 5.99;

  if (!items.length) {
    return <div className="shell py-20"><EmptyState title="Your cart is ready for something good." description="Browse the marketplace and add a few things worth bringing home." action={<Link href="/search" className="btn btn-primary">Start shopping</Link>} icon={<ShoppingCart className="h-10 w-10" />} /></div>;
  }

  return (
    <div className="shell py-10 md:py-14">
      <PageHeader eyebrow="Your bag" title="Ready when you are." description={`${items.length} product${items.length === 1 ? '' : 's'} set aside for checkout.`} />
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-3">
          {items.map(item => (
            <div key={String(item.productId)} className="surface flex gap-4 p-4 md:p-5">
              <img src={item.image || '/placeholder-product.svg'} alt={item.title} className="h-24 w-24 rounded-xl bg-brand-50 object-contain" />
              <div className="min-w-0 flex-1">
                <h2 className="font-bold leading-snug">{item.title}</h2>
                <p className="mt-1 text-lg font-black">${item.price.toFixed(2)}</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center rounded-lg border border-slate-200">
                    <button type="button" className="p-1.5 hover:bg-slate-50" onClick={() => update(String(item.productId), Math.max(1, item.qty - 1))} aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button>
                    <b className="w-8 text-center text-sm">{item.qty}</b>
                    <button type="button" className="p-1.5 hover:bg-slate-50" onClick={() => update(String(item.productId), item.qty + 1)} aria-label="Increase quantity"><Plus className="h-4 w-4" /></button>
                  </div>
                  <span className="text-xs text-slate-400">Quantity</span>
                </div>
              </div>
              <button type="button" onClick={async () => {await remove(String(item.productId)); toast.success('Removed');}} aria-label="Remove item" className="self-start rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500"><Trash2 className="h-5 w-5" /></button>
            </div>
          ))}
        </div>
        <aside className="surface h-fit p-6 lg:sticky lg:top-28">
          <p className="eyebrow">Summary</p>
          <div className="mt-5 flex justify-between"><span>Subtotal</span><b>${subtotal.toFixed(2)}</b></div>
          <div className="muted mt-2 flex justify-between text-sm"><span>Shipping</span><span>{shipping ? `$${shipping.toFixed(2)}` : 'Free'}</span></div>
          {shipping > 0 && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-700">Add ${(35 - subtotal).toFixed(2)} more for free shipping.</p>}
          <hr className="my-5 border-slate-100" />
          <div className="flex justify-between text-xl"><b>Total</b><b>${(subtotal + shipping).toFixed(2)}</b></div>
          <Link href="/checkout" className="btn btn-primary mt-6 w-full">Continue to checkout</Link>
        </aside>
      </div>
    </div>
  );
}
