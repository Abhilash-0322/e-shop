import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductGrid from '@/components/ProductGrid';
import Link from 'next/link';
import { ArrowRight, Check, Tag } from '@/lib/icons';

export const dynamic = 'force-dynamic';

export default async function DealsPage() {
  await connectDB();
  const products = await Product.find({ isDeal: true }).sort({ sold: -1 }).limit(60).select('-description -reviews').lean();
  return (
    <div className="shell py-10 md:py-14">
      <div className="relative overflow-hidden rounded-[1.8rem] bg-[#ff765c] p-8 text-white md:p-12">
        <div className="absolute -right-10 -top-16 h-72 w-72 rounded-full border-[36px] border-white/15" />
        <div className="relative max-w-2xl"><Tag className="h-9 w-9 text-white/80" /><p className="eyebrow mt-6 !text-white/75">Limited time / real value</p><h1 className="mt-3 text-5xl font-black tracking-[-.06em] md:text-6xl">Deals worth moving for.</h1><p className="mt-5 max-w-xl text-lg text-white/80">Clear prices, real savings, and no noisy countdowns. Just the good stuff at a better moment.</p><div className="mt-7 flex flex-wrap gap-4 text-sm font-bold"><span className="flex items-center gap-2"><Check className="h-4 w-4" /> Honest markdowns</span><span className="flex items-center gap-2"><Check className="h-4 w-4" /> Fast delivery options</span></div></div>
      </div>
      <div className="mt-8 flex items-center justify-between gap-4"><div><p className="eyebrow">The current drops</p><p className="muted mt-1 text-sm">{products.length} offers to explore</p></div><Link href="/search" className="amazon-link text-sm">Browse all products <ArrowRight className="inline h-4 w-4" /></Link></div>
      <div className="mt-7"><ProductGrid products={JSON.parse(JSON.stringify(products))} title="Good things, better priced" subtitle="Updated regularly" /></div>
    </div>
  );
}
