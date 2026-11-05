import Link from 'next/link';
import ProductCard, { Product } from './ProductCard';

export default function ProductGrid({
  products,
  title,
  subtitle,
}: {
  products: Product[];
  title: string;
  subtitle?: string;
}) {
  return (
    <section>
      <div className="mb-6">
        <p className="eyebrow">{subtitle || 'Curated selection'}</p>
        <h2 className="page-title mt-2">{title}</h2>
      </div>
      {products.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="surface border-dashed p-8 text-center">
          <p className="font-bold">Nothing is available in this collection yet.</p>
          <p className="muted text-sm mt-2">Try another department or search across the marketplace.</p>
          <Link href="/search" className="btn btn-soft mt-5">
            Browse all products
          </Link>
        </div>
      )}
    </section>
  );
}
