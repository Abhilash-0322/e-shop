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
  async function addItem(e: React.MouseEvent) {
    e.preventDefault(); e.stopPropagation();
    const ok = await add(product._id);
    toast[ok ? 'success' : 'error'](ok ? 'Added to cart' : 'Sign in to add items');
  }
  return (
    <article className="card group p-3">
      <Link href={`/product/${product._id}`}>
        <div className="relative flex aspect-square items-center justify-center overflow-hidden border-2 border-black bg-[#eeece3]">
          <img src={product.images?.[0] || '/placeholder-product.svg'} alt={product.title} className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105" loading="lazy" />
          {discount > 0 && <span className="pill absolute left-2 top-2 bg-[#ff5c35]">-{discount}%</span>}
          <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(product._id); }} className={`absolute right-2 top-2 border-2 border-black bg-white p-2 ${saved ? 'text-[#ff5c35]' : 'text-black'}`} aria-label="Save product"><Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} /></button>
        </div>
        <div className="pt-4">
          <div className="flex items-center gap-1 text-xs font-black text-[#ff5c35]"><Star className="h-3 w-3 fill-current" />{product.rating?.toFixed(1) || '4.5'} <span className="font-normal text-gray-500">({product.ratingCount || 0})</span></div>
          <h3 className="mt-2 line-clamp-2 text-sm font-black uppercase group-hover:text-[#ff5c35]">{product.title}</h3>
          {product.brand && <p className="mt-1 text-xs font-bold uppercase text-gray-500">{product.brand}</p>}
        </div>
      </Link>
      <div className="mt-4 flex items-center justify-between gap-2"><div><b className="text-lg">${product.price.toFixed(2)}</b>{product.listPrice && product.listPrice > product.price && <del className="ml-2 text-xs text-gray-500">${product.listPrice.toFixed(2)}</del>}</div><button type="button" onClick={addItem} className="border-2 border-black bg-[#d7ff3f] p-2 hover:bg-[#ff5c35]" aria-label="Add to cart"><ShoppingCart className="h-4 w-4" /></button></div>
    </article>
  );
}
