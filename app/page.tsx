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

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 -mt-16 md:-mt-24 relative z-10 space-y-10">
        {/* Quick categories grid */}
        {safeCategories.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {safeCategories.slice(0, 4).map((c: any) => (
              <Link href={`/category/${c.slug}`} key={String(c._id)} className="amazon-card amazon-card-hover p-4 sm:p-5 group">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold">{c.name}</h3>
                  <span className="text-amazon-link group-hover:translate-x-1 transition-transform">↗</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[0, 1, 2, 3].map((k) => (
                    <div key={k} className="aspect-square bg-amazon-bg/80 rounded-xl overflow-hidden">
                      {c.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.image} alt={c.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full shimmer-bg animate-shimmer" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-amazon-textMuted mt-3">Explore the edit</div>
              </Link>
            ))}
          </div>
        )}

        {/* Deals strip */}
        <ProductGrid products={safeDeals} title="🔥 Today's Deals" subtitle="Limited time offers" />

        {/* Featured */}
        <ProductGrid products={safeFeatured} title="Featured Categories" />

        {/* Two-up promo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="amazon-card p-6 sm:p-7 bg-gradient-to-br from-amazon-navy to-amazon-navylight text-white md:col-span-2 relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full border border-white/10" />
            <div className="absolute right-12 bottom-4 w-20 h-20 rounded-full bg-amazon-orange/20 blur-xl" />
            <div className="relative">
            <div className="ocean-kicker !text-amazon-orangelight mb-2">Your orbit awaits</div>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Make your next find feel personal.</h3>
            <p className="text-sm text-white/70 mb-5 max-w-md">Sign in for recommendations shaped around your taste, faster checkout, and a little less scrolling.</p>
            <Link href="/signin" className="amazon-btn-yellow inline-block">Sign in securely</Link>
            <div className="text-xs text-white/70 mt-3">
              New customer?{' '}
              <Link href="/register" className="amazon-link !text-white underline">
                Start here.
              </Link>
            </div>
            </div>
          </div>
          <div className="amazon-card p-6">
            <div className="ocean-kicker mb-2">Community picks</div>
            <h3 className="text-xl font-black mb-1">Top Sellers</h3>
            <p className="text-sm text-amazon-textMuted mb-3">Most-loved items by customers</p>
            <div className="grid grid-cols-2 gap-2">
              {safeBestSellers.slice(0, 4).map((p: any) => (
                <Link key={p._id} href={`/product/${p._id}`} className="amazon-card-hover amazon-card p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.images?.[0]} alt={p.title} className="w-full aspect-square object-contain" loading="lazy" />
                </Link>
              ))}
            </div>
          </div>
          <div className="amazon-card p-6 bg-gradient-to-br from-amazon-orange/20 to-amazon-orangedark/30">
            <div className="ocean-kicker mb-2 !text-amazon-linkHover">Less waiting, more living</div>
            <h3 className="text-xl font-black mb-1">Try halozon+</h3>
            <p className="text-sm text-amazon-textMuted mb-3">Fast, free delivery on millions of items.</p>
            <Link href="/prime" className="amazon-btn-primary inline-block">Try Prime free</Link>
            <div className="text-xs text-amazon-textMuted mt-2">Cancel anytime.</div>
          </div>
        </div>

        <ProductGrid products={safeTopRated} title="Highly Rated" subtitle="Top customer reviews" />

        {/* Categories */}
        {safeCategories.length > 0 && (
          <section className="panel p-5 sm:p-6">
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="ocean-kicker mb-1">Choose your depth</div>
                <h2 className="text-2xl font-black">Shop by Category</h2>
              </div>
              <Link href="/search" className="amazon-link text-sm">View all</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {safeCategories.map((c: any) => (
                <CategoryTile key={String(c._id)} name={c.name} image={c.image} slug={c.slug} />
              ))}
            </div>
          </section>
        )}

        {/* Best Sellers */}
        <ProductGrid products={safeBestSellers} title="Best Sellers" />

        {/* Personalized */}
        <PersonalizedRow />

        {/* Bottom info block */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#dff6f5] to-[#fff1e9] border border-white rounded-3xl p-8 mt-8 text-center">
          <div className="absolute -left-12 -bottom-20 w-48 h-48 rounded-full bg-amazon-prime/20 blur-2xl" />
          <div className="relative">
          <div className="ocean-kicker mb-2">Personalized recommendations</div>
          <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-2">See more products for your interests</h3>
          <Link href="/signin" className="amazon-btn-primary inline-block mt-2">Sign in to view</Link>
          <div className="text-xs text-amazon-textMuted mt-3">
            New customer?{' '}
            <Link href="/register" className="amazon-link">Start here.</Link>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
