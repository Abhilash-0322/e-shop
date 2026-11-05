'use client';

import Link from 'next/link';
import {CheckCircle2,Heart,ShoppingCart,Star} from '@/lib/icons';
import {useCart} from '@/hooks/useCart';
import {useWishlist} from '@/hooks/useWishlist';
import toast from 'react-hot-toast';

export type Product={_id:string;title:string;brand?:string;images?:string[];price:number;listPrice?:number;rating?:number;ratingCount?:number;isPrime?:boolean;stock?:number;categorySlug?:string;sellerName?:string};

export default function ProductCard({product}:{product:Product}){
  const {add}=useCart();
  const {has,toggle}=useWishlist();
  const saved=has(product._id);
  const discount=product.listPrice&&product.listPrice>product.price?Math.round((1-product.price/product.listPrice)*100):0;
  async function addItem(e:React.MouseEvent){
    e.preventDefault();
    const ok=await add(product._id);
    toast[ok?'success':'error'](ok?'Added to cart':'Sign in to add items');
  }
  return <article className="card p-3 group">
    <Link href={`/product/${product._id}`}>
      <div className="relative aspect-square rounded-xl bg-[#f0f7f1] overflow-hidden flex items-center justify-center">
        <img src={product.images?.[0]||'/placeholder-product.svg'} alt={product.title} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy"/>
        {discount>0&&<span className="absolute top-2 left-2 pill bg-[#fff0df] text-[#a45b27]">-{discount}%</span>}
        <button type="button" onClick={e=>{e.preventDefault();e.stopPropagation();toggle(product._id)}} className={`absolute right-2 top-2 rounded-full bg-white p-2 shadow-sm ${saved?'text-[#d76050]':'text-[#84958b]'}`} aria-label="Save product"><Heart className={`w-4 h-4 ${saved?'fill-current':''}`}/></button>
      </div>
      <div className="pt-4">
        <div className="flex items-center gap-1 text-[#d88942] text-xs"><Star className="w-3 h-3 fill-current"/><b>{product.rating?.toFixed(1)||'4.5'}</b><span className="text-[#84958b]">({product.ratingCount||0})</span>{(product.ratingCount||0)>10&&<span className="ml-auto flex items-center gap-1 text-[#28704e]"><CheckCircle2 className="w-3 h-3"/> trusted</span>}</div>
        <h3 className="font-bold text-sm mt-2 line-clamp-2 group-hover:text-[#28704e]">{product.title}</h3>
        {product.brand&&<p className="text-xs text-[#718178] mt-1">{product.brand}</p>}
        {product.sellerName&&<p className="text-[11px] text-[#718178] mt-2 truncate">Sold by {product.sellerName}</p>}
      </div>
    </Link>
    <div className="flex items-center justify-between mt-4"><div><b className="text-lg text-[#173f32]">${product.price.toFixed(2)}</b>{product.listPrice&&product.listPrice>product.price&&<del className="text-xs text-[#84958b] ml-2">${product.listPrice.toFixed(2)}</del>}</div><button type="button" onClick={addItem} className="rounded-xl bg-[#173f32] text-white p-2 hover:bg-[#28704e]" aria-label="Add to cart"><ShoppingCart className="w-4 h-4"/></button></div>
  </article>;
}
