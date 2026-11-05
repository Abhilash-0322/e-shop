'use client';

import {memo, useMemo} from 'react';
import Link from 'next/link';
import {Heart, ShoppingCart, Star} from '@/lib/icons';
import {useCart} from '@/hooks/useCart';
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

function ProductCard({product}: {product: Product}) {
  const {add} = useCart();
  const {has, toggle} = useWishlist();
  const saved = has(product._id);
  const discount = useMemo(
    () =>
      product.listPrice && product.listPrice > product.price
        ? Math.round((1 - product.price / product.listPrice) * 100)
        : 0,
    [product.listPrice, product.price],
  );

  async function addItem() {
    const ok = await add(product._id);
    toast[ok ? 'success' : 'error'](ok ? 'Added to cart' : 'Sign in to add items');
  }

  return (
    <article className="card group p-3">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 to-fuchsia-50">
        <Link href={`/product/${product._id}`} aria-label={`View ${product.title}`}>
          <div className="flex h-full items-center justify-center">
            <img
              src={product.images?.[0] || '/placeholder-product.svg'}
              alt={product.title}
              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          </div>
        </Link>
        {discount > 0 && <span className="pill absolute left-2 top-2 bg-fuchsia-600 text-white">-{discount}%</span>}
        <button
          type="button"
          onClick={() => toggle(product._id)}
          className={`absolute right-2 top-2 rounded-full bg-white p-2 shadow-sm ${saved ? 'text-rose-500' : 'text-slate-400'}`}
          aria-label={saved ? 'Remove from wishlist' : 'Save product'}
          aria-pressed={saved}
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
      <div className="mt-4 flex items-center justify-between">
        <div>
          <b className="text-lg">${product.price.toFixed(2)}</b>
          {product.listPrice && product.listPrice > product.price && (
            <del className="ml-2 text-xs text-slate-400">${product.listPrice.toFixed(2)}</del>
          )}
        </div>
        <button
          type="button"
          onClick={addItem}
          className="rounded-xl bg-indigo-600 p-2 text-white hover:bg-indigo-700"
          aria-label="Add to cart"
        >
          <ShoppingCart className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

export default memo(ProductCard);
