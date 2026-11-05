import {connectDB} from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductGrid from '@/components/ProductGrid';
import StoryBand from '@/components/StoryBand';

export const dynamic='force-dynamic';

export default async function DealsPage(){
  await connectDB();
  const products=await Product.find({isDeal:true}).sort({sold:-1}).limit(60).select('-description -reviews').lean();
  return <div className="shell py-12 md:py-16"><div className="relative overflow-hidden rounded-[1.75rem] bg-[#d96143] p-8 text-white md:p-14"><div className="absolute -right-16 -top-20 h-72 w-72 rounded-full border-[34px] border-white/15"/><p className="eyebrow !text-[#f7d8ce]">The weekly edit</p><h1 className="display-serif mt-4 max-w-3xl text-6xl md:text-8xl">Good things, less fuss.</h1><p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">Real savings on products worth moving for. No noisy countdowns, no artificial urgency — just a better price for a little while.</p></div><div className="py-14"><ProductGrid products={JSON.parse(JSON.stringify(products))} title="Current drops" subtitle={`${products.length} limited-time finds`} href="/search" linkLabel="Browse the full edit"/></div><StoryBand kicker="A better kind of deal" title="Price is only part of the story." body="We keep product context, seller details, and the same buyer protections in view — even when the price is moving." href="/info/about" label="How Halozon works" tone="dark"/></div>
}
