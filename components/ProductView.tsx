'use client';

import {useState} from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {useCart} from '@/hooks/useCart';
import {useWishlist} from '@/hooks/useWishlist';
import {Heart, Minus, Plus, ShieldCheck, ShoppingCart, Star, Truck} from '@/lib/icons';
import type {Product} from './ProductCard';
import ProductExtras from './ProductExtras';

type ProductDetail = Product & {
  description?: string;
  features?: string[];
  colors?: string[];
  sizes?: string[];
  sellerName?: string;
};

export default function ProductView({product}: {product: ProductDetail}) {
  const {add} = useCart();
  const wishlist = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const saved = wishlist.has(product._id);

  async function addItem() {
    const ok = await add(product._id, quantity);
    toast[ok ? 'success' : 'error'](ok ? 'Added to cart' : 'Sign in to add items');
  }

  return (
    <div className="shell py-10 md:py-14">
      <div className="mb-7 flex items-center gap-2 text-sm text-slate-500">
        <Link href="/" className="amazon-link">Home</Link><span>/</span><span className="truncate">{product.title}</span>
      </div>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)]">
        <div className="surface p-4 md:p-5">
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-50 via-white to-emerald-50">
            <img src={product.images?.[0] || '/placeholder-product.svg'} alt={product.title} className="max-h-full max-w-full object-contain" />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {(product.images || []).slice(0, 4).map((src: string, index: number) => (
              <div key={`${src}-${index}`} className="aspect-square rounded-xl border border-slate-200 bg-white p-1.5">
                <img src={src} alt="" className="h-full w-full object-contain" />
              </div>
            ))}
          </div>
        </div>
        <div className="lg:pt-2">
          <p className="eyebrow">{product.brand || 'Halozon selection'}</p>
          <h1 className="mt-3 text-3xl font-black tracking-[-.04em] md:text-5xl">{product.title}</h1>
          <div className="mt-4 flex items-center gap-2 text-amber-500">
            <Star className="h-4 w-4 fill-current" /> {product.rating?.toFixed(1) || '4.5'}
            <span className="text-sm text-slate-500">({product.ratingCount || 0} reviews)</span>
          </div>
          <div className="mt-7 flex items-baseline gap-3">
            <b className="text-4xl tracking-[-.05em]">${product.price.toFixed(2)}</b>
            {product.listPrice && product.listPrice > product.price && <del className="muted">${product.listPrice.toFixed(2)}</del>}
          </div>
          <p className="muted mt-5 leading-relaxed">{product.description || 'A thoughtfully selected product from a trusted Halozon seller.'}</p>
          {product.sellerName && <p className="mt-4 text-sm text-slate-500">Sold by <b className="text-slate-900">{product.sellerName}</b></p>}
          {product.features?.length ? (
            <ul className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
              {product.features.map(feature => <li key={feature} className="flex gap-2"><span className="text-emerald-600">✓</span>{feature}</li>)}
            </ul>
          ) : null}
          <div className="mt-8 flex gap-3">
            <div className="flex items-center rounded-xl border border-slate-300 bg-white">
              <button type="button" className="p-3" onClick={() => setQuantity(value => Math.max(1, value - 1))} aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button>
              <span className="w-8 text-center text-sm font-bold">{quantity}</span>
              <button type="button" className="p-3" onClick={() => setQuantity(value => value + 1)} aria-label="Increase quantity"><Plus className="h-4 w-4" /></button>
            </div>
            <button type="button" onClick={addItem} className="btn btn-primary flex-1"><ShoppingCart className="h-5 w-5" /> Add to cart</button>
            <button type="button" onClick={() => wishlist.toggle(product._id)} className={`btn btn-soft ${saved ? 'text-rose-600' : ''}`} aria-label={saved ? 'Remove from wishlist' : 'Save product'}>
              <Heart className={saved ? 'fill-current' : ''} />
            </button>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-2">
            {[[Truck, 'Fast delivery'], [ShieldCheck, 'Buyer protected'], [Heart, 'Easy returns']].map(([Icon, label]) => {
              const Glyph = Icon as typeof Truck;
              return <div key={label as string} className="surface p-3 text-center"><Glyph className="mx-auto h-5 w-5 text-brand-600" /><small className="mt-2 block text-xs">{label as string}</small></div>;
            })}
          </div>
        </div>
      </div>
      <ProductExtras productId={product._id} />
    </div>
  );
}
