import {connectDB} from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';
import ProductGrid from '@/components/ProductGrid';
import {PageHeader} from '@/components/ui';

export const dynamic = 'force-dynamic';

export default async function Store({params}: {params: {slug: string}}) {
  await connectDB();
  const user = await User.findOne({'sellerProfile.slug': params.slug}).lean() as any;
  const products = await Product.find({sellerSlug: params.slug}).select('-description -reviews').lean();
  return (
    <div className="shell py-10 md:py-14">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-950 p-8 text-white md:p-10">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-500/25 blur-3xl" />
        <div className="relative"><PageHeader inverse eyebrow="Seller storefront" title={user?.sellerProfile?.storeName || params.slug} description={user?.sellerProfile?.description || 'A Halozon seller storefront.'} /></div>
      </div>
      <div className="mt-12"><ProductGrid products={JSON.parse(JSON.stringify(products))} title="Store products" /></div>
    </div>
  );
}
