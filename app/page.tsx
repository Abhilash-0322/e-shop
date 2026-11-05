import {connectDB} from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Hero from '@/components/Hero';
import CuratedRail from '@/components/CuratedRail';
import CategoryTile from '@/components/CategoryTile';
import Link from 'next/link';
import {ArrowRight,Compass,Gift,Home as HomeIcon,Monitor,Plane,Heart,ShieldCheck} from '@/lib/icons';

export const dynamic='force-dynamic';

const interests=[
  {title:'The cozy corner',copy:'Warm lighting, soft textures, and little rituals.',query:'cozy',tone:'bg-[#f7dfc5]',art:'☕'},
  {title:'Better everyday',copy:'Useful upgrades that earn their place.',query:'everyday',tone:'bg-[#dcebd5]',art:'✦'},
  {title:'Desk, reimagined',copy:'Make focus feel a little more natural.',query:'workspace',tone:'bg-[#d8e5ee]',art:'⌘'},
  {title:'For the curious',copy:'Books, games, and rabbit holes worth taking.',query:'books games',tone:'bg-[#e9d9e7]',art:'◌'},
  {title:'A good kind of extra',copy:'Small joys for birthdays, thank-yous, and just because.',query:'gift',tone:'bg-[#f2e2ac]',art:'✿'},
  {title:'Outside, more often',copy:'Pack lighter. Wander further. Stay awhile.',query:'outdoor',tone:'bg-[#d9e6d1]',art:'↗'}
];
const paths=[
  ['Refresh your space','home decor','Make home feel more like you.',HomeIcon],
  ['Find your next hobby','games books','Follow a fresh curiosity.',Heart],
  ['Upgrade your setup','electronics','Tools that get out of your way.',Monitor],
  ['Pack for somewhere new','travel outdoor','Go well prepared.',Plane]
];

export default async function Home(){
  await connectDB();
  const [featured,deals,rated,categories]=await Promise.all([
    Product.find({isFeatured:true}).limit(10).select('-description -reviews').lean(),
    Product.find({isDeal:true}).sort({sold:-1}).limit(10).select('-description -reviews').lean(),
    Product.find().sort({rating:-1,ratingCount:-1}).limit(10).select('-description -reviews').lean(),
    Category.find({featured:true}).sort({order:1}).limit(8).lean()
  ]);
  const json=(value:any)=>JSON.parse(JSON.stringify(value));
  return <>
    <Hero/>
    <div className="trust-strip mt-8"><div className="shell grid grid-cols-1 sm:grid-cols-3 gap-4 py-5 text-sm"><span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#2e6548]"/>Honest details, no hidden surprises</span><span className="flex items-center gap-2"><Compass className="w-4 h-4 text-[#2e6548]"/>Curated paths when you need a starting point</span><span className="flex items-center gap-2"><Gift className="w-4 h-4 text-[#2e6548]"/>Giftable finds from trusted sellers</span></div></div>
    <div className="shell py-14 md:py-16 space-y-16">
      <section id="paths" className="grid lg:grid-cols-[.9fr_1.1fr] gap-10 items-start">
        <div><p className="eyebrow">No search bar required</p><h2 className="page-title mt-2">Choose a direction.</h2><p className="muted mt-4 max-w-md leading-relaxed">Start broad. We will help you narrow it down naturally with collections built around real-life moments.</p><Link href="/search" className="amazon-link inline-flex items-center gap-1 mt-6">See every path <ArrowRight className="w-4 h-4"/></Link></div>
        <div className="grid sm:grid-cols-2 gap-3">{paths.map(([title,query,copy,Icon])=>{const I=Icon as any;return <Link href={`/search?q=${encodeURIComponent(query as string)}`} className="use-case" key={title as string}><span className="grid place-items-center h-10 w-10 rounded-xl bg-white text-[#2e6548]"><I className="w-5 h-5"/></span><span><b className="block">{title as string}</b><small className="font-normal text-[#718071]">{copy as string}</small></span><ArrowRight className="w-4 h-4 ml-auto text-[#7f9b80]"/></Link>})}</div>
      </section>
      <section><div className="flex items-end justify-between mb-6"><div><p className="eyebrow">Browse by interest</p><h2 className="page-title mt-2">What sounds good?</h2></div><Link href="/search" className="amazon-link hidden sm:flex items-center gap-1">All interests <ArrowRight className="w-4 h-4"/></Link></div><div className="grid grid-cols-2 md:grid-cols-3 gap-3">{interests.map(item=><Link href={`/search?q=${encodeURIComponent(item.query)}`} key={item.title} className={`interest-card ${item.tone}`}><span className="pill bg-white/65">{item.title}</span><p className="relative z-10 max-w-[12rem] mt-7 text-sm font-semibold text-[#516253]">{item.copy}</p><span className="interest-art">{item.art}</span></Link>)}</div></section>
      <CuratedRail rails={[{title:'Good things, right now',subtitle:'A rotating shelf of popular finds and timely value.',products:json(deals)},{title:'Picked with intention',subtitle:'A few thoughtful places to begin exploring.',products:json(featured)},{title:'Loved, then loved again',subtitle:'Top-rated pieces with plenty of real-world approval.',products:json(rated)}]}/>
      <section className="grid lg:grid-cols-[1.1fr_.9fr] gap-5">
        <div className="rounded-[1.5rem] bg-[#2e6548] text-white p-8 md:p-10 relative overflow-hidden"><div className="absolute -right-8 -top-10 text-[12rem] leading-none text-white/10">✳</div><p className="eyebrow !text-[#f1c75b]">Halozon Plus</p><h2 className="text-3xl md:text-4xl font-black mt-3 max-w-md">More time enjoying. Less time waiting.</h2><p className="text-[#dcebd5] my-5 max-w-md leading-relaxed">Priority fulfillment and member-only drops for people who shop with intention.</p><Link href="/prime" className="btn bg-[#f1c75b] text-[#183022]">Explore Plus <ArrowRight className="w-4 h-4"/></Link></div>
        <div className="surface p-8 md:p-10"><p className="eyebrow">The Halozon promise</p><h2 className="text-3xl font-black mt-3">More clarity, fewer surprises.</h2><p className="muted mt-4 leading-relaxed">Every listing, seller, and order is designed to help you feel good about what comes next.</p><div className="grid grid-cols-3 gap-3 mt-7"><div className="stat-pill"><b>4.9★</b><small>seller avg.</small></div><div className="stat-pill"><b>48h</b><small>fast dispatch</small></div><div className="stat-pill"><b>24/7</b><small>support</small></div></div></div>
      </section>
      <section><div className="flex items-end justify-between mb-6"><div><p className="eyebrow">Keep wandering</p><h2 className="page-title mt-2">Featured departments.</h2></div><Link href="/search" className="amazon-link hidden sm:flex items-center gap-1">Browse all <ArrowRight className="w-4 h-4"/></Link></div><div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">{json(categories).map((category:any)=><CategoryTile key={category._id} {...category}/>)}</div></section>
    </div>
  </>
}
