import { ArrowRight, Clock, Tag, Zap } from '@/lib/icons';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductGrid from '@/components/ProductGrid';

export const dynamic = 'force-dynamic';

export default async function DealsPage() {
  await connectDB();
  const products = await Product.find({ isDeal: true }).sort({ sold: -1 }).limit(60).select('-description -reviews').lean();
  return (
    <div className="shell py-8 md:py-10">
      <div className="command-board mb-8 p-7 md:p-10">
        <div className="relative z-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div><div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.16em] text-[#f5b544]"><Zap className="h-3.5 w-3.5" /> Live drop monitor</div><h1 className="mt-3 text-4xl font-black tracking-[-.05em] md:text-5xl">Deals worth moving for.</h1><p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300">Clear prices, real savings, and no noisy countdowns. See what is worth your attention today.</p></div>
          <div className="board-grid min-w-[15rem]"><div className="board-stat"><Tag className="h-4 w-4 text-[#f5b544]" /><strong>{products.length}</strong><small>active drops</small></div><div className="board-stat"><Clock className="h-4 w-4 text-[#9af3e4]" /><strong>Today</strong><small>next refresh</small></div></div>
        </div>
      </div>
      <ProductGrid products={JSON.parse(JSON.stringify(products))} title="Current drops" subtitle="Updated regularly" />
      <a href="/search" className="mt-8 flex items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 p-4 text-xs font-extrabold text-indigo-600">Keep exploring <ArrowRight className="h-3.5 w-3.5" /></a>
    </div>
  );
}
