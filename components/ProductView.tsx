'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, Minus, Plus, ShieldCheck, ShoppingCart, Star, Truck } from '@/lib/icons';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';
import type { Product } from './ProductCard';
import ProductExtras from './ProductExtras';

export default function ProductView({ product }: { product: Product & { description?: string; features?: string[]; colors?: string[]; sizes?: string[]; sellerName?: string } }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [saved, setSaved] = useState(false);
  async function addItem() {
    const ok = await add(product._id, qty);
    toast[ok ? 'success' : 'error'](ok ? 'Added to cart' : 'Sign in to add items');
  }
  return (
    <div className="shell py-8 md:py-10">
      <Link href="/" className="mb-6 inline-flex items-center gap-1 text-xs font-bold text-slate-500"><ArrowLeft className="h-3.5 w-3.5" /> Back to workspace</Link>
      <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
        <div className="surface p-4 md:p-5"><div className="flex aspect-square items-center justify-center rounded-lg bg-gradient-to-br from-indigo-50 to-fuchsia-50"><img src={product.images?.[0] || '/placeholder-product.svg'} alt={product.title} className="max-h-full max-w-full object-contain" /></div><div className="mt-3 grid grid-cols-4 gap-2">{(product.images || []).slice(0, 4).map((src: string) => <div key={src} className="aspect-square rounded-md border border-slate-200 p-1"><img src={src} alt="" className="h-full w-full object-contain" /></div>)}</div></div>
        <div><p className="eyebrow">{product.brand || 'Halozon selection'}</p><h1 className="mt-3 text-3xl font-black tracking-[-.045em] md:text-4xl">{product.title}</h1><div className="mt-4 flex items-center gap-2 text-sm text-amber-500"><Star className="h-4 w-4 fill-current" />{product.rating?.toFixed(1) || '4.5'} <span className="text-xs text-slate-500">({product.ratingCount || 0} reviews)</span></div><div className="mt-6 flex items-baseline gap-3"><b className="text-4xl tracking-[-.05em]">${product.price.toFixed(2)}</b>{product.listPrice && product.listPrice > product.price && <del className="text-sm text-slate-400">${product.listPrice.toFixed(2)}</del>}</div><p className="muted mt-5 max-w-xl text-sm leading-relaxed">{product.description || 'A thoughtfully selected product from a trusted Halozon seller.'}</p>{product.features?.length ? <ul className="mt-5 space-y-2 text-sm">{product.features.map((feature) => <li key={feature} className="flex gap-2"><span className="text-emerald-600">✓</span>{feature}</li>)}</ul> : null}<div className="mt-8 flex gap-2"><div className="flex items-center rounded-lg border border-slate-300"><button type="button" className="p-3" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button><span className="w-8 text-center text-sm font-bold">{qty}</span><button type="button" className="p-3" onClick={() => setQty(qty + 1)} aria-label="Increase quantity"><Plus className="h-4 w-4" /></button></div><button type="button" onClick={addItem} className="btn btn-primary flex-1"><ShoppingCart className="h-4 w-4" /> Add to cart</button><button type="button" onClick={() => setSaved((value) => !value)} className={`btn btn-soft ${saved ? 'text-rose-600' : ''}`} aria-label="Save product"><Heart className={saved ? 'fill-current' : ''} /></button></div><div className="mt-8 grid grid-cols-3 gap-2">{[[Truck, 'Fast delivery'], [ShieldCheck, 'Buyer protected'], [Heart, 'Easy returns']].map(([Icon, label]) => { const Component = Icon as any; return <div key={label as string} className="surface p-3 text-center"><Component className="mx-auto h-5 w-5 text-indigo-600" /><small className="mt-2 block text-[10px] font-bold text-slate-500">{label as string}</small></div>; })}</div></div>
      </div>
      <ProductExtras productId={product._id} />
    </div>
  );
}
