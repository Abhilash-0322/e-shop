import Link from 'next/link';
import { ArrowUpRight } from '@/lib/icons';

export default function CategoryTile({ name, image, slug }: { name: string; image?: string; slug: string }) {
  return (
    <Link href={`/category/${slug}`} className="card group overflow-hidden p-2">
      <div className="relative aspect-square overflow-hidden rounded-[.85rem] bg-[#edf1e9]">
        {image ? <img src={image} alt={name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <span className="flex h-full items-center justify-center text-4xl font-black text-[#c3d39d]">{name[0]}</span>}
        <span className="absolute right-2 top-2 rounded-full bg-white/85 p-1.5 opacity-0 transition group-hover:opacity-100"><ArrowUpRight className="h-3.5 w-3.5" /></span>
      </div>
      <b className="block px-1 pb-1 pt-3 text-xs group-hover:text-[#6d8735]">{name}</b>
    </Link>
  );
}
