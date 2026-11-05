'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Heart, ShoppingCart, Star } from '@/lib/icons';
import { useCart } from '@/hooks/useCart';
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
  stock?: number;
  categorySlug?: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const { add, syncing } = useCart();
  const { has, toggle } = useWishlist();
  const [adding, setAdding] = useState(false);
  const saved = has(product._id);
  const discount = product.listPrice && product.listPrice > product.price
    ? Math.round((1 - product.price / product.listPrice) * 100)
    : 0;
  const unavailable = product.stock !== undefined && product.stock <= 0;

  async function addItem(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (unavailable || adding) return;
    setAdding(true);
    const ok = await add(product._id);
    setAdding(false);
    if (ok) toast.success('Added to cart');
    else toast.error('We could not update your cart. Try again or sign in.');
  }

  return (
    <article className="card group p-3">
      <Link href={`/product/${product._id}`}>
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[#e3f1ed]">
          <img src={product.images?.[0] || '/placeholder-product.svg'} alt={product.title} className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105" loading="lazy" />
          {discount > 0 && <span className="pill absolute left-2 top-2 bg-[#e35d43] text-white">-{discount}%</span>}
          {unavailable && <span className="absolute bottom-2 left-2 rounded-full bg-slate-900/80 px-2 py-1 text-[10px] font-bold text-white">Currently unavailable</span>}
          <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); toggle(product._id); }} className={`absolute right-2 top-2 rounded-full bg-white p-2 shadow ${saved ? 'text-[#e35d43]' : 'text-slate-400'}`} aria-label={saved ? 'Remove from wishlist' : 'Save product'}>
            <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>
        <div className="pt-4">
          <div className="flex items-center gap-1 text-xs text-amber-600"><Star className="h-3 w-3 fill-current" />{product.rating?.toFixed(1) || '4.5'} <span className="text-slate-400">({product.ratingCount || 0})</span></div>
          <h3 className="mt-2 line-clamp-2 text-sm font-black group-hover:text-[#bd4532]">{product.title}</h3>
          {product.brand && <p className="mt-1 text-xs text-slate-500">{product.brand}</p>}
        </div>
      </Link>
      <div className="mt-4 flex items-center justify-between gap-2">
        <div><b className="text-lg">${product.price.toFixed(2)}</b>{product.listPrice && product.listPrice > product.price && <del className="ml-2 text-xs text-slate-400">${product.listPrice.toFixed(2)}</del>}</div>
        <button type="button" onClick={addItem} disabled={unavailable || adding || syncing} className="rounded-xl bg-[#102235] p-2 text-white hover:bg-[#1d374d]" aria-label={unavailable ? 'Product unavailable' : 'Add to cart'}>
          <ShoppingCart className={`h-4 w-4 ${adding ? 'animate-pulse' : ''}`} />
        </button>
      </div>
    </article>
  );
}
