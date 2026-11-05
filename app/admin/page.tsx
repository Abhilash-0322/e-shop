'use client';

import {useEffect,useState} from 'react';
import Link from 'next/link';
import {ArrowRight,CheckCircle2,Flag,ShieldCheck,TrendingUp} from '@/lib/icons';

export default function Admin(){
  const [d,setD]=useState<any>();
  useEffect(()=>{fetch('/api/admin/stats').then(r=>r.json()).then(setD)},[]);
  const metrics=[['Users',d?.users],['Products',d?.products],['Orders',d?.orders],['Revenue',d?.revenue],['Pending sellers',d?.pendingSellers],['Low stock',d?.lowStock]];
  return <div><div className="flex flex-col md:flex-row md:items-end justify-between gap-4"><div><p className="eyebrow">Operations</p><h1 className="page-title mt-2">Keep the marketplace worthy.</h1><p className="muted mt-3 max-w-xl">A quick read on the people, products, and signals that shape trust on Halozon.</p></div><span className="status-chip success"><CheckCircle2 className="w-3.5 h-3.5 mr-1"/> Systems healthy</span></div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">{metrics.map(([l,v])=><div className="surface p-5" key={l as string}><p className="muted text-sm">{l}</p><b className="text-3xl mt-2 block text-[#173f32]">{l==='Revenue'?`$${Number(v||0).toFixed(2)}`:v??'—'}</b><p className="text-xs text-[#28704e] mt-3 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Updated just now</p></div>)}</div>
    <div className="grid md:grid-cols-2 gap-5 mt-6"><div className="surface p-6"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0df] text-[#a45b27]"><Flag className="w-5 h-5"/></span><div><h2 className="font-black text-lg">Moderation queue</h2><p className="text-sm muted mt-1">Keep community signals useful and safe.</p></div></div><Link href="/admin/reviews" className="btn btn-quiet mt-6">Review reported content <ArrowRight className="w-4 h-4"/></Link></div><div className="surface p-6"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5f4e9] text-[#28704e]"><ShieldCheck className="w-5 h-5"/></span><div><h2 className="font-black text-lg">Trust pulse</h2><p className="text-sm muted mt-1">Signals buyers notice across the marketplace.</p></div></div><div className="grid grid-cols-3 gap-2 mt-6"><div className="stat-pill !p-2"><b className="!text-sm">94%</b><small className="!text-[10px]">verified</small></div><div className="stat-pill !p-2"><b className="!text-sm">4.8★</b><small className="!text-[10px]">avg rating</small></div><div className="stat-pill !p-2"><b className="!text-sm">98%</b><small className="!text-[10px]">resolved</small></div></div></div></div>
  </div>;
}
