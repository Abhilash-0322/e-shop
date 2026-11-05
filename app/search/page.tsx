import {connectDB} from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductGrid from '@/components/ProductGrid';
import {CheckCircle2,SlidersHorizontal} from '@/lib/icons';

export const dynamic='force-dynamic';

export default async function SearchPage({searchParams}:{searchParams:{q?:string}}){
  await connectDB();
  const q=searchParams.q?.trim();
  const filter:any=q?{$text:{$search:q}}:{};
  const products=await Product.find(filter).sort({rating:-1,sold:-1}).limit(60).select('-description -reviews').lean();
  return <div className="shell py-10 md:py-14"><div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"><div><p className="eyebrow">Search results</p><h1 className="page-title mt-2">{q?`Results for “${q}”`:'Discover products'}</h1><p className="muted mt-3">Explore products from across the Halozon marketplace.</p></div><span className="status-chip success"><CheckCircle2 className="w-3.5 h-3.5 mr-1"/> Ranked by community confidence</span></div><div className="surface p-4 mb-8 flex flex-wrap items-center gap-3 text-sm"><span className="flex items-center gap-2 font-bold"><SlidersHorizontal className="w-4 h-4 text-[#28704e]"/> Refine your search</span><span className="pill">Top rated</span><span className="pill">Verified buyers</span><span className="pill">Fast dispatch</span><span className="text-xs muted ml-auto">{products.length} results</span></div><ProductGrid products={JSON.parse(JSON.stringify(products))} title="Available now"/></div>;
}
