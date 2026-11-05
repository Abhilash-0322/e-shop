import { ArrowUpRight, Boxes, SlidersHorizontal } from '@/lib/icons';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import ProductGrid from '@/components/ProductGrid';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params, searchParams }: { params: { slug: string }; searchParams: { sort?: string } }) {
  await connectDB();
  const category = await Category.findOne({ slug: params.slug }).lean() as any;
  const sort = searchParams.sort === 'price-asc' ? { price: 1 } : searchParams.sort === 'price-desc' ? { price: -1 } : { sold: -1 };
  const products = await Product.find({ categorySlug: params.slug }).sort(sort as any).limit(60).select('-description -reviews').lean();
  const title = category?.name || params.slug.replaceAll('-', ' ');

  return (
    <div className="shell py-8 md:py-10">
      <div className="command-board mb-8 p-7 md:p-10">
        <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><p className="eyebrow !text-[#9af3e4]">Collection / {params.slug}</p><h1 className="mt-3 text-4xl font-black capitalize tracking-[-.05em] md:text-5xl">{title}</h1><p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300">{category?.description || 'A focused selection from trusted Halozon sellers, organized for a faster decision.'}</p></div>
          <span className="flex items-center gap-2 text-xs font-bold text-slate-300"><Boxes className="h-4 w-4 text-[#9af3e4]" /> {products.length} products</span>
        </div>
      </div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><SlidersHorizontal className="h-4 w-4" /> Sort signal</div>
        <form action={`/category/${params.slug}`} className="flex items-center gap-2"><select name="sort" defaultValue={searchParams.sort || 'popular'} className="input !w-auto !py-2 text-xs" aria-label="Sort products"><option value="popular">Most popular</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select><button className="btn btn-soft !px-3 !py-2 text-xs">Apply</button></form>
      </div>
      <ProductGrid products={JSON.parse(JSON.stringify(products))} title="Browse the collection" subtitle="Live category signal" />
      <div className="mt-8 flex items-center justify-between rounded-lg border border-dashed border-slate-300 p-4 text-xs text-slate-500"><span>Need a different direction?</span><a href="/search" className="flex items-center gap-1 font-extrabold text-indigo-600">Open discovery <ArrowUpRight className="h-3.5 w-3.5" /></a></div>
    </div>
  );
}
