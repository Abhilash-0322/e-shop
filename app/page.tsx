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
  const json = (value: any) => JSON.parse(JSON.stringify(value));
  const visualLanes = [
    ['Start with a mood', 'Soft neutrals, warm light, slow mornings.', 'from-amber-100 to-rose-100', '/search?q=warm+neutral'],
    ['Make space for focus', 'Desk pieces that help your good ideas land.', 'from-cyan-100 to-indigo-100', '/search?q=desk+setup'],
    ['Find your everyday uniform', 'Reliable staples with a little point of view.', 'from-violet-100 to-fuchsia-100', '/search?q=everyday+essentials'],
  ];

  return (
    <>
      <Hero />
      <div className="shell space-y-20 py-14 md:py-20">
        <section>
          <div className="mb-6 flex items-end justify-between">
            <div><p className="eyebrow">Explore visually</p><h2 className="page-title mt-2">Shop by department</h2></div>
            <Link className="amazon-link" href="/search">View all</Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
            {json(categories).map((category: any) => <CategoryTile key={category._id} {...category} />)}
          </div>
        </section>

        <section className="surface overflow-hidden p-6 md:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div><p className="eyebrow">A little visual direction</p><h2 className="page-title mt-2">Shop by the feeling.</h2><p className="muted mt-3 max-w-xl">Start with a scene, then use filters to make it yours. No perfect search term required.</p></div>
            <Link href="/search?visual=1" className="btn btn-soft shrink-0">Try visual discovery <span aria-hidden>↗</span></Link>
          </div>
          <div className="mt-7 grid gap-3 md:grid-cols-3">
            {visualLanes.map(([title, description, color, href]) => (
              <Link href={href} key={title} className={`group rounded-2xl bg-gradient-to-br ${color} p-5 transition hover:-translate-y-1`}>
                <span className="text-xs font-black uppercase tracking-[.16em] text-slate-500">Inspiration lane</span>
                <h3 className="mt-12 text-xl font-black tracking-tight">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{description}</p>
                <span className="mt-5 block text-sm font-black text-indigo-700 group-hover:translate-x-1 transition-transform">Explore lane →</span>
              </Link>
            ))}
          </div>
        </section>

        <ProductGrid products={json(deals)} title="Today&apos;s best drops" subtitle="Limited-time value" />
        <ProductGrid products={json(featured)} title="Editor&apos;s picks" subtitle="Chosen by the Halozon team" />
        <section className="grid gap-5 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 p-8 text-white">
            <div className="animate-float absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/20 blur-3xl" />
            <p className="eyebrow !text-indigo-100">Halozon Plus</p><h2 className="mt-3 text-3xl font-black">More perks, less waiting.</h2>
            <p className="my-5 max-w-md text-indigo-100">Priority fulfillment and member-only drops for people who shop with intention.</p>
            <Link href="/prime" className="btn bg-white text-indigo-700">Explore Plus</Link>
          </div>
          <div className="surface p-8">
            <p className="eyebrow">Trust built in</p><h2 className="mt-3 text-3xl font-black">Shopping that feels considered.</h2>
            <p className="muted mt-4 leading-relaxed">Every listing, seller, and order is designed to give you more clarity and fewer surprises.</p>
            <div className="mt-7 grid grid-cols-3 gap-3"><div className="stat-pill"><b>4.9★</b><small>seller avg.</small></div><div className="stat-pill"><b>48h</b><small>fast dispatch</small></div><div className="stat-pill"><b>24/7</b><small>support</small></div></div>
          </div>
        </section>
        <ProductGrid products={json(rated)} title="Loved by shoppers" subtitle="Top-rated products" />
      </div>
    </>
  );
}
