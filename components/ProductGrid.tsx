import Link from 'next/link';
import ProductCard, { Product } from './ProductCard';

export default function ProductGrid({ products, title, subtitle, href }: { products: Product[]; title: string; subtitle?: string; href?: string }) {
  if (!products.length) return null;
  return (
    <section>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div><p className="eyebrow">{subtitle || 'Curated selection'}</p><h2 className="page-title mt-2">{title}</h2></div>
        {href && <Link href={href} className="amazon-link hidden text-sm sm:block">See all →</Link>}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => <ProductCard key={product._id} product={product} />)}
      </div>
    </section>
  );
}
