'use client';
import Link from 'next/link';
import { Heart, GitCompare } from 'lucide-react';
import { formatPrice, calcDiscount, starArray } from '@/lib/utils';
import { useWishlist } from '@/hooks/useWishlist';
import { useCompare } from '@/hooks/useCompare';
import toast from 'react-hot-toast';

type P = {
  _id: string;
  title: string;
  slug?: string;
  brand?: string;
  images?: string[];
  price: number;
  listPrice?: number;
  rating?: number;
  ratingCount?: number;
  isPrime?: boolean;
  isDeal?: boolean;
  stock?: number;
  lowStockThreshold?: number;
};

export default function ProductCard({ product, compact }: { product: P; compact?: boolean }) {
  const discount = calcDiscount(product.price, product.listPrice);
  const { has: wished, toggle } = useWishlist();
  const { has: compared, toggle: toggleCompare } = useCompare();
  const isWished = wished(product._id);
  const isCompared = compared(product._id);
  const isLowStock = (product.stock ?? 100) <= (product.lowStockThreshold ?? 5);

  function handleWish(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggle(product._id).then((ok) => {
      if (!ok) toast('Please sign in to use your wishlist');
      else toast.success(isWished ? 'Removed from wish list' : 'Added to wish list');
    });
  }
  function handleCompare(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(product._id);
  }

  const stars = starArray(product.rating || 0);
  return (
    <Link
      href={`/product/${product._id}`}
      className="amazon-card amazon-card-hover p-4 group flex flex-col h-full relative"
    >
      {!compact && (
        <label
          className={`absolute top-3 left-3 z-10 flex items-center gap-1 text-[10px] bg-white/95 border rounded-full px-2 py-1 cursor-pointer transition-all shadow-sm ${
            isCompared ? 'border-violet-400 text-violet-700 font-semibold' : 'border-slate-200 text-slate-500 hover:border-violet-300'
          }`}
          onClick={handleCompare}
        >
          <input type="checkbox" checked={isCompared} onChange={() => {}} className="w-3 h-3 cursor-pointer accent-violet-600" />
          Compare
        </label>
      )}
      <div className="relative aspect-square mb-3 bg-gradient-to-br from-slate-50 to-violet-50/50 rounded-xl overflow-hidden flex items-center justify-center">
        {product.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={product.title}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="shimmer-bg w-full h-full animate-shimmer" />
        )}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
            -{discount}%
          </span>
        )}
        {product.isDeal && discount === 0 && (
          <span className="absolute top-2 left-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            Deal
          </span>
        )}
        <button
          type="button"
          onClick={handleWish}
          aria-label="Add to wish list"
          className={`absolute top-2 right-2 p-2 rounded-full bg-white shadow-md transition-all ${
            isWished ? 'text-rose-500 scale-110' : 'text-slate-400 hover:text-rose-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWished ? 'fill-rose-500' : ''}`} />
        </button>
        {isLowStock && (
          <span className="absolute bottom-2 left-2 bg-slate-900/85 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            Only {product.stock} left
          </span>
        )}
      </div>
      <div className="flex-1 flex flex-col">
        {!compact && product.rating ? (
          <div className="flex items-center gap-1 mb-1">
            <div className="flex">
              {stars.map((s, i) => (
                <span key={i} className="text-amber-400 text-sm leading-none">
                  {s === 'full' ? '★' : s === 'half' ? '★' : '☆'}
                </span>
              ))}
            </div>
            <span className="text-violet-600 text-xs font-medium">{(product.ratingCount || 0).toLocaleString()}</span>
          </div>
        ) : null}
        <div className="text-sm font-medium text-slate-800 line-clamp-2 mb-1 group-hover:text-violet-700 transition-colors">
          {product.title}
        </div>
        {product.brand && <div className="text-xs text-slate-500 mb-1">{product.brand}</div>}
        <div className="mt-auto">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-xl font-bold text-slate-900">{formatPrice(product.price)}</span>
            {product.listPrice && product.listPrice > product.price && (
              <span className="price-strike">{formatPrice(product.listPrice)}</span>
            )}
          </div>
          {product.isPrime && (
            <div className="text-xs font-semibold mt-1 text-sky-600 inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" /> Plus delivery
            </div>
          )}
          {discount > 0 && (
            <div className="text-xs text-rose-600 font-medium mt-0.5">
              Save {formatPrice((product.listPrice || 0) - product.price)} ({discount}%)
            </div>
          )}
          {!compact && <div className="chip mt-2 w-fit">Free shipping</div>}
        </div>
      </div>
    </Link>
  );
}
