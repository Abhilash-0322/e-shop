import Link from 'next/link';
import {ArrowRight} from '@/lib/icons';
import ProductCard,{Product} from './ProductCard';

export default function CollectionRail({products,title,kicker='The edit',description,href,linkLabel='See the collection'}:{products:Product[];title:string;kicker?:string;description?:string;href?:string;linkLabel?:string}){
  if(!products.length)return null;
  return <section>
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="eyebrow">{kicker}</p><h2 className="display-serif mt-2 text-4xl md:text-5xl">{title}</h2>{description&&<p className="muted mt-3 max-w-xl text-sm leading-relaxed">{description}</p>}</div>
      {href&&<Link href={href} className="group inline-flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#d96143]"> {linkLabel}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1"/></Link>}
    </div>
    <div className="rail">{products.map(product=><ProductCard key={product._id} product={product}/>)}</div>
  </section>
}
