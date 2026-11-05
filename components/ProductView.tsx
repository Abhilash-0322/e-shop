'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { Heart, ShoppingCart, ShieldCheck, Truck, Plus, Minus, Star, Sparkles } from '@/lib/icons';
import toast from 'react-hot-toast';
import Link from 'next/link';
import type { Product } from './ProductCard';
import ProductExtras from './ProductExtras';

type DetailProduct = Product & {
  description?: string;
  features?: string[];
  colors?: string[];
  sizes?: string[];
  sellerName?: string;
};

export default function ProductView({ product }: { product: DetailProduct }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [saved, setSaved] = useState(false);
  const discount = product.listPrice && product.listPrice > product.price ? product.listPrice - product.price : 0;

  async function addItem() {
    const ok = await add(product._id, qty);
    toast[ok ? 'success' : 'error'](ok ? 'Added to cart' : 'Sign in to add items');
  }

  const guarantees: [typeof Truck, string][] = [
    [Truck, 'Fast delivery'],
    [ShieldCheck, 'Buyer protected'],
    [Heart, 'Easy returns'],
  ];

  return (
    <div className="shell py-12">
      <div className="mb-7 text-sm muted">
        <Link href="/" className="amazon-link">Home</Link> / {product.title}
      </div>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="surface p-5">
          <div className="flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-fuchsia-50">
            <img src={product.images?.[0] || '/placeholder-product.svg'} alt={product.title} className="max-h-full max-w-full object-contain" />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {(product.images || []).slice(0, 4).map((src: string) => (
              <div key={src} className="aspect-square rounded-lg border border-slate-200 p-1">
                <img src={src} alt="" className="h-full w-full object-contain" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow">{product.brand || 'Halozon selection'}</p>
          <h1 className="mt-3 text-4xl font-black">{product.title}</h1>
          <div className="mt-4 flex items-center gap-2 text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            {product.rating?.toFixed(1) || '4.5'}
            <span className="text-sm text-slate-500">({product.ratingCount || 0} reviews)</span>
          </div>
          <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
            <div className="flex items-baseline gap-3">
              <b className="text-4xl">${product.price.toFixed(2)}</b>
              {product.listPrice && product.listPrice > product.price && <del className="muted">${product.listPrice.toFixed(2)}</del>}
            </div>
            {discount > 0 && <div className="savings-line mt-2"><span>You save</span><strong>${discount.toFixed(2)}</strong></div>}
            <div className="mt-3 flex items-center gap-2 text-xs font-bold text-indigo-700">
              <Sparkles className="h-4 w-4" /> Earn {Math.max(5, Math.round(product.price))} points on this purchase
            </div>
          </div>
          <div className="mt-4"><span className="delivery-badge"><Truck className="h-3 w-3" /> Free Plus delivery · estimated tomorrow</span></div>
          <p className="muted mt-5 leading-relaxed">{product.description || 'A thoughtfully selected product from a trusted Halozon seller.'}</p>
          {product.features?.length && <ul className="mt-5 space-y-2 text-sm">{product.features.map((feature) => <li key={feature}>✓ {feature}</li>)}</ul>}
          <div className="mt-8 flex gap-3">
            <div className="flex items-center rounded-xl border border-slate-300">
              <button className="p-3" onClick={() => setQty(Math.max(1, qty - 1))}><Minus className="h-4 w-4" /></button>
              <span className="w-8 text-center font-bold">{qty}</span>
              <button className="p-3" onClick={() => setQty(qty + 1)}><Plus className="h-4 w-4" /></button>
            </div>
            <button onClick={addItem} className="btn btn-primary flex-1"><ShoppingCart className="h-5 w-5" />Add to cart</button>
            <button onClick={() => setSaved((value) => !value)} className={`btn btn-soft ${saved ? 'text-rose-600' : ''}`}><Heart className={saved ? 'fill-current' : ''} /></button>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {guarantees.map(([Icon, label]) => <div key={label} className="surface p-3 text-center"><Icon className="mx-auto h-5 w-5 text-indigo-600" /><small className="mt-2 block">{label}</small></div>)}
          </div>
        </div>
      </div>
      <ProductExtras productId={product._id} />
    </div>
  );
}
