'use client';

import Link from 'next/link';
import {Heart, ShoppingCart, Star} from '@/lib/icons';
import {useCart} from '@/hooks/useCart';
import {useWishlist} from '@/hooks/useWishlist';
import {useLocale} from './LocaleProvider';
import toast from 'react-hot-toast';

export type Product = {_id: string; title: string; brand?: string; images?: string[]; price: number; listPrice?: number; currency?: string; rating?: number; ratingCount?: number; isPrime?: boolean; stock?: number; categorySlug?: string};

export default function ProductCard({product}: {product: Product}) {
  const {add} = useCart();
  const {has, toggle} = useWishlist();
  const {formatMoney, formatNumber} = useLocale();
  const saved = has(product._id);
  const discount = product.listPrice && product.listPrice > product.price ? Math.round((1 - product.price / product.listPrice) * 100) : 0;

  async function addItem(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const ok = await add(product._id);
    toast[ok ? 'success' : 'error'](ok ? 'Added to cart' : 'Sign in to add items');
  }

  return <article className="card group p-3">
    <Link href={`/product/${product._id}`} className="block min-w-0">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 to-fuchsia-50">
        <img src={product.images?.[0] || '/placeholder-product.svg'} alt={product.title} className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105" loading="lazy"/>
        {discount > 0 && <span className="pill absolute left-2 top-2 bg-fuchsia-600 text-white">-{discount}%</span>}
        <button type="button" onClick={(event) => {event.preventDefault(); event.stopPropagation(); toggle(product._id)}} className={`absolute right-2 top-2 rounded-full bg-white p-2 shadow ${saved ? 'text-rose-500' : 'text-slate-400'}`} aria-label={saved ? `Remove ${product.title} from wishlist` : `Save ${product.title} to wishlist`}>
          <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} aria-hidden="true"/>
        </button>
      </div>
      <div className="min-w-0 pt-4">
        <div className="flex flex-wrap items-center gap-1 text-xs text-amber-500"><Star className="h-3 w-3 fill-current" aria-hidden="true"/>{product.rating?.toFixed(1) || '4.5'} <span className="text-slate-400">({formatNumber(product.ratingCount || 0)})</span></div>
        <h3 className="text-wrap mt-2 line-clamp-2 text-sm font-bold group-hover:text-indigo-700">{product.title}</h3>
        {product.brand && <p className="text-wrap mt-1 text-xs text-slate-500">{product.brand}</p>}
      </div>
    </Link>
    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
      <div className="min-w-0"><b className="text-lg">{formatMoney(product.price, (product.currency as 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY' | 'CAD') || 'USD')}</b>{product.listPrice && product.listPrice > product.price && <del className="ml-2 text-xs text-slate-400">{formatMoney(product.listPrice, (product.currency as 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY' | 'CAD') || 'USD')}</del>}</div>
      <button type="button" onClick={addItem} className="rounded-xl bg-indigo-600 p-2 text-white hover:bg-indigo-700" aria-label={`Add ${product.title} to cart`}><ShoppingCart className="h-4 w-4" aria-hidden="true"/></button>
    </div>
  </article>;
}
