import Link from 'next/link';
import {ArrowLeft,ArrowRight} from '@/lib/icons';

export default function CollectionIntro({kicker,title,body,backHref,backLabel='All collections',actionHref,actionLabel}:{kicker:string;title:string;body:string;backHref?:string;backLabel?:string;actionHref?:string;actionLabel?:string}){
  return <div className="mb-10 border-b border-[#ddd6c9] pb-8">
    {backHref&&<Link href={backHref} className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#66735f] hover:text-[#d96143]"><ArrowLeft className="h-3 w-3"/>{backLabel}</Link>}
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="eyebrow">{kicker}</p><h1 className="display-serif mt-3 max-w-4xl text-5xl md:text-7xl">{title}</h1><p className="muted mt-5 max-w-2xl text-base leading-relaxed">{body}</p></div>{actionHref&&<Link href={actionHref} className="btn btn-primary shrink-0">{actionLabel}<ArrowRight className="h-4 w-4"/></Link>}</div>
  </div>
}
