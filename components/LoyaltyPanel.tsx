import Link from 'next/link';
import { ArrowRight, Package, Sparkles, Truck } from '@/lib/icons';

export default function LoyaltyPanel({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="reward-card p-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-indigo-200">
          <Sparkles className="h-4 w-4 text-cyan-300" /> Plus value
        </div>
        <h2 className="mt-3 text-xl font-black">More value from this order.</h2>
        <p className="mt-2 text-sm leading-6 text-indigo-100/75">
          Eligible items earn points and unlock free delivery with Halozon Plus.
        </p>
        <Link href="/prime" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-cyan-300">
          See benefits <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <section className="reward-card p-6 md:p-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-indigo-200">
            <Sparkles className="h-4 w-4 text-cyan-300" /> The Plus advantage
          </div>
          <h2 className="mt-3 text-3xl font-black tracking-[-.03em]">Every order gives something back.</h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-indigo-100/75">
            Free delivery, member pricing, and points that become checkout credit. Everything is shown before you pay.
          </p>
          <Link href="/prime" className="btn mt-6 bg-white text-indigo-700">
            Explore Plus <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Truck, value: 'Free delivery', label: 'on eligible items' },
            { icon: Sparkles, value: '2× points', label: 'on Plus picks' },
            { icon: Package, value: '30-day', label: 'easy returns' },
            { icon: ArrowRight, value: '$3 credit', label: 'at 300 points' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={value} className="rounded-2xl border border-white/15 bg-white/10 p-4">
              <Icon className="h-5 w-5 text-cyan-300" />
              <div className="mt-4 font-bold">{value}</div>
              <div className="mt-1 text-xs text-indigo-100/65">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
