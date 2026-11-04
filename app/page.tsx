import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import CategoryTile from '@/components/CategoryTile';
import PersonalizedRow from '@/components/PersonalizedRow';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  await connectDB();
  const [featured, deals, topRated, bestSellers, categories] = await Promise.all([
    Product.find({ isFeatured: true }).limit(10).select('-reviews -description').lean() as any,
    Product.find({ isDeal: true }).sort({ sold: -1 }).limit(10).select('-reviews -description').lean() as any,
    Product.find().sort({ rating: -1, ratingCount: -1 }).limit(10).select('-reviews -description').lean() as any,
    Product.find().sort({ sold: -1 }).limit(10).select('-reviews -description').lean() as any,
    Category.find({ featured: true }).sort({ order: 1 }).limit(8).lean() as any,
  ]);
  const safe = (v: unknown) => JSON.parse(JSON.stringify(v));
  const safeFeatured = safe(featured);
  const safeDeals = safe(deals);
  const safeTopRated = safe(topRated);
  const safeBestSellers = safe(bestSellers);
  const safeCategories = safe(categories);

  return (
    <div className="min-h-screen pb-12">
      <Hero />

      <div className="max-w-screen-xl mx-auto px-4 md:px-6 -mt-20 relative z-10 space-y-8">
        {safeCategories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {safeCategories.slice(0, 4).map((c: any) => (
              <div key={String(c._id)} className="amazon-card p-5 border-violet-100">
                <h3 className="text-lg font-bold mb-3 text-slate-900">{c.name}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[0, 1, 2, 3].map((k) => (
                    <div key={k} className="aspect-square bg-gradient-to-br from-violet-50 to-cyan-50 rounded-xl overflow-hidden">
                      {c.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.image} alt={c.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full shimmer-bg animate-shimmer" />
                      )}
                    </div>
                  ))}
                </div>
                <Link href={`/category/${c.slug}`} className="amazon-btn-primary !text-xs !py-2 mt-4 inline-block">
                  Explore {c.name}
                </Link>
              </div>
            ))}
          </div>
        )}

        <ProductGrid products={safeDeals} title="Flash deals" subtitle="Today's best prices" />

        <ProductGrid products={safeFeatured} title="Staff picks" subtitle="Hand-selected favorites" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="amazon-card p-6 bg-hz-gradient text-white border-0 shadow-glow">
            <h3 className="text-xl font-bold mb-2">Your personalized hub</h3>
            <p className="text-sm text-white/85 mb-4">Sign in for recommendations, faster checkout, and order tracking.</p>
            <Link href="/signin" className="inline-block rounded-full bg-white text-violet-700 font-semibold px-5 py-2.5 text-sm hover:bg-violet-50 transition-colors">
              Sign in
            </Link>
            <div className="text-xs text-white/75 mt-4">
              New here?{' '}
              <Link href="/register" className="underline font-medium text-white">
                Create an account
              </Link>
            </div>
          </div>
          <div className="amazon-card p-6">
            <h3 className="text-xl font-bold mb-2 text-slate-900">Trending now</h3>
            <p className="text-sm text-amazon-textMuted mb-3">What shoppers love this week</p>
            <div className="grid grid-cols-2 gap-2">
              {safeBestSellers.slice(0, 4).map((p: any) => (
                <Link key={p._id} href={`/product/${p._id}`} className="rounded-xl border border-slate-100 p-2 hover:border-violet-200 hover:shadow-md transition-all">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.images?.[0]} alt={p.title} className="w-full aspect-square object-contain" loading="lazy" />
                </Link>
              ))}
            </div>
          </div>
          <div className="amazon-card p-6 bg-gradient-to-br from-sky-50 via-violet-50 to-pink-50 border-sky-100">
            <h3 className="text-xl font-bold mb-2 text-slate-900">Halozon Plus</h3>
            <p className="text-sm text-amazon-textMuted mb-4">Fast delivery, member deals, and early access.</p>
            <Link href="/prime" className="amazon-btn-primary inline-block">
              Try Plus free
            </Link>
            <div className="text-xs text-amazon-textMuted mt-3">Cancel anytime — no hassle.</div>
          </div>
        </div>

        <ProductGrid products={safeTopRated} title="Top rated" subtitle="Loved by the community" />

        {safeCategories.length > 0 && (
          <section className="panel p-6">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-5 text-slate-900">Shop by category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {safeCategories.map((c: any, index: number) => (
                <CategoryTile key={String(c._id)} name={c.name} image={c.image} slug={c.slug} index={index} />
              ))}
            </div>
          </section>
        )}

        <ProductGrid products={safeBestSellers} title="Best sellers" />

        <PersonalizedRow />

        <div className="rounded-3xl bg-white border border-violet-100 p-8 text-center shadow-card">
          <div className="text-xs font-semibold uppercase tracking-wider text-violet-600 mb-2">For you</div>
          <h3 className="text-2xl font-bold mb-3 text-slate-900">Unlock tailored recommendations</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">We learn what you like — without feeling like a warehouse catalog.</p>
          <Link href="/signin" className="amazon-btn-primary inline-block">
            Sign in to explore
          </Link>
        </div>
      </div>
    </div>
  );
}
