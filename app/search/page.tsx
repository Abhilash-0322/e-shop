import {connectDB} from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductGrid from '@/components/ProductGrid';
import CollectionIntro from '@/components/CollectionIntro';
import StoryBand from '@/components/StoryBand';

export const dynamic='force-dynamic';

export default async function SearchPage({searchParams}:{searchParams:{q?:string;featured?:string;sort?:string}}){
  await connectDB();
  const q=searchParams.q?.trim();
  const filter:any=q?{$text:{$search:q}}:{};
  if(searchParams.featured)filter.isFeatured=true;
  const sort=searchParams.sort==='rating'?{rating:-1,ratingCount:-1}:{rating:-1,sold:-1};
  const products=await Product.find(filter).sort(sort as any).limit(60).select('-description -reviews').lean();
  return <div className="shell py-12 md:py-16"><CollectionIntro kicker={q?'Search / Results':'Open collection'} title={q?`Results for “${q}”`:'Discover something good.'} body={q?'A considered set of products from across the Halozon marketplace.':'Follow a thread, browse a category, or take the scenic route through our latest finds.'} backHref="/" backLabel="Back to the edit" actionHref="/deals" actionLabel="See the deals"/>
    <div className="mb-8 grid gap-4 md:grid-cols-3"><div className="rounded-[1.25rem] bg-[#e8d8d4] p-6 md:col-span-2"><p className="font-serif text-3xl">The right thing is easier to spot when the room is quiet.</p><p className="muted mt-3 max-w-xl text-sm">Use the search field above to follow a specific idea, brand, or category.</p></div><div className="surface p-5"><p className="eyebrow">Showing</p><p className="mt-3 font-serif text-3xl">{products.length} finds</p><p className="muted mt-2 text-sm">Ranked by relevance and shopper love.</p></div></div>
    <ProductGrid products={JSON.parse(JSON.stringify(products))} title="Available now" subtitle={q?'Your search, thoughtfully filtered':'Freshly gathered'} href="/search?sort=rating" linkLabel="Top rated"/>
    <StoryBand kicker="No wrong turns" title="Discovery is part of the point." body="Keep wandering through categories and sellers. There is no pressure to know exactly what you want before you arrive." href="/info/about" label="Our point of view" tone="paper"/>
  </div>
}
