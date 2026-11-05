'use client';
import Link from 'next/link';
import {Trash2, Minus, Plus, ShoppingCart} from '@/lib/icons';
import {useCart} from '@/hooks/useCart';
import {useLocale} from '@/components/LocaleProvider';
import toast from 'react-hot-toast';

export default function CartPage() {
  const {items, update, remove} = useCart();
  const {formatMoney, formatNumber} = useLocale();
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = total >= 35 ? 0 : 5.99;
  if (!items.length) return <div className="shell py-24 text-center"><ShoppingCart className="mx-auto h-12 w-12 text-indigo-300" aria-hidden="true"/><h1 className="page-title mx-auto mt-5">Your cart is ready for something good.</h1><Link href="/search" className="btn btn-primary mt-7">Start shopping</Link></div>;
  return <div className="shell py-8 md:py-12"><p className="eyebrow">Your bag</p><h1 className="page-title mb-8 mt-2">Ready when you are.</h1><div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)]"><div className="min-w-0 space-y-3">{items.map((item) => <div key={String(item.productId)} className="surface flex min-w-0 flex-wrap items-center gap-3 p-4 sm:flex-nowrap sm:gap-4"><img src={item.image || '/placeholder-product.svg'} alt={item.title} className="h-20 w-20 shrink-0 rounded-xl bg-indigo-50 object-contain sm:h-24 sm:w-24"/><div className="min-w-0 flex-1"><h2 className="text-wrap font-bold">{item.title}</h2><p className="mt-1 text-lg font-black">{formatMoney(item.price)}</p><div className="mt-3 flex items-center gap-2"><button className="rounded bg-slate-100 p-1" onClick={() => update(String(item.productId), Math.max(1, item.qty - 1))} aria-label={`Decrease quantity for ${item.title}`}><Minus className="h-4 w-4" aria-hidden="true"/></button><b aria-live="polite">{formatNumber(item.qty)}</b><button className="rounded bg-slate-100 p-1" onClick={() => update(String(item.productId), item.qty + 1)} aria-label={`Increase quantity for ${item.title}`}><Plus className="h-4 w-4" aria-hidden="true"/></button></div></div><button onClick={async () => {await remove(String(item.productId)); toast.success('Removed')}} aria-label={`Remove ${item.title}`}><Trash2 className="h-5 w-5 text-slate-400 hover:text-rose-500" aria-hidden="true"/></button></div>)}</div><aside className="surface h-fit min-w-0 p-5 sm:p-6"><p className="eyebrow">Summary</p><div className="mt-5 flex justify-between gap-4"><span>Subtotal</span><b>{formatMoney(total)}</b></div><div className="muted mt-2 flex justify-between gap-4 text-sm"><span>Shipping</span><span>{shipping ? formatMoney(shipping) : 'Free'}</span></div><hr className="my-5"/><div className="flex justify-between gap-4 text-xl"><b>Total</b><b>{formatMoney(total + shipping)}</b></div><Link href="/checkout" className="btn btn-primary mt-6 w-full">Continue to checkout</Link></aside></div></div>;
}
