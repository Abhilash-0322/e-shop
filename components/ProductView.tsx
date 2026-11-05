'use client';
import {useState} from 'react';
import {useCart} from '@/hooks/useCart';
import {Heart, ShoppingCart, ShieldCheck, Truck, Plus, Minus, Star} from '@/lib/icons';
import toast from 'react-hot-toast';
import Link from 'next/link';
import type {Product} from './ProductCard';
import ProductExtras from './ProductExtras';
import {useLocale} from './LocaleProvider';

export default function ProductView({product}: {product: Product & {description?: string; features?: string[]; colors?: string[]; sizes?: string[]; sellerName?: string}}) {
  const {add} = useCart();
  const {formatMoney, formatNumber} = useLocale();
  const [qty, setQty] = useState(1);
  const [saved, setSaved] = useState(false);
  const sourceCurrency = (product.currency as 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY' | 'CAD') || 'USD';

  async function addItem() {
    const ok = await add(product._id, qty);
    toast[ok ? 'success' : 'error'](ok ? 'Added to cart' : 'Sign in to add items');
  }

  return <div className="shell py-8 md:py-12">
    <div className="mb-7 text-sm muted"><Link href="/" className="amazon-link">Home</Link> <span aria-hidden="true">/</span> <span className="text-wrap">{product.title}</span></div>
    <div className="grid min-w-0 gap-8 lg:grid-cols-2 lg:gap-10">
      <div className="surface p-4 sm:p-5">
        <div className="flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-fuchsia-50"><img src={product.images?.[0] || '/placeholder-product.svg'} alt={product.title} className="max-h-full max-w-full object-contain"/></div>
        <div className="mt-3 grid grid-cols-4 gap-2">{(product.images || []).slice(0, 4).map((src: string) => <div key={src} className="aspect-square rounded-lg border border-slate-200 p-1"><img src={src} alt="" className="h-full w-full object-contain"/></div>)}</div>
      </div>
      <div className="min-w-0">
        <p className="eyebrow">{product.brand || 'Halozon selection'}</p>
        <h1 className="mt-3 text-3xl font-black text-wrap sm:text-4xl">{product.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-amber-500"><Star className="h-4 w-4 fill-current" aria-hidden="true"/>{product.rating?.toFixed(1) || '4.5'} <span className="text-sm text-slate-500">({formatNumber(product.ratingCount || 0)} reviews)</span></div>
        <div className="mt-6 flex flex-wrap items-baseline gap-3"><b className="text-3xl sm:text-4xl">{formatMoney(product.price, sourceCurrency)}</b>{product.listPrice && product.listPrice > product.price && <del className="muted">{formatMoney(product.listPrice, sourceCurrency)}</del>}</div>
        <p className="mt-5 leading-relaxed muted text-wrap">{product.description || 'A thoughtfully selected product from a trusted Halozon seller.'}</p>
        {!!product.features?.length && <ul className="mt-5 space-y-2 text-sm">{product.features.map((feature) => <li className="flex gap-2 text-wrap" key={feature}><span className="text-emerald-600" aria-hidden="true">✓</span>{feature}</li>)}</ul>}
        <div className="mt-8 flex flex-wrap gap-3">
          <div className="flex items-center rounded-xl border border-slate-300"><button className="p-3" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity"><Minus className="h-4 w-4" aria-hidden="true"/></button><span className="w-8 text-center font-bold" aria-live="polite">{qty}</span><button className="p-3" onClick={() => setQty(qty + 1)} aria-label="Increase quantity"><Plus className="h-4 w-4" aria-hidden="true"/></button></div>
          <button onClick={addItem} className="btn btn-primary min-w-[10rem] flex-1"><ShoppingCart className="h-5 w-5" aria-hidden="true"/>Add to cart</button>
          <button onClick={() => setSaved((value) => !value)} className={`btn btn-soft ${saved ? 'text-rose-600' : ''}`} aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}><Heart className={saved ? 'fill-current' : ''} aria-hidden="true"/></button>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-3 min-[420px]:grid-cols-3">{[[Truck, 'Fast delivery'], [ShieldCheck, 'Buyer protected'], [Heart, 'Easy returns']].map(([Icon, label]) => {const FeatureIcon = Icon as typeof Truck; return <div key={label as string} className="surface p-3 text-center"><FeatureIcon className="mx-auto h-5 w-5 text-indigo-600" aria-hidden="true"/><small className="mt-2 block text-wrap">{label as string}</small></div>})}</div>
      </div>
    </div>
    <ProductExtras productId={product._id}/>
  </div>;
}
