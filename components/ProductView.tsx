'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useCompare } from '@/hooks/useCompare';
import { ArrowRightLeft, Heart, ShoppingCart, ShieldCheck, Truck, Plus, Minus, Star } from '@/lib/icons';
import toast from 'react-hot-toast';
import Link from 'next/link';
import type { Product } from './ProductCard';
import ProductExtras from './ProductExtras';

type ProductDetails = Product & {
  description?: string;
  features?: string[];
  colors?: string[];
  sizes?: string[];
  sellerName?: string;
};

export default function ProductView({ product }: { product: ProductDetails }) {
  const { add } = useCart();
  const { has: isCompared, toggle: toggleCompare } = useCompare();
  const [qty, setQty] = useState(1);
  const [saved, setSaved] = useState(false);
  const compared = isCompared(product._id);

  async function addItem() {
    const ok = await add(product._id, qty);
    toast[ok ? 'success' : 'error'](ok ? 'Added to cart' : 'Sign in to add items');
  }

  return (
    <div className="shell py-10 md:py-14">
      <div className="mb-7 text-sm muted"><Link href="/" className="amazon-link">Home</Link> <span className="mx-2">/</span> {product.title}</div>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="surface p-5">
          <div className="flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-fuchsia-50">
            <img src={product.images?.[0] || '/placeholder-product.svg'} alt={product.title} className="max-h-full max-w-full object-contain" />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {(product.images || []).slice(0, 4).map((src: string) => <div key={src} className="aspect-square rounded-lg border border-slate-200 p-1"><img src={src} alt="" className="h-full w-full object-contain" /></div>)}
          </div>
        </div>
        <div>
          <p className="eyebrow">{product.brand || 'Halozon selection'}</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">{product.title}</h1>
          <div className="mt-4 flex items-center gap-2 text-amber-500"><Star className="h-4 w-4 fill-current" />{product.rating?.toFixed(1) || '4.5'} <span className="text-sm text-slate-500">({product.ratingCount || 0} reviews)</span></div>
          <div className="mt-6 flex items-baseline gap-3"><b className="text-4xl">${product.price.toFixed(2)}</b>{product.listPrice && product.listPrice > product.price && <del className="muted">${product.listPrice.toFixed(2)}</del>}</div>
          <p className="muted mt-5 leading-relaxed">{product.description || 'A thoughtfully selected product from a trusted Halozon seller.'}</p>
          {product.features?.length ? <ul className="mt-5 space-y-2 text-sm">{product.features.map((feature) => <li key={feature} className="flex gap-2"><span className="text-emerald-600">✓</span>{feature}</li>)}</ul> : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <div className="flex items-center rounded-xl border border-slate-300"><button className="p-3" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button><span className="w-8 text-center font-bold">{qty}</span><button className="p-3" onClick={() => setQty(qty + 1)} aria-label="Increase quantity"><Plus className="h-4 w-4" /></button></div>
            <button onClick={addItem} className="btn btn-primary flex-1"><ShoppingCart className="h-5 w-5" />Add to cart</button>
            <button onClick={() => setSaved((value) => !value)} className={`btn btn-soft ${saved ? 'text-rose-600' : ''}`} aria-label={saved ? 'Remove from wishlist' : 'Save product'}><Heart className={saved ? 'fill-current' : ''} /></button>
            <button onClick={() => toggleCompare(product._id)} className={`btn btn-soft ${compared ? 'text-fuchsia-700' : ''}`}><ArrowRightLeft className="h-4 w-4" />{compared ? 'Compared' : 'Compare'}</button>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[[Truck, 'Fast delivery'], [ShieldCheck, 'Buyer protected'], [Heart, 'Easy returns']].map(([Icon, label]) => { const Component = Icon as any; return <div key={label as string} className="surface p-3 text-center"><Component className="mx-auto h-5 w-5 text-indigo-600" /><small className="mt-2 block">{label as string}</small></div>; })}
          </div>
          <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900"><b>{product.stock && product.stock < 10 ? `Only ${product.stock} left` : 'In stock'}</b><span className="mx-2">·</span>{product.sellerName || product.seller || 'Trusted Halozon seller'}<span className="mx-2">·</span>Free shipping on eligible orders</div>
        </div>
      </div>
      <ProductExtras productId={product._id} />
    </div>
  );
}
