import {connectDB} from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import CategoryTile from '@/components/CategoryTile';
import Link from 'next/link';
import {CheckCircle2,MessageCircle,ShieldCheck,Star} from '@/lib/icons';

export const dynamic='force-dynamic';

export default async function Home(){
  await connectDB();
  const [featured,deals,rated,categories]=await Promise.all([
    Product.find({isFeatured:true}).limit(10).select('-description -reviews').lean(),
    Product.find({isDeal:true}).sort({sold:-1}).limit(10).select('-description -reviews').lean(),
    Product.find().sort({rating:-1,ratingCount:-1}).limit(10).select('-description -reviews').lean(),
    Category.find({featured:true}).sort({order:1}).limit(8).lean()
  ]);
  const json=(v:any)=>JSON.parse(JSON.stringify(v));
  const trustCards=[[CheckCircle2,'Verified-buyer context','Know when a review comes from a delivered order.'],[MessageCircle,'Answers from the community','Ask before you buy and help the next shopper.'],[ShieldCheck,'A fair way back','Buyer protection and simple returns on every order.']] as const;
  return <><Hero/><div className="shell py-14 md:py-18 space-y-20">
    <section className="surface p-5 md:p-6 grid md:grid-cols-3 gap-4">
      {trustCards.map(([I,title,body])=>{const Icon=I as any;return <div key={title} className="flex gap-3 items-start"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5f4e9] text-[#28704e] shrink-0"><Icon className="w-5 h-5"/></span><div><b className="text-sm">{title}</b><p className="text-xs muted mt-1 leading-relaxed">{body}</p></div></div>})}
    </section>
    <section><div className="flex justify-between items-end mb-6"><div><p className="eyebrow">Explore</p><h2 className="page-title mt-2">Shop by department</h2></div><Link className="amazon-link" href="/search">View all</Link></div><div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">{json(categories).map((c:any)=><CategoryTile key={c._id} {...c}/>)}</div></section>
    <ProductGrid products={json(deals)} title="Today&apos;s best drops" subtitle="Limited-time value"/>
    <ProductGrid products={json(featured)} title="Editor&apos;s picks" subtitle="Chosen by the Halozon team"/>
    <section className="grid lg:grid-cols-2 gap-5">
      <div className="rounded-[1.7rem] bg-[#173f32] text-white p-8 relative overflow-hidden"><div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-[#f2b47e]/20 blur-3xl animate-float"/><p className="eyebrow !text-[#b7d1c0]">Halozon Plus</p><h2 className="text-3xl font-black mt-3">More perks, less waiting.</h2><p className="text-[#cfe2d5] my-5 max-w-md">Priority fulfillment and member-only drops for people who shop with intention.</p><Link href="/prime" className="btn bg-[#f2b47e] text-[#173f32]">Explore Plus</Link></div>
      <div className="surface p-8"><p className="eyebrow">Trust built in</p><h2 className="text-3xl font-black mt-3">Good signals, close at hand.</h2><p className="muted mt-4 leading-relaxed">Every listing, seller, and order is designed to give you more clarity and fewer surprises.</p><div className="grid grid-cols-3 gap-3 mt-7"><div className="stat-pill"><b>4.9★</b><small>seller avg.</small></div><div className="stat-pill"><b>48h</b><small>fast dispatch</small></div><div className="stat-pill"><b>24/7</b><small>support</small></div></div></div>
    </section>
    <ProductGrid products={json(rated)} title="Loved by shoppers" subtitle="Top-rated products"/>
    <section className="rounded-[1.7rem] bg-[#fff7ee] border border-[#f4dfc8] p-8 md:p-10 flex flex-col md:flex-row gap-6 md:items-center"><div className="flex-1"><p className="eyebrow !text-[#a45b27]">A better feedback loop</p><h2 className="text-3xl font-black mt-2 text-[#5c3926]">Your helpful vote changes what people see.</h2><p className="text-[#80624d] mt-3 max-w-xl">Tell the community which reviews and answers gave you the confidence to decide.</p></div><Link href="/search" className="btn btn-dark">Find your next good thing <Star className="w-4 h-4"/></Link></section>
  </div></>;
}
