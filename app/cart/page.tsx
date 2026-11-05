'use client';

import Link from 'next/link';
import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingCart, Trash2 } from '@/lib/icons';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, update, remove } = useCart();
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  if (!items.length) {
    return <div className="shell py-24 text-center"><ShoppingCart className="mx-auto h-12 w-12 text-indigo-300" /><p className="eyebrow mt-6">Cart signal</p><h1 className="page-title mt-3">Your cart is ready for something good.</h1><p className="muted mx-auto mt-3 max-w-md text-sm">Save a product or add something from discovery to get started.</p><Link href="/search" className="btn btn-primary mt-7">Start shopping <ArrowRight className="h-4 w-4" /></Link></div>;
  }
  const shipping = total >= 35 ? 0 : 5.99;
  return (
    <div className="shell py-8 md:py-10">
      <div className="workspace-toolbar"><div><p className="eyebrow">Purchase queue</p><h1 className="page-title mt-2">Ready when you are.</h1><p className="muted mt-3 text-sm">{items.length} line item{items.length !== 1 ? 's' : ''} · Review before checkout.</p></div><div className="hidden items-center gap-2 text-xs font-bold text-emerald-700 sm:flex"><ShieldCheck className="h-4 w-4" /> Protected checkout</div></div>
      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        <div className="space-y-3">{items.map((item) => <div key={String(item.productId)} className="surface flex items-center gap-4 p-4"><img src={item.image || '/placeholder-product.svg'} alt={item.title} className="h-20 w-20 rounded-lg bg-indigo-50 object-contain sm:h-24 sm:w-24" /><div className="min-w-0 flex-1"><h2 className="truncate text-sm font-bold">{item.title}</h2><p className="mt-1 text-lg font-black">${item.price.toFixed(2)}</p><div className="mt-3 flex w-fit items-center gap-3 rounded-md border border-slate-200 px-2 py-1"><button type="button" onClick={() => update(String(item.productId), Math.max(1, item.qty - 1))} aria-label="Decrease quantity"><Minus className="h-3.5 w-3.5" /></button><b className="text-xs">{item.qty}</b><button type="button" onClick={() => update(String(item.productId), item.qty + 1)} aria-label="Increase quantity"><Plus className="h-3.5 w-3.5" /></button></div></div><button type="button" onClick={async () => { await remove(String(item.productId)); toast.success('Removed'); }} aria-label={`Remove ${item.title}`}><Trash2 className="h-4 w-4 text-slate-400 hover:text-rose-500" /></button></div>)}</div>
        <aside className="surface h-fit p-6"><p className="eyebrow">Order summary</p><div className="mt-5 flex justify-between text-sm"><span>Subtotal</span><b>${total.toFixed(2)}</b></div><div className="muted mt-2 flex justify-between text-xs"><span>Shipping</span><span>{shipping ? `$${shipping.toFixed(2)}` : 'Free'}</span></div><hr className="my-5 border-slate-100" /><div className="flex justify-between text-lg"><b>Total</b><b>${(total + shipping).toFixed(2)}</b></div><Link href="/checkout" className="btn btn-primary mt-6 w-full">Continue to checkout <ArrowRight className="h-4 w-4" /></Link><p className="muted mt-4 text-center text-[11px]">Taxes and final delivery timing are confirmed at checkout.</p></aside>
      </div>
    </div>
  );
}
