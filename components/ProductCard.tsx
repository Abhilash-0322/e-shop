'use client';

import Link from 'next/link';
import {Heart, Scale, ShoppingCart, Star} from '@/lib/icons';
import {useCart} from '@/hooks/useCart';
import {useCompare} from '@/hooks/useCompare';
import {useWishlist} from '@/hooks/useWishlist';
import toast from 'react-hot-toast';

export type Product = {
  _id: string;
  title: string;
  brand?: string;
  images?: string[];
  price: number;
  listPrice?: number;
  rating?: number;
  ratingCount?: number;
  isPrime?: boolean;
  stock?: number;
  categorySlug?: string;
};

export default function ProductCard({product}: {product: Product}) {
  const {add} = useCart();
  const {has, toggle} = useWishlist();
  const compare = useCompare();
  const saved = has(product._id);
  const compared = compare.has(product._id);
  const discount = product.listPrice && product.listPrice > product.price
    ? Math.round((1 - product.price / product.listPrice) * 100)
    : 0;

  async function addItem(event: React.MouseEvent) {
    event.preventDefault();
    const ok = await add(product._id);
    toast[ok ? 'success' : 'error'](ok ? 'Added to cart' : 'Sign in to add items');
  }

  function toggleWishlist(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    toggle(product._id);
  }

  function toggleCompare(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    compare.toggle(product._id);
  }

  return (
    <article className="card group overflow-hidden p-3">
      <Link href={`/product/${product._id}`}>
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-50 via-white to-emerald-50">
          <img src={product.images?.[0] || '/placeholder-product.svg'} alt={product.title} className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105" loading="lazy" />
          {discount > 0 && <span className="pill absolute left-2 top-2 bg-rose-600 text-white">-{discount}%</span>}
          {product.isPrime && <span className="pill pill-success absolute bottom-2 left-2">Plus</span>}
          <div className="absolute right-2 top-2 flex flex-col gap-1.5">
            <button type="button" onClick={toggleWishlist} className={`rounded-full bg-white p-2 shadow-sm transition hover:scale-105 ${saved ? 'text-rose-500' : 'text-slate-400'}`} aria-label={saved ? 'Remove from wishlist' : 'Save product'}>
              <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
            </button>
            <button type="button" onClick={toggleCompare} className={`rounded-full bg-white p-2 shadow-sm transition hover:scale-105 ${compared ? 'text-brand-600' : 'text-slate-400'}`} aria-label={compared ? 'Remove from comparison' : 'Compare product'}>
              <Scale className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="pt-4">
          <div className="flex items-center gap-1 text-xs text-amber-500">
            <Star className="h-3 w-3 fill-current" />
            {product.rating?.toFixed(1) || '4.5'}
            <span className="text-slate-400">({product.ratingCount || 0})</span>
          </div>
          <h3 className="mt-2 line-clamp-2 text-sm font-bold transition-colors group-hover:text-brand-700">{product.title}</h3>
          {product.brand && <p className="mt-1 text-xs text-slate-500">{product.brand}</p>}
        </div>
      </Link>
      <div className="mt-4 flex items-center justify-between gap-2">
        <div>
          <b className="text-lg tracking-tight">${product.price.toFixed(2)}</b>
          {product.listPrice && product.listPrice > product.price && <del className="ml-2 text-xs text-slate-400">${product.listPrice.toFixed(2)}</del>}
        </div>
        <button type="button" onClick={addItem} className="rounded-xl bg-brand-600 p-2.5 text-white transition hover:bg-brand-700" aria-label="Add to cart">
          <ShoppingCart className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
