'use client';

import {useEffect,useState} from 'react';
import ProductCard,{Product} from './ProductCard';
import {ChevronLeft,ChevronRight,Sparkles} from '@/lib/icons';

type Rail={title:string;subtitle:string;products:Product[]};

export default function CuratedRail({rails}:{rails:Rail[]}){
  const [active,setActive]=useState(0);
  useEffect(()=>{
    if(rails.length<2)return;
    const timer=window.setInterval(()=>setActive(current=>(current+1)%rails.length),7000);
    return()=>window.clearInterval(timer);
  },[rails.length]);
  if(!rails.length)return null;
  const rail=rails[active];
  return <section className="rail-wrap">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
      <div><p className="eyebrow flex items-center gap-1"><Sparkles className="w-3.5 h-3.5"/>A little inspiration</p><h2 className="page-title mt-2">{rail.title}</h2><p className="muted mt-2">{rail.subtitle}</p></div>
      <div className="flex items-center gap-2">
        <div className="flex gap-1 rounded-full bg-[#e7f0e4] p-1">{rails.map((item,index)=><button key={item.title} onClick={()=>setActive(index)} aria-label={`Show ${item.title}`} className={`h-2 rounded-full transition-all ${index===active?'w-7 bg-[#2e6548]':'w-2 bg-[#b7cdb3]'}`}/>)}</div>
        <button onClick={()=>setActive(current=>(current-1+rails.length)%rails.length)} className="rounded-full border border-[#d7e0d2] p-2 hover:bg-[#e7f0e4]" aria-label="Previous collection"><ChevronLeft className="w-4 h-4"/></button>
        <button onClick={()=>setActive(current=>(current+1)%rails.length)} className="rounded-full border border-[#d7e0d2] p-2 hover:bg-[#e7f0e4]" aria-label="Next collection"><ChevronRight className="w-4 h-4"/></button>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" key={rail.title}>{rail.products.map(product=><ProductCard key={product._id} product={product}/>)}</div>
  </section>
}
