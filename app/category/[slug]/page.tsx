import {connectDB} from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import ProductGrid from '@/components/ProductGrid';
import {CheckCircle2,SlidersHorizontal} from '@/lib/icons';

export const dynamic='force-dynamic';

export default async function CategoryPage({params,searchParams}:{params:{slug:string};searchParams:{sort?:string}}){
  await connectDB();
  const c=await Category.findOne({slug:params.slug}).lean() as any;
  const sort=searchParams.sort==='price-asc'?{price:1}:searchParams.sort==='price-desc'?{price:-1}:{sold:-1};
  const products=await Product.find({categorySlug:params.slug}).sort(sort as any).limit(60).select('-description -reviews').lean();
  return <div className="shell py-10 md:py-14"><div className="surface p-8 md:p-10 mb-8 bg-[#eef7f0] border-[#d1e7d7]"><span className="pill"><CheckCircle2 className="w-3 h-3 mr-1"/> Community collection</span><p className="eyebrow mt-5">Collection</p><h1 className="page-title mt-2 capitalize">{c?.name||params.slug.replaceAll('-',' ')}</h1><p className="muted mt-3 max-w-2xl">{c?.description||'Explore a focused selection from trusted Halozon sellers.'}</p></div><div className="surface p-4 mb-8 flex flex-col sm:flex-row gap-3 sm:items-center justify-between"><span className="text-sm font-bold flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-[#28704e]"/> Browse with confidence</span><label className="flex items-center gap-2 text-sm muted">Sort<select defaultValue={searchParams.sort||'popular'} className="input !w-auto !py-2" aria-label="Sort products"><option value="popular">Most popular</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label></div><ProductGrid products={JSON.parse(JSON.stringify(products))} title="Browse the collection"/></div>;
}
