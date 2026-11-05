'use client';
import Link from 'next/link';
import { Store as StoreIcon, Star, MapPin, BadgeCheck, Heart, MessageCircle } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export default function StoreView({
  store,
  products,
  notFound,
}: {
  store?: any;
  products?: any[];
  notFound?: boolean;
}) {
  if (notFound) {
    return (
      <div className="max-w-screen-md mx-auto px-4 py-12 text-center">
        <StoreIcon className="w-12 h-12 mx-auto text-amazon-textMuted mb-3" />
        <h1 className="text-2xl font-bold mb-2">Store not found</h1>
        <Link href="/" className="amazon-btn-primary inline-block">Continue shopping</Link>
      </div>
    );
  }
  return (
    <div className="bg-amazon-bg min-h-screen">
      {/* Banner */}
      <div className="bg-amazon-navy text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 soft-grid" />
        <div className="max-w-screen-xl mx-auto px-4 relative flex items-center gap-5">
          <div className="avatar-ring w-24 h-24 bg-amazon-orange rounded-full flex items-center justify-center text-white">
            <StoreIcon className="w-10 h-10" />
          </div>
          <div>
            <div className="eyebrow !text-amazon-yellow mb-2">Independent studio</div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">{store.name}</h1>
            <div className="text-sm text-white/80 flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {store.country}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-amazon-star text-amazon-star" />
                {store.rating.toFixed(1)} ({store.ratingCount} ratings)
              </span>
              <span className="flex items-center gap-1"><BadgeCheck className="w-3 h-3 text-amazon-yellow" /> Identity verified</span>
            </div>
          </div>
          <div className="ml-auto hidden md:flex gap-2"><button className="amazon-btn-yellow !text-xs inline-flex items-center gap-1"><Heart className="w-3 h-3" /> Follow</button><button className="border border-white/30 rounded-full px-4 py-2 text-xs inline-flex items-center gap-1"><MessageCircle className="w-3 h-3" /> Ask a question</button></div>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
        <aside className="panel p-5 self-start">
          <div className="eyebrow mb-2">The story</div>
          <h3 className="text-xl font-black mb-2">About the maker</h3>
          <p className="text-sm text-amazon-text leading-relaxed">{store.description}</p>
          <div className="border-t border-amazon-border mt-5 pt-4 space-y-3 text-xs text-amazon-textMuted"><div><b className="text-amazon-text block">Based in</b>{store.country}</div><div><b className="text-amazon-text block">Response time</b>Usually within a day</div><div><b className="text-amazon-text block">Community love</b>98% would recommend</div></div>
        </aside>
        <div>
          <div className="flex items-end justify-between mb-4"><div><div className="eyebrow">The collection</div><h2 className="text-2xl font-black">Made by {store.name}</h2></div><div className="text-sm text-amazon-textMuted">{products?.length || 0} pieces</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {(products || []).map((p: any) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
