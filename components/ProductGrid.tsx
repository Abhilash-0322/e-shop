import ProductCard, { Product } from './ProductCard';

export default function ProductGrid({ products, title, subtitle }: { products: Product[]; title: string; subtitle?: string }) {
  if (!products.length) return null;
  return (
    <section>
      <div className="mb-6 flex items-end justify-between border-b-2 border-black pb-3">
        <div><p className="eyebrow">{subtitle || 'Curated selection'}</p><h2 className="page-title mt-2">{title}</h2></div>
        <span className="hidden text-xs font-black uppercase md:block">{products.length} signals</span>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{products.map((p) => <ProductCard key={p._id} product={p} />)}</div>
    </section>
  );
}
