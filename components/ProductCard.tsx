'use client';

import Link from 'next/link';
import { GitCompare, Heart, ShoppingCart, Star } from '@/lib/icons';
import { useCart } from '@/hooks/useCart';
import { useCompare } from '@/hooks/useCompare';
import { useWishlist } from '@/hooks/useWishlist';
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
  isDeal?: boolean;
  stock?: number;
  categorySlug?: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const { has: isCompared, toggle: toggleCompare } = useCompare();
  const saved = has(product._id);
  const compared = isCompared(product._id);
  const discount = product.listPrice && product.listPrice > product.price
    ? Math.round((1 - product.price / product.listPrice) * 100)
    : 0;

  async function addItem() {
    const ok = await add(product._id);
    toast[ok ? 'success' : 'error'](ok ? 'Added to cart' : 'Sign in to add items');
  }

  async function saveItem() {
    const ok = await toggle(product._id);
    if (!ok) toast('Sign in to save products');
  }

  return (
    <article className="card group p-3">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-[#f3f5ff]">
        <Link href={`/product/${product._id}`} className="flex h-full items-center justify-center">
          <img src={product.images?.[0] || '/placeholder-product.svg'} alt={product.title} className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        </Link>
        {(discount > 0 || product.isDeal) && (
          <span className="absolute left-2 top-2 rounded bg-[#fce7f3] px-2 py-1 text-[10px] font-extrabold text-[#be185d]">
            {discount > 0 ? `-${discount}%` : 'DROP'}
          </span>
        )}
        <div className="absolute right-2 top-2 flex gap-1">
          <button type="button" onClick={saveItem} className={`grid h-7 w-7 place-items-center rounded-full bg-white shadow-sm ${saved ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`} aria-label={saved ? 'Remove from wishlist' : 'Save product'}>
            <Heart className={`h-3.5 w-3.5 ${saved ? 'fill-current' : ''}`} />
          </button>
          <button type="button" onClick={() => toggleCompare(product._id)} className={`grid h-7 w-7 place-items-center rounded-full bg-white shadow-sm ${compared ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`} aria-label={compared ? 'Remove from compare' : 'Compare product'}>
            <GitCompare className="h-3.5 w-3.5" />
          </button>
        </div>
        {typeof product.stock === 'number' && product.stock < 6 && <span className="absolute bottom-2 left-2 rounded bg-[#fff4d6] px-2 py-1 text-[10px] font-extrabold text-[#9a6700]">Only {product.stock} left</span>}
      </div>
      <Link href={`/product/${product._id}`} className="block pt-3">
        <div className="flex items-center gap-1 text-xs text-[#b7791f]">
          <Star className="h-3 w-3 fill-current" /> {product.rating?.toFixed(1) || '4.5'}
          <span className="text-slate-400">({product.ratingCount || 0})</span>
        </div>
        <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-snug group-hover:text-indigo-700">{product.title}</h3>
        {product.brand && <p className="mt-1 text-xs text-slate-500">{product.brand}</p>}
      </Link>
      <div className="mt-4 flex items-center justify-between gap-2">
        <div>
          <b className="text-lg tracking-tight">${product.price.toFixed(2)}</b>
          {product.listPrice && product.listPrice > product.price && <del className="ml-1.5 text-[11px] text-slate-400">${product.listPrice.toFixed(2)}</del>}
        </div>
        <button type="button" onClick={addItem} className="grid h-8 w-8 place-items-center rounded-lg bg-[#635bff] text-white transition hover:bg-[#5149e8]" aria-label="Add to cart">
          <ShoppingCart className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
