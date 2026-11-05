import {connectDB} from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Hero from '@/components/Hero';
import CollectionRail from '@/components/CollectionRail';
import CategoryTile from '@/components/CategoryTile';
import StoryBand from '@/components/StoryBand';
import Link from 'next/link';

export const dynamic='force-dynamic';

export default async function Home(){
  await connectDB();
  const [featured,deals,rated,categories]=await Promise.all([
    Product.find({isFeatured:true}).limit(10).select('-description -reviews').lean(),
    Product.find({isDeal:true}).sort({sold:-1}).limit(10).select('-description -reviews').lean(),
    Product.find().sort({rating:-1,ratingCount:-1}).limit(10).select('-description -reviews').lean(),
    Category.find({featured:true}).sort({order:1}).limit(8).lean()
  ]);
  const json=(v:any)=>JSON.parse(JSON.stringify(v));
  return <><Hero/><main className="shell space-y-20 py-14 md:py-20">
    <section className="grid gap-8 border-b border-[#ddd6c9] pb-14 lg:grid-cols-[.75fr_1.25fr] lg:items-end"><div><p className="eyebrow">A calmer way in</p><h2 className="display-serif mt-3 text-4xl md:text-6xl">Start with a feeling.</h2></div><p className="muted max-w-2xl text-lg leading-relaxed">From the desk to the kitchen to the weekend ahead, our collections make it easier to find what fits your life — and the people who made it.</p></section>
    <section><div className="mb-7 flex items-end justify-between"><div><p className="eyebrow">Browse by mood</p><h2 className="display-serif mt-2 text-4xl md:text-5xl">Find your next chapter.</h2></div><Link href="/search" className="hidden text-xs font-bold uppercase tracking-[.14em] text-[#d96143] sm:block">All collections →</Link></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">{json(categories).map((c:any)=><CategoryTile key={c._id} {...c}/>)}</div></section>
    <CollectionRail products={json(deals)} title="Small luxuries, better prices." kicker="The weekly edit" description="Good finds with a little more room in the budget." href="/deals" linkLabel="Shop all deals"/>
    <StoryBand kicker="A note from Halozon" title="More context makes better choices." body="We believe a product is more than a price and a star rating. See the details, meet the seller, and choose something you will be happy to keep." href="/info/about" label="Why we built this" tone="dark"/>
    <CollectionRail products={json(featured)} title="The ones we keep coming back to." kicker="Staff picks" description="A thoughtful mix of useful, beautiful, and quietly excellent." href="/search?featured=true" linkLabel="See staff picks"/>
    <section className="grid gap-5 lg:grid-cols-3"><div className="lg:col-span-2"><p className="eyebrow">The people behind it</p><h2 className="display-serif mt-2 text-4xl md:text-5xl">A marketplace with faces.</h2><p className="muted mt-4 max-w-xl leading-relaxed">Independent sellers bring the point of view. Halozon gives their work a place to be discovered, understood, and remembered.</p><Link href="/seller/apply" className="btn btn-dark mt-6">Become a seller <span aria-hidden>↗</span></Link></div><div className="grid grid-cols-2 gap-3"><div className="rounded-[1.25rem] bg-[#d9e1df] p-5"><p className="font-serif text-3xl">01</p><p className="mt-12 text-sm font-bold">Independent makers</p></div><div className="rounded-[1.25rem] bg-[#e8d8d4] p-5"><p className="font-serif text-3xl">02</p><p className="mt-12 text-sm font-bold">Useful by design</p></div></div></section>
    <CollectionRail products={json(rated)} title="Loved, then lived with." kicker="Community notes" description="The things shoppers are glad they made room for." href="/search?sort=rating" linkLabel="Browse top rated"/>
  </main></>
}
