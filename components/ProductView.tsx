'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useCart } from '@/hooks/useCart';
import { Heart, Minus, Plus, ShieldCheck, ShoppingCart, Star, Truck } from '@/lib/icons';
import type { Product } from './ProductCard';
import ProductExtras from './ProductExtras';

type DetailProduct = Product & { description?: string; features?: string[]; colors?: string[]; sizes?: string[]; sellerName?: string };

export default function ProductView({ product }: { product: DetailProduct }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [saved, setSaved] = useState(false);

  async function addItem() {
    const ok = await add(product._id, qty);
    toast[ok ? 'success' : 'error'](ok ? 'Added to cart' : 'Sign in to add items');
  }

  const benefits = [[Truck, 'Fast delivery'], [ShieldCheck, 'Buyer protected'], [Heart, 'Easy returns']] as const;
  return <div className="shell py-6 sm:py-10">
    <div className="mb-5 text-sm muted"><Link href="/" className="amazon-link">Home</Link><span className="mx-2">/</span><span className="line-clamp-2">{product.title}</span></div>
    <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="surface p-3 sm:p-5">
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 to-fuchsia-50"><img src={product.images?.[0] || '/placeholder-product.svg'} alt={product.title} className="max-h-full max-w-full object-contain" /></div>
        <div className="rail mt-3 gap-2">{(product.images || []).slice(0, 4).map((src: string, index: number) => <div key={src} className={`aspect-square min-w-20 rounded-xl border p-1 ${index === 0 ? 'border-violet-500 ring-2 ring-violet-100' : 'border-slate-200'}`}><img src={src} alt={`${product.title} view ${index + 1}`} className="h-full w-full object-contain" /></div>)}</div>
      </div>
      <div>
        <p className="eyebrow">{product.brand || 'Halozon selection'}</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:mt-3 sm:text-4xl">{product.title}</h1>
        <div className="mt-3 flex items-center gap-2 text-amber-500"><Star className="h-4 w-4 fill-current" />{product.rating?.toFixed(1) || '4.5'} <span className="text-sm text-slate-500">({product.ratingCount || 0} reviews)</span></div>
        <div className="mt-5 flex items-baseline gap-3 sm:mt-6"><b className="text-3xl sm:text-4xl">${product.price.toFixed(2)}</b>{product.listPrice && product.listPrice > product.price && <del className="muted">${product.listPrice.toFixed(2)}</del>}</div>
        <p className="mt-4 leading-relaxed muted">{product.description || 'A thoughtfully selected product from a trusted Halozon seller.'}</p>
        {product.features?.length ? <ul className="mt-5 space-y-2 text-sm">{product.features.map((feature) => <li key={feature} className="flex gap-2"><span className="font-black text-emerald-600">✓</span>{feature}</li>)}</ul> : null}
        <div className="mt-7 flex gap-2 sm:gap-3">
          <div className="flex items-center rounded-xl border border-slate-300"><button className="tap-target" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button><span className="w-7 text-center font-black" aria-live="polite">{qty}</span><button className="tap-target" onClick={() => setQty(qty + 1)} aria-label="Increase quantity"><Plus className="h-4 w-4" /></button></div>
          <button onClick={addItem} className="btn btn-primary min-h-12 flex-1"><ShoppingCart className="h-5 w-5" /> <span>Add to cart</span></button>
          <button onClick={() => setSaved((value) => !value)} className={`btn btn-soft min-h-12 min-w-12 px-3 ${saved ? 'text-rose-600' : ''}`} aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'} aria-pressed={saved}><Heart className={saved ? 'fill-current' : ''} /></button>
        </div>
        <div className="mt-7 grid grid-cols-3 gap-2 sm:gap-3">{benefits.map(([Icon, label]) => <div key={label} className="surface p-3 text-center"><Icon className="mx-auto h-5 w-5 text-violet-600" /><small className="mt-2 block text-[11px] sm:text-xs">{label}</small></div>)}</div>
      </div>
    </div>
    <ProductExtras productId={product._id} />
    <div className="fixed inset-x-3 bottom-[5.4rem] z-40 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-2xl backdrop-blur md:hidden"><span className="px-2 text-lg font-black">${product.price.toFixed(2)}</span><button onClick={addItem} className="btn btn-primary min-h-11 flex-1">Add to cart</button></div>
  </div>;
}
