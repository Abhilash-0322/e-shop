import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import ProductGrid from '@/components/ProductGrid';
import Link from 'next/link';
import { ArrowRight, Check } from '@/lib/icons';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params, searchParams }: { params: { slug: string }; searchParams: { sort?: string } }) {
  await connectDB();
  const category = await Category.findOne({ slug: params.slug }).lean() as any;
  const sort = searchParams.sort === 'price-asc' ? { price: 1 } : searchParams.sort === 'price-desc' ? { price: -1 } : { sold: -1 };
  const products = await Product.find({ categorySlug: params.slug }).sort(sort as any).limit(60).select('-description -reviews').lean();
  const name = category?.name || params.slug.replaceAll('-', ' ');
  return (
    <div className="shell py-10 md:py-14">
      <div className="relative overflow-hidden rounded-[1.8rem] bg-[#17221c] p-8 text-white md:p-12">
        {category?.image && <img src={category.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />}
        <div className="absolute inset-0 bg-gradient-to-r from-[#17221c] via-[#17221c]/85 to-transparent" />
        <div className="relative max-w-2xl"><p className="eyebrow !text-[#d7f36b]">Collection / {products.length} finds</p><h1 className="mt-4 text-5xl font-black capitalize tracking-[-.06em] md:text-6xl">{name}</h1><p className="mt-4 max-w-xl text-[#c5d0c4] leading-relaxed">{category?.description || 'Explore a focused selection from trusted Halozon sellers.'}</p><div className="mt-7 flex flex-wrap gap-4 text-sm font-bold text-[#d7f36b]"><span className="flex items-center gap-2"><Check className="h-4 w-4" /> Clear product details</span><span className="flex items-center gap-2"><Check className="h-4 w-4" /> Buyer protected</span></div></div>
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4"><p className="muted text-sm">Showing {products.length} products for every kind of day.</p><div className="flex items-center gap-2"><span className="text-xs font-black uppercase tracking-wider text-[#8b998d]">Sort</span><select defaultValue={searchParams.sort || 'popular'} className="input !w-auto !py-2 text-sm" aria-label="Sort products"><option value="popular">Most popular</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></div></div>
      <div className="mt-8"><ProductGrid products={JSON.parse(JSON.stringify(products))} title={`The ${name} edit`} subtitle="Selected for you" /></div>
      {!products.length && <div className="surface mt-8 p-10 text-center"><h2 className="text-2xl font-black">This collection is still taking shape.</h2><p className="muted mt-2">There are plenty more good finds waiting elsewhere.</p><Link href="/search" className="btn btn-primary mt-6">Browse everything <ArrowRight className="h-4 w-4" /></Link></div>}
    </div>
  );
}
