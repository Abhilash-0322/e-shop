import Link from 'next/link';
import ProductCard, { Product } from './ProductCard';

export default function ProductGrid({ products, title, subtitle }: { products: Product[]; title: string; subtitle?: string }) {
  if (!products.length) return null;
  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{subtitle || 'Curated selection'}</p>
          <h2 className="mt-2 text-2xl font-black tracking-[-.04em] md:text-3xl">{title}</h2>
        </div>
        <Link href="/search" className="hidden text-xs font-extrabold text-indigo-600 sm:inline">View all <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => <ProductCard key={product._id} product={product} />)}
      </div>
    </section>
  );
}
