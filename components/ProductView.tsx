'use client';

import Link from 'next/link';
import {useState} from 'react';
import {Heart, Minus, Plus, ShieldCheck, ShoppingCart, Star, Truck} from '@/lib/icons';
import {useCart} from '@/hooks/useCart';
import toast from 'react-hot-toast';
import type {Product} from './ProductCard';
import ProductExtras from './ProductExtras';

type ProductDetails = Product & {
  description?: string;
  features?: string[];
  colors?: string[];
  sizes?: string[];
  sellerName?: string;
};

const assurances = [
  {Icon: Truck, label: 'Fast delivery'},
  {Icon: ShieldCheck, label: 'Buyer protected'},
  {Icon: Heart, label: 'Easy returns'},
];

export default function ProductView({product}: {product: ProductDetails}) {
  const {add} = useCart();
  const [qty, setQty] = useState(1);
  const [saved, setSaved] = useState(false);

  async function addItem() {
    const ok = await add(product._id, qty);
    toast[ok ? 'success' : 'error'](ok ? 'Added to cart' : 'Sign in to add items');
  }

  return (
    <div className="shell py-12">
      <nav className="mb-7 text-sm muted" aria-label="Breadcrumb">
        <Link href="/" className="amazon-link">Home</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{product.title}</span>
      </nav>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="surface p-5">
          <div className="flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-cyan-50">
            <img src={product.images?.[0] || '/placeholder-product.svg'} alt={product.title} className="max-h-full max-w-full object-contain" />
          </div>
          {product.images?.length ? (
            <div className="mt-3 grid grid-cols-4 gap-2" aria-label="Product images">
              {product.images.slice(0, 4).map((src, index) => (
                <div key={src} className="aspect-square rounded-lg border border-slate-200 p-1">
                  <img src={src} alt={`${product.title}, view ${index + 1}`} className="h-full w-full object-contain" />
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <div>
          <p className="eyebrow">{product.brand || 'Halozon selection'}</p>
          <h1 className="mt-3 text-4xl font-black">{product.title}</h1>
          <div className="mt-4 flex items-center gap-2 text-amber-700">
            <Star className="h-4 w-4 fill-current" aria-hidden="true" />
            <span>{product.rating?.toFixed(1) || '4.5'}</span>
            <span className="text-sm text-slate-600">({product.ratingCount || 0} reviews)</span>
          </div>
          <div className="mt-6 flex items-baseline gap-3">
            <b className="text-4xl">${product.price.toFixed(2)}</b>
            {product.listPrice && product.listPrice > product.price && <del className="muted">${product.listPrice.toFixed(2)}</del>}
          </div>
          <p className="mt-5 leading-relaxed muted">{product.description || 'A thoughtfully selected product from a trusted Halozon seller.'}</p>
          {product.features?.length ? <ul className="mt-5 space-y-2 text-sm" aria-label="Product features">{product.features.map((feature) => <li key={feature}><span className="mr-2 text-emerald-700" aria-hidden="true">✓</span>{feature}</li>)}</ul> : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <fieldset className="flex items-center rounded-xl border border-slate-300">
              <legend className="sr-only">Quantity</legend>
              <button type="button" className="flex min-h-11 min-w-11 items-center justify-center rounded-l-xl p-3 hover:bg-slate-100" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity" disabled={qty === 1}>
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>
              <output className="w-10 text-center font-bold" aria-label={`Quantity ${qty}`} aria-live="polite">{qty}</output>
              <button type="button" className="flex min-h-11 min-w-11 items-center justify-center rounded-r-xl p-3 hover:bg-slate-100" onClick={() => setQty(qty + 1)} aria-label="Increase quantity">
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </fieldset>
            <button type="button" onClick={addItem} className="btn btn-primary min-w-40 flex-1"><ShoppingCart className="h-5 w-5" aria-hidden="true" /> Add to cart</button>
            <button type="button" onClick={() => setSaved((value) => !value)} className={`btn btn-soft ${saved ? 'text-rose-700' : ''}`} aria-label={saved ? 'Remove product from wishlist' : 'Save product to wishlist'} aria-pressed={saved}>
              <Heart className={saved ? 'fill-current' : ''} aria-hidden="true" />
            </button>
          </div>
          <ul className="mt-8 grid grid-cols-3 gap-3" aria-label="Purchase assurances">
            {assurances.map(({Icon, label}) => <li key={label} className="surface p-3 text-center"><Icon className="mx-auto h-5 w-5 text-indigo-700" aria-hidden="true" /><small className="mt-2 block">{label}</small></li>)}
          </ul>
        </div>
      </div>
      <ProductExtras productId={product._id} />
    </div>
  );
}
