'use client';

import {useState} from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {useCart} from '@/hooks/useCart';
import {useWishlist} from '@/hooks/useWishlist';
import {Heart, Minus, Plus, ShieldCheck, ShoppingCart, Star, Truck} from '@/lib/icons';
import type {Product} from './ProductCard';
import ProductExtras from './ProductExtras';

type DetailProduct = Product & {
  description?: string;
  features?: string[];
  colors?: string[];
  sizes?: string[];
  sellerName?: string;
};

export default function ProductView({product}: {product: DetailProduct}) {
  const {add} = useCart();
  const {has, toggle} = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const saved = has(product._id);
  const images = product.images?.length ? product.images : ['/placeholder-product.svg'];

  async function addItem() {
    const ok = await add(product._id, quantity);
    toast[ok ? 'success' : 'error'](ok ? 'Added to cart' : 'Sign in to add items');
  }

  return (
    <div className="shell py-12">
      <div className="muted mb-7 text-sm">
        <Link href="/" className="amazon-link">Home</Link> / {product.title}
      </div>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="surface p-5">
          <div className="flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-fuchsia-50">
            <img
              src={images[0]}
              alt={product.title}
              className="max-h-full max-w-full object-contain"
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {images.slice(0, 4).map((src, index) => (
              <div key={`${src}-${index}`} className="aspect-square rounded-lg border border-slate-200 p-1">
                <img src={src} alt="" className="h-full w-full object-contain" loading="lazy" decoding="async" />
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
          <div className="mt-6 flex items-baseline gap-3">
            <b className="text-4xl">${product.price.toFixed(2)}</b>
            {product.listPrice && product.listPrice > product.price && <del className="muted">${product.listPrice.toFixed(2)}</del>}
          </div>
          <p className="muted mt-5 leading-relaxed">{product.description || 'A thoughtfully selected product from a trusted Halozon seller.'}</p>
          {product.features?.length ? (
            <ul className="mt-5 space-y-2 text-sm">
              {product.features.map((feature) => <li key={feature}>✓ {feature}</li>)}
            </ul>
          ) : null}
          <div className="mt-8 flex gap-3">
            <div className="flex items-center rounded-xl border border-slate-300">
              <button className="p-3" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-bold">{quantity}</span>
              <button className="p-3" onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button onClick={addItem} className="btn btn-primary flex-1">
              <ShoppingCart className="h-5 w-5" /> Add to cart
            </button>
            <button
              onClick={() => toggle(product._id)}
              className={`btn btn-soft ${saved ? 'text-rose-600' : ''}`}
              aria-label={saved ? 'Remove from wishlist' : 'Save product'}
              aria-pressed={saved}
            >
              <Heart className={saved ? 'fill-current' : ''} />
            </button>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[[Truck, 'Fast delivery'], [ShieldCheck, 'Buyer protected'], [Heart, 'Easy returns']].map(([Icon, label]) => {
              const FeatureIcon = Icon as typeof Truck;
              return (
                <div key={label as string} className="surface p-3 text-center">
                  <FeatureIcon className="mx-auto h-5 w-5 text-indigo-600" />
                  <small className="mt-2 block">{label as string}</small>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <ProductExtras productId={product._id} />
    </div>
  );
}
