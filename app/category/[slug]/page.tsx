import {connectDB} from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import ProductGrid from '@/components/ProductGrid';
import Link from 'next/link';
import {ArrowLeft,ArrowRight,SlidersHorizontal} from '@/lib/icons';

export const dynamic='force-dynamic';

export default async function CategoryPage({params,searchParams}:{params:{slug:string};searchParams:{sort?:string;min?:string;max?:string}}){
  await connectDB();
  const c=await Category.findOne({slug:params.slug}).lean() as any;
  const sort=searchParams.sort==='price-asc'?{price:1}:searchParams.sort==='price-desc'?{price:-1}:searchParams.sort==='rating'?{rating:-1}:{sold:-1,rating:-1};
  const filter:any={categorySlug:params.slug};
  const min=searchParams.min?Number(searchParams.min):NaN;
  const max=searchParams.max?Number(searchParams.max):NaN;
  if(Number.isFinite(min)||Number.isFinite(max))filter.price={...(Number.isFinite(min)?{$gte:min}:{}),...(Number.isFinite(max)?{$lte:max}:{})};
  const products=await Product.find(filter).sort(sort as any).limit(60).select('-description -reviews').lean();
  const title=c?.name||params.slug.replaceAll('-',' ');
  return <div className="shell py-10 md:py-14">
    <Link href="/search" className="inline-flex items-center gap-1 text-sm amazon-link"><ArrowLeft className="w-4 h-4"/>Back to all paths</Link>
    <div className="discovery-hero mt-5 mb-8"><div className="relative z-10 p-7 md:p-10"><p className="eyebrow">A path for you</p><h1 className="page-title mt-2 capitalize">{title}</h1><p className="muted mt-4 max-w-2xl">{c?.description||'Explore a focused selection from trusted Halozon sellers, then narrow it down when something catches your eye.'}</p><div className="flex flex-wrap gap-2 mt-6"><Link href={`/search?q=${encodeURIComponent(title)}`} className="discovery-chip">More like this <ArrowRight className="w-3.5 h-3.5"/></Link><Link href="/search?q=gift" className="discovery-chip">Find a gift <ArrowRight className="w-3.5 h-3.5"/></Link></div></div></div>
    <form className="filter-panel mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] items-end" method="get">
      <label className="text-xs font-bold text-[#516253]">Price from<input className="input mt-1" name="min" type="number" min="0" defaultValue={searchParams.min||''} placeholder="$0"/></label>
      <label className="text-xs font-bold text-[#516253]">Price to<input className="input mt-1" name="max" type="number" min="0" defaultValue={searchParams.max||''} placeholder="No limit"/></label>
      <label className="text-xs font-bold text-[#516253]">Sort<select defaultValue={searchParams.sort||'popular'} className="input mt-1" name="sort" aria-label="Sort products"><option value="popular">Most popular</option><option value="rating">Top rated</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label>
      <button className="btn btn-primary" type="submit"><SlidersHorizontal className="w-4 h-4"/>Update shelf</button>
    </form>
    <ProductGrid products={JSON.parse(JSON.stringify(products))} title="Browse the collection" subtitle={`${products.length} finds in this path`}/>
  </div>
}
