import Link from 'next/link';
import {connectDB} from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import ProductGrid from '@/components/ProductGrid';
import {SlidersHorizontal,ArrowRight} from '@/lib/icons';

export const dynamic='force-dynamic';

export default async function SearchPage({searchParams}:{searchParams:{q?:string;category?:string;min?:string;max?:string;sort?:string}}){
  await connectDB();
  const q=searchParams.q?.trim();
  const filter:any=q?{$text:{$search:q}}:{};
  if(searchParams.category)filter.categorySlug=searchParams.category;
  const min=Number(searchParams.min);
  const max=Number(searchParams.max);
  if(Number.isFinite(min)||Number.isFinite(max))filter.price={...(Number.isFinite(min)?{$gte:min}:{}),...(Number.isFinite(max)?{$lte:max}:{})};
  const sort=searchParams.sort==='price-asc'?{price:1}:searchParams.sort==='price-desc'?{price:-1}:searchParams.sort==='rating'?{rating:-1,ratingCount:-1}:{sold:-1,rating:-1};
  const [products,categories]=await Promise.all([
    Product.find(filter).sort(sort as any).limit(60).select('-description -reviews').lean(),
    Category.find().sort({order:1}).limit(12).lean()
  ]);
  const queryLabel=q?`Results for “${q}”`:searchParams.category?'A focused collection':'Discover products';
  return <div className="shell py-10 md:py-14">
    <div className="max-w-3xl"><p className="eyebrow">Browse at your pace</p><h1 className="page-title mt-2">{queryLabel}</h1><p className="muted mt-4 leading-relaxed">Start broad, then use the filters to make the shelf feel like yours. No perfect keywords needed.</p></div>
    <div className="flex flex-wrap gap-2 mt-7">{[['Everything','/search'],['Giftable','/search?q=gift'],['Cozy','/search?q=cozy'],['Workspace','/search?q=workspace'],['Under $50','/search?max=50']].map(([label,href])=><Link key={href} href={href} className={`discovery-chip ${(!q&&!searchParams.category&&!searchParams.max&&label==='Everything')?'!bg-[#2e6548] !text-white':''}`}>{label}<ArrowRight className="w-3.5 h-3.5"/></Link>)}</div>
    <form className="filter-panel mt-8 grid gap-3 md:grid-cols-[1.3fr_1fr_1fr_1fr_auto] items-end" method="get">
      <label className="text-xs font-bold text-[#516253]">Search<input className="input mt-1" name="q" defaultValue={q||''} placeholder="Try a mood, room, or hobby"/></label>
      <label className="text-xs font-bold text-[#516253]">Category<select className="input mt-1" name="category" defaultValue={searchParams.category||''}><option value="">All categories</option>{JSON.parse(JSON.stringify(categories)).map((category:any)=><option key={category.slug} value={category.slug}>{category.name}</option>)}</select></label>
      <label className="text-xs font-bold text-[#516253]">Min price<input className="input mt-1" name="min" type="number" min="0" defaultValue={searchParams.min||''} placeholder="$0"/></label>
      <label className="text-xs font-bold text-[#516253]">Max price<input className="input mt-1" name="max" type="number" min="0" defaultValue={searchParams.max||''} placeholder="No limit"/></label>
      <label className="text-xs font-bold text-[#516253]">Sort<select className="input mt-1" name="sort" defaultValue={searchParams.sort||'popular'}><option value="popular">Popular</option><option value="rating">Top rated</option><option value="price-asc">Price: low</option><option value="price-desc">Price: high</option></select></label>
      <button className="btn btn-primary md:col-start-5" type="submit"><SlidersHorizontal className="w-4 h-4"/>Apply</button>
    </form>
    <div className="flex items-center justify-between mt-10 mb-5"><p className="text-sm text-[#718071]">{products.length} {products.length===1?'find':'finds'} to explore</p>{(q||searchParams.category||searchParams.min||searchParams.max||searchParams.sort)&&<Link href="/search" className="text-sm amazon-link">Clear filters</Link>}</div>
    <ProductGrid products={JSON.parse(JSON.stringify(products))} title="Your current shelf" subtitle="Transparent discovery"/>
  </div>
}
