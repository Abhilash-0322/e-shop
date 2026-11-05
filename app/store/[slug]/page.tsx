import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';
import ProductGrid from '@/components/ProductGrid';
import { CheckCircle2, Store as StoreIcon } from '@/lib/icons';

export const dynamic = 'force-dynamic';

export default async function Store({ params }: { params: { slug: string } }) {
  await connectDB();
  const user = await User.findOne({ 'sellerProfile.slug': params.slug }).lean() as any;
  const products = await Product.find({ sellerSlug: params.slug }).select('-description -reviews').lean();
  return <div className="shell py-10 md:py-14"><div className="relative overflow-hidden rounded-[1.8rem] bg-[#17221c] p-8 text-white md:p-12"><div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[#d7f36b]/15 blur-3xl" /><div className="relative max-w-2xl"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d7f36b] text-[#405719]"><StoreIcon className="h-6 w-6" /></div><p className="eyebrow mt-7 !text-[#d7f36b]">Seller storefront</p><h1 className="mt-3 text-5xl font-black tracking-[-.06em]">{user?.sellerProfile?.storeName || params.slug}</h1><p className="mt-4 max-w-xl text-[#c5d0c4]">{user?.sellerProfile?.description || 'A Halozon seller storefront.'}</p><div className="mt-6 flex items-center gap-2 text-sm font-bold text-[#d7f36b]"><CheckCircle2 className="h-4 w-4" /> Verified Halozon seller</div></div></div><div className="mt-10"><ProductGrid products={JSON.parse(JSON.stringify(products))} title="The store edit" subtitle={`${products.length} products`} /></div></div>;
}
