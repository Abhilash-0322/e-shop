'use client';

import Link from 'next/link';
import {Heart,ShoppingCart,Star} from '@/lib/icons';
import {useCart} from '@/hooks/useCart';
import {useWishlist} from '@/hooks/useWishlist';
import toast from 'react-hot-toast';

export type Product={_id:string;title:string;brand?:string;images?:string[];price:number;listPrice?:number;rating?:number;ratingCount?:number;isPrime?:boolean;stock?:number;categorySlug?:string;sellerName?:string;sellerSlug?:string;tags?:string[]};

export default function ProductCard({product}:{product:Product}){
  const {add}=useCart();
  const {has,toggle}=useWishlist();
  const saved=has(product._id);
  const discount=product.listPrice&&product.listPrice>product.price?Math.round((1-product.price/product.listPrice)*100):0;
  async function addItem(){const ok=await add(product._id);toast[ok?'success':'error'](ok?'Added to cart':'Sign in to add items')}
  return <article className="card group overflow-hidden p-3">
    <div className="relative">
      <Link href={`/product/${product._id}`} className="block">
        <div className="relative flex aspect-[4/4.5] items-center justify-center overflow-hidden rounded-[.85rem] bg-[#eee7da]">
          <img src={product.images?.[0]||'/placeholder-product.svg'} alt={product.title} className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" loading="lazy"/>
          {discount>0&&<span className="pill pill-coral absolute left-2 top-2">-{discount}%</span>}
          {product.isPrime&&<span className="pill absolute bottom-2 left-2 bg-white/85">Halozon Plus</span>}
        </div>
      </Link>
      <button type="button" onClick={()=>toggle(product._id)} className={`absolute right-2 top-2 rounded-full bg-[#fffdf9]/90 p-2 shadow-sm ${saved?'text-[#d96143]':'text-[#70786f]'}`} aria-label="Save product"><Heart className={`h-4 w-4 ${saved?'fill-current':''}`}/></button>
    </div>
    <Link href={`/product/${product._id}`} className="block pt-4">
      <div className="flex items-center gap-1 text-xs text-[#b47748]"><Star className="h-3 w-3 fill-current"/>{product.rating?.toFixed(1)||'4.5'} <span className="text-[#a29a8e]">({product.ratingCount||0})</span></div>
      <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-snug group-hover:text-[#d96143]">{product.title}</h3>
      {product.brand&&<p className="mt-1 text-xs text-[#70786f]">{product.brand}</p>}
      {product.sellerName&&<p className="mt-3 truncate text-[11px] text-[#8a9184]">from {product.sellerName}</p>}
    </Link>
    <div className="mt-4 flex items-center justify-between gap-2"><div><b className="text-lg">${product.price.toFixed(2)}</b>{product.listPrice&&product.listPrice>product.price&&<del className="ml-2 text-xs text-[#a29a8e]">${product.listPrice.toFixed(2)}</del>}</div><button type="button" onClick={addItem} className="rounded-full bg-[#202621] p-2.5 text-white transition hover:bg-[#d96143]" aria-label="Add to cart"><ShoppingCart className="h-4 w-4"/></button></div>
  </article>
}
