import {connectDB} from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';
import ProductGrid from '@/components/ProductGrid';
import StoryBand from '@/components/StoryBand';
import {MapPin,ShieldCheck,Star} from '@/lib/icons';

export const dynamic='force-dynamic';

export default async function Store({params}:{params:{slug:string}}){
  await connectDB();
  const u=await User.findOne({'sellerProfile.slug':params.slug}).lean() as any;
  const p=await Product.find({sellerSlug:params.slug}).select('-description -reviews').lean();
  const name=u?.sellerProfile?.storeName||params.slug;
  return <div className="shell py-12 md:py-16"><section className="relative overflow-hidden rounded-[1.75rem] bg-[#66735f] p-8 text-white md:p-14"><div className="absolute -right-12 -top-20 h-80 w-80 rounded-full border-[36px] border-white/10"/><div className="relative max-w-3xl"><p className="eyebrow !text-[#dce5d8]">Seller collection</p><h1 className="display-serif mt-4 text-6xl md:text-8xl">{name}</h1><p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">{u?.sellerProfile?.description||'A Halozon seller with a distinct point of view and a collection worth getting to know.'}</p><div className="mt-8 flex flex-wrap gap-4 text-xs font-bold uppercase tracking-[.13em] text-white/70"><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4"/>Verified seller</span><span className="flex items-center gap-2"><Star className="h-4 w-4"/>Trusted by shoppers</span><span className="flex items-center gap-2"><MapPin className="h-4 w-4"/>Ships with care</span></div></div></section><div className="grid gap-5 py-12 md:grid-cols-3"><div className="md:col-span-2"><p className="eyebrow">The seller story</p><h2 className="display-serif mt-2 text-4xl">Objects chosen with intention.</h2><p className="muted mt-4 max-w-xl leading-relaxed">Every storefront is a chance to see the taste, care, and expertise behind a product. Start with the collection below and follow what catches your eye.</p></div><div className="surface p-6"><p className="eyebrow">Collection note</p><p className="mt-3 font-serif text-2xl">{p.length} pieces to explore</p><p className="muted mt-2 text-sm">A living selection from {name}.</p></div></div><ProductGrid products={JSON.parse(JSON.stringify(p))} title="The collection" subtitle="From this seller"/><div className="mt-14"><StoryBand kicker="Find another point of view" title="There is always another story to follow." body="Return to the edit for more sellers, more context, and a few unexpected discoveries." href="/search" label="Explore the marketplace" tone="paper"/></div></div>
}
