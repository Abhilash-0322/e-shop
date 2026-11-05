'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Bell, Check, MessageCircle, Send } from 'lucide-react';
import ProductCard, { Product } from './ProductCard';

export default function ProductExtras({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [bundleItems, setBundleItems] = useState<Product[]>([]);
  const [review, setReview] = useState({ rating: 5, title: '', body: '' });
  const [question, setQuestion] = useState('');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      fetch(`/api/products/${productId}`, { signal: controller.signal }).then((r) => r.json()),
      fetch(`/api/products/${productId}/questions`, { signal: controller.signal }).then((r) => r.json()),
      fetch('/api/me/recommendations', { signal: controller.signal }).then((r) => r.json()),
      fetch(`/api/bundles/${productId}`, { signal: controller.signal }).then((r) => r.json()),
    ]).then(([productData, questionData, recommendationData, bundleData]) => {
      if (controller.signal.aborted) return;
      setReviews(productData.product?.reviews || []);
      setQuestions(questionData.items || []);
      setRecommendations((recommendationData.items || []).filter((item: Product) => String(item._id) !== productId).slice(0, 5));
      const firstBundle = bundleData.items?.[0]?.products || [];
      setBundleItems(firstBundle.filter((item: Product) => String(item._id) !== productId).slice(0, 4));
    }).catch(() => {});
    return () => controller.abort();
  }, [productId]);

  async function postReview(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const response = await fetch(`/api/products/${productId}/review`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(review) });
      const data = await response.json();
      if (!response.ok) throw Error(data.error);
      toast.success('Review submitted');
      setReview({ rating: 5, title: '', body: '' });
    } catch (error: any) {
      toast.error(error.message || 'Sign in to review');
    } finally {
      setBusy(false);
    }
  }

  async function postQuestion(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch(`/api/products/${productId}/questions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ body: question }) });
    if (response.ok) { setQuestion(''); toast.success('Question posted'); } else toast.error('Sign in to ask a question');
  }

  async function alertStock(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch('/api/stock-alerts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, productId }) });
    toast[response.ok ? 'success' : 'error'](response.ok ? 'We will email you when it is back' : 'Could not create alert');
  }

  return (
    <section className="mt-14 space-y-8">
      {bundleItems.length > 0 && <section><div className="mb-5"><p className="eyebrow">Complete the look</p><h2 className="page-title mt-2">Often bought together</h2></div><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{bundleItems.map((item) => <ProductCard key={item._id} product={item} />)}</div></section>}
      {recommendations.length > 0 && <section><div className="mb-5"><p className="eyebrow">Keep exploring</p><h2 className="page-title mt-2">You may also like</h2></div><div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">{recommendations.map((item) => <ProductCard key={item._id} product={item} />)}</div></section>}
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={postReview} className="surface p-6 md:p-7"><p className="eyebrow">Community</p><h2 className="mt-2 text-2xl font-black">Share your take</h2><select className="input mt-5" value={review.rating} onChange={(event) => setReview({ ...review, rating: Number(event.target.value) })}>{[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} stars</option>)}</select><input className="input mt-3" placeholder="Review title" value={review.title} onChange={(event) => setReview({ ...review, title: event.target.value })} /><textarea required minLength={4} className="input mt-3 min-h-28" placeholder="What should shoppers know?" value={review.body} onChange={(event) => setReview({ ...review, body: event.target.value })} /><button disabled={busy} className="btn btn-primary mt-3">{busy ? 'Sending...' : 'Publish review'}<Send className="h-4 w-4" /></button></form>
        <div className="surface p-6 md:p-7"><p className="eyebrow">Questions</p><h2 className="mt-2 text-2xl font-black">Ask the community</h2><form onSubmit={postQuestion} className="mt-5 flex gap-2"><input required minLength={5} className="input" placeholder="Ask a question" value={question} onChange={(event) => setQuestion(event.target.value)} /><button className="btn btn-dark"><Send className="h-4 w-4" /></button></form><div className="mt-5 space-y-3">{questions.slice(0, 4).map((item) => <div className="border-t border-[#dfe5dc] pt-3" key={item._id}><b className="text-sm"><MessageCircle className="mr-1 inline h-4 w-4 text-[#728749]" />{item.body}</b><p className="muted mt-2 text-xs">{item.answers?.length || 0} answers · {item.helpful || 0} found helpful</p></div>)}{!questions.length && <p className="muted text-sm">Be the first to ask.</p>}</div></div>
      </div>
      <div className="surface p-6 md:p-7"><p className="eyebrow">Reviews</p><h2 className="mt-2 text-2xl font-black">What shoppers say</h2><div className="mt-5 grid gap-4 md:grid-cols-2">{reviews.slice(0, 6).map((item) => <article className="rounded-xl bg-[#edf1e9] p-4" key={item._id || item.body}><div className="text-[#b07a29]">{'★'.repeat(item.rating || 5)}</div><b className="mt-2 block">{item.title || 'Verified experience'}</b><p className="mt-2 text-sm text-[#526259]">{item.body}</p><small className="muted mt-3 block">{item.userName || 'Halozon shopper'} {item.verifiedBuyer && <Check className="inline h-3 w-3 text-[#728749]" />}</small></article>)}</div></div>
      <form onSubmit={alertStock} className="surface flex flex-col gap-3 p-6 sm:flex-row sm:items-end"><div className="flex-1"><p className="font-black"><Bell className="mr-1 inline h-4 w-4 text-[#728749]" />Want a restock alert?</p><input required type="email" className="input mt-3" placeholder="Your email" value={email} onChange={(event) => setEmail(event.target.value)} /></div><button className="btn btn-soft">Notify me</button></form>
    </section>
  );
}
