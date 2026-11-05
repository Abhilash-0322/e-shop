import Link from 'next/link';
import {ArrowRight,Sparkles} from '@/lib/icons';

export default function StoryBand({kicker,title,body,href,label,tone='dark'}:{kicker:string;title:string;body:string;href:string;label:string;tone?:'dark'|'coral'|'paper'}){
  const tones={dark:'bg-[#263b3a] text-[#f6f2ea]',coral:'bg-[#d96143] text-white',paper:'bg-[#e9e2d6] text-[#202621]'};
  const subtle=tone==='paper'?'text-[#66735f]':'text-white/70';
  return <section className={`relative overflow-hidden rounded-[1.75rem] p-8 md:p-12 ${tones[tone]}`}>
    <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border-[30px] border-white/10"/>
    <div className="absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-white/10 blur-3xl"/>
    <div className="relative max-w-2xl"><span className={`pill ${tone==='coral'?'bg-white/15 text-white':tone==='paper'?'bg-white/70 text-[#59624e]':'bg-white/10 text-[#e9b7a7]'}`}><Sparkles className="mr-1 inline h-3 w-3"/>{kicker}</span><h2 className="display-serif mt-5 text-4xl md:text-6xl">{title}</h2><p className={`mt-5 max-w-xl leading-relaxed ${subtle}`}>{body}</p><Link href={href} className={`btn mt-8 ${tone==='paper'?'bg-[#263b3a] text-white':'bg-[#f6f2ea] text-[#263b3a]'}`}>{label}<ArrowRight className="h-4 w-4"/></Link></div>
  </section>
}
