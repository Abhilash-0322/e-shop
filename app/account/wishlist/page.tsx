import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';
import AccountLayout from '../AccountLayout';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { serialize } from '@/lib/serialize';
import { AccountPageHeader, EmptyState } from '@/components/AccountPrimitives';
import { Heart, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin?redirect=/account/wishlist');
  await connectDB();
  const w = serialize(await Wishlist.findOne({ userId: user.id }).populate('items.productId').lean()) as any;
  const items = (w?.items || []).map((i: any) => i.productId).filter((p: any) => p && p._id);

  return (
    <AccountLayout user={user}>
      <AccountPageHeader eyebrow="Discover" title="Wishlist" description="Keep the things that make you pause, then come back when the moment is right." action={{ href: '/account/recommendations', label: 'See picks for you' }} />
      <div className="panel p-5">
        <div className="flex items-center justify-between mb-4"><div><h2 className="text-lg font-bold">Saved for later</h2><p className="text-sm text-muted">{items.length} item{items.length !== 1 ? 's' : ''}</p></div><Heart className="w-6 h-6 text-amazon-orange" /></div>
        {items.length === 0 ? (
          <EmptyState icon={Heart} title="Your wishlist is ready for inspiration" description="Tap the heart on products you love and they&apos;ll be waiting here when you are." action={{ href: '/', label: 'Discover products' }} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((p: any) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
      <Link href="/account/recommendations" className="panel p-4 mt-4 flex items-center gap-3 hover:border-amazon-orange transition-colors">
        <div className="w-10 h-10 rounded-xl bg-amazon-orange/10 text-amazon-orange grid place-items-center"><Sparkles className="w-5 h-5" /></div>
        <div className="flex-1"><div className="font-bold text-sm">Need a fresh idea?</div><div className="text-xs text-muted">Explore recommendations shaped by your browsing.</div></div>
        <span className="amazon-link text-sm">Explore</span>
      </Link>
    </AccountLayout>
  );
}
