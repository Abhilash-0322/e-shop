import {connectDB} from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import ProductGrid from '@/components/ProductGrid';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({params, searchParams}: {params: {slug: string}; searchParams: {sort?: string}}) {
  await connectDB();
  const category = await Category.findOne({slug: params.slug}).lean() as any;
  const sort = searchParams.sort === 'price-asc' ? {price: 1} : searchParams.sort === 'price-desc' ? {price: -1} : {sold: -1};
  const products = await Product.find({categorySlug: params.slug}).sort(sort as any).limit(60).select('-description -reviews').lean();
  return (
    <div className="shell py-12">
      <section className="surface mb-10 bg-indigo-50 p-8" aria-labelledby="category-title">
        <p className="eyebrow">Collection</p>
        <h1 id="category-title" className="page-title mt-2">{category?.name || params.slug.replaceAll('-', ' ')}</h1>
        <p className="mt-3 max-w-2xl muted">{category?.description || 'Explore a focused selection from trusted Halozon sellers.'}</p>
      </section>
      <form method="get" className="mb-5 flex items-end justify-end gap-2">
        <label htmlFor="sort-products" className="sr-only">Sort products</label>
        <select id="sort-products" name="sort" defaultValue={searchParams.sort || 'popular'} className="input !w-auto">
          <option value="popular">Most popular</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
        <button type="submit" className="btn btn-soft">Apply</button>
      </form>
      <ProductGrid products={JSON.parse(JSON.stringify(products))} title="Browse the collection" />
    </div>
  );
}
