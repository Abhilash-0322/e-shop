import {connectDB} from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductGrid from '@/components/ProductGrid';
import {PageHeader} from '@/components/ui';

export const dynamic = 'force-dynamic';

export default async function DealsPage() {
  await connectDB();
  const products = await Product.find({isDeal: true}).sort({sold: -1}).limit(60).select('-description -reviews').lean();
  return (
    <div className="shell py-10 md:py-14">
      <div className="relative mb-10 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-rose-600 via-brand-600 to-brand-800 p-8 text-white md:p-10">
        <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
        <div className="relative"><PageHeader inverse eyebrow="Limited time" title="Deals worth moving for." description="Clear prices, real savings, and no noisy countdowns." /></div>
      </div>
      <ProductGrid products={JSON.parse(JSON.stringify(products))} title="Current drops" subtitle="Updated regularly" />
    </div>
  );
}
