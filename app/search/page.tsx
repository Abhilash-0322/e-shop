import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductGrid from '@/components/ProductGrid';
import Link from 'next/link';
import { Search, SlidersHorizontal } from '@/lib/icons';

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  await connectDB();
  const q = searchParams.q?.trim();
  const filter: any = q ? { $text: { $search: q } } : {};
  const products = await Product.find(filter).sort({ rating: -1, sold: -1 }).limit(60).select('-description -reviews').lean();
  return (
    <div className="shell py-10 md:py-14">
      <div className="relative overflow-hidden rounded-[1.8rem] bg-[#dcecff] p-7 md:p-10">
        <div className="relative max-w-2xl"><span className="pill bg-white/70 text-[#526239]">The discovery shelf</span><h1 className="page-title mt-4">{q ? <>Results for <span className="text-[#6d8735]">“{q}”</span></> : 'Find your next favorite.'}</h1><p className="muted mt-4 max-w-xl text-base leading-relaxed">Explore products from across the Halozon marketplace, with the signals that make browsing feel easy.</p></div>
        <Search className="absolute -bottom-8 -right-5 h-48 w-48 rotate-12 text-white/60 md:right-10" />
      </div>
      <div className="mt-8 flex items-center justify-between gap-4"><div><p className="eyebrow">Available now</p><p className="muted mt-1 text-sm">{products.length} products {q ? 'matched your search' : 'to start exploring'}</p></div><Link href="/deals" className="btn btn-soft"><SlidersHorizontal className="h-4 w-4" /> Browse deals</Link></div>
      <div className="mt-8"><ProductGrid products={JSON.parse(JSON.stringify(products))} title={q ? 'A few good options' : 'Popular right now'} subtitle="Curated marketplace picks" /></div>
      {!products.length && <div className="surface mt-8 p-10 text-center"><h2 className="text-2xl font-black">Nothing matched that yet.</h2><p className="muted mt-2">Try a broader search or browse one of our collections.</p><Link href="/" className="btn btn-primary mt-6">Back to the edit</Link></div>}
    </div>
  );
}
