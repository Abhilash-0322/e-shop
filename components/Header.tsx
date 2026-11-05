'use client';

import Link from 'next/link';
import {useEffect,useState} from 'react';
import {usePathname,useRouter,useSearchParams} from 'next/navigation';
import {ChevronDown,LogOut,Menu,Package,Search,ShoppingCart,Sparkles,User,X} from '@/lib/icons';
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
  return <header className="sticky top-0 z-50 border-b border-white/70 bg-white/80 backdrop-blur-2xl">
    <div className="bg-[#171936] text-white text-[11px] tracking-wide"><div className="shell flex items-center justify-between py-2"><span className="flex items-center gap-2"><Sparkles className="h-3.5 w-3.5 text-cyan-300"/> The marketplace for your next obsession</span><span className="hidden sm:block text-indigo-200">Free delivery over $50 · Buyer protected</span></div></div>
    <div className="shell flex items-center gap-3 py-3.5">
      <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Halozon home"><span className="hz-logo-mark">H</span><span className="hz-logo hidden sm:block">Halozon</span></Link>
      <form onSubmit={submit} className="flex-1 max-w-3xl mx-auto"><div className="flex items-center rounded-2xl border border-[#d8d8ea] bg-[#f8f8fd] focus-within:bg-white focus-within:border-[#8b76ff] focus-within:ring-4 focus-within:ring-[#8070ff]/10 overflow-hidden transition-all"><Search className="ml-3.5 h-4.5 w-4.5 text-[#725bfa]"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search the spectrum..." className="min-w-0 flex-1 bg-transparent outline-none px-3 py-2.5 text-sm"/><button className="btn btn-primary !rounded-xl !py-2 !px-4 m-1">Search</button></div></form>
      <div className="flex items-center gap-1">
        <div className="relative hidden md:block"><button onClick={()=>setOpen(v=>!v)} className="flex items-center gap-2 rounded-xl p-2 hover:bg-[#f0efff]" aria-expanded={open}><User className="h-5 w-5 text-[#6953df]"/><span className="hidden lg:block text-left text-xs"><small className="block text-[#7b819a]">{user?`Hi, ${user.name.split(' ')[0]}`:'Welcome'}</small><b>Account</b><ChevronDown className="inline h-3 w-3 ml-1"/></span></button>{open&&<div className="absolute right-0 top-full mt-2 w-72 surface p-4 animate-reveal z-20">{user?<><div className="border-b border-[#e5e3f1] pb-3 mb-3"><b>{user.name}</b><p className="text-xs muted">{user.email}</p></div><div className="grid grid-cols-2 gap-2 text-sm"><Link className="amazon-link" href="/account">Dashboard</Link><Link className="amazon-link" href="/account/orders">Orders</Link><Link className="amazon-link" href="/account/wishlist">Wishlist</Link><Link className="amazon-link" href="/account/addresses">Addresses</Link>{user.role==='seller'&&<Link className="amazon-link" href="/seller/dashboard">Seller hub</Link>}{user.role==='admin'&&<Link className="amazon-link" href="/admin">Admin</Link>}</div><button onClick={logout} className="btn btn-soft mt-4 w-full"><LogOut className="h-4 w-4"/>Sign out</button></>:<><Link href="/signin" className="btn btn-primary w-full">Sign in</Link><Link href="/register" className="block text-center amazon-link text-sm mt-3">Create account</Link></>}</div>}</div>
        <Link href="/account/orders" className="hidden lg:flex rounded-xl p-2 hover:bg-[#f0efff]" aria-label="Orders"><Package className="h-5 w-5"/></Link><Link href="/cart" className="relative rounded-xl p-2 hover:bg-[#f0efff]" aria-label="Cart"><ShoppingCart className="h-5 w-5"/>{count>0&&<span className="absolute -top-1 -right-1 bg-[#e65ac8] text-white rounded-full min-w-5 h-5 text-[10px] flex items-center justify-center font-bold">{count}</span>}</Link><button onClick={()=>setMobile(true)} className="md:hidden rounded-xl p-2 hover:bg-[#f0efff]" aria-label="Open navigation"><Menu/></button>
      </div>
    </div>
    <nav className="shell flex items-center gap-5 overflow-x-auto pb-3 text-xs" aria-label="Categories">{categories.map(c=><Link className={`whitespace-nowrap font-semibold ${pathname===cat(c)?'text-[#6650d8]':'text-[#68718d] hover:text-[#6650d8]'}`} href={cat(c)} key={c}>{c}</Link>)}<span className="h-4 w-px bg-[#dddbea]"/><Link className="whitespace-nowrap font-bold text-[#e04fc4]" href="/deals">Trending drops</Link><Link className="whitespace-nowrap font-bold text-[#42a8cc]" href="/prime">Halozon Plus</Link></nav>
    {mobile&&<div className="fixed inset-0 z-[60]"><button className="absolute inset-0 bg-[#11132b]/60" onClick={()=>setMobile(false)} aria-label="Close navigation"/><aside className="relative w-full max-w-sm bg-[#fafaff] h-full p-5 animate-reveal shadow-2xl"><div className="flex justify-between items-center mb-6"><div className="flex items-center gap-2"><span className="hz-logo-mark">H</span><b className="text-xl">Explore Halozon</b></div><button onClick={()=>setMobile(false)} aria-label="Close"><X/></button></div>{categories.map(c=><Link key={c} href={cat(c)} onClick={()=>setMobile(false)} className="block rounded-xl p-3 hover:bg-[#f0efff] font-semibold">{c}</Link>)}<Link href="/deals" onClick={()=>setMobile(false)} className="block rounded-xl p-3 text-[#df4fc4] font-bold">Trending drops</Link><Link href="/prime" onClick={()=>setMobile(false)} className="block rounded-xl p-3 text-[#369cbc] font-bold">Halozon Plus</Link></aside></div>}
  </header>
}
