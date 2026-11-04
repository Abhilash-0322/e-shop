import Link from 'next/link';
import { slugify } from '@/lib/utils';

const ACCENTS = [
  'from-violet-500/20 to-fuchsia-500/10',
  'from-cyan-500/20 to-sky-500/10',
  'from-rose-500/20 to-orange-500/10',
  'from-emerald-500/20 to-teal-500/10',
  'from-amber-500/20 to-yellow-500/10',
  'from-indigo-500/20 to-violet-500/10',
  'from-pink-500/20 to-rose-500/10',
  'from-teal-500/20 to-cyan-500/10',
];

export default function CategoryTile({
  name,
  image,
  slug,
  index = 0,
}: {
  name: string;
  image?: string;
  slug?: string;
  index?: number;
}) {
  const href = `/category/${slug || slugify(name)}`;
  const accent = ACCENTS[index % ACCENTS.length];
  return (
    <Link
      href={href}
      className={`amazon-card amazon-card-hover p-4 flex flex-col items-center text-center group bg-gradient-to-br ${accent}`}
    >
      <div className="w-full aspect-square bg-white rounded-2xl mb-3 overflow-hidden flex items-center justify-center shadow-inner">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="text-4xl">✨</div>
        )}
      </div>
      <span className="text-sm font-semibold text-slate-800 group-hover:text-violet-700 transition-colors">{name}</span>
    </Link>
  );
}
