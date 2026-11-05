import ProductCard,{Product} from './ProductCard';
import {ArrowRight} from '@/lib/icons';
import Link from 'next/link';

export default function ProductGrid({products,title,subtitle='Curated selection',href,linkLabel='View all'}:{products:Product[];title:string;subtitle?:string;href?:string;linkLabel?:string}){
  if(!products.length)return <div className="surface p-10 text-center"><p className="eyebrow">A quiet moment</p><p className="mt-3 font-serif text-2xl">Nothing here yet. Try another path through the edit.</p></div>;
  return <section><div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">{subtitle}</p><h2 className="display-serif mt-2 text-4xl md:text-5xl">{title}</h2></div>{href&&<Link href={href} className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#d96143]">{linkLabel}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1"/></Link>}</div><div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">{products.map(p=><ProductCard key={p._id} product={p}/>)}</div></section>
}
