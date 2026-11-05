import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowUpRight, Heart, Package, Sparkles } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import AccountLayout from './AccountLayout';

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin?redirect=/account');
  return (
    <AccountLayout user={user}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[.2em] text-amazon-orange"><Sparkles className="h-4 w-4" /> Your studio</div><h1 className="text-4xl font-black tracking-tight">Good to see you, {user.name.split(' ')[0]}.</h1><p className="mt-2 text-sm text-amazon-textMuted">Everything you love, in one happy place.</p></div>
        <Link href="/search" className="amazon-btn-primary">Keep exploring <ArrowUpRight className="ml-1 inline h-4 w-4" /></Link>
      </div>
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-amazon-mint p-5"><Package className="mb-6 h-6 w-6 text-amazon-greenDark" /><div className="text-xs font-bold uppercase tracking-widest text-amazon-textMuted">Your next chapter</div><div className="mt-1 text-xl font-black">Track an order</div><Link href="/account/orders" className="mt-3 inline-block text-sm font-bold text-amazon-link">See your orders →</Link></div>
        <div className="rounded-3xl bg-[#f4eafa] p-5"><Heart className="mb-6 h-6 w-6 fill-amazon-orange text-amazon-orange" /><div className="text-xs font-bold uppercase tracking-widest text-amazon-textMuted">Your happy list</div><div className="mt-1 text-xl font-black">Save a little magic</div><Link href="/account/wishlist" className="mt-3 inline-block text-sm font-bold text-amazon-link">View saved finds →</Link></div>
        <div className="rounded-3xl bg-[#fff0e6] p-5"><Sparkles className="mb-6 h-6 w-6 text-amazon-orange" /><div className="text-xs font-bold uppercase tracking-widest text-amazon-textMuted">Want to make?</div><div className="mt-1 text-xl font-black">Open a seller studio</div><Link href={(user as any).role === 'seller' ? '/seller/dashboard' : '/seller/apply'} className="mt-3 inline-block text-sm font-bold text-amazon-link">{(user as any).role === 'seller' ? 'Visit your dashboard →' : 'Learn about selling →'}</Link></div>
      </div>
      <section className="rounded-3xl border border-amazon-border bg-white/80 p-6 shadow-card">
        <div className="mb-5 flex items-end justify-between"><div><div className="text-xs font-bold uppercase tracking-widest text-amazon-textMuted">Manage your world</div><h2 className="mt-1 text-2xl font-black">Shortcuts for a softer life</h2></div></div>
        <div className="grid gap-3 md:grid-cols-2">
          <Card title="Order constellation" desc="Track, return, or discover what to buy again." href="/account/orders" />
          <Card title="Addresses" desc="Keep delivery details ready for the next good thing." href="/account/addresses" />
          <Card title="Payment options" desc="Manage your cards and saved methods." href="/account/payment" />
          <Card title="Login & security" desc="Keep your account feeling safe and yours." href="/account/security" />
          <Card title="Memberships" desc="See your halo+ benefits and subscriptions." href="/account/subscriptions" />
          {(user as any).role === 'admin' && <Card title="Admin console" desc="Manage products, sellers, reviews, and users." href="/admin" highlight />}
        </div>
      </section>
    </AccountLayout>
  );
}

function Card({ title, desc, href, highlight }: { title: string; desc: string; href: string; highlight?: boolean }) {
  return <Link href={href} className={`group block rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-cardHover ${highlight ? 'border-amazon-orange bg-[#fff0e6]' : 'border-amazon-border bg-white hover:bg-amazon-bg'}`}><div className="flex items-center justify-between"><div className="font-black">{title}</div><ArrowUpRight className="h-4 w-4 text-amazon-textMuted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></div><div className="mt-1 text-sm text-amazon-textMuted">{desc}</div></Link>;
}
