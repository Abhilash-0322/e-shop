import ProductCard,{Product} from './ProductCard';

export default function ProductGrid({
  products,
  title,
  subtitle,
}: {
  products: Product[];
  title: string;
  subtitle?: string;
}) {
  if (!products.length) return null;

  return (
    <section className="perf-section">
      <div className="mb-6">
        <p className="eyebrow">{subtitle || 'Curated selection'}</p>
        <h2 className="page-title mt-2">{title}</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
