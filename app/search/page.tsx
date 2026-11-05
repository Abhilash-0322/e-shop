import { Search, SlidersHorizontal, Sparkles, Tag } from '@/lib/icons';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductGrid from '@/components/ProductGrid';

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  await connectDB();
  const q = searchParams.q?.trim();
  const filter: any = q ? { $text: { $search: q } } : {};
  const products = await Product.find(filter).sort({ rating: -1, sold: -1 }).limit(60).select('-description -reviews').lean();

  return (
    <div className="shell py-8 md:py-10">
      <div className="workspace-toolbar">
        <div>
          <p className="eyebrow">Discovery console</p>
          <h1 className="page-title mt-2">{q ? `Results for “${q}”` : 'Find your next thing'}</h1>
          <p className="muted mt-3 text-sm">Use the launcher with <kbd className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold">⌘ K</kbd> to search from anywhere.</p>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full bg-white px-3 py-2 text-[11px] font-bold text-slate-500 shadow-sm sm:flex"><Sparkles className="h-3.5 w-3.5 text-indigo-600" /> {products.length} signals</span>
      </div>
      <form action="/search" className="surface mb-8 flex items-center gap-3 p-3">
        <Search className="ml-2 h-5 w-5 text-indigo-600" />
        <input name="q" defaultValue={q} className="flex-1 border-0 bg-transparent text-sm outline-none" placeholder="Search products, brands, categories..." aria-label="Search products" />
        <button className="btn btn-primary">Search</button>
      </form>
      <div className="grid gap-8 lg:grid-cols-[190px_1fr]">
        <aside className="surface h-fit p-4">
          <div className="flex items-center gap-2 text-xs font-black"><SlidersHorizontal className="h-4 w-4 text-indigo-600" /> Refine</div>
          <div className="mt-5 space-y-4 text-xs">
            <div><span className="font-bold text-slate-500">Sort signal</span><p className="mt-2 rounded-md bg-indigo-50 p-2 font-bold text-indigo-700">Top rated</p><p className="p-2 text-slate-500">Most popular</p></div>
            <div><span className="font-bold text-slate-500">Quick filters</span><p className="mt-2 flex items-center gap-2 p-2 font-semibold"><Tag className="h-3.5 w-3.5 text-amber-500" /> Deals only</p><p className="p-2 font-semibold">Prime eligible</p></div>
          </div>
        </aside>
        <div>
          {products.length ? <ProductGrid products={JSON.parse(JSON.stringify(products))} title={q ? 'Available matches' : 'Recommended for you'} subtitle={q ? 'Search signal' : 'Curated selection'} /> : <div className="surface p-12 text-center"><p className="eyebrow">No match yet</p><h2 className="mt-3 text-2xl font-black">Try a broader search.</h2><p className="muted mt-2 text-sm">The launcher can take you to deals, categories, or support.</p></div>}
        </div>
      </div>
    </div>
  );
}
