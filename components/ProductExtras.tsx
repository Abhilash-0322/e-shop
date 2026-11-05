'use client';

import {useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import {Check, MessageCircle, Send} from 'lucide-react';
import FormField, {fieldA11y} from './FormField';

export default function ProductExtras({productId}: {productId: string}) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [review, setReview] = useState({rating: 5, title: '', body: ''});
  const [question, setQuestion] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/products/${productId}`, {signal: controller.signal}).then((response) => response.json()).then((data) => {
      if (!controller.signal.aborted) setReviews(data.product?.reviews || []);
    }).catch(() => {});
    fetch(`/api/products/${productId}/questions`, {signal: controller.signal}).then((response) => response.json()).then((data) => {
      if (!controller.signal.aborted) setQuestions(data.items || []);
    }).catch(() => {});
    return () => controller.abort();
  }, [productId]);

  async function postReview(event: React.FormEvent) {
    event.preventDefault();
    if (review.body.trim().length < 4) {
      setErrors({reviewBody: 'Add at least a few words about your experience.'});
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      const response = await fetch(`/api/products/${productId}/review`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(review)});
      const data = await response.json();
      if (!response.ok) {
        setErrors({review: data.error || 'Sign in to review this product.'});
        return;
      }
      toast.success('Review submitted');
      setReview({rating: 5, title: '', body: ''});
    } catch {
      setErrors({review: 'The service is unavailable. Try again shortly.'});
    } finally {
      setBusy(false);
    }
  }

  async function postQuestion(event: React.FormEvent) {
    event.preventDefault();
    if (question.trim().length < 5) {
      setErrors({question: 'Ask a question with at least five characters.'});
      return;
    }
    const response = await fetch(`/api/products/${productId}/questions`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({body: question})});
    if (response.ok) {
      setQuestion('');
      setErrors({});
      toast.success('Question posted');
    } else setErrors({question: 'Sign in to ask a question.'});
  }

  async function alertStock(event: React.FormEvent) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({stockEmail: 'Enter a valid email address.'});
      return;
    }
    const response = await fetch('/api/stock-alerts', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({email, productId})});
    if (response.ok) {
      setErrors({});
      toast.success('We will email you when it is back');
    } else setErrors({stockEmail: 'Could not create the alert. Try again.'});
  }

  return <section className="mt-12 space-y-6">
    <div className="grid min-w-0 gap-6 lg:grid-cols-2">
      <form onSubmit={postReview} noValidate className="surface min-w-0 p-5 sm:p-6">
        <p className="eyebrow">Community</p><h2 className="mt-2 text-2xl font-black">Share your take</h2>
        {errors.review && <p className="error-text mt-3 rounded bg-rose-50 p-2" role="alert">{errors.review}</p>}
        <FormField id="review-rating" label="Rating"><select id="review-rating" className="input" value={review.rating} onChange={(event) => setReview({...review, rating: Number(event.target.value)})}>{[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} stars</option>)}</select></FormField>
        <div className="mt-3"><FormField id="review-title" label="Review title"><input id="review-title" className="input" placeholder="A short summary" value={review.title} onChange={(event) => setReview({...review, title: event.target.value})}/></FormField></div>
        <div className="mt-3"><FormField id="review-body" label="Your review" error={errors.reviewBody}><textarea {...fieldA11y('review-body', errors.reviewBody)} required minLength={4} className="input min-h-28" placeholder="What should shoppers know?" value={review.body} onChange={(event) => {setReview({...review, body: event.target.value}); setErrors((current) => ({...current, reviewBody: ''}))}}/></FormField></div>
        <button disabled={busy} className="btn btn-primary mt-3">{busy ? 'Sending…' : 'Publish review'}<Send className="h-4 w-4" aria-hidden="true"/></button>
      </form>
      <div className="surface min-w-0 p-5 sm:p-6"><p className="eyebrow">Questions</p><h2 className="mt-2 text-2xl font-black">Ask the community</h2>
        <form onSubmit={postQuestion} noValidate className="mt-5 flex flex-wrap gap-2"><div className="min-w-0 flex-1"><label htmlFor="product-question" className="sr-only">Your question</label><input {...fieldA11y('product-question', errors.question)} required minLength={5} id="product-question" className="input" placeholder="Ask a question" value={question} onChange={(event) => setQuestion(event.target.value)}/></div><button className="btn btn-dark" aria-label="Post question"><Send className="h-4 w-4" aria-hidden="true"/></button></form>
        {errors.question && <p className="error-text mt-2" role="alert">{errors.question}</p>}
        <div className="mt-5 space-y-3">{questions.slice(0, 4).map((item) => <div className="border-t pt-3" key={item._id}><b className="text-wrap text-sm"><MessageCircle className="mr-1 inline h-4 w-4 text-indigo-600" aria-hidden="true"/>{item.body}</b><p className="mt-2 text-xs muted">{item.answers?.length || 0} answers · {item.helpful || 0} found helpful</p></div>)}{!questions.length && <p className="text-sm muted">Be the first to ask.</p>}</div>
      </div>
    </div>
    <div className="surface p-5 sm:p-6"><p className="eyebrow">Reviews</p><h2 className="mt-2 text-2xl font-black">What shoppers say</h2><div className="mt-5 grid gap-4 md:grid-cols-2">{reviews.slice(0, 6).map((item) => <article className="rounded-xl bg-slate-50 p-4" key={item._id || item.body}><div className="text-amber-500" aria-label={`${item.rating || 5} out of 5 stars`}>{'★'.repeat(item.rating || 5)}</div><b className="mt-2 block text-wrap">{item.title || 'Verified experience'}</b><p className="mt-2 text-sm text-slate-600 text-wrap">{item.body}</p><small className="mt-3 block muted">{item.userName || 'Halozon shopper'} {item.verifiedBuyer && <Check className="inline h-3 w-3 text-emerald-600" aria-label="Verified buyer"/>}</small></article>)}</div></div>
    <form onSubmit={alertStock} noValidate className="surface flex flex-col gap-3 p-5 sm:flex-row sm:items-end sm:p-6"><FormField id="stock-email" label="Want a restock alert?" error={errors.stockEmail} hint="We will only email you about this product."><input {...fieldA11y('stock-email', errors.stockEmail, 'stock-email-description')} required type="email" className="input" placeholder="Your email" value={email} onChange={(event) => setEmail(event.target.value)}/></FormField><button className="btn btn-soft">Notify me</button></form>
  </section>;
}
