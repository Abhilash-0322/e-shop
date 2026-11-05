'use client';
import Link from 'next/link';
import {Heart,ShoppingCart,Star,ArrowUpRight} from '@/lib/icons';
import {useCart} from '@/hooks/useCart';
import {useWishlist} from '@/hooks/useWishlist';
import toast from 'react-hot-toast';

export type Product={_id:string;title:string;brand?:string;images?:string[];price:number;listPrice?:number;rating?:number;ratingCount?:number;isPrime?:boolean;stock?:number;categorySlug?:string};

export default function ProductCard({product}:{product:Product}){
  const {add}=useCart();
  const {has,toggle}=useWishlist();
  const saved=has(product._id);
  const discount=product.listPrice&&product.listPrice>product.price?Math.round((1-product.price/product.listPrice)*100):0;
  async function addItem(e:React.MouseEvent){e.preventDefault();const ok=await add(product._id);toast[ok?'success':'error'](ok?'Added to cart':'Sign in to add items')}
  return <article className="card p-3 group">
    <Link href={`/product/${product._id}`}>
      <div className="relative aspect-square rounded-[.9rem] bg-[#f0f3e9] overflow-hidden flex items-center justify-center">
        <img src={product.images?.[0]||'/placeholder-product.svg'} alt={product.title} className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" loading="lazy"/>
        <div className="absolute top-2 left-2 flex gap-1">{discount>0&&<span className="pill bg-[#c95d3f] text-white">-{discount}%</span>}{product.isPrime&&<span className="pill bg-white/90 text-[#2e6548]">Plus</span>}</div>
        <button type="button" onClick={e=>{e.preventDefault();e.stopPropagation();toggle(product._id)}} className={`absolute right-2 top-2 rounded-full bg-white p-2 shadow-sm ${saved?'text-[#c95d3f]':'text-[#718071]'}`} aria-label="Save product"><Heart className={`w-4 h-4 ${saved?'fill-current':''}`}/></button>
        <span className="absolute right-2 bottom-2 rounded-full bg-white/85 p-2 opacity-0 group-hover:opacity-100 transition-opacity"><ArrowUpRight className="w-4 h-4 text-[#2e6548]"/></span>
      </div>
      <div className="pt-4">
        <div className="flex items-center gap-1 text-[#b27a20] text-xs"><Star className="w-3 h-3 fill-current"/>{product.rating?.toFixed(1)||'4.5'} <span className="text-[#8a958a]">({product.ratingCount||0})</span></div>
        <h3 className="font-bold text-sm mt-2 line-clamp-2 group-hover:text-[#2e6548]">{product.title}</h3>
        {product.brand&&<p className="text-xs text-[#718071] mt-1">{product.brand}</p>}
      </div>
    </Link>
    <div className="flex items-center justify-between mt-4"><div><b className="text-lg">${product.price.toFixed(2)}</b>{product.listPrice&&product.listPrice>product.price&&<del className="text-xs text-[#8a958a] ml-2">${product.listPrice.toFixed(2)}</del>}</div><button type="button" onClick={addItem} className="rounded-xl bg-[#2e6548] text-white p-2 hover:bg-[#1e4933]" aria-label="Add to cart"><ShoppingCart className="w-4 h-4"/></button></div>
  </article>
}
