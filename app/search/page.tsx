import {connectDB} from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductGrid from '@/components/ProductGrid';
import {PageHeader} from '@/components/ui';

export const dynamic = 'force-dynamic';

export default async function SearchPage({searchParams}: {searchParams: {q?: string}}) {
  await connectDB();
  const query = searchParams.q?.trim();
  const filter: any = query ? {$text: {$search: query}} : {};
  const products = await Product.find(filter).sort({rating: -1, sold: -1}).limit(60).select('-description -reviews').lean();
  return (
    <div className="shell py-10 md:py-14">
      <PageHeader eyebrow="Search results" title={query ? `Results for “${query}”` : 'Discover products'} description="Explore products from across the Halozon marketplace." />
      <div className="mt-10"><ProductGrid products={JSON.parse(JSON.stringify(products))} title="Available now" /></div>
    </div>
  );
}
