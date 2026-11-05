import Link from 'next/link';

const palettes=['bg-[#e6d4c2]','bg-[#d8dfd2]','bg-[#e8d8d4]','bg-[#d9e1df]','bg-[#e6dfca]'];

export default function CategoryTile({name,image,slug}:{name:string;image?:string;slug:string}){
  const palette=palettes[name.length%palettes.length];
  return <Link href={`/category/${slug}`} className="group block">
    <div className={`relative aspect-[.84] overflow-hidden rounded-[1.1rem] ${palette}`}>{image?<img src={image} alt={name} className="h-full w-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"/>:<span className="absolute inset-0 flex items-center justify-center font-serif text-6xl text-[#66735f]/30">{name[0]}</span>}<span className="absolute inset-x-3 bottom-3 font-serif text-lg leading-none">{name}</span></div>
  </Link>
}
