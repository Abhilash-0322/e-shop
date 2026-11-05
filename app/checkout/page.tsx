'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Check,CheckCircle2,Lock,ShieldCheck,Truck} from '@/lib/icons';
import {useCart} from '@/hooks/useCart';
import toast from 'react-hot-toast';

export default function Checkout(){
  const router=useRouter();
  const {items}=useCart();
  const [busy,setBusy]=useState(false);
  const [address,setAddress]=useState({fullName:'',street:'',city:'',state:'',zip:'',country:'United States',phone:''});
  const [payment,setPayment]=useState('visa');
  const [card,setCard]=useState('');
  async function submit(e:React.FormEvent){
    e.preventDefault();
    setBusy(true);
    try{
      const r=await fetch('/api/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({shippingAddress:address,paymentMethod:payment,cardNumber:card})});
      const d=await r.json();
      if(!r.ok)throw Error(d.error);
      toast.success('Order placed');
      router.push(`/account/orders/${d.order._id}`);
    }catch(e:any){toast.error(e.message||'Checkout failed')}finally{setBusy(false)}
  }
  if(!items.length)return <div className="shell py-20 text-center"><h1 className="page-title">Your cart is empty</h1></div>;
  const total=items.reduce((sum,item)=>sum+item.price*item.qty,0);
  const shipping=total>=35?0:5.99;
  return <div className="shell py-10 md:py-14"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8"><div><p className="eyebrow">Checkout</p><h1 className="page-title mt-2">A safe, simple finish.</h1></div><span className="status-chip success"><Lock className="w-3.5 h-3.5 mr-1"/> Secure checkout</span></div>
    <form onSubmit={submit} className="grid lg:grid-cols-[1fr_380px] gap-8">
      <div className="space-y-5">
        <section className="surface p-6"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173f32] text-white text-sm font-bold">1</span><div><h2 className="text-xl font-black">Delivery details</h2><p className="text-xs muted mt-1">Where should this order meet you?</p></div></div><div className="grid sm:grid-cols-2 gap-3 mt-6">{[['fullName','Full name'],['street','Street address'],['city','City'],['state','State'],['zip','ZIP code'],['phone','Phone']].map(([key,label])=><label key={key} className="text-sm font-bold">{label}<input required value={(address as any)[key]} onChange={e=>setAddress({...address,[key]:e.target.value})} className="input mt-2"/></label>)}</div></section>
        <section className="surface p-6"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173f32] text-white text-sm font-bold">2</span><div><h2 className="text-xl font-black">Payment</h2><p className="text-xs muted mt-1">Your payment details stay protected.</p></div></div><div className="grid sm:grid-cols-2 gap-3 mt-6"><label className="text-sm font-bold">Card type<select value={payment} onChange={e=>setPayment(e.target.value)} className="input mt-2"><option value="visa">Visa</option><option value="mastercard">Mastercard</option></select></label><label className="text-sm font-bold">Card number<input required value={card} onChange={e=>setCard(e.target.value)} placeholder="4242 4242 4242 4242" className="input mt-2"/></label></div><p className="text-xs muted mt-4 flex gap-1.5"><ShieldCheck className="w-4 h-4 text-[#28704e]"/> This is a secure demo checkout. You will not be charged.</p></section>
      </div>
      <aside className="space-y-4"><div className="surface p-6 h-fit"><h2 className="font-black text-xl">Review order</h2><div className="space-y-3 mt-5">{items.map(item=><div key={String(item.productId)} className="flex gap-3 text-sm"><span className="w-7 h-7 rounded-lg bg-[#f0f7f1] flex items-center justify-center text-xs font-bold text-[#28704e]">{item.qty}</span><span className="flex-1 line-clamp-2">{item.title}</span><b>${(item.price*item.qty).toFixed(2)}</b></div>)}</div><div className="section-rule my-5"/><div className="flex justify-between text-sm"><span>Subtotal</span><span>${total.toFixed(2)}</span></div><div className="flex justify-between text-sm mt-2 muted"><span>Shipping</span><span>{shipping?'$5.99':'Free'}</span></div><div className="flex justify-between text-xl font-black text-[#173f32] mt-4"><span>Total</span><span>${(total+shipping).toFixed(2)}</span></div><button disabled={busy} className="btn btn-primary w-full mt-6"><Check className="w-4 h-4"/>{busy?'Placing order...':'Place protected order'}</button></div><div className="surface p-5 text-xs muted space-y-3"><p className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#28704e] shrink-0"/> Clear order updates in your account.</p><p className="flex gap-2"><Truck className="w-4 h-4 text-[#28704e] shrink-0"/> Dispatch and delivery signals you can trust.</p></div></aside>
    </form>
  </div>;
}
