import Link from 'next/link';
import {ArrowRight,CheckCircle2,ShieldCheck,Sparkles} from '@/lib/icons';

type Section={title:string;body:string;points?:string[]};
export default function EditorialPage({kicker,title,intro,sections,cta}:{kicker:string;title:string;intro:string;sections:Section[];cta?:{label:string;href:string}}){
  return <div className="shell py-10 md:py-16">
    <div className="relative overflow-hidden rounded-[2rem] bg-[#173f32] text-white p-8 md:p-14"><div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#f2b47e]/20 blur-3xl animate-float"/><div className="relative max-w-3xl"><span className="pill bg-white/10 text-[#dff3e5] border border-white/15">{kicker}</span><h1 className="text-4xl md:text-6xl font-black tracking-[-.05em] mt-5">{title}</h1><p className="text-lg text-[#cfe2d5] leading-relaxed mt-5 max-w-2xl">{intro}</p>{cta&&<Link href={cta.href} className="btn bg-[#f2b47e] text-[#173f32] mt-8">{cta.label}<ArrowRight className="w-4 h-4"/></Link>}</div></div>
    <div className="grid md:grid-cols-2 gap-5 mt-8">{sections.map((s,i)=><article className="surface p-7" key={s.title}><div className="flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-[#e5f4e9] text-[#28704e] flex items-center justify-center font-black">{String(i+1).padStart(2,'0')}</span><h2 className="text-xl font-black">{s.title}</h2></div><p className="muted leading-relaxed mt-5">{s.body}</p>{s.points&&<ul className="space-y-3 mt-5 text-sm">{s.points.map(p=><li key={p} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#28704e] shrink-0 mt-0.5"/>{p}</li>)}</ul>}</article>)}</div>
    <div className="surface p-7 mt-8 flex flex-col md:flex-row md:items-center gap-5 bg-[#fff7ee] border-[#f4dfc8]"><div className="w-11 h-11 rounded-2xl bg-[#f2b47e] text-[#173f32] flex items-center justify-center"><Sparkles className="w-5 h-5"/></div><div className="flex-1"><b className="text-[#5c3926]">Designed around trust</b><p className="text-[#80624d] text-sm mt-1">Clear information, helpful support, and simple next steps are part of every Halozon experience.</p></div><ShieldCheck className="w-7 h-7 text-[#a45b27]"/></div>
  </div>;
}
