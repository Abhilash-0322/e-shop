import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from '@/lib/icons';

type Section = { title: string; body: string; points?: string[] };

export default function EditorialPage({ kicker, title, intro, sections, cta }: { kicker: string; title: string; intro: string; sections: Section[]; cta?: { label: string; href: string } }) {
  return (
    <div className="shell py-10 md:py-16">
      <div className="relative overflow-hidden rounded-[1.8rem] bg-[#17221c] p-8 text-white md:p-14">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#d7f36b]/15 blur-3xl animate-float" />
        <div className="relative max-w-3xl"><span className="pill border border-white/15 bg-white/10 text-[#d7f36b]">{kicker}</span><h1 className="mt-5 text-4xl font-black tracking-[-.06em] md:text-6xl">{title}</h1><p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#c5d0c4]">{intro}</p>{cta && <Link href={cta.href} className="btn btn-primary mt-8">{cta.label}<ArrowRight className="h-4 w-4" /></Link>}</div>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2">{sections.map((section, index) => <article className="surface p-7" key={section.title}><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d7f36b] font-black text-[#405719]">{String(index + 1).padStart(2, '0')}</span><h2 className="text-xl font-black">{section.title}</h2></div><p className="muted mt-5 leading-relaxed">{section.body}</p>{section.points && <ul className="mt-5 space-y-3 text-sm">{section.points.map((point) => <li key={point} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#728749]" />{point}</li>)}</ul>}</article>)}</div>
      <div className="surface mt-8 flex flex-col gap-5 p-7 md:flex-row md:items-center"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d7f36b] text-[#405719]"><Sparkles className="h-5 w-5" /></div><div className="flex-1"><b>Designed around trust</b><p className="muted mt-1 text-sm">Clear information, helpful support, and simple next steps are part of every Halozon experience.</p></div><ShieldCheck className="h-7 w-7 text-[#728749]" /></div>
    </div>
  );
}
