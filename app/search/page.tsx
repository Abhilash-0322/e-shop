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

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  await connectDB();
  const q = one(searchParams.q)?.trim();
  const brands = many(searchParams.brand);
  const min = Number(one(searchParams.min));
  const max = Number(one(searchParams.max));
  const minRating = Number(one(searchParams.minRating));
  const minDiscount = Number(one(searchParams.minDiscount));
  const filter: Record<string, unknown> = {};
  if (q) filter.$text = { $search: q };
  if (one(searchParams.category)) filter.categorySlug = one(searchParams.category);
  if (brands.length) filter.brand = { $in: brands };
  if (Number.isFinite(min) && min > 0) filter.price = { ...(filter.price as object), $gte: min };
  if (Number.isFinite(max) && max > 0) filter.price = { ...(filter.price as object), $lte: max };
  if (Number.isFinite(minRating) && minRating > 0) filter.rating = { $gte: minRating };

  const sortKey = one(searchParams.sort) || 'relevance';
  const sortMap: Record<string, Record<string, 1 | -1>> = {
    relevance: { rating: -1, sold: -1 },
    'best-sellers': { sold: -1 },
    rating: { rating: -1, ratingCount: -1 },
    newest: { createdAt: -1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
  };
  let products = await Product.find(filter)
    .sort(sortMap[sortKey] || sortMap.relevance)
    .limit(80)
    .select('-description -reviews')
    .lean();
  if (Number.isFinite(minDiscount) && minDiscount > 0) {
    products = products.filter((product: any) => product.listPrice > product.price && ((product.listPrice - product.price) / product.listPrice) * 100 >= minDiscount);
  }

  const [brandOptions, categoryOptions] = await Promise.all([
    Product.distinct('brand', q ? { $text: { $search: q } } : {}).then((items) => items.filter(Boolean).sort().slice(0, 30)),
    Category.find({}).sort({ order: 1 }).limit(30).select('name slug').lean(),
  ]);
  const serialized = JSON.parse(JSON.stringify(products));
  const categories = JSON.parse(JSON.stringify(categoryOptions));
  const filtered = Boolean(q || brands.length || one(searchParams.category) || one(searchParams.min) || one(searchParams.max) || one(searchParams.minRating) || one(searchParams.minDiscount));

  return (
    <div className="shell py-10 md:py-14">
      <div className="mb-8 max-w-3xl">
        <p className="eyebrow">Visual discovery</p>
        <h1 className="page-title mt-2">{q ? `Results for “${q}”` : filtered ? 'Your edited selection' : 'Find your next favorite'}</h1>
        <p className="muted mt-3 text-base">Search by intent, narrow by the details that matter, and keep a shortlist for later.</p>
      </div>
      <SearchControls brands={brandOptions} categories={categories} resultCount={serialized.length} />
      <div className="mt-10">
        {serialized.length ? (
          <ProductGrid products={serialized} title={q ? 'Matched for you' : 'Fresh finds'} subtitle={filtered ? 'Your filters' : 'Curated across Halozon'} />
        ) : (
          <div className="surface flex flex-col items-center px-6 py-16 text-center">
            <div className="mb-4 rounded-2xl bg-indigo-50 p-4 text-3xl">✦</div>
            <h2 className="text-2xl font-black">Nothing matches this edit yet.</h2>
            <p className="muted mt-2 max-w-md">Try removing a filter or explore the full collection while we keep learning what you like.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/search" className="btn btn-primary">Clear filters</Link>
              <Link href="/deals" className="btn btn-soft">See current deals</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
