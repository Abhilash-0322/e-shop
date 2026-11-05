import ProductCard, { Product } from './ProductCard';
import { EmptyState } from './RecoveryState';

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
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      ) : (
        <EmptyState
          title="Nothing here yet"
          description="Try a different search or explore another collection. New finds are added every day."
        />
      )}
    </section>
  );
}
