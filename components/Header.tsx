'use client';

import Link from 'next/link';
import {useEffect,useState} from 'react';
import {usePathname,useRouter,useSearchParams} from 'next/navigation';
import {Search,ShoppingCart,Menu,X,ChevronDown,User,Package,LogOut,ArrowRight} from '@/lib/icons';
import {useCart} from '@/hooks/useCart';

type UserData={id:string;name:string;email:string;role:string}|null;
const fallbackCategories=['Electronics','Computers','Smart Home','Books','Fashion','Home & Kitchen','Games'];

export default function Header({user}:{user:UserData}){
  const router=useRouter();
  const pathname=usePathname();
  const sp=useSearchParams();
  const {count}=useCart();
  const [q,setQ]=useState(sp.get('q')||'');
  const [open,setOpen]=useState(false);
  const [mobile,setMobile]=useState(false);
  const [categories,setCategories]=useState<string[]>(fallbackCategories);
  useEffect(()=>{let alive=true;fetch('/api/categories').then(r=>r.json()).then(d=>{if(alive&&d.items?.length)setCategories(d.items.map((x:any)=>x.name))}).catch(()=>{});return()=>{alive=false}},[]);
  function submit(e:React.FormEvent){e.preventDefault();router.push(`/search?q=${encodeURIComponent(q.trim())}`)}
  async function logout(){await fetch('/api/auth/logout',{method:'POST'});router.refresh()}
  const cat=(x:string)=>`/category/${x.toLowerCase().replace(/\s+/g,'-').replace(/&/g,'and')}`;
  return <header className="sticky top-0 z-50 border-b border-[#ddd6c9] bg-[#f6f2ea]/95 backdrop-blur-xl">
    <div className="bg-[#263b3a] text-[#f6f2ea]"><div className="shell flex items-center justify-center gap-2 py-2 text-[11px] font-bold tracking-wide">Free delivery on orders over $35 <span className="text-[#e9b7a7]">·</span> Meet the sellers behind the things you love <ArrowRight className="h-3 w-3"/></div></div>
    <div className="shell flex items-center gap-4 py-4">
      <Link href="/" className="flex shrink-0 items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d96143] font-serif text-xl font-bold text-white">H</span><span className="hidden font-serif text-2xl font-bold tracking-[-.06em] sm:block">halozon</span></Link>
      <form onSubmit={submit} className="order-3 w-full md:order-none md:flex-1">
        <div className="flex items-center rounded-full border border-[#cfc6b7] bg-[#fffdf9] px-3 transition focus-within:border-[#d96143] focus-within:ring-4 focus-within:ring-[#d96143]/10"><Search className="h-4 w-4 text-[#d96143]"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search a collection, product, or seller" className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none"/><button className="hidden rounded-full bg-[#202621] px-4 py-2 text-xs font-bold text-white sm:block">Search</button></div>
      </form>
      <div className="ml-auto flex items-center gap-1">
        <div className="relative hidden md:block"><button onClick={()=>setOpen(v=>!v)} className="flex items-center gap-2 rounded-full p-2 hover:bg-[#e9e2d6]"><User className="h-5 w-5 text-[#66735f]"/><span className="hidden text-left text-xs lg:block"><small className="block muted">{user?`Hi, ${user.name.split(' ')[0]}`:'Welcome'}</small><b>Account</b><ChevronDown className="ml-1 inline h-3 w-3"/></span></button>{open&&<div className="surface absolute right-0 top-full mt-2 w-72 p-4 animate-reveal">{user?<><div className="mb-3 border-b border-[#ddd6c9] pb-3"><b>{user.name}</b><p className="muted text-xs">{user.email}</p></div><div className="grid grid-cols-2 gap-2 text-sm"><Link className="rounded-lg px-2 py-1 hover:bg-[#eee7da]" href="/account">Dashboard</Link><Link className="rounded-lg px-2 py-1 hover:bg-[#eee7da]" href="/account/orders">Orders</Link><Link className="rounded-lg px-2 py-1 hover:bg-[#eee7da]" href="/account/wishlist">Wishlist</Link><Link className="rounded-lg px-2 py-1 hover:bg-[#eee7da]" href="/account/addresses">Addresses</Link>{user.role==='seller'&&<Link className="rounded-lg px-2 py-1 hover:bg-[#eee7da]" href="/seller/dashboard">Seller hub</Link>}{user.role==='admin'&&<Link className="rounded-lg px-2 py-1 hover:bg-[#eee7da]" href="/admin">Admin</Link>}</div><button onClick={logout} className="btn btn-soft mt-4 w-full"><LogOut className="h-4 w-4"/>Sign out</button></>:<><Link href="/signin" className="btn btn-primary w-full">Sign in</Link><Link href="/register" className="mt-3 block text-center text-sm underline underline-offset-4">Create account</Link></>}</div>}</div>
        <Link href="/account/orders" className="hidden rounded-full p-2 hover:bg-[#e9e2d6] lg:flex"><Package className="h-5 w-5"/></Link>
        <Link href="/cart" className="relative rounded-full p-2 hover:bg-[#e9e2d6]"><ShoppingCart className="h-5 w-5"/>{count>0&&<span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d96143] px-1 text-[10px] font-bold text-white">{count}</span>}</Link>
        <button onClick={()=>setMobile(true)} className="rounded-full p-2 md:hidden" aria-label="Open navigation"><Menu className="h-5 w-5"/></button>
      </div>
    </div>
    <nav className="shell hidden items-center gap-6 overflow-x-auto pb-3 text-xs font-bold tracking-wide md:flex">{categories.map(c=><Link className={`whitespace-nowrap ${pathname===cat(c)?'text-[#d96143]':'text-[#59624e] hover:text-[#d96143]'}`} href={cat(c)} key={c}>{c}</Link>)}<Link className="whitespace-nowrap text-[#d96143]" href="/deals">The edit: deals</Link><Link className="whitespace-nowrap text-[#59624e]" href="/prime">Halozon Plus</Link><Link className="whitespace-nowrap text-[#59624e]" href="/seller/apply">Sell with us</Link></nav>
    {mobile&&<div className="fixed inset-0 z-[60]"><button className="absolute inset-0 bg-[#202621]/50" onClick={()=>setMobile(false)} aria-label="Close navigation"/><aside className="relative h-full w-full max-w-sm bg-[#f6f2ea] p-5 animate-reveal"><div className="mb-7 flex items-center justify-between"><b className="font-serif text-2xl">Explore halo<span className="text-[#d96143]">zon</span></b><button onClick={()=>setMobile(false)} aria-label="Close"><X/></button></div>{categories.map(c=><Link key={c} href={cat(c)} onClick={()=>setMobile(false)} className="block border-b border-[#ddd6c9] py-3 font-semibold">{c}</Link>)}<Link href="/deals" onClick={()=>setMobile(false)} className="block border-b border-[#ddd6c9] py-3 font-bold text-[#d96143]">The edit: deals</Link><Link href="/prime" onClick={()=>setMobile(false)} className="block py-3 font-semibold">Halozon Plus</Link></aside></div>}
  </header>
}
