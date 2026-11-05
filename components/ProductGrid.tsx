import ProductCard, { Product } from './ProductCard';

export default function ProductGrid({ products, title, subtitle }: { products: Product[]; title: string; subtitle?: string }) {
  if (!products.length) return null;
  return <section>
    <div className="mb-5 flex items-end justify-between gap-4 sm:mb-6">
      <div><p className="eyebrow">{subtitle || 'Curated selection'}</p><h2 className="page-title mt-2">{title}</h2></div>
      <span className="shrink-0 text-xs font-bold text-slate-400 sm:hidden">Swipe to explore →</span>
    </div>
    <div className="rail -mx-4 px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => <ProductCard key={product._id} product={product} />)}
    </div>
  </section>;
}
