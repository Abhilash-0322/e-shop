import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import CategoryTile from '@/components/CategoryTile';
import Link from 'next/link';
import { ArrowRight, Check, ShieldCheck, Sparkles } from '@/lib/icons';

export const dynamic = 'force-dynamic';

export default async function Home() {
  await connectDB();
  const [featured, deals, rated, categories] = await Promise.all([
    Product.find({ isFeatured: true }).limit(10).select('-description -reviews').lean(),
    Product.find({ isDeal: true }).sort({ sold: -1 }).limit(10).select('-description -reviews').lean(),
    Product.find().sort({ rating: -1, ratingCount: -1 }).limit(10).select('-description -reviews').lean(),
    Category.find({ featured: true }).sort({ order: 1 }).limit(8).lean(),
  ]);
  const json = (value: unknown) => JSON.parse(JSON.stringify(value));
  return (
    <>
      <Hero />
      <div className="shell space-y-20 py-14 md:py-20">
        <section>
          <div className="mb-6 flex items-end justify-between gap-4"><div><p className="eyebrow">Start with a feeling</p><h2 className="page-title mt-2">Shop by department</h2></div><Link className="amazon-link text-sm" href="/search">View all →</Link></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">{json(categories).map((category: any) => <CategoryTile key={category._id} {...category} />)}</div>
        </section>
        <ProductGrid products={json(deals)} title="Today&apos;s best drops" subtitle="Limited-time value" href="/deals" />
        <section className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
          <div className="relative min-h-[24rem] overflow-hidden rounded-[1.8rem] bg-[#dcecff] p-8 md:p-10">
            <img src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1000&q=80" alt="A calm desk and home objects" className="absolute inset-0 h-full w-full object-cover mix-blend-multiply opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#dcecff] via-[#dcecff]/70 to-transparent" />
            <div className="relative max-w-sm"><p className="eyebrow">The everyday edit</p><h2 className="mt-3 text-4xl font-black tracking-tight">Good design makes room for life.</h2><p className="muted mt-4 leading-relaxed">Thoughtful objects for the places where your days happen.</p><Link href="/category/home-and-kitchen" className="btn btn-dark mt-7">Shop home <ArrowRight className="h-4 w-4" /></Link></div>
          </div>
          <div className="flex flex-col justify-between rounded-[1.8rem] bg-[#d7f36b] p-8 md:p-10"><div><Sparkles className="h-8 w-8 text-[#405719]" /><p className="eyebrow mt-6 !text-[#405719]">Why Halozon</p><h2 className="mt-3 text-3xl font-black tracking-tight">The signal is in the details.</h2><p className="mt-4 max-w-sm leading-relaxed text-[#526239]">Clear listings, honest seller context, and the little pieces of reassurance that make clicking add to bag feel good.</p></div><div className="mt-8 grid grid-cols-2 gap-3 text-sm font-black"><span className="flex items-center gap-2"><Check className="h-4 w-4" /> Verified sellers</span><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Buyer protected</span></div></div>
        </section>
        <ProductGrid products={json(featured)} title="Editor&apos;s picks" subtitle="Chosen for a reason" href="/search" />
        <section className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-[1.8rem] bg-[#ff765c] p-8 text-white md:p-10"><p className="eyebrow !text-white/70">Halozon Plus</p><h2 className="mt-3 text-4xl font-black tracking-tight">More perks, less waiting.</h2><p className="mt-4 max-w-md text-white/80">Priority fulfillment and member-only drops for people who shop with intention.</p><Link href="/prime" className="btn mt-7 bg-white text-[#17221c]">Explore Plus</Link></div>
          <div className="surface p-8 md:p-10"><p className="eyebrow">Trust, made visible</p><h2 className="mt-3 text-3xl font-black tracking-tight">Shopping that feels considered.</h2><p className="muted mt-4 leading-relaxed">Every listing, seller, and order is designed to give you more clarity and fewer surprises.</p><div className="mt-7 grid grid-cols-3 gap-3"><div className="stat-pill"><b>4.9★</b><small>seller avg.</small></div><div className="stat-pill"><b>48h</b><small>fast dispatch</small></div><div className="stat-pill"><b>24/7</b><small>support</small></div></div></div>
        </section>
        <ProductGrid products={json(rated)} title="Loved by shoppers" subtitle="Top-rated products" href="/search" />
      </div>
    </>
  );
}
