import Link from 'next/link';
import { Activity, ArrowUpRight, CheckCircle2, Clock, LayoutDashboard, ShieldCheck, Sparkles, Store, Zap } from '@/lib/icons';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import CategoryTile from '@/components/CategoryTile';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';

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
      <div className="shell space-y-10 py-8 md:py-10">
        <section className="grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
          <div className="surface p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Your workspace</p>
                <h2 className="mt-2 text-2xl font-black tracking-[-.04em]">Make a move</h2>
                <p className="muted mt-2 max-w-xl text-sm">Jump into the tasks that matter most right now.</p>
              </div>
              <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-extrabold text-emerald-700 sm:flex"><Activity className="h-3 w-3" /> All systems go</span>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              <Link href="/search" className="action-tile"><span className="action-tile-icon"><LayoutDashboard className="h-4 w-4" /></span><span><b className="mt-3 block text-sm">Discover</b><small className="muted mt-1 block text-[11px]">Search by intent</small></span></Link>
              <Link href="/account/orders" className="action-tile"><span className="action-tile-icon"><Clock className="h-4 w-4" /></span><span><b className="mt-3 block text-sm">Track orders</b><small className="muted mt-1 block text-[11px]">See what&apos;s next</small></span></Link>
              <Link href="/seller/apply" className="action-tile"><span className="action-tile-icon"><Store className="h-4 w-4" /></span><span><b className="mt-3 block text-sm">Start selling</b><small className="muted mt-1 block text-[11px]">Build your store</small></span></Link>
            </div>
          </div>
          <div className="surface p-5 md:p-6">
            <div className="flex items-center justify-between"><p className="eyebrow">Signal check</p><Sparkles className="h-4 w-4 text-[#635bff]" /></div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-emerald-600" /><span className="flex-1 text-xs font-semibold">Buyer protection</span><b className="text-sm">Active</b></div>
              <div className="flex items-center gap-3"><Zap className="h-4 w-4 text-amber-500" /><span className="flex-1 text-xs font-semibold">Fresh drops</span><b className="text-sm">Today</b></div>
              <div className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-indigo-600" /><span className="flex-1 text-xs font-semibold">Seller quality</span><b className="text-sm">4.9 / 5</b></div>
            </div>
            <Link href="/help" className="mt-5 flex items-center gap-1 text-xs font-extrabold text-indigo-600">How it works <ArrowUpRight className="h-3.5 w-3.5" /></Link>
          </div>
        </section>

        {categories.length > 0 && (
          <section>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div><p className="eyebrow">Browse by signal</p><h2 className="mt-2 text-2xl font-black tracking-[-.04em]">Shop by department</h2></div>
              <Link className="text-xs font-extrabold text-indigo-600" href="/search">View all <span aria-hidden="true">↗</span></Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">{json(categories).map((category: any) => <CategoryTile key={category._id} {...category} />)}</div>
          </section>
        )}

        <ProductGrid products={json(deals)} title="Today&apos;s drops" subtitle="Limited-time value" />
        <ProductGrid products={json(featured)} title="Editor&apos;s picks" subtitle="Chosen by the Halozon team" />

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="command-board p-7 md:p-8">
            <p className="eyebrow !text-[#9af3e4]">Halozon Plus</p>
            <h2 className="mt-3 max-w-md text-3xl font-black tracking-[-.05em]">More perks, less waiting.</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300">Priority fulfillment and member-only drops for people who shop with intention.</p>
            <Link href="/prime" className="btn mt-6 bg-white text-slate-900">Explore Plus <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          <div className="surface p-7 md:p-8">
            <p className="eyebrow">Trust built in</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-.05em]">Shopping that feels considered.</h2>
            <p className="muted mt-4 max-w-xl text-sm leading-relaxed">Every listing, seller, and order is designed to give you more clarity and fewer surprises.</p>
            <div className="mt-7 grid grid-cols-3 gap-2">
              <div className="metric-card"><b className="text-lg">4.9★</b><small className="muted mt-1 block text-[10px]">seller avg.</small></div>
              <div className="metric-card"><b className="text-lg">48h</b><small className="muted mt-1 block text-[10px]">fast dispatch</small></div>
              <div className="metric-card"><b className="text-lg">24/7</b><small className="muted mt-1 block text-[10px]">support</small></div>
            </div>
          </div>
        </section>

        <ProductGrid products={json(rated)} title="Loved by shoppers" subtitle="Top-rated products" />
      </div>
    </>
  );
}
