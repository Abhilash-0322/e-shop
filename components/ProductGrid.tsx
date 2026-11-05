import ProductCard,{Product} from './ProductCard';

export default function ProductGrid({products,title,subtitle}:{products:Product[];title:string;subtitle?:string}){
  if(!products.length)return null;
  return <section>
    <div className="flex items-end justify-between gap-4 mb-6"><div><p className="eyebrow">{subtitle||'Curated selection'}</p><h2 className="page-title mt-2">{title}</h2></div><span className="hidden sm:block text-xs muted">Chosen with community signals in mind</span></div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">{products.map(p=><ProductCard key={p._id} product={p}/>)}</div>
  </section>;
}
