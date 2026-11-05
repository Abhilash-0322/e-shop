'use client';

import Link from 'next/link';
import {CheckCircle2,Lock,Minus,Plus,ShieldCheck,ShoppingCart,Trash2,Truck} from '@/lib/icons';
import {useCart} from '@/hooks/useCart';
import toast from 'react-hot-toast';

export default function CartPage(){
  const {items,update,remove}=useCart();
  const total=items.reduce((n,i)=>n+i.price*i.qty,0);
  if(!items.length)return <div className="shell py-24 text-center"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e5f4e9] text-[#28704e]"><ShoppingCart className="w-8 h-8"/></span><h1 className="page-title mt-5">Your cart is ready for something good.</h1><p className="muted mt-3">A considered choice is only a few clicks away.</p><Link href="/search" className="btn btn-primary mt-7">Start shopping</Link></div>;
  const shipping=total>=35?0:5.99;
  return <div className="shell py-10 md:py-14"><div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8"><div><p className="eyebrow">Your bag</p><h1 className="page-title mt-2">Ready when you are.</h1></div><span className="status-chip success"><CheckCircle2 className="w-3.5 h-3.5 mr-1"/> Protected purchase</span></div>
    <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
      <div className="space-y-3">{items.map(i=><div key={String(i.productId)} className="surface p-4 flex gap-4 items-center"><img src={i.image||'/placeholder-product.svg'} alt={i.title} className="w-24 h-24 rounded-xl bg-[#f0f7f1] object-contain"/><div className="flex-1"><h2 className="font-bold">{i.title}</h2><p className="text-lg font-black text-[#173f32] mt-1">${i.price.toFixed(2)}</p><p className="text-xs muted mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-[#28704e]"/> Community-backed listing</p><div className="flex items-center gap-2 mt-3"><button className="p-1.5 rounded-lg bg-[#eef7f0] text-[#28704e]" onClick={()=>update(String(i.productId),Math.max(1,i.qty-1))} aria-label="Decrease quantity"><Minus className="w-4 h-4"/></button><b>{i.qty}</b><button className="p-1.5 rounded-lg bg-[#eef7f0] text-[#28704e]" onClick={()=>update(String(i.productId),i.qty+1)} aria-label="Increase quantity"><Plus className="w-4 h-4"/></button></div></div><button onClick={async()=>{await remove(String(i.productId));toast.success('Removed')}} aria-label="Remove item"><Trash2 className="w-5 h-5 text-[#84958b] hover:text-[#d76050]"/></button></div>)}</div>
      <aside className="space-y-4"><div className="surface p-6 h-fit"><p className="eyebrow">Order summary</p><div className="flex justify-between mt-5"><span>Subtotal</span><b>${total.toFixed(2)}</b></div><div className="flex justify-between mt-2 muted text-sm"><span>Shipping</span><span>{shipping===0?'Free':'$5.99'}</span></div><hr className="my-5 border-[#dce7df]"/><div className="flex justify-between text-xl text-[#173f32]"><b>Total</b><b>${(total+shipping).toFixed(2)}</b></div><Link href="/checkout" className="btn btn-primary w-full mt-6">Continue to checkout</Link><p className="text-xs muted text-center mt-3 flex items-center justify-center gap-1"><Lock className="w-3.5 h-3.5"/> Secure payment · no surprise fees</p></div><div className="surface p-5"><p className="font-bold text-sm">Why shoppers trust Halozon</p><div className="space-y-3 mt-4 text-xs muted"><span className="flex gap-2"><ShieldCheck className="w-4 h-4 text-[#28704e] shrink-0"/> Buyer protection if an order is not as described.</span><span className="flex gap-2"><Truck className="w-4 h-4 text-[#28704e] shrink-0"/> Free shipping automatically applied over $35.</span></div></div></aside>
    </div>
  </div>;
}
