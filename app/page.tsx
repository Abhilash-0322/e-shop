import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import CategoryTile from '@/components/CategoryTile';
import PersonalizedRow from '@/components/PersonalizedRow';
import Link from 'next/link';
import { ArrowUpRight, BadgeCheck, HeartHandshake, Sparkles, Users, type LucideIcon } from 'lucide-react';

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
      <div className="max-w-screen-xl mx-auto px-4 -mt-24 relative z-10 space-y-10">
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {([
            ['01', 'Human first', 'Meet the maker behind every shop.', Users],
            ['02', 'Trust built in', 'Real reviews from real buyers.', BadgeCheck],
            ['03', 'Easy on repeat', 'Save a favorite and come back.', HeartHandshake],
            ['04', 'Always fresh', 'New drops every week.', Sparkles],
          ] as [string, string, string, LucideIcon][]).map(([number, title, text, FeatureIcon]) => {
            return (
              <div key={String(number)} className="amazon-card p-4 md:p-5 bg-amazon-panel/95 backdrop-blur">
                <div className="flex justify-between items-start mb-5"><span className="eyebrow">{number}</span><FeatureIcon className="w-5 h-5 text-amazon-orange" /></div>
                <h3 className="font-bold">{String(title)}</h3><p className="text-xs text-amazon-textMuted mt-1">{String(text)}</p>
              </div>
            );
          })}
        </section>

        {safeCategories.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-4"><div><p className="eyebrow">Browse by mood</p><h2 className="text-3xl font-black tracking-tight">Find your next thing</h2></div><Link href="/search" className="amazon-link text-sm inline-flex items-center gap-1">See all <ArrowUpRight className="w-4 h-4" /></Link></div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {safeCategories.map((c: any) => <CategoryTile key={String(c._id)} name={c.name} image={c.image} slug={c.slug} />)}
            </div>
          </section>
        )}

        <ProductGrid products={safeDeals} title="Fresh drops" subtitle="Limited pieces, ready for a new home" showMore moreHref="/deals" />
        <section className="grid grid-cols-1 lg:grid-cols-[1.2fr_.8fr] gap-5">
          <div className="rounded-3xl p-7 md:p-10 bg-amazon-navy text-white overflow-hidden relative soft-grid">
            <div className="relative z-10 max-w-lg"><p className="eyebrow !text-amazon-yellow">For the independent</p><h2 className="text-4xl md:text-5xl font-black tracking-tight mt-3">Your taste deserves a storefront.</h2><p className="text-white/70 mt-4 max-w-md">Open a studio, share your point of view, and turn the things you make into a community.</p><Link href="/seller/apply" className="amazon-btn-yellow inline-flex items-center gap-2 mt-7">Become a creator <ArrowUpRight className="w-4 h-4" /></Link></div>
            <div className="absolute -right-16 -bottom-24 w-72 h-72 rounded-full bg-amazon-orange/40 blur-2xl" />
          </div>
          <div className="rounded-3xl p-7 bg-amazon-yellow text-amazon-navy"><p className="eyebrow !text-amazon-navy/60">Community note</p><div className="text-6xl font-black mt-8">4.9<span className="text-2xl">/5</span></div><p className="font-bold mt-1">average maker rating</p><p className="text-sm mt-6 text-amazon-navy/70">“It feels like discovering a great little shop in a city I’ve never visited.”</p><div className="flex -space-x-2 mt-5">{['A','M','J','S'].map((x) => <span key={x} className="grid place-items-center w-8 h-8 rounded-full bg-amazon-navy text-amazon-yellow text-xs font-bold border-2 border-amazon-yellow">{x}</span>)}</div></div>
        </section>

        <ProductGrid products={safeFeatured} title="Editor’s picks" subtitle="A considered collection from the halozon community" />
        <ProductGrid products={safeTopRated} title="Loved by the community" subtitle="The reviews are in" />
        <ProductGrid products={safeBestSellers} title="What’s moving now" showMore moreHref="/search?sort=best-sellers" />
        <PersonalizedRow />
        <div className="text-center py-8"><p className="eyebrow">Keep exploring</p><h2 className="text-3xl font-black mt-2">There’s a world of good stuff out there.</h2><Link href="/search" className="amazon-btn-primary inline-flex items-center gap-2 mt-5">Explore everything <ArrowUpRight className="w-4 h-4" /></Link></div>
      </div>
    </div>
  );
}
