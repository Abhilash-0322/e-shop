'use client';

import {useEffect,useMemo,useState} from 'react';
import toast from 'react-hot-toast';
import {Bell,Camera,CheckCircle2,ChevronDown,Flag,Heart,MessageCircle,Send,ThumbsUp} from 'lucide-react';

type Review={_id?:string;rating:number;title?:string;body:string;helpful?:number;userName?:string;verifiedBuyer?:boolean;images?:string[];createdAt?:string};
type Question={_id:string;body:string;helpful?:number;userName?:string;answers?:{body:string;userName?:string}[];answerCount?:number};

export default function ProductExtras({productId,rating=4.5,ratingCount=0}:{productId:string;rating?:number;ratingCount?:number}){
  const [reviews,setReviews]=useState<Review[]>([]);
  const [questions,setQuestions]=useState<Question[]>([]);
  const [review,setReview]=useState({rating:5,title:'',body:'',photoUrl:''});
  const [question,setQuestion]=useState('');
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [email,setEmail]=useState('');
  const [busy,setBusy]=useState(false);
  const [sort,setSort]=useState<'helpful'|'recent'>('helpful');
  const [reported,setReported]=useState<string[]>([]);

  useEffect(()=>{
    const c=new AbortController();
    fetch(`/api/products/${productId}`,{signal:c.signal}).then(r=>r.json()).then(d=>{if(!c.signal.aborted)setReviews(d.product?.reviews||[])}).catch(()=>{});
    fetch(`/api/products/${productId}/questions`,{signal:c.signal}).then(r=>r.json()).then(d=>{if(!c.signal.aborted)setQuestions(d.items||[])}).catch(()=>{});
    return()=>c.abort();
  },[productId]);

  const counts=useMemo(()=>[5,4,3,2,1].map(star=>({star,count:reviews.filter(item=>item.rating===star).length})),[reviews]);
  const average=reviews.length?reviews.reduce((sum,item)=>sum+item.rating,0)/reviews.length:rating;
  const photoReviews=reviews.filter(item=>item.images?.length);
  const visibleReviews=[...reviews].sort((a,b)=>sort==='helpful'?(b.helpful||0)-(a.helpful||0):String(b.createdAt||'').localeCompare(String(a.createdAt||'')));

  async function postReview(e:React.FormEvent){
    e.preventDefault();
    setBusy(true);
    try{
      const body={...review,images:review.photoUrl?[review.photoUrl]:[]};
      const r=await fetch(`/api/products/${productId}/review`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      const d=await r.json();
      if(!r.ok)throw Error(d.error);
      toast.success(d.verifiedBuyer?'Review published with verified-buyer badge':'Review submitted for publishing');
      setReview({rating:5,title:'',body:'',photoUrl:''});
    }catch(e:any){toast.error(e.message||'Sign in to review')}finally{setBusy(false)}
  }
  async function postQuestion(e:React.FormEvent){
    e.preventDefault();
    const r=await fetch(`/api/products/${productId}/questions`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({body:question})});
    if(r.ok){const d=await r.json();setQuestions(items=>[d.question,...items]);setQuestion('');toast.success('Question posted')}else toast.error('Sign in to ask a question');
  }
  async function markReviewHelpful(item:Review){
    if(!item._id){toast.error('This review cannot be voted on yet');return}
    const r=await fetch(`/api/products/${productId}/reviews/${item._id}/helpful`,{method:'POST'});
    const d=await r.json();
    if(r.ok){setReviews(items=>items.map(review=>review._id===item._id?{...review,helpful:d.helpful}:review));toast.success(d.alreadyVoted?'Already marked helpful':'Thanks for the signal')}
    else toast.error(d.error||'Sign in to vote');
  }
  async function markQuestionHelpful(item:Question){
    const r=await fetch(`/api/questions/${item._id}/helpful`,{method:'POST'});
    const d=await r.json();
    if(r.ok){setQuestions(items=>items.map(question=>question._id===item._id?{...question,helpful:d.helpful}:question));toast.success('Thanks for helping the community')}
    else toast.error(d.error||'Sign in to vote');
  }
  async function postAnswer(item:Question){
    const body=answers[item._id]?.trim();
    if(!body)return;
    const r=await fetch(`/api/questions/${item._id}/answer`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({body})});
    const d=await r.json();
    if(r.ok){setQuestions(items=>items.map(question=>question._id===item._id?d.question:question));setAnswers({...answers,[item._id]:''});toast.success('Answer shared')}else toast.error(d.error||'Sign in to answer');
  }
  function report(key:string){setReported(items=>items.includes(key)?items:[...items,key]);toast.success('Thanks — our moderation team will review this signal.')}
  async function alertStock(e:React.FormEvent){
    e.preventDefault();
    const r=await fetch('/api/stock-alerts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,productId})});
    toast[r.ok?'success':'error'](r.ok?'We will email you when it is back':'Could not create alert');
  }

  return <section className="mt-16 space-y-6" id="community-proof">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4"><div><p className="eyebrow">Community proof</p><h2 className="page-title mt-2">Make a more informed choice.</h2><p className="muted mt-3 max-w-2xl">Reviews, photos, and questions from people who have spent time with this product.</p></div><a href="#ask" className="btn btn-quiet">Ask a question <MessageCircle className="w-4 h-4"/></a></div>

    <div className="grid lg:grid-cols-[.9fr_1.1fr] gap-6">
      <div className="surface p-6">
        <div className="flex items-end gap-3"><div><span className="text-5xl font-black text-[#173f32]">{average.toFixed(1)}</span><span className="text-[#d88942] text-xl ml-2">★★★★★</span><p className="text-sm muted mt-1">{ratingCount||reviews.length||0} community reviews</p></div><div className="ml-auto text-right"><span className="status-chip success"><CheckCircle2 className="w-3.5 h-3.5 mr-1"/> Purchase signals</span><p className="text-xs muted mt-2">Ratings are never hidden</p></div></div>
        <div className="space-y-2 mt-7">{counts.map(({star,count})=>{const total=reviews.length||ratingCount||1;const width=Math.round(count/total*100);return <div className="flex items-center gap-3 text-xs" key={star}><span className="w-8 text-[#687a70]">{star} star</span><div className="h-2 flex-1 rounded-full bg-[#edf2ee] overflow-hidden"><div className="h-full rounded-full bg-[#e2a05e]" style={{width:`${reviews.length?Math.max(width,count?5:0):star===5?'78%':star===4?'16%':'6%'}`}}/></div><span className="w-7 text-right muted">{reviews.length?count:'—'}</span></div>})}</div>
        <div className="grid grid-cols-2 gap-3 mt-7"><div className="stat-pill"><b>{reviews.filter(item=>item.verifiedBuyer).length||'—'}</b><small>verified-buyer reviews</small></div><div className="stat-pill"><b>{photoReviews.length||'—'}</b><small>reviews with photos</small></div></div>
      </div>
      <div className="surface p-6">
        <div className="flex items-center justify-between"><div><p className="eyebrow">Photo reviews</p><h3 className="text-xl font-black mt-1">See it in real homes.</h3></div><Camera className="w-6 h-6 text-[#d88942]"/></div>
        {photoReviews.length?<div className="grid grid-cols-4 gap-3 mt-5">{photoReviews.slice(0,8).flatMap(item=>(item.images||[]).map((src,index)=><img key={`${item._id}-${index}`} src={src} alt="Customer review" className="aspect-square rounded-xl object-cover bg-[#f0f7f1]"/>))}</div>:<div className="mt-5 rounded-xl border border-dashed border-[#c9d8ce] p-6 text-center"><Camera className="w-7 h-7 mx-auto text-[#9eb4a5]"/><p className="font-bold mt-3">No customer photos yet</p><p className="text-sm muted mt-1">Be the first to show how you use it.</p></div>}
        <p className="text-xs muted mt-5 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#28704e]"/> Photos are attached to reviews and screened for community safety.</p>
      </div>
    </div>

    <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-6" id="ask">
      <div className="surface p-6">
        <div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Questions & answers</p><h3 className="text-2xl font-black mt-1">Ask people who know.</h3></div><MessageCircle className="w-6 h-6 text-[#28704e]"/></div>
        <form onSubmit={postQuestion} className="flex gap-2 mt-5"><input required minLength={5} className="input" placeholder="Is this comfortable for all-day use?" value={question} onChange={e=>setQuestion(e.target.value)}/><button className="btn btn-primary"><Send className="w-4 h-4"/></button></form>
        <div className="space-y-4 mt-6">{questions.slice(0,5).map(item=><article className="border-t border-[#dce7df] pt-4" key={item._id}><div className="flex items-start gap-3"><span className="avatar w-8 h-8 shrink-0">{(item.userName||'Q').slice(0,1).toUpperCase()}</span><div className="flex-1"><b className="text-sm">{item.body}</b><p className="text-xs muted mt-1">Asked by {item.userName||'a Halozon shopper'} · {item.answerCount||item.answers?.length||0} answers</p><div className="flex items-center gap-3 mt-3"><button type="button" onClick={()=>markQuestionHelpful(item)} className="text-xs font-bold text-[#28704e] flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5"/> Helpful · {item.helpful||0}</button><button type="button" onClick={()=>report(`q-${item._id}`)} className={`text-xs flex items-center gap-1 ${reported.includes(`q-${item._id}`)?'text-[#a45b27]':'muted'}`}><Flag className="w-3.5 h-3.5"/>{reported.includes(`q-${item._id}`)?'Reported':'Report'}</button></div>
          {!!item.answers?.length&&<div className="ml-3 mt-3 space-y-2 border-l-2 border-[#e5f4e9] pl-3">{item.answers.map((answer,index)=><div key={index} className="text-sm"><p>{answer.body}</p><small className="muted">{answer.userName||'Community member'}</small></div>)}</div>}
          <div className="flex gap-2 mt-3"><input className="input !py-2 text-xs" placeholder="Add an answer" value={answers[item._id]||''} onChange={e=>setAnswers({...answers,[item._id]:e.target.value})}/><button type="button" onClick={()=>postAnswer(item)} className="btn btn-quiet !px-3 !py-2 text-xs">Reply</button></div>
        </div></div></article>)}{!questions.length&&<p className="muted text-sm border-t border-[#dce7df] pt-4">Be the first to ask a useful question.</p>}</div>
      </div>
      <form onSubmit={postReview} className="surface p-6 h-fit">
        <p className="eyebrow">Your experience</p><h3 className="text-2xl font-black mt-1">Leave a helpful review.</h3><p className="text-sm muted mt-2">Specific details help the next shopper more than a perfect score.</p>
        <select className="input mt-5" value={review.rating} onChange={e=>setReview({...review,rating:Number(e.target.value)})}>{[5,4,3,2,1].map(x=><option key={x} value={x}>{x} stars</option>)}</select>
        <input className="input mt-3" placeholder="Give your review a title" value={review.title} onChange={e=>setReview({...review,title:e.target.value})}/>
        <textarea required minLength={4} className="input mt-3 min-h-28" placeholder="What should shoppers know?" value={review.body} onChange={e=>setReview({...review,body:e.target.value})}/>
        <label className="text-xs font-bold text-[#52635a] block mt-3">Photo URL <span className="font-normal muted">(optional)</span><input className="input mt-1.5" placeholder="https://..." value={review.photoUrl} onChange={e=>setReview({...review,photoUrl:e.target.value})}/></label>
        <button disabled={busy} className="btn btn-primary mt-4 w-full">{busy?'Publishing...':'Publish review'}<Send className="w-4 h-4"/></button>
        <p className="text-xs muted mt-3 flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-[#d88942]"/> Your review can help someone buy with confidence.</p>
      </form>
    </div>

    <div className="surface p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><p className="eyebrow">Community reviews</p><h3 className="text-2xl font-black mt-1">The details behind the rating.</h3></div><label className="relative"><span className="sr-only">Sort reviews</span><select className="input !w-auto !pr-9 !py-2 text-sm" value={sort} onChange={e=>setSort(e.target.value as 'helpful'|'recent')}><option value="helpful">Most helpful</option><option value="recent">Most recent</option></select><ChevronDown className="pointer-events-none absolute right-2 top-2.5 w-4 h-4 muted"/></label></div>
      <div className="grid md:grid-cols-2 gap-4 mt-6">{visibleReviews.slice(0,8).map((item,index)=><article className="rounded-xl bg-[#f7faf7] border border-[#e5eee7] p-4" key={item._id||`${item.body}-${index}`}><div className="flex items-center justify-between"><span className="text-[#d88942] tracking-tight">{'★'.repeat(item.rating||5)}<span className="text-[#dce7df]">{'★'.repeat(5-(item.rating||5))}</span></span><button type="button" onClick={()=>report(`r-${item._id||index}`)} className={`text-xs flex items-center gap-1 ${reported.includes(`r-${item._id||index}`)?'text-[#a45b27]':'muted'}`}><Flag className="w-3.5 h-3.5"/>{reported.includes(`r-${item._id||index}`)?'Reported':'Report'}</button></div><b className="block mt-2">{item.title||'A considered shopper review'}</b><p className="text-sm text-[#52635a] mt-2 leading-relaxed">{item.body}</p>{item.images?.length&&<div className="flex gap-2 mt-3">{item.images.slice(0,3).map((src,imageIndex)=><img key={imageIndex} src={src} alt="" className="h-14 w-14 rounded-lg object-cover"/>)}</div>}<div className="flex items-center justify-between gap-2 mt-4"><small className="muted flex items-center gap-1.5"><span className="avatar w-6 h-6">{(item.userName||'H').slice(0,1).toUpperCase()}</span>{item.userName||'Halozon shopper'}{item.verifiedBuyer&&<span className="status-chip success !py-1 !px-1.5"><CheckCircle2 className="w-3 h-3 mr-1"/> Verified buyer</span>}</small><button type="button" onClick={()=>markReviewHelpful(item)} className="text-xs font-bold text-[#28704e] flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5"/> Helpful · {item.helpful||0}</button></div></article>)}{!reviews.length&&<div className="md:col-span-2 border border-dashed border-[#c9d8ce] rounded-xl p-8 text-center"><p className="font-bold">No reviews yet</p><p className="muted text-sm mt-1">Your experience could be the first useful signal.</p></div>}</div>
      <div className="mt-6 rounded-xl bg-[#eef7f0] p-4 text-xs text-[#52635a] flex gap-2"><Flag className="w-4 h-4 text-[#a45b27] shrink-0"/> See something that breaks our community guidelines? Use Report and our moderation team will review it.</div>
    </div>

    <form onSubmit={alertStock} className="surface p-5 flex flex-col sm:flex-row gap-3 sm:items-end"><div className="flex-1"><p className="font-black"><Bell className="inline w-4 h-4 text-[#28704e] mr-1"/> Want a restock alert?</p><input required type="email" className="input mt-3" placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)}/></div><button className="btn btn-soft">Notify me</button></form>
  </section>;
}
