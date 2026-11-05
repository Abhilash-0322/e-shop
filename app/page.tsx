import {connectDB} from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import CategoryTile from '@/components/CategoryTile';
import {SectionHeading} from '@/components/ui';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  await connectDB();
  const [featured, deals, rated, categories] = await Promise.all([
    Product.find({isFeatured: true}).limit(10).select('-description -reviews').lean(),
    Product.find({isDeal: true}).sort({sold: -1}).limit(10).select('-description -reviews').lean(),
    Product.find().sort({rating: -1, ratingCount: -1}).limit(10).select('-description -reviews').lean(),
    Category.find({featured: true}).sort({order: 1}).limit(8).lean(),
  ]);
  const json = (value: unknown) => JSON.parse(JSON.stringify(value));

  return (
    <>
      <Hero />
      <div className="shell space-y-20 py-16 md:py-20">
        <section>
          <SectionHeading
            eyebrow="Explore"
            title="Shop by department"
            action={<Link className="amazon-link text-sm" href="/search">View all products →</Link>}
          />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
            {json(categories).map((category: any) => <CategoryTile key={category._id} {...category} />)}
          </div>
        </section>
        <ProductGrid products={json(deals)} title="Today&apos;s best drops" subtitle="Limited-time value" />
        <ProductGrid products={json(featured)} title="Editor&apos;s picks" subtitle="Chosen by the Halozon team" />
        <section className="grid gap-5 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-brand-700 via-brand-600 to-emerald-600 p-8 text-white md:p-10">
            <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/20 blur-3xl animate-float" />
            <p className="eyebrow !text-brand-100">Halozon Plus</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">More perks, less waiting.</h2>
            <p className="my-5 max-w-md leading-relaxed text-brand-100">Priority fulfillment and member-only drops for people who shop with intention.</p>
            <Link href="/prime" className="btn bg-white text-brand-700">Explore Plus</Link>
          </div>
          <div className="surface p-8 md:p-10">
            <p className="eyebrow">Trust built in</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">Shopping that feels considered.</h2>
            <p className="muted mt-4 max-w-xl leading-relaxed">Every listing, seller, and order is designed to give you more clarity and fewer surprises.</p>
            <div className="mt-7 grid grid-cols-3 gap-3">
              <div className="stat-pill"><b>4.9★</b><small>seller avg.</small></div>
              <div className="stat-pill"><b>48h</b><small>fast dispatch</small></div>
              <div className="stat-pill"><b>24/7</b><small>support</small></div>
            </div>
          </div>
        </section>
        <ProductGrid products={json(rated)} title="Loved by shoppers" subtitle="Top-rated products" />
      </div>
    </>
  );
}
