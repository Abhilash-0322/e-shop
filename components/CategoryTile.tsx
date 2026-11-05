import Link from 'next/link';

export default function CategoryTile({name, image, slug}: {name: string; image?: string; slug: string}) {
  return (
    <Link href={`/category/${slug}`} className="card group rounded-xl p-3 text-center">
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 to-cyan-50">
        {image ? <img src={image} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" /> : <span className="text-3xl font-black text-indigo-300" aria-hidden="true">{name[0]}</span>}
      </div>
      <b className="mt-3 block text-xs group-hover:text-indigo-800">{name}</b>
    </Link>
  );
}
