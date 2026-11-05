import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { serialize } from '@/lib/serialize';

export const dynamic = 'force-dynamic';

export default async function DealsPage() {
  await connectDB();
  const deals = serialize(await Product.find({ isDeal: true }).sort({ sold: -1 }).limit(40).select('-reviews -description').lean()) as any;
  return (
    <div className="confidence-shell py-5 sm:py-8">
      <div className="text-xs text-amazon-textMuted mb-3">
        <Link href="/" className="amazon-link">Home</Link>
        <span className="mx-1">›</span>
        <span>Today&apos;s Deals</span>
      </div>
      <div className="bg-gradient-to-r from-amazon-deal to-red-700 text-white rounded-2xl p-7 mb-5 shadow-card">
        <p className="text-xs uppercase tracking-[0.16em] text-white/75">Limited-time savings</p>
        <h1 className="mt-1 text-3xl font-bold mb-1">Today&apos;s Deals</h1>
        <p className="text-white/90">All discounts updated daily. New deals every hour.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {deals.map((p: any) => <ProductCard key={String(p._id)} product={p} />)}
      </div>
    </div>
  );
}
