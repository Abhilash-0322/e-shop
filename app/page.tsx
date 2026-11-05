import Link from 'next/link';
import { ArrowUpRight, Heart, Sparkles, WandSparkles } from 'lucide-react';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import CategoryTile from '@/components/CategoryTile';
import PersonalizedRow from '@/components/PersonalizedRow';

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
  const safe = (value: unknown) => JSON.parse(JSON.stringify(value));
  const safeFeatured = safe(featured);
  const safeDeals = safe(deals);
  const safeTopRated = safe(topRated);
  const safeBestSellers = safe(bestSellers);
  const safeCategories = safe(categories);

  return (
    <div className="pb-10">
      <Hero />
      <div className="mx-auto max-w-screen-xl px-4">
        <section className="relative z-10 -mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { icon: '✦', title: 'Made with intention', desc: 'Thoughtful finds from real people', color: 'bg-amazon-mint' },
            { icon: '♡', title: 'Save your favorites', desc: 'Build a little wish cloud', color: 'bg-[#f4eafa]' },
            { icon: '↗', title: 'Easy, breezy checkout', desc: 'Secure from cart to doorstep', color: 'bg-[#fff0e6]' },
            { icon: '☼', title: 'Feel-good support', desc: 'Humans here when you need us', color: 'bg-[#fff7d8]' },
          ].map((item) => (
            <div key={item.title} className={`rounded-2xl p-4 shadow-card ${item.color}`}>
              <div className="mb-2 text-2xl">{item.icon}</div>
              <div className="text-sm font-black">{item.title}</div>
              <div className="mt-1 text-xs text-amazon-textMuted">{item.desc}</div>
            </div>
          ))}
        </section>

        {safeCategories.length > 0 && (
          <section className="mt-12">
            <div className="mb-4 flex items-end justify-between">
              <div><div className="mb-1 text-[10px] font-black uppercase tracking-[.2em] text-amazon-orange">Start somewhere lovely</div><h2 className="text-3xl font-black tracking-tight">Shop by feeling</h2></div>
              <Link href="/search" className="amazon-link text-sm font-bold">See every category →</Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
              {safeCategories.map((category: any) => <CategoryTile key={String(category._id)} name={category.name} image={category.image} slug={category.slug} />)}
            </div>
          </section>
        )}

        <div className="mt-12">
          <ProductGrid products={safeDeals} title="Fresh drops & happy prices" subtitle="The good stuff is moving — find your new everyday favorite." showMore moreHref="/deals" />
        </div>

        <section className="my-12 grid gap-4 md:grid-cols-[1.35fr_.65fr]">
          <div className="relative overflow-hidden rounded-3xl bg-amazon-navy p-8 text-white md:p-10">
            <div className="floating-shape -right-14 -top-14 h-48 w-48 bg-amazon-orange/70" />
            <WandSparkles className="mb-6 h-8 w-8 text-amazon-yellow" />
            <div className="relative max-w-lg"><div className="mb-2 text-xs font-black uppercase tracking-[.2em] text-amazon-orangelight">The halozon promise</div><h2 className="text-3xl font-black tracking-tight md:text-4xl">Shopping should feel like a little discovery.</h2><p className="mt-4 text-sm leading-relaxed text-white/70">We bring together curious shoppers and independent sellers in a space that feels human, bright, and easy to navigate.</p><Link href="/info/about" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-amazon-navy">Our story <ArrowUpRight className="h-4 w-4" /></Link></div>
          </div>
          <div className="rounded-3xl bg-amazon-mint p-7">
            <Heart className="mb-6 h-8 w-8 fill-amazon-orange text-amazon-orange" />
            <h2 className="text-2xl font-black">Have a point of view?</h2>
            <p className="mt-3 text-sm leading-relaxed text-amazon-textMuted">Open your own little corner of halozon and find people who get what you make.</p>
            <Link href="/seller/apply" className="amazon-btn-primary mt-6 inline-block">Meet the seller studio →</Link>
          </div>
        </section>

        <ProductGrid products={safeFeatured} title="Editor-approved energy" subtitle="A handpicked lineup of clever, beautiful, and very giftable things." />
        <ProductGrid products={safeTopRated} title="Loved by the community" subtitle="The five-star corner of the internet." />
        <ProductGrid products={safeBestSellers} title="Main character essentials" subtitle="Popular for a reason — these are having a moment." />
        <PersonalizedRow />
        <section className="mt-12 rounded-3xl border border-amazon-border bg-white/70 p-8 text-center md:p-12">
          <Sparkles className="mx-auto mb-3 h-7 w-7 text-amazon-orange" />
          <h2 className="text-3xl font-black tracking-tight">Your next favorite is waiting.</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-amazon-textMuted">Sign in to tune your feed, keep a wish cloud, and pick up right where you left off.</p>
          <Link href="/signin" className="amazon-btn-primary mt-6 inline-block">Make it personal</Link>
        </section>
      </div>
    </div>
  );
}
