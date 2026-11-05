'use client';
import Link from 'next/link';
import { Store as StoreIcon, Star, MapPin } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import TrustBadge from '@/components/TrustBadge';
import SafetyNotice from '@/components/SafetyNotice';

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
      <div className="bg-gradient-to-r from-amazon-navy via-amazon-navylight to-amazon-orange text-white py-10">
        <div className="max-w-screen-xl mx-auto px-4 flex items-center gap-4">
          <div className="w-20 h-20 bg-white rounded-md flex items-center justify-center">
            <StoreIcon className="w-10 h-10 text-amazon-orange" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold">{store.name}</h1>
            <div className="text-sm text-white/80 flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {store.country}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-amazon-star text-amazon-star" />
                {store.rating.toFixed(1)} ({store.ratingCount} ratings)
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <TrustBadge kind="verified" compact />
              <span className="inline-flex items-center rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold">
                Approved store profile
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
        <aside className="panel p-4 self-start">
          <h3 className="font-bold mb-2">About this seller</h3>
          <p className="text-sm text-amazon-text">{store.description}</p>
          <div className="border-t border-amazon-border mt-4 pt-4 space-y-2 text-xs text-amazon-textMuted">
            <div><b className="text-amazon-text">Keep conversations on halozon.</b> We can only help with orders and messages kept on-platform.</div>
            <div>Seller identity and store details are reviewed before a store is approved.</div>
          </div>
          <SafetyNotice title="See something concerning?" href="/help#report" linkLabel="Report a safety concern" tone="warning">
            Don’t send payment or sensitive information directly to a seller.
          </SafetyNotice>
        </aside>
        <div>
          <div className="text-sm text-amazon-textMuted mb-3">
            <span className="font-semibold text-amazon-text">Verified storefront</span> · Showing {products?.length || 0} product{(products?.length || 0) !== 1 ? 's' : ''}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {(products || []).map((p: any) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
