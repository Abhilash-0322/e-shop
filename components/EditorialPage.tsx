import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from '@/lib/icons';

type Section = { title: string; body: string; points?: string[] };

export default function EditorialPage({ kicker, title, intro, sections, cta }: { kicker: string; title: string; intro: string; sections: Section[]; cta?: { label: string; href: string } }) {
  return (
    <div className="shell py-8 md:py-10">
      <div className="command-board p-7 md:p-12"><div className="relative z-10 max-w-3xl"><span className="pill border-white/15 bg-white/10 text-[#9af3e4]">{kicker}</span><h1 className="mt-5 text-4xl font-black tracking-[-.055em] md:text-6xl">{title}</h1><p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">{intro}</p>{cta && <Link href={cta.href} className="btn mt-8 bg-white text-slate-900">{cta.label}<ArrowRight className="h-4 w-4" /></Link>}</div></div>
      <div className="mt-7 grid gap-4 md:grid-cols-2">{sections.map((section, index) => <article className="surface p-6 md:p-7" key={section.title}><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-100 text-sm font-black text-indigo-700">{String(index + 1).padStart(2, '0')}</span><h2 className="text-lg font-black">{section.title}</h2></div><p className="muted mt-5 text-sm leading-relaxed">{section.body}</p>{section.points && <ul className="mt-5 space-y-3 text-xs">{section.points.map((point) => <li key={point} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{point}</li>)}</ul>}</article>)}</div>
      <div className="surface mt-6 flex flex-col gap-4 p-6 md:flex-row md:items-center"><span className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-100 text-indigo-700"><Sparkles className="h-5 w-5" /></span><div className="flex-1"><b className="text-sm">Designed around trust</b><p className="muted mt-1 text-xs">Clear information, helpful support, and simple next steps are part of every Halozon experience.</p></div><ShieldCheck className="h-6 w-6 text-indigo-500" /></div>
    </div>
  );
}
