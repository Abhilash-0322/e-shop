import {connectDB} from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import ProductGrid from '@/components/ProductGrid';
import CollectionIntro from '@/components/CollectionIntro';
import StoryBand from '@/components/StoryBand';

export const dynamic='force-dynamic';

export default async function CategoryPage({params,searchParams}:{params:{slug:string};searchParams:{sort?:string}}){
  await connectDB();
  const c=await Category.findOne({slug:params.slug}).lean() as any;
  const sort=searchParams.sort==='price-asc'?{price:1}:searchParams.sort==='price-desc'?{price:-1}:{sold:-1};
  const products=await Product.find({categorySlug:params.slug}).sort(sort as any).limit(60).select('-description -reviews').lean();
  const title=c?.name||params.slug.replaceAll('-',' ');
  return <div className="shell py-12 md:py-16"><CollectionIntro kicker="Collection / 01" title={title} body={c?.description||'A focused selection from trusted Halozon sellers, gathered around a shared point of view.'} backHref="/" backLabel="Back to the edit"/>
    <div className="mb-8 grid gap-4 md:grid-cols-3"><div className="rounded-[1.25rem] bg-[#d9e1df] p-6 md:col-span-2"><p className="font-serif text-3xl">A little context goes a long way.</p><p className="muted mt-4 max-w-xl text-sm leading-relaxed">Explore the collection at your own pace. Sort by what matters most and save the pieces that speak to you.</p></div><form className="surface flex flex-col justify-between p-5" method="get"><label className="eyebrow" htmlFor="sort">Arrange by</label><select id="sort" name="sort" defaultValue={searchParams.sort||'popular'} className="input mt-3"><option value="popular">Most popular</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select><button className="btn btn-dark mt-3 w-full">Update view</button></form></div>
    <ProductGrid products={JSON.parse(JSON.stringify(products))} title="Everything in this collection" subtitle={`${products.length} pieces to explore`}/>
    <StoryBand kicker="Keep exploring" title="The best finds are usually one click away." body="Follow the thread into another category, or return to the full edit when you are ready for a fresh point of view." href="/search" label="Browse all products" tone="paper"/>
  </div>
}
