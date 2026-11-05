'use client';

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

export default function ProductCard({product}: {product: Product}) {
  const {add} = useCart();
  const {has, toggle} = useWishlist();
  const saved = has(product._id);
  const discount = product.listPrice && product.listPrice > product.price
    ? Math.round((1 - product.price / product.listPrice) * 100)
    : 0;

  async function addItem() {
    const ok = await add(product._id);
    toast[ok ? 'success' : 'error'](ok ? 'Added to cart' : 'Sign in to add items');
  }

  return (
    <article className="card group p-3" aria-labelledby={`product-${product._id}`}>
      <div className="relative">
        <Link href={`/product/${product._id}`} className="block rounded-xl" aria-label={`View ${product.title}`}>
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 to-cyan-50">
            <img src={product.images?.[0] || '/placeholder-product.svg'} alt="" className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            {discount > 0 && <span className="pill absolute left-2 top-2 bg-fuchsia-700 text-white">-{discount}%</span>}
          </div>
        </Link>
        <button
          type="button"
          onClick={() => toggle(product._id)}
          className={`absolute right-2 top-2 flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white p-2 shadow ${saved ? 'text-rose-600' : 'text-slate-600'}`}
          aria-label={`${saved ? 'Remove' : 'Save'} ${product.title} ${saved ? 'from wishlist' : 'to wishlist'}`}
          aria-pressed={saved}
        >
          <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} aria-hidden="true" />
        </button>
      </div>
      <Link href={`/product/${product._id}`} className="block rounded-lg pt-4">
        <div className="flex items-center gap-1 text-xs text-amber-700">
          <Star className="h-3 w-3 fill-current" aria-hidden="true" />
          <span>{product.rating?.toFixed(1) || '4.5'}</span>
          <span className="text-slate-500">({product.ratingCount || 0} reviews)</span>
        </div>
        <h3 id={`product-${product._id}`} className="mt-2 line-clamp-2 text-sm font-bold group-hover:text-indigo-800">{product.title}</h3>
        {product.brand && <p className="mt-1 text-xs text-slate-600">{product.brand}</p>}
      </Link>
      <div className="mt-4 flex items-center justify-between gap-2">
        <div>
          <b className="text-lg">${product.price.toFixed(2)}</b>
          {product.listPrice && product.listPrice > product.price && <del className="ml-2 text-xs text-slate-500">${product.listPrice.toFixed(2)}</del>}
        </div>
        <button type="button" onClick={addItem} className="flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-indigo-700 p-2 text-white hover:bg-indigo-800" aria-label={`Add ${product.title} to cart`}>
          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
