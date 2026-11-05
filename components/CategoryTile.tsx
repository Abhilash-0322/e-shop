import Link from 'next/link';

export default function CategoryTile({name, image, slug}: {name: string; image?: string; slug: string}) {
  return (
    <Link href={`/category/${slug}`} className="card group p-3 text-center">
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-50 via-white to-emerald-50">
        {image
          ? <img src={image} alt={name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
          : <span className="text-3xl font-black text-brand-200">{name[0]}</span>}
      </div>
      <b className="mt-3 block text-xs transition-colors group-hover:text-brand-700">{name}</b>
    </Link>
  );
}
