import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import ProductGrid from '@/components/ProductGrid';
import SortSelect from '@/components/SortSelect';
export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params, searchParams }: { params: { slug: string }; searchParams: { sort?: string } }) {
  await connectDB();
  const category = await Category.findOne({ slug: params.slug }).lean() as any;
  const sort = searchParams.sort === 'price-asc' ? { price: 1 } : searchParams.sort === 'price-desc' ? { price: -1 } : { sold: -1 };
  const products = await Product.find({ categorySlug: params.slug }).sort(sort as any).limit(60).select('-description -reviews').lean();
  return (
    <div className="shell py-12">
      <div className="surface mb-10 overflow-hidden bg-gradient-to-r from-[#e3f1ed] to-[#fff4ed] p-8 md:p-10">
        <p className="eyebrow">Collection</p>
        <h1 className="page-title mt-2 capitalize">{category?.name || params.slug.replaceAll('-', ' ')}</h1>
        <p className="muted mt-3 max-w-2xl">{category?.description || 'Explore a focused selection from trusted Halozon sellers.'}</p>
      </div>
      <div className="mb-5 flex justify-end"><SortSelect value={searchParams.sort || 'popular'} /></div>
      <ProductGrid products={JSON.parse(JSON.stringify(products))} title="Browse the collection" />
    </div>
  );
}
