import Link from 'next/link';
import {Clock, Headphones, Truck} from 'lucide-react';
import {PageHeader} from '@/components/ui';

export default function Plus() {
  return (
    <div>
      <section className="bg-slate-950 text-white">
        <div className="shell py-20 md:py-28">
          <PageHeader inverse eyebrow="Membership" title="Halozon Plus" description="Priority delivery, exclusive drops, and premium support for people who shop with intention." actions={<Link className="btn bg-white text-brand-700" href="/register">Start your free trial</Link>} />
        </div>
      </section>
      <div className="shell grid gap-5 py-14 md:grid-cols-3">
        {[[Truck, 'Fast delivery', 'Priority shipping on qualifying products.'], [Clock, 'Member drops', 'Early access to limited collections.'], [Headphones, 'Premium support', 'A faster path through order questions.']].map(([Icon, title, description]) => {
          const Glyph = Icon as typeof Truck;
          return <div className="surface p-7" key={title as string}><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-700"><Glyph className="h-5 w-5" /></div><h2 className="mt-5 text-xl font-black">{title as string}</h2><p className="muted mt-3 leading-relaxed">{description as string}</p></div>;
        })}
      </div>
    </div>
  );
}
