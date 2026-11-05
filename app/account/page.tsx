import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
import Wishlist from '@/models/Wishlist';
import Subscription from '@/models/Subscription';
import AccountLayout from './AccountLayout';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  Heart,
  MapPin,
  Package,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';
import { AccountPageHeader, Notice, ProgressBar, StatCard, StatusBadge } from '@/components/AccountPrimitives';
import { formatPrice } from '@/lib/utils';

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin?redirect=/account');
  await connectDB();
  const [profile, latestOrder, wishlist, subscriptions] = await Promise.all([
    User.findById(user.id).select('addresses paymentMethods emailVerified phone').lean() as any,
    Order.findOne({ userId: user.id }).sort({ createdAt: -1 }).lean() as any,
    Wishlist.findOne({ userId: user.id }).lean() as any,
    Subscription.find({ userId: user.id, active: true }).lean() as any,
  ]);
  const setup = [
    { label: 'Profile details', done: Boolean(profile?.phone) },
    { label: 'Shipping address', done: Boolean(profile?.addresses?.length) },
    { label: 'Payment method', done: Boolean(profile?.paymentMethods?.length) },
    { label: 'Email verified', done: Boolean(profile?.emailVerified) },
  ];
  const completed = setup.filter((item) => item.done).length;
  const serializedOrder = latestOrder ? JSON.parse(JSON.stringify(latestOrder)) : null;
  const wishlistCount = wishlist?.items?.length || 0;

  return (
    <AccountLayout user={user}>
      <AccountPageHeader eyebrow={`Good to see you, ${user.name.split(' ')[0]}`} title="Your account" description="Everything you need to shop with confidence, in one place." />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
        <StatCard icon={Package} label="Orders" value={serializedOrder ? 'Active' : 'Start here'} detail={serializedOrder ? 'View your latest delivery' : 'Your first order is waiting'} tone="blue" />
        <StatCard icon={Heart} label="Wishlist" value={String(wishlistCount)} detail="Saved for later" tone="orange" />
        <StatCard icon={Truck} label="Subscriptions" value={String(subscriptions.length)} detail={subscriptions.length ? 'Deliveries scheduled' : 'Save on repeat buys'} tone="purple" />
        <StatCard icon={ShieldCheck} label="Account setup" value={`${Math.round((completed / setup.length) * 100)}%`} detail={`${completed} of ${setup.length} steps complete`} tone="green" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_.75fr] gap-4 mb-5">
        <section className="panel p-5">
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <div className="eyebrow mb-1">Your next best step</div>
              <h2 className="text-xl font-bold">Make checkout feel effortless</h2>
              <p className="text-sm text-muted mt-1">Complete your details once and we&apos;ll keep every future order moving.</p>
            </div>
            <Sparkles className="w-6 h-6 text-amazon-orange shrink-0" />
          </div>
          <ProgressBar value={(completed / setup.length) * 100} label={`${completed} of ${setup.length} complete`} detail={completed === setup.length ? 'All set' : `${setup.length - completed} to go`} />
          <div className="grid sm:grid-cols-2 gap-2 mt-5">
            {setup.map((item) => (
              <Link key={item.label} href={item.label === 'Shipping address' ? '/account/addresses' : item.label === 'Payment method' ? '/account/payment' : '/account/security'} className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm ${item.done ? 'border-amazon-green/30 bg-amazon-green/5' : 'border-amazon-border hover:border-amazon-orange'}`}>
                <span className={`w-5 h-5 rounded-full grid place-items-center ${item.done ? 'bg-amazon-green text-white' : 'bg-amazon-bg text-muted'}`}>
                  {item.done ? <BadgeCheck className="w-3.5 h-3.5" /> : <span className="text-[10px]">+</span>}
                </span>
                <span className="flex-1">{item.label}</span>
                {!item.done && <ArrowRight className="w-3.5 h-3.5 text-muted" />}
              </Link>
            ))}
          </div>
        </section>

        <section className="panel p-5 bg-gradient-to-br from-amazon-navy to-amazon-navylight text-white border-0">
          <div className="eyebrow !text-amazon-orangedark mb-2">Latest activity</div>
          {serializedOrder ? (
            <>
              <div className="flex justify-between gap-2 items-start">
                <div><div className="text-sm text-white/60">Order #{serializedOrder.orderNumber}</div><div className="text-2xl font-bold mt-1">{formatPrice(serializedOrder.total)}</div></div>
                <StatusBadge status={serializedOrder.status} tone={serializedOrder.status === 'delivered' ? 'success' : 'info'} />
              </div>
              <p className="text-sm text-white/70 mt-5">{serializedOrder.status === 'delivered' ? 'Your order was delivered. Enjoy your finds.' : 'We&apos;re keeping an eye on this delivery for you.'}</p>
              <Link href={`/account/orders/${serializedOrder._id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-white mt-6 hover:text-amazon-orangedark">Track this order <ArrowRight className="w-4 h-4" /></Link>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold">Your next great find starts here.</h2>
              <p className="text-sm text-white/70 mt-2">Explore hand-picked products and make your first order.</p>
              <Link href="/" className="amazon-btn-yellow inline-flex mt-6">Start exploring <ArrowRight className="w-4 h-4" /></Link>
            </>
          )}
        </section>
      </div>

      <section className="panel p-5">
        <div className="flex items-center justify-between mb-4">
          <div><div className="eyebrow mb-1">Shortcuts</div><h2 className="text-xl font-bold">Jump back in</h2></div>
          <Link href="/account/security" className="btn-quiet">Edit profile <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <ActionCard icon={Package} title="Orders & tracking" description="See delivery progress" href="/account/orders" />
          <ActionCard icon={MapPin} title="Saved addresses" description="Ready for every checkout" href="/account/addresses" />
          <ActionCard icon={CreditCard} title="Payment methods" description="Safe and secure checkout" href="/account/payment" />
          <ActionCard icon={Heart} title="Wishlist" description={`${wishlistCount} saved ${wishlistCount === 1 ? 'item' : 'items'}`} href="/account/wishlist" />
          <ActionCard icon={Sparkles} title="Picked for you" description="Fresh ideas based on you" href="/account/recommendations" />
          <ActionCard icon={RotateCcw} title="Returns" description="Manage a recent return" href="/account/returns" />
        </div>
      </section>

      {user.role === 'seller' && <Notice tone="info"><Link href="/seller/dashboard" className="font-bold underline">Open Seller Central</Link><span className="ml-1">to manage your store, products, and incoming orders.</span></Notice>}
      {user.role !== 'seller' && <Notice tone="success"><Link href="/seller/apply" className="font-bold underline">Sell on halozon</Link><span className="ml-1">and turn the things you love into a store.</span></Notice>}
      {user.role === 'admin' && <Notice tone="warning"><Link href="/admin" className="font-bold underline">Open Admin Console</Link><span className="ml-1">to review platform activity.</span></Notice>}
    </AccountLayout>
  );
}

function ActionCard({ icon: Icon, title, description, href }: { icon: typeof Package; title: string; description: string; href: string }) {
  return (
    <Link href={href} className="group rounded-xl border border-amazon-border p-3.5 hover:border-amazon-orange hover:shadow-cardHover transition-all">
      <div className="w-9 h-9 rounded-lg bg-amazon-orange/10 text-amazon-orange grid place-items-center mb-3"><Icon className="w-4 h-4" /></div>
      <div className="font-bold text-sm group-hover:text-amazon-linkHover">{title}</div>
      <div className="text-xs text-muted mt-1">{description}</div>
    </Link>
  );
}
