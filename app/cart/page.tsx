'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowRight, Check, Minus, Plus, ShieldCheck, ShoppingCart, Trash2, Truck } from '@/lib/icons';
import { useCart } from '@/hooks/useCart';
import ProductCard, { Product } from '@/components/ProductCard';

export default function CartPage() {
  const { items, update, remove } = useCart();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= 35 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    fetch('/api/me/recommendations').then((response) => response.json()).then((data) => setRecommendations((data.items || []).slice(0, 4))).catch(() => {});
  }, []);

  if (!items.length) return <div className="shell py-24 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#d7f36b] text-[#405719]"><ShoppingCart className="h-7 w-7" /></div><p className="eyebrow mt-6">Your bag</p><h1 className="page-title mt-3">Ready for something good?</h1><p className="muted mx-auto mt-3 max-w-md">Your saved-for-later moment starts with one great find. Browse the edit and we&apos;ll keep your bag ready.</p><Link href="/search" className="btn btn-primary mt-7">Start shopping <ArrowRight className="h-4 w-4" /></Link>{recommendations.length > 0 && <div className="mt-20 text-left"><div className="mb-5"><p className="eyebrow">For your next scroll</p><h2 className="page-title mt-2">You might like these</h2></div><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{recommendations.map((item) => <ProductCard key={item._id} product={item} />)}</div></div>}</div>;

  async function changeQty(id: string, qty: number) {
    const ok = await update(id, qty);
    if (!ok) toast.error('Could not update your bag');
  }

  async function removeItem(id: string) {
    const ok = await remove(id);
    if (ok) toast.success('Removed from your bag');
  }

  return (
    <div className="shell py-10 md:py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Your bag / {items.length} item{items.length === 1 ? '' : 's'}</p><h1 className="page-title mt-2">Ready when you are.</h1></div><Link href="/search" className="amazon-link text-sm">Keep browsing →</Link></div>
      <div className="grid gap-6 lg:grid-cols-[1fr_370px]">
        <div className="space-y-3">{items.map((item) => <div key={String(item.productId)} className="surface flex gap-4 p-4 sm:p-5"><img src={item.image || '/placeholder-product.svg'} alt={item.title} className="h-24 w-24 shrink-0 rounded-xl bg-[#edf1e9] object-contain sm:h-32 sm:w-32" /><div className="min-w-0 flex-1"><div className="flex justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-[#8b998d]">{item.isPrime ? 'Halozon Plus' : 'Marketplace pick'}</p><h2 className="mt-1 line-clamp-2 font-black">{item.title}</h2></div><button onClick={() => removeItem(String(item.productId))} aria-label={`Remove ${item.title}`}><Trash2 className="h-5 w-5 text-[#8b998d] transition hover:text-[#ff765c]" /></button></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center rounded-lg border border-[#cbd6ca]"><button className="p-2" onClick={() => changeQty(String(item.productId), Math.max(1, item.qty - 1))} aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button><b className="w-8 text-center text-sm">{item.qty}</b><button className="p-2" onClick={() => changeQty(String(item.productId), item.qty + 1)} aria-label="Increase quantity"><Plus className="h-4 w-4" /></button></div><b className="text-xl">${(item.price * item.qty).toFixed(2)}</b></div><p className="mt-3 flex items-center gap-2 text-xs font-bold text-[#6d8735]"><Truck className="h-3.5 w-3.5" /> Free delivery on this item</p></div></div>)}</div>
        <aside className="surface h-fit p-6 lg:sticky lg:top-32"><p className="eyebrow">Order summary</p><div className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><span>Items</span><b>${subtotal.toFixed(2)}</b></div><div className="flex justify-between text-[#526259]"><span>Shipping</span><span>{shipping ? `$${shipping.toFixed(2)}` : 'Free'}</span></div><div className="flex justify-between text-[#526259]"><span>Estimated tax</span><span>${tax.toFixed(2)}</span></div></div><div className="my-5 border-t border-[#dfe5dc] pt-5"><div className="flex justify-between text-xl"><b>Total</b><b>${total.toFixed(2)}</b></div><p className="muted mt-2 text-xs">Taxes and final delivery details are confirmed at checkout.</p></div><Link href="/checkout" className="btn btn-primary w-full">Continue to checkout <ArrowRight className="h-4 w-4" /></Link><div className="mt-5 space-y-3 border-t border-[#dfe5dc] pt-5 text-xs font-bold text-[#526259]"><p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#728749]" /> Buyer protection included</p><p className="flex items-center gap-2"><Check className="h-4 w-4 text-[#728749]" /> Free delivery over $35</p></div></aside>
      </div>
      {recommendations.length > 0 && <section className="mt-16"><div className="mb-5"><p className="eyebrow">Keep exploring</p><h2 className="page-title mt-2">You may also like</h2></div><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{recommendations.map((item) => <ProductCard key={item._id} product={item} />)}</div></section>}
    </div>
  );
}
