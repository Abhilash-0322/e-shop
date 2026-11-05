'use client';

import {useEffect,useState} from 'react';
import {CheckCircle2,HelpCircle,Star,TrendingUp} from '@/lib/icons';

export default function Analytics(){
  const [d,setD]=useState<any>();
  useEffect(()=>{fetch('/api/seller/analytics').then(r=>r.json()).then(setD)},[]);
  const metrics=d?.metrics||{};
  return <div><p className="eyebrow">Performance</p><h1 className="page-title mt-2">Analytics that point to action.</h1><p className="muted mt-3 max-w-xl">See how sales, service, and community confidence move together.</p>
    <div className="grid sm:grid-cols-3 gap-4 mt-8"><div className="surface p-5"><p className="muted text-sm">Revenue</p><b className="text-3xl block mt-2 text-[#173f32]">${Number(metrics.revenue||0).toFixed(2)}</b><span className="text-xs text-[#28704e] flex items-center gap-1 mt-3"><TrendingUp className="w-3 h-3"/> Sales signal</span></div><div className="surface p-5"><p className="muted text-sm">Products</p><b className="text-3xl block mt-2 text-[#173f32]">{metrics.products||0}</b><span className="text-xs muted flex items-center gap-1 mt-3"><CheckCircle2 className="w-3 h-3 text-[#28704e]"/> Active catalog</span></div><div className="surface p-5"><p className="muted text-sm">Community replies</p><b className="text-3xl block mt-2 text-[#173f32]">—</b><span className="text-xs muted flex items-center gap-1 mt-3"><HelpCircle className="w-3 h-3 text-[#28704e]"/> Add seller answers</span></div></div>
    <div className="surface p-8 mt-6"><div className="flex items-center justify-between"><div><p className="eyebrow">Trust signals</p><h2 className="text-xl font-black mt-1">What shoppers can feel.</h2></div><Star className="w-6 h-6 text-[#d88942]"/></div><div className="grid md:grid-cols-3 gap-4 mt-6"><div className="rounded-xl bg-[#f7faf7] p-4"><b>98%</b><p className="muted text-xs mt-1">positive seller sentiment</p><div className="h-2 bg-[#dce7df] rounded-full mt-4"><div className="h-2 rounded-full bg-[#4c9b6c] w-[98%]"/></div></div><div className="rounded-xl bg-[#f7faf7] p-4"><b>97%</b><p className="muted text-xs mt-1">on-time dispatch</p><div className="h-2 bg-[#dce7df] rounded-full mt-4"><div className="h-2 rounded-full bg-[#4c9b6c] w-[97%]"/></div></div><div className="rounded-xl bg-[#f7faf7] p-4"><b>4.8 / 5</b><p className="muted text-xs mt-1">average product rating</p><div className="h-2 bg-[#dce7df] rounded-full mt-4"><div className="h-2 rounded-full bg-[#e2a05e] w-[94%]"/></div></div></div></div>
  </div>;
}
