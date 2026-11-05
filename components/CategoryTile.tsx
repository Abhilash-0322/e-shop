import Link from 'next/link';
import { ExternalLink } from '@/lib/icons';

export default function CategoryTile({ name, image, slug }: { name: string; image?: string; slug: string }) {
  return <Link href={`/category/${slug}`} className="card group p-3"><div className="flex aspect-square items-center justify-center overflow-hidden border-2 border-black bg-[#d7ff3f]">{image ? <img src={image} alt={name} className="h-full w-full object-cover mix-blend-multiply transition-transform group-hover:scale-105" /> : <span className="text-5xl font-black">{name[0]}</span>}</div><b className="mt-3 block text-left text-xs uppercase group-hover:text-[#ff5c35]">{name} <ExternalLink className="inline h-3 w-3" /></b></Link>;
}
