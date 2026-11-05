import Link from 'next/link';
export default function CategoryTile({ name, image, slug }: { name: string; image?: string; slug: string }) {
  return (
    <Link href={`/category/${slug}`} className="card group p-2.5 text-center">
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-indigo-50 to-cyan-50">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        ) : <span className="text-3xl font-black text-indigo-200">{name[0]}</span>}
      </div>
      <b className="mt-2 block truncate text-[11px] group-hover:text-indigo-700">{name}</b>
    </Link>
  );
}
