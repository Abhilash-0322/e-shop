import {connectDB} from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductGrid from '@/components/ProductGrid';
import Link from 'next/link';
import {ArrowRight,Tag} from '@/lib/icons';
export const dynamic='force-dynamic';
export default async function DealsPage(){
  await connectDB();
  const products=await Product.find({isDeal:true}).sort({sold:-1}).limit(60).select('-description -reviews').lean();
  return <div className="shell py-10 md:py-14"><div className="discovery-hero mb-10"><div className="relative z-10 grid md:grid-cols-[1fr_auto] gap-6 items-end p-8 md:p-12"><div><span className="pill bg-white/65"><Tag className="w-3.5 h-3.5 mr-1"/>Real value, clearly marked</span><h1 className="page-title mt-4">Good finds, no pressure.</h1><p className="muted mt-4 max-w-xl leading-relaxed">Clear prices, real savings, and no noisy countdowns. Take what is useful and leave what is not.</p></div><Link href="/search?sort=price-asc" className="btn btn-primary">Browse by price <ArrowRight className="w-4 h-4"/></Link></div></div><ProductGrid products={JSON.parse(JSON.stringify(products))} title="Current good finds" subtitle="Updated regularly"/></div>
}
