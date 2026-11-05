'use client';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {usePathname,useRouter,useSearchParams} from 'next/navigation';
import {Search,ShoppingCart,Menu,X,ChevronDown,User,Package,LogOut,Command,Activity} from '@/lib/icons';
import {useCart} from '@/hooks/useCart';

type UserData={id:string;name:string;email:string;role:string}|null;
const cats=['Electronics','Computers','Smart Home','Books','Fashion','Home & Kitchen','Games'];

export default function Header({user}:{user:UserData}){
  const router=useRouter();const pathname=usePathname();const sp=useSearchParams();const searchRef=useRef<HTMLInputElement>(null);
  const {count}=useCart();const [q,setQ]=useState(sp.get('q')||'');const [open,setOpen]=useState(false);const [mobile,setMobile]=useState(false);const [categories,setCategories]=useState<string[]>(cats);
  useEffect(()=>{let alive=true;fetch('/api/categories').then(r=>r.json()).then(d=>{if(alive&&d.items?.length)setCategories(d.items.map((x:any)=>x.name))}).catch(()=>{});return()=>{alive=false}},[]);
  useEffect(()=>{const onKey=(event:KeyboardEvent)=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();searchRef.current?.focus()}};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[]);
  useEffect(()=>{setOpen(false);setMobile(false)},[pathname]);
  function submit(e:React.FormEvent){e.preventDefault();router.push(`/search?q=${encodeURIComponent(q.trim())}`)}
  async function logout(){await fetch('/api/auth/logout',{method:'POST'});router.refresh()}
  const cat=(x:string)=>`/category/${x.toLowerCase().replace(/\s+/g,'-').replace(/&/g,'and')}`;
  return <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[#0a0d0dee] backdrop-blur-xl">
    <div className="shell flex items-center gap-4 py-3">
      <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Halozon home"><span className="hz-logo-mark">H</span><span className="hz-logo hidden sm:block">halozon<span className="text-[var(--acid)]">_</span></span></Link>
      <form onSubmit={submit} className="flex-1 max-w-3xl">
        <div className="flex items-center rounded-lg border border-[var(--line-strong)] bg-[#101615] focus-within:border-[var(--acid)] focus-within:ring-4 focus-within:ring-[rgba(200,255,85,.08)] overflow-hidden">
          <Search className="ml-3 w-4 h-4 text-[var(--acid-dim)]"/>
          <input ref={searchRef} value={q} onChange={e=>setQ(e.target.value)} placeholder="query products, brands, categories..." aria-label="Search products" className="flex-1 bg-transparent outline-none px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--faint)]"/>
          <span className="hidden sm:flex items-center gap-1 mr-2 rounded border border-[var(--line)] px-1.5 py-1 text-[10px] text-[var(--faint)]"><Command className="w-3 h-3"/>K</span>
          <button className="hidden sm:inline-flex btn btn-primary !rounded-none !py-2.5">Run query</button>
        </div>
      </form>
      <div className="flex items-center gap-1">
        <span className="hidden xl:flex items-center gap-1.5 mr-2 text-[10px] uppercase tracking-[.16em] text-[var(--muted)]"><Activity className="w-3 h-3 text-[var(--acid)]"/> live</span>
        <div className="relative hidden md:block">
          <button onClick={()=>setOpen(v=>!v)} aria-expanded={open} className="flex items-center gap-2 p-2 rounded-lg hover:bg-[rgba(200,255,85,.08)]"><User className="w-5 h-5 text-[var(--acid)]"/><span className="hidden lg:block text-left text-xs"><small className="block text-[var(--muted)]">{user?`hi, ${user.name.split(' ')[0]}`:'guest session'}</small><b>account</b><ChevronDown className="inline w-3 h-3 ml-1"/></span></button>
          {open&&<div className="absolute right-0 top-full mt-2 w-72 surface p-4 animate-reveal">{user?<><div className="border-b border-[var(--line)] pb-3 mb-3"><b>{user.name}</b><p className="text-xs muted">{user.email}</p></div><div className="grid grid-cols-2 gap-2 text-sm"><Link className="amazon-link" href="/account">Dashboard</Link><Link className="amazon-link" href="/account/orders">Orders</Link><Link className="amazon-link" href="/account/wishlist">Wishlist</Link><Link className="amazon-link" href="/account/addresses">Addresses</Link>{user.role==='seller'&&<Link className="amazon-link" href="/seller/dashboard">Seller hub</Link>}{user.role==='admin'&&<Link className="amazon-link" href="/admin">Admin</Link>}</div><button onClick={logout} className="btn btn-soft mt-4 w-full"><LogOut className="w-4 h-4"/>Sign out</button></>:<><Link href="/signin" className="btn btn-primary w-full">Sign in</Link><Link href="/register" className="block text-center amazon-link text-sm mt-3">Create account</Link></>}</div>}
        </div>
        <Link href="/account/orders" className="hidden lg:flex p-2 rounded-lg hover:bg-[rgba(200,255,85,.08)]" aria-label="Orders"><Package className="w-5 h-5"/></Link>
        <Link href="/cart" className="relative p-2 rounded-lg hover:bg-[rgba(200,255,85,.08)]" aria-label={`Cart${count?`, ${count} items`:''}`}><ShoppingCart className="w-5 h-5"/>{count>0&&<span className="absolute -top-1 -right-1 bg-[var(--acid)] text-[#0a0d0d] rounded-full min-w-5 h-5 text-[10px] flex items-center justify-center font-bold">{count}</span>}</Link>
        <button onClick={()=>setMobile(true)} className="md:hidden p-2" aria-label="Open navigation"><Menu/></button>
      </div>
    </div>
    <nav className="shell flex gap-5 overflow-x-auto pb-3 text-[11px] uppercase tracking-[.12em] text-[var(--muted)]" aria-label="Primary navigation">{categories.map(c=><Link className={`whitespace-nowrap font-semibold ${pathname===cat(c)?'text-[var(--acid)]':'hover:text-[var(--acid)]'}`} href={cat(c)} key={c}>{c}</Link>)}<Link className="whitespace-nowrap font-bold text-[var(--amber)]" href="/deals">deals</Link><Link className="whitespace-nowrap font-bold text-[var(--acid)]" href="/prime">plus</Link></nav>
    {mobile&&<div className="fixed inset-0 z-[60]"><button className="absolute inset-0 bg-black/70" onClick={()=>setMobile(false)} aria-label="Close navigation"/><aside className="relative w-full max-w-sm bg-[var(--panel)] h-full p-5 animate-reveal border-r border-[var(--line)]"><div className="flex justify-between items-center mb-5"><b className="text-xl">explore<span className="text-[var(--acid)]">_</span></b><button onClick={()=>setMobile(false)} aria-label="Close"><X/></button></div>{categories.map(c=><Link key={c} href={cat(c)} onClick={()=>setMobile(false)} className="block rounded-lg p-3 hover:bg-[rgba(200,255,85,.08)] font-semibold">{c}</Link>)}<Link href="/deals" onClick={()=>setMobile(false)} className="block rounded-lg p-3 text-[var(--amber)] font-bold">Trending deals</Link></aside></div>}
  </header>
}
