import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import AccountLayout from './AccountLayout';

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin?redirect=/account');
  return (
    <AccountLayout user={user}>
      <div className="bento-card gradient-border mb-5 bg-[#11121a] p-6 text-white">
        <div className="section-kicker !text-amazon-orange">Personal command center</div>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Your Account</h1>
        <p className="mt-2 max-w-xl text-sm text-white/60">Manage your orders, saved details, and the things orbiting your next checkout.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card title="Your Orders" desc="Track, return, or buy things again" href="/account/orders" />
        <Card title="Your Addresses" desc="Edit addresses for orders and gifts" href="/account/addresses" />
        <Card title="Payment options" desc="Manage your cards and saved methods" href="/account/payment" />
        <Card title="Your Wish List" desc="Save items you love for later" href="/account/wishlist" />
        <Card title="Login & security" desc="Edit login, name, and mobile number" href="/account/security" />
        <Card title="Prime" desc="View your benefits and membership" href="/prime" />
        {(user as any).role === 'seller' && (
          <Card title="Seller Central" desc="Manage your store, products, and orders" href="/seller/dashboard" highlight />
        )}
        {(user as any).role === 'seller' && (
          <Card title="Your public store" desc="View your store as customers see it" href={`/store/${(user as any).sellerProfile?.slug || ''}`} />
        )}
        {(user as any).role !== 'seller' && (
          <Card title="Sell on halozon" desc="Open a store and reach millions" href="/seller/apply" highlight />
        )}
        {(user as any).role === 'admin' && (
          <Card title="Admin console" desc="Manage users, products, reviews, sellers" href="/admin" highlight />
        )}
      </div>
    </AccountLayout>
  );
}

function Card({ title, desc, href, highlight }: { title: string; desc: string; href: string; highlight?: boolean }) {
  return (
    <a href={href} className={`group rounded-2xl border p-5 transition-all hover:-translate-y-1 hover:shadow-cardHover ${highlight ? 'border-amazon-orange/50 bg-amazon-orange/10' : 'border-amazon-border bg-white/80'}`}>
      <div className="mb-1 flex items-center justify-between font-bold">{title}<span className="text-amazon-orange transition-transform group-hover:translate-x-1">↗</span></div>
      <div className="text-sm text-amazon-textMuted">{desc}</div>
    </a>
  );
}
