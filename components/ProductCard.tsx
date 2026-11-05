'use client';

import Link from 'next/link';
import { ArrowRightLeft, Check, Heart, ShoppingCart, Star, Truck } from '@/lib/icons';
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
  categorySlug?: string;
  colors?: string[];
  sizes?: string[];
  fastShipping?: boolean;
  freeShipping?: boolean;
  sellerName?: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { has: hasWishlist, toggle: toggleWishlist } = useWishlist();
  const { has: hasCompare, toggle: toggleCompare } = useCompare();
  const saved = hasWishlist(product._id);
  const compared = hasCompare(product._id);
  const discount = product.listPrice && product.listPrice > product.price ? Math.round((1 - product.price / product.listPrice) * 100) : 0;
  const soldOut = product.stock !== undefined && product.stock <= 0;

  async function addItem(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const ok = await add(product._id);
    toast[ok ? 'success' : 'error'](ok ? 'Added to your bag' : 'Sign in to add items');
  }

  async function saveItem(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const ok = await toggleWishlist(product._id);
    if (!ok) toast.error('Sign in to save products');
  }

  function compareItem(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    toggleCompare(product._id);
    toast.success(compared ? 'Removed from compare' : 'Added to compare');
  }

  return (
    <article className="card group overflow-hidden p-2.5">
      <Link href={`/product/${product._id}`}>
        <div className="relative aspect-[4/4.6] overflow-hidden rounded-[.85rem] bg-[#edf1e9]">
          <img src={product.images?.[0] || '/placeholder-product.svg'} alt={product.title} className={`h-full w-full object-contain mix-blend-multiply transition duration-500 group-hover:scale-105 ${product.images?.[0] ? '' : 'p-8'}`} loading="lazy" />
          {product.images?.[1] && <img src={product.images[1]} alt="" className="absolute inset-0 h-full w-full object-contain mix-blend-multiply opacity-0 transition duration-500 group-hover:opacity-100 group-hover:scale-105" loading="lazy" />}
          <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
            {discount > 0 && <span className="pill bg-[#ff765c] text-white">-{discount}%</span>}
            {product.isPrime && <span className="pill bg-white/90 text-[#526239]">Plus</span>}
          </div>
          <div className="absolute right-2 top-2 flex flex-col gap-2">
            <button type="button" onClick={saveItem} className={`rounded-full bg-white/90 p-2 shadow-sm transition hover:scale-105 ${saved ? 'text-[#ff765c]' : 'text-[#526259]'}`} aria-label={saved ? 'Remove from wishlist' : 'Save product'}><Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} /></button>
            <button type="button" onClick={compareItem} className={`rounded-full bg-white/90 p-2 shadow-sm transition hover:scale-105 ${compared ? 'bg-[#d7f36b] text-[#405719]' : 'text-[#526259]'}`} aria-label={compared ? 'Remove from compare' : 'Add to compare'}><ArrowRightLeft className="h-4 w-4" /></button>
          </div>
          <div className="absolute bottom-2 left-2 right-2 translate-y-2 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
            <button type="button" disabled={soldOut} onClick={addItem} className="btn btn-primary w-full !py-2.5 text-xs">{soldOut ? 'Sold out' : <><ShoppingCart className="h-3.5 w-3.5" /> Quick add</>}</button>
          </div>
        </div>
        <div className="px-1.5 pb-1 pt-4">
          <div className="flex items-center gap-1 text-xs text-[#b07a29]"><Star className="h-3 w-3 fill-current" />{product.rating?.toFixed(1) || '4.5'} <span className="text-[#8b998d]">({product.ratingCount || 0})</span></div>
          <h3 className="mt-2 line-clamp-2 text-sm font-black leading-snug group-hover:text-[#6d8735]">{product.title}</h3>
          <div className="mt-2 flex items-center justify-between gap-2"><p className="text-lg font-black">${product.price.toFixed(2)}{product.listPrice && product.listPrice > product.price && <del className="ml-1.5 text-xs font-normal text-[#8b998d]">${product.listPrice.toFixed(2)}</del>}</p>{product.colors?.length ? <span className="text-[10px] text-[#8b998d]">+{product.colors.length} colors</span> : null}</div>
          <div className="mt-2 flex items-center gap-2 text-[11px] font-bold text-[#6d8735]">{product.freeShipping !== false && <><Truck className="h-3 w-3" /> Free delivery</>}{product.stock !== undefined && product.stock > 0 && product.stock <= 5 && <span className="text-[#ff765c]">Only {product.stock} left</span>}</div>
          {product.sellerName && <p className="mt-2 truncate text-[11px] text-[#8b998d]">Sold by {product.sellerName}</p>}
        </div>
      </Link>
      <div className="sr-only">{soldOut ? 'Sold out' : <><Check /> Available now</>}</div>
    </article>
  );
}
