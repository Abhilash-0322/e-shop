'use client';

import Link from 'next/link';
import { Heart, ShoppingCart, Star } from '@/lib/icons';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import toast from 'react-hot-toast';

export type Product = { _id: string; title: string; brand?: string; images?: string[]; price: number; listPrice?: number; rating?: number; ratingCount?: number; isPrime?: boolean; stock?: number; categorySlug?: string };

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const saved = has(product._id);
  const discount = product.listPrice && product.listPrice > product.price ? Math.round((1 - product.price / product.listPrice) * 100) : 0;

  async function addItem(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const ok = await add(product._id);
    toast[ok ? 'success' : 'error'](ok ? 'Added to cart' : 'Sign in to add items');
  }

  return <article className="card group min-w-[calc(50vw-1.35rem)] p-2.5 sm:min-w-0 sm:p-3">
    <Link href={`/product/${product._id}`} className="block">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 to-fuchsia-50">
        <img src={product.images?.[0] || '/placeholder-product.svg'} alt={product.title} className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        {discount > 0 && <span className="pill absolute left-2 top-2 bg-fuchsia-600 text-white">-{discount}%</span>}
        <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); toggle(product._id); }} className={`tap-target absolute right-1.5 top-1.5 rounded-full bg-white shadow-sm ${saved ? 'text-rose-500' : 'text-slate-400'}`} aria-label={saved ? 'Remove from wishlist' : 'Save product'} aria-pressed={saved}>
          <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
        </button>
      </div>
      <div className="pt-3">
        <div className="flex items-center gap-1 text-xs text-amber-500"><Star className="h-3 w-3 fill-current" />{product.rating?.toFixed(1) || '4.5'} <span className="text-slate-400">({product.ratingCount || 0})</span></div>
        <h3 className="mt-1.5 line-clamp-2 text-sm font-extrabold group-hover:text-indigo-700">{product.title}</h3>
        {product.brand && <p className="mt-1 truncate text-xs text-slate-500">{product.brand}</p>}
      </div>
    </Link>
    <div className="mt-3 flex items-center justify-between gap-2">
      <div className="min-w-0"><b className="text-base sm:text-lg">${product.price.toFixed(2)}</b>{product.listPrice && product.listPrice > product.price && <del className="ml-1 text-[10px] text-slate-400 sm:ml-2 sm:text-xs">${product.listPrice.toFixed(2)}</del>}</div>
      <button type="button" onClick={addItem} className="tap-target h-10 w-10 shrink-0 rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700" aria-label={`Add ${product.title} to cart`}><ShoppingCart className="mx-auto h-4 w-4" /></button>
    </div>
  </article>;
}
