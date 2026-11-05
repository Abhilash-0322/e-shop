import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import CategoryTile from '@/components/CategoryTile';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  await connectDB();
  const [featured, deals, rated, categories] = await Promise.all([
    Product.find({ isFeatured: true }).limit(10).select('-description -reviews').lean(),
    Product.find({ isDeal: true }).sort({ sold: -1 }).limit(10).select('-description -reviews').lean(),
    Product.find().sort({ rating: -1, ratingCount: -1 }).limit(10).select('-description -reviews').lean(),
    Category.find({ featured: true }).sort({ order: 1 }).limit(8).lean(),
  ]);
  const json = (v: any) => JSON.parse(JSON.stringify(v));
  return <><Hero /><div className="shell space-y-20 py-16">
    <section><div className="mb-6 flex items-end justify-between border-b-2 border-black pb-3"><div><p className="eyebrow">01 / Explore</p><h2 className="page-title mt-2">Shop by department</h2></div><Link className="amazon-link text-sm uppercase" href="/search">View all ↗</Link></div><div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">{json(categories).map((c: any) => <CategoryTile key={c._id} {...c} />)}</div></section>
    <ProductGrid products={json(deals)} title="Today's best drops" subtitle="02 / Limited-time value" />
    <ProductGrid products={json(featured)} title="Editor's picks" subtitle="03 / Chosen by the HZN team" />
    <section className="grid gap-5 lg:grid-cols-2"><div className="border-2 border-black bg-[#ff5c35] p-8 shadow-[7px_7px_0_#101010]"><p className="eyebrow !text-black">04 / Halozon Plus</p><h2 className="mt-3 text-3xl font-black uppercase">More perks,<br />less waiting.</h2><p className="my-5 max-w-md text-sm leading-relaxed">Priority fulfillment and member-only drops for people who shop with intention.</p><Link href="/prime" className="btn bg-black text-white">Explore Plus ↗</Link></div><div className="surface p-8"><p className="eyebrow">Trust built in</p><h2 className="mt-3 text-3xl font-black uppercase">Shopping that feels considered.</h2><p className="muted mt-4 leading-relaxed">Every listing, seller, and order is designed to give you more clarity and fewer surprises.</p><div className="mt-7 grid grid-cols-3 gap-3"><div className="stat-pill"><b>4.9★</b><small>seller avg.</small></div><div className="stat-pill"><b>48h</b><small>fast dispatch</small></div><div className="stat-pill"><b>24/7</b><small>support</small></div></div></div></section>
    <ProductGrid products={json(rated)} title="Loved by shoppers" subtitle="05 / Top-rated products" />
  </div></>;
}
