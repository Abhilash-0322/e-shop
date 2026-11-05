import {connectDB} from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductGrid from '@/components/ProductGrid';
import {CheckCircle2,ShieldCheck,Tag} from '@/lib/icons';

export const dynamic='force-dynamic';

export default async function DealsPage(){
  await connectDB();
  const products=await Product.find({isDeal:true}).sort({sold:-1}).limit(60).select('-description -reviews').lean();
  return <div className="shell py-10 md:py-14"><div className="rounded-[2rem] bg-[#173f32] text-white p-8 md:p-12 mb-10 relative overflow-hidden"><div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-[#f2b47e]/20 blur-3xl"/><div className="relative"><span className="pill bg-white/10 text-[#dff3e5] border border-white/15"><Tag className="w-3 h-3 mr-1"/> Limited time</span><h1 className="text-5xl font-black tracking-[-.05em] mt-4">Deals worth moving for.</h1><p className="text-[#cfe2d5] mt-4 max-w-xl">Clear prices, real savings, and no noisy countdowns. Every listing still comes with the same community signals.</p><div className="flex flex-wrap gap-4 mt-6 text-xs text-[#b7d1c0]"><span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#8bd5a8]"/> Price checked</span><span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#8bd5a8]"/> Buyer protected</span></div></div></div><ProductGrid products={JSON.parse(JSON.stringify(products))} title="Current drops" subtitle="Updated regularly"/></div>;
}
