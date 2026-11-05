'use client';

import Link from 'next/link';
import { GitCompare, Heart, Sparkles } from 'lucide-react';
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

  function handleWish(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    toggle(product._id).then((ok) => {
      if (!ok) toast('Sign in to save your favorites');
      else toast.success(isWished ? 'Removed from saved finds' : 'Saved to your favorites');
    });
  }

  function handleCompare(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    toggleCompare(product._id);
  }

  return (
    <Link href={`/product/${product._id}`} className="amazon-card amazon-card-hover group relative flex h-full flex-col p-3">
      {!compact && (
        <button type="button" onClick={handleCompare} className={`absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-bold backdrop-blur ${isCompared ? 'border-amazon-orange bg-amazon-orange/10 text-amazon-linkHover' : 'border-amazon-border bg-white/85 text-amazon-textMuted'}`} aria-label="Compare product">
          <GitCompare className="h-3 w-3" /> {isCompared ? 'Added' : 'Compare'}
        </button>
      )}
      <div className="relative mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-amazon-bg/70">
        {product.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.images[0]} alt={product.title} className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        ) : <div className="shimmer-bg h-full w-full" />}
        <div className="absolute right-2 top-2 flex flex-col gap-2">
          <button type="button" onClick={handleWish} aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'} className={`grid h-8 w-8 place-items-center rounded-full bg-white/90 shadow-sm transition-transform hover:scale-110 ${isWished ? 'text-amazon-deal' : 'text-amazon-textMuted'}`}>
            <Heart className={`h-4 w-4 ${isWished ? 'fill-current' : ''}`} />
          </button>
        </div>
        {discount > 0 && <span className="absolute bottom-2 left-2 rounded-full bg-amazon-deal px-2 py-1 text-[10px] font-black text-white">-{discount}%</span>}
        {product.isDeal && discount === 0 && <span className="absolute bottom-2 left-2 rounded-full bg-amazon-deal px-2 py-1 text-[10px] font-black text-white">FRESH DROP</span>}
      </div>
      <div className="flex flex-1 flex-col">
        {product.brand && <div className="mb-1 text-[10px] font-black uppercase tracking-[.14em] text-amazon-textMuted">{product.brand}</div>}
        {!compact && product.rating ? (
          <div className="mb-1 flex items-center gap-1">
            <div className="flex text-amazon-star">{starArray(product.rating).map((star, index) => <span key={index} className="text-xs">{star === 'full' || star === 'half' ? '★' : '☆'}</span>)}</div>
            <span className="text-[10px] text-amazon-link">{(product.ratingCount || 0).toLocaleString()}</span>
          </div>
        ) : null}
        <div className="mb-2 line-clamp-3 text-sm font-semibold leading-snug text-amazon-text group-hover:text-amazon-linkHover">{product.title}</div>
        <div className="mt-auto">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-xl font-black text-amazon-text">{formatPrice(product.price)}</span>
            {product.listPrice && product.listPrice > product.price && <span className="price-strike">{formatPrice(product.listPrice)}</span>}
          </div>
          {product.isPrime && <div className="mt-1 text-xs font-bold text-amazon-prime">✦ halo+ delivery</div>}
          {!compact && <div className="mt-2 flex items-center gap-1 text-[11px] text-amazon-textMuted"><Sparkles className="h-3 w-3 text-amazon-orange" /> Free delivery over $35</div>}
          {isLowStock && <div className="mt-1 text-[10px] font-bold text-amazon-deal">Only {product.stock} left — moving fast</div>}
        </div>
      </div>
    </Link>
  );
}
