import {connectDB} from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import ProductGrid from '@/components/ProductGrid';
import {PageHeader} from '@/components/ui';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({params, searchParams}: {params: {slug: string}; searchParams: {sort?: string}}) {
  await connectDB();
  const category = await Category.findOne({slug: params.slug}).lean() as any;
  const sort = searchParams.sort === 'price-asc' ? {price: 1} : searchParams.sort === 'price-desc' ? {price: -1} : {sold: -1};
  const products = await Product.find({categorySlug: params.slug}).sort(sort as any).limit(60).select('-description -reviews').lean();
  return (
    <div className="shell py-10 md:py-14">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-brand-100 via-white to-emerald-50 p-7 md:p-10">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-200/50 blur-3xl" />
        <div className="relative"><PageHeader eyebrow="Collection" title={category?.name || params.slug.replaceAll('-', ' ')} description={category?.description || 'Explore a focused selection from trusted Halozon sellers.'} /></div>
      </div>
      <div className="mt-9 flex flex-wrap items-end justify-between gap-3">
        <p className="muted text-sm">{products.length} products available</p>
        <label className="text-sm font-bold">Sort<select defaultValue={searchParams.sort || 'popular'} className="input mt-2 !w-auto min-w-44" aria-label="Sort products"><option value="popular">Most popular</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label>
      </div>
      <div className="mt-8"><ProductGrid products={JSON.parse(JSON.stringify(products))} title="Browse the collection" /></div>
    </div>
  );
}
