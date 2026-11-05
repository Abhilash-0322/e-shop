import Link from 'next/link';
import {CheckCircle2, ExternalLink, Store, TrendingUp} from '@/lib/icons';
import {PageHeader} from '@/components/ui';

export default function SellerStore() {
  return (
    <div>
      <PageHeader eyebrow="Your public presence" title="Store profile" description="Build a storefront buyers can remember and trust." />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-brand-700 to-emerald-700 p-7 text-white md:col-span-2">
          <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/15 blur-3xl" /><Store className="h-8 w-8 text-brand-100" /><h2 className="mt-5 text-2xl font-black">Your store is your signal.</h2><p className="mt-3 max-w-lg leading-relaxed text-brand-100">Keep your catalog focused, your description clear, and your service promise consistent.</p><Link href="/seller/products" className="btn mt-6 bg-white text-brand-700">Manage products</Link>
        </div>
        <div className="surface p-6"><TrendingUp className="h-7 w-7 text-fuchsia-600" /><h2 className="mt-4 text-xl font-black">Store health</h2><p className="muted mt-2 text-sm leading-relaxed">Keep products in stock and respond quickly to build confidence.</p><div className="mt-6 flex items-center gap-2 text-sm font-bold text-emerald-700"><CheckCircle2 className="h-4 w-4" />Ready to grow</div></div>
      </div>
      <div className="surface mt-6 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"><div><b>Public storefront</b><p className="muted mt-1 text-sm">Share your store with customers.</p></div><Link href="/seller/apply" className="btn btn-soft">Open profile <ExternalLink className="h-4 w-4" /></Link></div>
    </div>
  );
}
