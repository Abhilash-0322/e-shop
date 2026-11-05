import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import CategoryTile from '@/components/CategoryTile';
import PersonalizedRow from '@/components/PersonalizedRow';
import Link from 'next/link';
import { ArrowUpRight, Flame, Gift, Sparkles, TrendingUp } from 'lucide-react';
import type { ReactNode } from 'react';

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
    <div className="min-h-screen pb-8">
      <Hero />
      <div className="page-shell relative z-10 -mt-16 space-y-8">
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <SignalTile label="Live shoppers" value="24.8k" accent="lime" icon={<TrendingUp className="h-4 w-4" />} />
          <SignalTile label="Drops today" value="148" accent="violet" icon={<Flame className="h-4 w-4" />} />
          <SignalTile label="Free delivery" value="$50+" accent="cyan" icon={<Gift className="h-4 w-4" />} />
          <SignalTile label="Curated weekly" value="2.4m" accent="pink" icon={<Sparkles className="h-4 w-4" />} />
        </section>

        {safeCategories.length > 0 && (
          <section>
            <div className="mb-3 flex items-end justify-between">
              <div><div className="section-kicker">Find your next</div><h2 className="mt-1 text-2xl font-black tracking-tight">Shop the signal</h2></div>
              <Link href="/search" className="amazon-link flex items-center gap-1 text-xs font-semibold">All categories <ArrowUpRight className="h-3 w-3" /></Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {safeCategories.slice(0, 4).map((c: any, index: number) => (
                <Link key={String(c._id)} href={`/category/${c.slug}`} className={`group relative min-h-[180px] overflow-hidden rounded-3xl p-5 text-white shadow-card transition-transform hover:-translate-y-1 ${['bg-[#17182a]', 'bg-[#47327d]', 'bg-[#195d62]', 'bg-[#71325a]'][index]}`}>
                  {c.image && <img src={c.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35 mix-blend-screen transition-transform duration-500 group-hover:scale-110" loading="lazy" />}
                  <div className="relative flex h-full flex-col justify-between">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/65">0{index + 1}</div>
                    <div><div className="text-xl font-black">{c.name}</div><div className="mt-2 text-xs text-white/65">Explore collection <ArrowUpRight className="inline h-3 w-3" /></div></div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <ProductGrid products={safeDeals} title="Today's Deals" subtitle="Limited time offers, moving fast" />
        <ProductGrid products={safeFeatured} title="Featured Categories" subtitle="Picked by the halozon curators" />

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_.8fr]">
          <div className="bento-card gradient-border min-h-[250px] bg-[#11121a] p-7 text-white">
            <div className="section-kicker !text-amazon-orange">Your personal orbit</div>
            <h3 className="mt-3 max-w-md text-3xl font-black tracking-[-0.04em]">A sharper way to find things you&apos;ll love.</h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/60">Sign in for personalized recommendations, faster checkout, and a feed that learns your taste.</p>
            <Link href="/signin" className="amazon-btn-yellow mt-6 inline-flex items-center gap-2">Sign in securely <ArrowUpRight className="h-4 w-4" /></Link>
            <div className="mt-4 text-xs text-white/45">New customer? <Link href="/register" className="text-white underline">Start here.</Link></div>
            <div className="absolute -bottom-16 -right-8 h-48 w-48 rounded-full bg-amazon-orange/20 blur-3xl" />
          </div>
          <div className="bento-card p-6">
            <div className="section-kicker">The fast lane</div>
            <h3 className="mt-1 text-xl font-black">Top sellers right now</h3>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {safeBestSellers.slice(0, 4).map((p: any) => (
                <Link key={p._id} href={`/product/${p._id}`} className="group rounded-2xl bg-amazon-bg p-2">
                  <img src={p.images?.[0]} alt={p.title} className="aspect-square w-full object-contain transition-transform group-hover:scale-105" loading="lazy" />
                </Link>
              ))}
            </div>
            <Link href="/deals" className="amazon-link mt-5 inline-flex items-center gap-1 text-xs font-semibold">See the full drop <ArrowUpRight className="h-3 w-3" /></Link>
          </div>
        </section>

        <ProductGrid products={safeTopRated} title="Highly Rated" subtitle="Top customer reviews" />
        {safeCategories.length > 0 && (
          <section className="panel p-5">
            <div className="mb-4 flex items-end justify-between"><div><div className="section-kicker">Browse the universe</div><h2 className="mt-1 text-2xl font-black">Shop by category</h2></div></div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
              {safeCategories.map((c: any) => <CategoryTile key={String(c._id)} name={c.name} image={c.image} slug={c.slug} />)}
            </div>
          </section>
        )}
        <ProductGrid products={safeBestSellers} title="Best Sellers" subtitle="The community has spoken" />
        <PersonalizedRow />
        <section className="bento-card flex flex-col items-center justify-between gap-5 bg-gradient-to-r from-[#d8ff3e] via-[#b8df37] to-[#34d6de] p-7 text-center md:flex-row md:text-left">
          <div><div className="section-kicker !text-amazon-navy/60">Never miss a drop</div><h3 className="mt-1 text-2xl font-black tracking-tight">Keep your orbit moving.</h3><p className="mt-1 text-sm text-amazon-navy/70">Sign in to unlock a feed built around your interests.</p></div>
          <Link href="/signin" className="amazon-btn-dark inline-flex items-center gap-2">Sign in to explore <ArrowUpRight className="h-4 w-4" /></Link>
        </section>
      </div>
    </div>
  );
}

function SignalTile({ label, value, accent, icon }: { label: string; value: string; accent: 'lime' | 'violet' | 'cyan' | 'pink'; icon: ReactNode }) {
  const colors = { lime: 'text-[#7d9c00] bg-[#d8ff3e]/25', violet: 'text-[#6b50dc] bg-[#7c5cff]/15', cyan: 'text-[#17848c] bg-[#34d6de]/20', pink: 'text-[#c33173] bg-[#ff5ca8]/15' };
  return <div className="bento-card flex items-center gap-3 p-4"><div className={`rounded-xl p-2 ${colors[accent]}`}>{icon}</div><div><div className="text-xl font-black tracking-tight">{value}</div><div className="text-[10px] uppercase tracking-[0.12em] text-amazon-textMuted">{label}</div></div></div>;
}
