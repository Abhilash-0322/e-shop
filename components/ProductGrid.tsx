import ProductCard, {Product} from './ProductCard';
import {EmptyState, SectionHeading} from './ui';

export default function ProductGrid({products, title, subtitle}: {products: Product[]; title: string; subtitle?: string}) {
  return (
    <section>
      <SectionHeading eyebrow={subtitle || 'Curated selection'} title={title} />
      {products.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map(product => <ProductCard key={product._id} product={product} />)}
        </div>
      ) : (
        <EmptyState title="Nothing here yet" description="Try another category or broaden your search to find the right fit." />
      )}
    </section>
  );
}
