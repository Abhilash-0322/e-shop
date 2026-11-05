'use client';

import {useEffect,useState} from 'react';
import {Ban,Check,CheckCircle2,Flag,ShieldCheck,Trash2} from '@/lib/icons';
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
    if(r.ok){setItems(v=>kind==='users'?v.map(x=>x._id===item._id?{...x,banned:!x.banned}:x):kind==='sellers'?v.map(x=>x._id===item._id?{...x,sellerProfile:{...x.sellerProfile,approved:!x.sellerProfile?.approved}}:x):v.filter(x=>x._id!==item._id));toast.success('Action completed')}else toast.error('Action failed');
  }
  return <div><div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3"><div><p className="eyebrow">Trust & safety</p><h1 className="page-title mt-2">{title}</h1><p className="muted mt-3">Review signals, protect people, and keep the marketplace useful.</p></div>{kind==='reviews'&&<span className="status-chip warning"><Flag className="w-3.5 h-3.5 mr-1"/> Moderation queue</span>}</div>
    <div className="surface mt-8 divide-y divide-[#dce7df] overflow-hidden">{items.map(x=><div className="p-4 md:p-5 flex items-center justify-between gap-4" key={x._id||x.reviewId}><div className="flex items-start gap-3 min-w-0"><span className="avatar w-9 h-9 shrink-0">{(x.name||x.title||x.productTitle||x.email||'H').slice(0,1).toUpperCase()}</span><div className="min-w-0"><b className="block truncate">{x.name||x.title||x.productTitle||x.email||x._id}</b><span className="muted text-sm block mt-1 line-clamp-2">{x.body||x.status||x.role||x.sellerProfile?.storeName||''}</span>{kind==='reviews'&&<span className="status-chip success mt-2"><CheckCircle2 className="w-3 h-3 mr-1"/> Reported signal</span>}</div></div>{['users','products','sellers','reviews'].includes(kind)&&<button onClick={()=>action(x)} className="btn btn-quiet !p-2 shrink-0" aria-label="Moderate">{kind==='sellers'?<Check className="w-4 h-4"/>:kind==='users'?<Ban className="w-4 h-4"/>:kind==='reviews'?<ShieldCheck className="w-4 h-4"/>:<Trash2 className="w-4 h-4"/>}</button>}</div>)}{!items.length&&<div className="p-10 text-center"><ShieldCheck className="w-8 h-8 mx-auto text-[#9eb4a5]"/><p className="font-bold mt-3">Nothing needs attention.</p><p className="muted text-sm mt-1">The queue is clear for now.</p></div>}</div>
  </div>;
}
