import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import ProductGrid from '@/components/ProductGrid';
import SearchControls from '@/components/SearchControls';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

type SearchParams = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function many(value: string | string[] | undefined) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: SearchParams;
}) {
  await connectDB();
  const category = (await Category.findOne({ slug: params.slug }).lean()) as any;
  const selectedBrands = many(searchParams.brand);
  const min = Number(one(searchParams.min));
  const max = Number(one(searchParams.max));
  const minRating = Number(one(searchParams.minRating));
  const q = one(searchParams.q)?.trim();
  const filter: Record<string, unknown> = { categorySlug: params.slug };
  if (q) filter.$text = { $search: q };
  if (selectedBrands.length) filter.brand = { $in: selectedBrands };
  if (Number.isFinite(min) && min > 0) filter.price = { ...(filter.price as object), $gte: min };
  if (Number.isFinite(max) && max > 0) filter.price = { ...(filter.price as object), $lte: max };
  if (Number.isFinite(minRating) && minRating > 0) filter.rating = { $gte: minRating };
  const sortKey = one(searchParams.sort) || 'relevance';
  const sortMap: Record<string, Record<string, 1 | -1>> = {
    relevance: { sold: -1, rating: -1 },
    'best-sellers': { sold: -1 },
    rating: { rating: -1, ratingCount: -1 },
    newest: { createdAt: -1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
  };
  const products = await Product.find(filter).sort(sortMap[sortKey] || sortMap.relevance).limit(80).select('-description -reviews').lean();
  const brands = await Product.distinct('brand', { categorySlug: params.slug }).then((items) => items.filter(Boolean).sort().slice(0, 30));
  const items = JSON.parse(JSON.stringify(products));
  const hasFilters = Boolean(q || selectedBrands.length || one(searchParams.min) || one(searchParams.max) || one(searchParams.minRating));
  const title = category?.name || params.slug.replaceAll('-', ' ');

  return (
    <div className="shell py-10 md:py-14">
      <div className="relative mb-8 overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white md:p-12">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="relative">
          <p className="eyebrow !text-indigo-200">Curated collection</p>
          <h1 className="page-title mt-2 capitalize">{title}</h1>
          <p className="mt-3 max-w-2xl text-indigo-100">{category?.description || 'Explore a focused selection from trusted Halozon sellers, organized around how you shop.'}</p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-indigo-100">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2">Verified sellers</span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2">Fast fulfillment</span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2">Clear pricing</span>
          </div>
        </div>
      </div>
      <SearchControls brands={brands} resultCount={items.length} />
      <div className="mt-10">
        {items.length ? (
          <ProductGrid products={items} title={hasFilters ? 'Your collection edit' : `Popular in ${title}`} subtitle={hasFilters ? 'Filtered picks' : 'Shop the signal'} />
        ) : (
          <div className="surface p-12 text-center">
            <h2 className="text-2xl font-black">This collection is between drops.</h2>
            <p className="muted mt-2">Try clearing the filters or see what is trending across Halozon.</p>
            <Link href={`/category/${params.slug}`} className="btn btn-primary mt-6">Reset collection</Link>
          </div>
        )}
      </div>
    </div>
  );
}
