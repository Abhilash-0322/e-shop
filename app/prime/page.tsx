import Link from 'next/link';
import { Clock, MessageCircle, ShieldCheck, Sparkles, Truck } from '@/lib/icons';
import { getCurrentUser } from '@/lib/auth';

const benefits = [
  [Truck, 'Fast delivery', 'Priority shipping on qualifying products, with delivery context visible in your order timeline.'],
  [Sparkles, 'Member drops', 'Early access to limited collections when a member drop is available.'],
  [MessageCircle, 'Premium support', 'A clearer path through order and delivery questions when you need a hand.'],
];

export default async function Plus() {
  const user = await getCurrentUser();

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-600 to-fuchsia-600 text-white">
        <div className="absolute -right-16 -top-24 h-80 w-80 rounded-full bg-white/15 blur-3xl" />
        <div className="shell relative py-20 md:py-24">
          <div className="max-w-3xl">
            <p className="eyebrow !text-indigo-100">Membership</p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mt-3">Halozon Plus</h1>
            <p className="text-xl text-indigo-100 max-w-2xl mt-5 leading-relaxed">
              A calmer way to shop regularly: priority experiences, considered drops, and support that keeps up.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link className="btn bg-white text-indigo-700" href={user ? '/account' : '/signin?redirect=/prime'}>
                {user ? 'Go to your account' : 'Sign in to continue'}
              </Link>
              <Link className="btn border border-white/30 text-white hover:bg-white/10" href="/account/subscriptions">
                Manage subscriptions
              </Link>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 mt-12">
            {[
              ['Designed for repeat', 'Subscription tools stay separate from one-time checkout.'],
              ['Clear next steps', 'See membership and delivery context in one place.'],
              ['Flexible by design', 'Manage what you need from your account.'],
            ].map(([title, description]) => (
              <div className="surface bg-white/10 border-white/20 p-5 text-white" key={title}>
                <p className="font-black">{title}</p>
                <p className="text-sm text-indigo-100 mt-2">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="shell py-14">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow">The Plus experience</p>
            <h2 className="page-title mt-2">Useful perks, made visible.</h2>
          </div>
          <div className="surface px-4 py-3 flex items-center gap-3 text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>
              <b>{user ? 'Signed in' : 'Not signed in'}</b>
              <span className="muted block text-xs mt-0.5">
                {user ? `Welcome back, ${user.name.split(' ')[0]}.` : 'Sign in to view account-specific options.'}
              </span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mt-8">
          {benefits.map(([Icon, title, description]) => {
            const BenefitIcon = Icon as any;
            return (
              <article className="surface p-7" key={title as string}>
                <BenefitIcon className="w-7 h-7 text-indigo-600" />
                <h2 className="font-black text-xl mt-5">{title as string}</h2>
                <p className="muted mt-3 leading-relaxed">{description as string}</p>
              </article>
            );
          })}
        </div>

        <div className="surface border-indigo-200 bg-indigo-50/70 p-7 mt-8 flex flex-col md:flex-row md:items-center gap-5">
          <Clock className="w-7 h-7 text-indigo-600 shrink-0" />
          <div className="flex-1">
            <h2 className="font-black text-xl">Your delivery context stays yours.</h2>
            <p className="muted mt-2">
              Whether an order is one-time or part of a replenishment routine, the account timeline shows the next
              meaningful update without hiding the details.
            </p>
          </div>
          <Link href={user ? '/account/orders' : '/help'} className="btn btn-soft shrink-0">
            {user ? 'View your orders' : 'Explore support'}
          </Link>
        </div>
      </div>
    </div>
  );
}
