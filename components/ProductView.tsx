'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { Heart, Minus, Plus, ShieldCheck, ShoppingCart, Star, Truck } from '@/lib/icons';
import toast from 'react-hot-toast';
import Link from 'next/link';
import type { Product } from './ProductCard';
import ProductExtras from './ProductExtras';
import { RecoveryState } from './RecoveryState';

export default function ProductView({ product }: { product: Product & { description?: string; features?: string[]; colors?: string[]; sizes?: string[]; sellerName?: string } }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const saved = has(product._id);
  const unavailable = product.stock !== undefined && product.stock <= 0;

  async function addItem() {
    if (unavailable || busy) return;
    setBusy(true);
    setError('');
    const ok = await add(product._id, qty);
    setBusy(false);
    if (ok) toast.success('Added to cart');
    else setError('We could not update your cart. Your quantity is still selected; try again or sign in.');
  }

  async function saveProduct() {
    const ok = await toggle(product._id);
    if (!ok) toast.error('We could not update your saved items.');
  }

  return (
    <div className="shell py-12">
      <div className="muted mb-7 text-sm"><Link href="/" className="amazon-link">Home</Link> <span className="mx-1">/</span> {product.title}</div>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="surface p-5">
          <div className="flex aspect-square items-center justify-center rounded-2xl bg-[#e3f1ed]"><img src={product.images?.[0] || '/placeholder-product.svg'} alt={product.title} className="max-h-full max-w-full object-contain" /></div>
          <div className="mt-3 grid grid-cols-4 gap-2">{(product.images || []).slice(0, 4).map((src: string) => <div key={src} className="aspect-square rounded-lg border border-[#dce4e5] bg-white p-1"><img src={src} alt="" className="h-full w-full object-contain" /></div>)}</div>
        </div>
        <div>
          <p className="eyebrow">{product.brand || 'Halozon selection'}</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">{product.title}</h1>
          <div className="mt-4 flex items-center gap-2 text-amber-600"><Star className="h-4 w-4 fill-current" />{product.rating?.toFixed(1) || '4.5'} <span className="text-sm text-slate-500">({product.ratingCount || 0} reviews)</span></div>
          <div className="mt-6 flex items-baseline gap-3"><b className="text-4xl">${product.price.toFixed(2)}</b>{product.listPrice && product.listPrice > product.price && <del className="muted">${product.listPrice.toFixed(2)}</del>}</div>
          <p className="muted mt-5 leading-relaxed">{product.description || 'A thoughtfully selected product from a trusted Halozon seller.'}</p>
          {product.features?.length ? <ul className="mt-5 space-y-2 text-sm">{product.features.map((feature) => <li key={feature} className="flex gap-2"><span className="font-black text-[#0f766e]">✓</span>{feature}</li>)}</ul> : null}
          {unavailable && <div className="mt-6"><RecoveryState title="This product is currently unavailable" description="It may be temporarily out of stock. Ask for a restock alert below or explore similar finds." href="/search" hrefLabel="Find alternatives" compact /></div>}
          {error && <div className="mt-6"><RecoveryState title="Cart update paused" description={error} onRetry={addItem} retryLabel="Try adding again" href="/signin" hrefLabel="Sign in" compact /></div>}
          <div className="mt-8 flex gap-3">
            <div className="flex items-center rounded-xl border border-[#c8d5d7]"><button disabled={unavailable} className="p-3 disabled:opacity-40" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button><span className="w-8 text-center font-bold">{qty}</span><button disabled={unavailable} className="p-3 disabled:opacity-40" onClick={() => setQty(qty + 1)} aria-label="Increase quantity"><Plus className="h-4 w-4" /></button></div>
            <button onClick={addItem} disabled={unavailable || busy} className="btn btn-primary flex-1"><ShoppingCart className="h-5 w-5" />{busy ? 'Adding…' : unavailable ? 'Unavailable' : 'Add to cart'}</button>
            <button onClick={saveProduct} className={`btn btn-soft ${saved ? 'text-[#bd4532]' : ''}`} aria-label={saved ? 'Remove from wishlist' : 'Save product'}><Heart className={saved ? 'fill-current' : ''} /></button>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-3">{[[Truck, 'Fast delivery'], [ShieldCheck, 'Buyer protected'], [Heart, 'Easy returns']].map(([Icon, label]) => { const Component = Icon as any; return <div key={label as string} className="surface p-3 text-center"><Component className="mx-auto h-5 w-5 text-[#0f766e]" /><small className="mt-2 block">{label as string}</small></div>; })}</div>
        </div>
      </div>
      <ProductExtras productId={product._id} />
    </div>
  );
}
