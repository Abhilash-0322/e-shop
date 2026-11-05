'use client';
import {useState} from 'react';
import {useCart} from '@/hooks/useCart';
import {Heart,ShoppingCart,ShieldCheck,Truck,Plus,Minus,Star,ArrowLeft} from '@/lib/icons';
import toast from 'react-hot-toast';
import Link from 'next/link';
import type {Product} from './ProductCard';
import ProductExtras from './ProductExtras';

type Guarantee=[React.ComponentType<any>,string];

export default function ProductView({product}:{product:Product&{description?:string;features?:string[];colors?:string[];sizes?:string[];sellerName?:string}}){
  const {add}=useCart();
  const [qty,setQty]=useState(1);
  const [saved,setSaved]=useState(false);
  const guarantees:Guarantee[]=[[Truck,'Fast delivery'],[ShieldCheck,'Buyer protected'],[Heart,'Easy returns']];
  async function addItem(){const ok=await add(product._id,qty);toast[ok?'success':'error'](ok?'Added to cart':'Sign in to add items')}
  return <div className="shell py-10 md:py-12">
    <div className="text-sm muted mb-7"><Link href="/" className="amazon-link inline-flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5"/>Home</Link><span className="mx-2">/</span>{product.title}</div>
    <div className="grid lg:grid-cols-2 gap-10">
      <div className="surface p-5"><div className="aspect-square rounded-[1.1rem] bg-[#f0f3e9] flex items-center justify-center"><img src={product.images?.[0]||'/placeholder-product.svg'} alt={product.title} className="max-w-full max-h-full object-contain mix-blend-multiply"/></div><div className="grid grid-cols-4 gap-2 mt-3">{(product.images||[]).slice(0,4).map((src:string)=><div key={src} className="aspect-square rounded-lg border border-[#e5e0d4] p-1"><img src={src} alt="" className="w-full h-full object-contain"/></div>)}</div></div>
      <div><p className="eyebrow">{product.brand||'Halozon selection'}</p><h1 className="text-4xl font-black mt-3 tracking-tight">{product.title}</h1><div className="flex items-center gap-2 mt-4 text-[#b27a20]"><Star className="w-4 h-4 fill-current"/>{product.rating?.toFixed(1)||'4.5'} <span className="text-[#718071] text-sm">({product.ratingCount||0} reviews)</span></div><div className="flex items-baseline gap-3 mt-6"><b className="text-4xl">${product.price.toFixed(2)}</b>{product.listPrice&&product.listPrice>product.price&&<del className="muted">${product.listPrice.toFixed(2)}</del>}</div><p className="muted leading-relaxed mt-5">{product.description||'A thoughtfully selected product from a trusted Halozon seller.'}</p>{product.features?.length&&<ul className="mt-5 space-y-2 text-sm">{product.features.map(x=><li key={x}>✓ {x}</li>)}</ul>}<div className="flex gap-3 mt-8"><div className="flex items-center border border-[#cfcabd] rounded-xl bg-white"><button className="p-3" onClick={()=>setQty(Math.max(1,qty-1))} aria-label="Decrease quantity"><Minus className="w-4 h-4"/></button><span className="w-8 text-center font-bold">{qty}</span><button className="p-3" onClick={()=>setQty(qty+1)} aria-label="Increase quantity"><Plus className="w-4 h-4"/></button></div><button onClick={addItem} className="btn btn-primary flex-1"><ShoppingCart className="w-5 h-5"/>Add to cart</button><button onClick={()=>setSaved(v=>!v)} className={`btn btn-soft ${saved?'text-[#c95d3f]':''}`} aria-label="Save product"><Heart className={saved?'fill-current':''}/></button></div><div className="grid grid-cols-3 gap-3 mt-8">{guarantees.map(([Icon,label])=><div key={label} className="surface p-3 text-center"><Icon className="w-5 h-5 mx-auto text-[#2e6548]"/><small className="block mt-2">{label}</small></div>)}</div></div>
    </div>
    <ProductExtras productId={product._id}/>
  </div>
}
