'use client';

import Link from 'next/link';
import toast from 'react-hot-toast';
import { Heart, RefreshCw, ShoppingCart, Star } from '@/lib/icons';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';

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
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const saved = has(product._id);
  const discount =
    product.listPrice && product.listPrice > product.price
      ? Math.round((1 - product.price / product.listPrice) * 100)
      : 0;

  async function addItem(event: React.MouseEvent) {
    event.preventDefault();
    const ok = await add(product._id);
    toast[ok ? 'success' : 'error'](ok ? 'Added to cart' : 'Sign in to add items');
  }

  return (
    <article className="card p-3 group">
      <Link href={`/product/${product._id}`}>
        <div className="relative aspect-square rounded-xl bg-gradient-to-br from-indigo-50 to-fuchsia-50 overflow-hidden flex items-center justify-center">
          <img
            src={product.images?.[0] || '/placeholder-product.svg'}
            alt={product.title}
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {discount > 0 && <span className="absolute top-2 left-2 pill bg-fuchsia-600 text-white">-{discount}%</span>}
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              toggle(product._id);
            }}
            className={`absolute right-2 top-2 rounded-full bg-white p-2 shadow ${
              saved ? 'text-rose-500' : 'text-slate-400'
            }`}
            aria-label="Save product"
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>
        <div className="pt-4">
          <div className="flex items-center gap-1 text-amber-500 text-xs">
            <Star className="w-3 h-3 fill-current" />
            {product.rating?.toFixed(1) || '4.5'}{' '}
            <span className="text-slate-400">({product.ratingCount || 0})</span>
          </div>
          <h3 className="font-bold text-sm mt-2 line-clamp-2 group-hover:text-indigo-700">{product.title}</h3>
          {product.brand && <p className="text-xs text-slate-500 mt-1">{product.brand}</p>}
          <p className="inline-flex items-center gap-1 text-[11px] text-indigo-700 font-bold mt-3">
            <RefreshCw className="w-3 h-3" />
            Repeat & save on product page
          </p>
        </div>
      </Link>
      <div className="flex items-center justify-between mt-4">
        <div>
          <b className="text-lg">${product.price.toFixed(2)}</b>
          {product.listPrice && product.listPrice > product.price && (
            <del className="text-xs text-slate-400 ml-2">${product.listPrice.toFixed(2)}</del>
          )}
        </div>
        <button
          type="button"
          onClick={addItem}
          disabled={product.stock === 0}
          className="rounded-xl bg-indigo-600 text-white p-2 hover:bg-indigo-700 disabled:bg-slate-300"
          aria-label="Add to cart"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
}
