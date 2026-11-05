'use client';
import {useEffect,useState} from 'react';
import {Ban,Trash2,Check,ArrowRight} from '@/lib/icons';
import toast from 'react-hot-toast';

export default function AdminList({title,endpoint}:{title:string;endpoint:string}){
  const [items,setItems]=useState<any[]>([]);
  useEffect(()=>{const c=new AbortController();fetch(endpoint,{signal:c.signal}).then(r=>r.json()).then(d=>{if(!c.signal.aborted)setItems(d.items||[])}).catch(()=>{});return()=>c.abort()},[endpoint]);
  const kind=endpoint.split('/').pop()||'';
  async function action(item:any){
    let method='DELETE';let body:any={};
    if(kind==='users'){method='PATCH';body={userId:item._id,banned:!item.banned}}
    else if(kind==='sellers'){method='PATCH';body={userId:item._id,approved:!item.sellerProfile?.approved}}
    else if(kind==='reviews')body={productId:item.productId,reviewId:item.reviewId};
    else body={productId:item._id};
    const r=await fetch(endpoint,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    if(r.ok){setItems(v=>kind==='users'?v.map(x=>x._id===item._id?{...x,banned:!x.banned}:x):kind==='sellers'?v.map(x=>x._id===item._id?{...x,sellerProfile:{...x.sellerProfile,approved:!x.sellerProfile?.approved}}:x):v.filter(x=>x._id!==item._id));toast.success('Action completed')}else toast.error('Action failed')
  }
  return <div><p className="eyebrow">Operations / Queue</p><h1 className="display-serif mt-3 text-6xl">{title}</h1><p className="muted mt-4">Review records carefully and keep the marketplace useful.</p><div className="surface mt-8 divide-y divide-[#ddd6c9]">{items.map(x=><div className="flex items-center justify-between gap-4 p-4 md:p-5" key={x._id||x.reviewId}><div className="min-w-0"><b className="block truncate">{x.name||x.title||x.productTitle||x.email||x._id}</b><span className="muted mt-1 block truncate text-sm">{x.body||x.status||x.role||x.sellerProfile?.storeName||''}</span></div>{['users','products','sellers','reviews'].includes(kind)&&<button onClick={()=>action(x)} className="btn btn-soft !p-2" aria-label="Moderate">{kind==='sellers'?<Check className="h-4 w-4"/>:kind==='users'?<Ban className="h-4 w-4"/>:<Trash2 className="h-4 w-4"/>}</button>}<ArrowRight className="h-4 w-4 shrink-0 text-[#a29a8e]"/></div>)}{!items.length&&<div className="p-8 text-center muted">No records available.</div>}</div></div>
}
