'use client';

import Link from 'next/link';
import { ArrowRightLeft, Heart, ShoppingCart, Star } from '@/lib/icons';
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
  stock?: number;
  seller?: string;
  categorySlug?: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const { has: inCompare, toggle: toggleCompare } = useCompare();
  const saved = has(product._id);
  const compared = inCompare(product._id);
  const discount =
    product.listPrice && product.listPrice > product.price
      ? Math.round((1 - product.price / product.listPrice) * 100)
      : 0;

  async function addItem() {
    const ok = await add(product._id);
    toast[ok ? 'success' : 'error'](ok ? 'Added to cart' : 'Sign in to add items');
  }

  function compareItem() {
    if (!compared && !inCompare(product._id)) {
      toast.success('Added to comparison');
    }
    toggleCompare(product._id);
  }

  return (
    <article className="card group p-3">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 to-fuchsia-50">
        <Link href={`/product/${product._id}`} className="absolute inset-0">
          <img
            src={product.images?.[0] || '/placeholder-product.svg'}
            alt={product.title}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        {discount > 0 && <span className="pill absolute left-2 top-2 bg-fuchsia-600 text-white">-{discount}%</span>}
        <button
          type="button"
          onClick={() => toggle(product._id)}
          className={`absolute right-2 top-2 rounded-full bg-white p-2 shadow transition hover:scale-105 ${saved ? 'text-rose-500' : 'text-slate-400'}`}
          aria-label={saved ? 'Remove from wishlist' : 'Save product'}
        >
          <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
        </button>
      </div>
      <Link href={`/product/${product._id}`} className="block pt-4">
        <div className="flex items-center gap-1 text-xs text-amber-500">
          <Star className="h-3 w-3 fill-current" />
          {product.rating?.toFixed(1) || '4.5'}
          <span className="text-slate-400">({product.ratingCount || 0})</span>
        </div>
        <h3 className="mt-2 line-clamp-2 text-sm font-bold group-hover:text-indigo-700">{product.title}</h3>
        {product.brand && <p className="mt-1 text-xs text-slate-500">{product.brand}</p>}
      </Link>
      <div className="mt-4 flex items-center justify-between gap-2">
        <div>
          <b className="text-lg">${product.price.toFixed(2)}</b>
          {product.listPrice && product.listPrice > product.price && (
            <del className="ml-2 text-xs text-slate-400">${product.listPrice.toFixed(2)}</del>
          )}
          {product.stock !== undefined && product.stock < 10 && (
            <span className="mt-1 block text-[10px] font-bold text-amber-600">Only {product.stock} left</span>
          )}
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={compareItem}
            className={`rounded-xl p-2 transition ${compared ? 'bg-fuchsia-100 text-fuchsia-700' : 'bg-slate-100 text-slate-500 hover:bg-indigo-100 hover:text-indigo-700'}`}
            aria-label={compared ? 'Remove from comparison' : 'Compare product'}
            title={compared ? 'Remove from comparison' : 'Compare product'}
          >
            <ArrowRightLeft className="h-4 w-4" />
          </button>
          <button type="button" onClick={addItem} className="rounded-xl bg-indigo-600 p-2 text-white hover:bg-indigo-700" aria-label="Add to cart">
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
