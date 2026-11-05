'use client';

import {useState} from 'react';
import {useCart} from '@/hooks/useCart';
import {CheckCircle2,Heart,MessageCircle,Minus,Plus,ShieldCheck,ShoppingCart,Star,Truck} from '@/lib/icons';
import toast from 'react-hot-toast';
import Link from 'next/link';
import type {Product} from './ProductCard';
import ProductExtras from './ProductExtras';

export default function ProductView({product}:{product:Product&{description?:string;features?:string[];colors?:string[];sizes?:string[];sellerName?:string}}){
  const {add}=useCart();
  const [qty,setQty]=useState(1);
  const [saved,setSaved]=useState(false);
  const benefits=[[Truck,'Fast delivery','Ships in 1–2 days'],[ShieldCheck,'Buyer protected','Support if it is not right'],[Heart,'Easy returns','30 days, no awkwardness']] as const;
  async function addItem(){
    const ok=await add(product._id,qty);
    toast[ok?'success':'error'](ok?'Added to cart':'Sign in to add items');
  }
  const seller=product.sellerName||'Halozon verified seller';
  return <div className="shell py-10 md:py-14">
    <div className="text-sm muted mb-7"><Link href="/" className="amazon-link">Home</Link><span className="mx-2">/</span>{product.brand||'Product'}<span className="mx-2">/</span>{product.title}</div>
    <div className="grid lg:grid-cols-[.95fr_1.05fr] gap-8 lg:gap-12">
      <div>
        <div className="surface p-5"><div className="aspect-square rounded-[1.25rem] bg-[#f0f7f1] flex items-center justify-center"><img src={product.images?.[0]||'/placeholder-product.svg'} alt={product.title} className="max-w-full max-h-full object-contain"/></div><div className="grid grid-cols-5 gap-2 mt-3">{(product.images||[]).slice(0,5).map((src:string,index)=><div key={`${src}-${index}`} className="aspect-square rounded-lg border border-[#dce7df] p-1 bg-white"><img src={src} alt="" className="w-full h-full object-contain"/></div>)}</div></div>
        <div className="grid grid-cols-3 gap-3 mt-4">{benefits.map(([I,title,detail])=>{const Icon=I as any;return <div key={title} className="surface p-3"><Icon className="w-5 h-5 text-[#28704e]"/><b className="block text-xs mt-3">{title}</b><small className="block text-[11px] muted mt-1">{detail}</small></div>})}</div>
      </div>
      <div>
        <p className="eyebrow">{product.brand||'Halozon selection'}</p>
        <h1 className="text-4xl md:text-5xl font-black tracking-[-.05em] mt-3">{product.title}</h1>
        <a href="#community-proof" className="flex flex-wrap items-center gap-2 mt-4 text-sm"><span className="text-[#d88942] flex items-center gap-1"><Star className="w-4 h-4 fill-current"/><b>{product.rating?.toFixed(1)||'4.5'}</b></span><span className="amazon-link underline-offset-4">{product.ratingCount||0} community reviews</span><span className="status-chip success"><CheckCircle2 className="w-3 h-3 mr-1"/> Verified signals</span></a>
        <div className="flex items-baseline gap-3 mt-7"><b className="text-4xl text-[#173f32]">${product.price.toFixed(2)}</b>{product.listPrice&&product.listPrice>product.price&&<><del className="muted">${product.listPrice.toFixed(2)}</del><span className="status-chip warning">Save {Math.round((1-product.price/product.listPrice)*100)}%</span></>}</div>
        <p className="muted leading-relaxed mt-5 max-w-2xl">{product.description||'A thoughtfully selected product from a trusted Halozon seller.'}</p>
        {product.features?.length&&<ul className="mt-6 space-y-2 text-sm">{product.features.map(x=><li key={x} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#28704e] mt-0.5 shrink-0"/>{x}</li>)}</ul>}
        <div className="surface p-4 mt-7"><div className="flex items-center gap-3"><span className="avatar w-10 h-10 text-sm">{seller.slice(0,1).toUpperCase()}</span><div className="flex-1"><div className="flex items-center gap-2"><b>{seller}</b><CheckCircle2 className="w-4 h-4 text-[#28704e]"/></div><p className="text-xs muted mt-1">98% positive · 2.4k orders · responds within a day</p></div><Link href="/info/seller-standards" className="text-xs amazon-link">Seller profile</Link></div><div className="grid grid-cols-3 gap-2 mt-4"><div className="stat-pill !p-2"><b className="!text-sm">4.8/5</b><small className="!text-[10px]">shopper rating</small></div><div className="stat-pill !p-2"><b className="!text-sm">97%</b><small className="!text-[10px]">on-time dispatch</small></div><div className="stat-pill !p-2"><b className="!text-sm">1.2k</b><small className="!text-[10px]">helpful votes</small></div></div></div>
        <div className="flex gap-3 mt-7"><div className="flex items-center border border-[#c9d8ce] rounded-xl bg-white"><button className="p-3 hover:bg-[#eef7f0]" onClick={()=>setQty(Math.max(1,qty-1))} aria-label="Decrease quantity"><Minus className="w-4 h-4"/></button><span className="w-8 text-center font-bold">{qty}</span><button className="p-3 hover:bg-[#eef7f0]" onClick={()=>setQty(qty+1)} aria-label="Increase quantity"><Plus className="w-4 h-4"/></button></div><button onClick={addItem} className="btn btn-primary flex-1"><ShoppingCart className="w-5 h-5"/>Add to cart</button><button onClick={()=>setSaved(v=>!v)} className={`btn btn-soft ${saved?'text-[#d76050]':''}`} aria-label="Save product"><Heart className={saved?'fill-current':''}/></button></div>
        <a href="#ask" className="mt-4 flex items-center gap-2 text-sm amazon-link"><MessageCircle className="w-4 h-4"/> Have a question? Ask the community before buying.</a>
      </div>
    </div>
    <ProductExtras productId={product._id} rating={product.rating} ratingCount={product.ratingCount}/>
  </div>;
}
