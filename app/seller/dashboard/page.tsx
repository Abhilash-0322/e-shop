'use client';

import {useEffect,useState} from 'react';
import Link from 'next/link';
import {ArrowRight,CheckCircle2,Package,Star,TrendingUp} from '@/lib/icons';

export default function Dashboard(){
  const [data,setData]=useState<any>();
  useEffect(()=>{fetch('/api/seller/analytics').then(r=>r.json()).then(setData)},[]);
  return <div><div className="flex flex-col md:flex-row md:items-end justify-between gap-4"><div><p className="eyebrow">Seller performance</p><h1 className="page-title mt-2">Good business starts with clarity.</h1><p className="muted mt-3">The signals that help you earn the next customer’s confidence.</p></div><span className="status-chip success"><CheckCircle2 className="w-3.5 h-3.5 mr-1"/> Store healthy</span></div>
    <div className="grid sm:grid-cols-3 gap-4 mt-8">{[['Revenue',data?.metrics?.revenue||0],['Orders',data?.metrics?.orders||0],['Products',data?.metrics?.products||0]].map(([l,v])=><div className="surface p-6" key={l as string}><p className="muted text-sm">{l}</p><b className="text-3xl block mt-2 text-[#173f32]">{typeof v==='number'&&l==='Revenue'?`$${v.toFixed(2)}`:v}</b><p className="text-xs text-[#28704e] mt-3 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Compared with last period</p></div>)}</div>
    <div className="surface p-7 mt-6 bg-[#fff7ee] border-[#f4dfc8]"><div className="flex items-start gap-4"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2b47e] text-[#173f32]"><Star className="w-5 h-5"/></span><div><h2 className="text-xl font-black text-[#5c3926]">Trust is your best storefront.</h2><p className="text-sm text-[#80624d] mt-2 max-w-2xl">Reply to questions, keep dispatch promises, and invite thoughtful photo reviews. Those are the details shoppers remember.</p></div></div></div>
    <div className="surface p-8 mt-6"><h2 className="text-xl font-black">Next best actions</h2><div className="grid md:grid-cols-3 gap-3 mt-5"><Link className="card p-4" href="/seller/products/new"><Package className="w-5 h-5 text-[#28704e]"/><b className="block mt-4">Add a product</b><p className="muted text-sm mt-2">Expand your catalog with clear details.</p><span className="amazon-link text-xs flex items-center gap-1 mt-4">Start <ArrowRight className="w-3 h-3"/></span></Link><Link className="card p-4" href="/seller/orders"><CheckCircle2 className="w-5 h-5 text-[#28704e]"/><b className="block mt-4">Review orders</b><p className="muted text-sm mt-2">Stay ahead of fulfillment and updates.</p><span className="amazon-link text-xs flex items-center gap-1 mt-4">Open orders <ArrowRight className="w-3 h-3"/></span></Link><Link className="card p-4" href="/seller/analytics"><TrendingUp className="w-5 h-5 text-[#28704e]"/><b className="block mt-4">View analytics</b><p className="muted text-sm mt-2">Understand what is earning trust.</p><span className="amazon-link text-xs flex items-center gap-1 mt-4">See insights <ArrowRight className="w-3 h-3"/></span></Link></div></div>
  </div>;
}
