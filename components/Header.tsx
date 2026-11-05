'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {usePathname,useRouter,useSearchParams} from 'next/navigation';
import {Search,ShoppingCart,Menu,X,ChevronDown,User,Package,LogOut,Sparkles} from '@/lib/icons';
import {useCart} from '@/hooks/useCart';

type UserData={id:string;name:string;email:string;role:string}|null;
const fallbackCategories=['Electronics','Computers','Smart Home','Books','Fashion','Home & Kitchen','Games'];
export default function Header({user}:{user:UserData}){
  const router=useRouter();const pathname=usePathname();const sp=useSearchParams();const {count}=useCart();
  const [q,setQ]=useState(sp.get('q')||'');const [open,setOpen]=useState(false);const [mobile,setMobile]=useState(false);const [categories,setCategories]=useState<string[]>(fallbackCategories);
  useEffect(()=>{let alive=true;fetch('/api/categories').then(r=>r.json()).then(d=>{if(alive&&d.items?.length)setCategories(d.items.map((x:any)=>x.name))}).catch(()=>{});return()=>{alive=false}},[]);
  function submit(e:React.FormEvent){e.preventDefault();router.push(`/search?q=${encodeURIComponent(q.trim())}`)}
  async function logout(){await fetch('/api/auth/logout',{method:'POST'});router.refresh()}
  const cat=(x:string)=>`/category/${x.toLowerCase().replace(/\s+/g,'-').replace(/&/g,'and')}`;
  return <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080d21]/85 backdrop-blur-2xl">
    <div className="shell flex items-center gap-3 py-3">
      <Link href="/" className="flex items-center gap-2 shrink-0"><span className="hz-logo-mark">H</span><span className="hz-logo hidden sm:block">Halozon</span></Link>
      <form onSubmit={submit} className="flex-1 max-w-3xl mx-auto"><div className="flex items-center rounded-xl border border-white/15 bg-white/[.06] focus-within:border-violet-400/70 focus-within:ring-4 focus-within:ring-violet-500/10 overflow-hidden"><Search className="ml-3 w-4 h-4 text-violet-300"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search the marketplace..." className="flex-1 bg-transparent outline-none px-3 py-2.5 text-sm text-white placeholder:text-slate-500"/><button className="btn btn-primary !rounded-none !py-2.5">Search</button></div></form>
      <div className="flex items-center gap-1">
        <div className="relative hidden md:block"><button onClick={()=>setOpen(v=>!v)} className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/10" aria-expanded={open}><User className="w-5 h-5 text-violet-300"/><span className="hidden lg:block text-left text-xs"><small className="block text-slate-400">{user?`Hi, ${user.name.split(' ')[0]}`:'Welcome'}</small><b className="text-slate-100">Account</b><ChevronDown className="inline w-3 h-3 ml-1"/></span></button>{open&&<div className="absolute right-0 top-full mt-2 w-72 surface p-4 animate-reveal">{user?<><div className="border-b border-white/10 pb-3 mb-3"><b>{user.name}</b><p className="text-xs muted">{user.email}</p></div><div className="grid grid-cols-2 gap-2 text-sm"><Link className="amazon-link" href="/account">Dashboard</Link><Link className="amazon-link" href="/account/orders">Orders</Link><Link className="amazon-link" href="/account/wishlist">Wishlist</Link><Link className="amazon-link" href="/account/addresses">Addresses</Link>{user.role==='seller'&&<Link className="amazon-link" href="/seller/dashboard">Seller hub</Link>}{user.role==='admin'&&<Link className="amazon-link" href="/admin">Admin</Link>}</div><button onClick={logout} className="btn btn-soft mt-4 w-full"><LogOut className="w-4 h-4"/>Sign out</button></>:<><Link href="/signin" className="btn btn-primary w-full">Sign in</Link><Link href="/register" className="block text-center amazon-link text-sm mt-3">Create account</Link></>}</div>}</div>
        <Link href="/account/orders" className="hidden lg:flex p-2 rounded-xl hover:bg-white/10" aria-label="Orders"><Package className="w-5 h-5"/></Link><Link href="/cart" className="relative p-2 rounded-xl hover:bg-white/10" aria-label="Cart"><ShoppingCart className="w-6 h-6"/>{count>0&&<span className="absolute -top-1 -right-1 bg-fuchsia-500 text-white rounded-full min-w-5 h-5 text-[10px] flex items-center justify-center font-bold">{count}</span>}</Link><button onClick={()=>setMobile(true)} className="md:hidden p-2" aria-label="Open navigation"><Menu/></button>
      </div>
    </div>
    <nav className="shell flex gap-5 overflow-x-auto pb-3 text-sm text-slate-400">{categories.map(c=><Link className={`whitespace-nowrap font-medium ${pathname===cat(c)?'text-violet-300':'hover:text-white'}`} href={cat(c)} key={c}>{c}</Link>)}<Link className="whitespace-nowrap font-bold text-fuchsia-300" href="/deals"><Sparkles className="inline w-3 h-3 mr-1"/>Trending drops</Link><Link className="whitespace-nowrap font-bold text-cyan-300" href="/prime">Halozon Plus</Link></nav>
    {mobile&&<div className="fixed inset-0 z-[60]"><button className="absolute inset-0 bg-slate-950/70" onClick={()=>setMobile(false)} aria-label="Close navigation"/><aside className="relative w-full max-w-sm bg-[#0d1330] border-r border-white/10 h-full p-5 animate-reveal"><div className="flex justify-between items-center mb-5"><b className="text-xl">Explore Halozon</b><button onClick={()=>setMobile(false)} aria-label="Close"><X/></button></div>{categories.map(c=><Link key={c} href={cat(c)} onClick={()=>setMobile(false)} className="block rounded-xl p-3 hover:bg-white/10 font-semibold">{c}</Link>)}<Link href="/deals" onClick={()=>setMobile(false)} className="block rounded-xl p-3 text-fuchsia-300 font-bold">Trending drops</Link></aside></div>}
  </header>
}
