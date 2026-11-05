'use client';

import {useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import {Bell, Check, MessageCircle, Send} from 'lucide-react';

export default function ProductExtras({productId}: {productId: string}) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [review, setReview] = useState({rating: 5, title: '', body: ''});
  const [question, setQuestion] = useState('');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');

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
    setBusy(true);
    setStatus('');
    try {
      const response = await fetch(`/api/products/${productId}/review`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(review)});
      const data = await response.json();
      if (!response.ok) throw Error(data.error);
      setStatus('Review submitted.');
      toast.success('Review submitted');
      setReview({rating: 5, title: '', body: ''});
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Sign in to review';
      setStatus(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  async function postQuestion(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch(`/api/products/${productId}/questions`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({body: question})});
    if (response.ok) {
      setQuestion('');
      setStatus('Question posted.');
      toast.success('Question posted');
    } else {
      setStatus('Sign in to ask a question.');
      toast.error('Sign in to ask a question');
    }
  }

  async function alertStock(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch('/api/stock-alerts', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({email, productId})});
    const message = response.ok ? 'We will email you when it is back.' : 'Could not create alert.';
    setStatus(message);
    toast[response.ok ? 'success' : 'error'](message);
  }

  return (
    <section className="mt-12 space-y-6" aria-labelledby="community-heading">
      <h2 id="community-heading" className="sr-only">Community feedback</h2>
      {status && <p className="status-text" role="status" aria-live="polite">{status}</p>}
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={postReview} className="surface p-6" aria-labelledby="review-form-heading">
          <p className="eyebrow">Community</p>
          <h3 id="review-form-heading" className="mt-2 text-2xl font-black">Share your take</h3>
          <label htmlFor="review-rating" className="sr-only">Rating</label>
          <select id="review-rating" className="input mt-5" value={review.rating} onChange={(event) => setReview({...review, rating: Number(event.target.value)})}>
            {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}
          </select>
          <label htmlFor="review-title" className="sr-only">Review title</label>
          <input id="review-title" className="input mt-3" placeholder="Review title" value={review.title} onChange={(event) => setReview({...review, title: event.target.value})} />
          <label htmlFor="review-body" className="sr-only">Review details</label>
          <textarea id="review-body" required minLength={4} className="input mt-3 min-h-28" placeholder="What should shoppers know?" value={review.body} onChange={(event) => setReview({...review, body: event.target.value})} />
          <button type="submit" disabled={busy} className="btn btn-primary mt-3" aria-busy={busy}>{busy ? 'Sending…' : 'Publish review'} <Send className="h-4 w-4" aria-hidden="true" /></button>
        </form>

        <section className="surface p-6" aria-labelledby="questions-heading">
          <p className="eyebrow">Questions</p>
          <h3 id="questions-heading" className="mt-2 text-2xl font-black">Ask the community</h3>
          <form onSubmit={postQuestion} className="mt-5 flex gap-2">
            <label htmlFor="product-question" className="sr-only">Your question</label>
            <input id="product-question" required minLength={5} className="input" placeholder="Ask a question" value={question} onChange={(event) => setQuestion(event.target.value)} />
            <button type="submit" className="btn btn-dark" aria-label="Post question"><Send className="h-4 w-4" aria-hidden="true" /></button>
          </form>
          <div className="mt-5 space-y-3">
            {questions.slice(0, 4).map((item) => (
              <article className="border-t pt-3" key={item._id}>
                <b className="text-sm"><MessageCircle className="mr-1 inline h-4 w-4 text-indigo-700" aria-hidden="true" />{item.body}</b>
                <p className="mt-2 text-xs muted">{item.answers?.length || 0} answers · {item.helpful || 0} found helpful</p>
              </article>
            ))}
            {!questions.length && <p className="text-sm muted">Be the first to ask.</p>}
          </div>
        </section>
      </div>

      <section className="surface p-6" aria-labelledby="reviews-heading">
        <p className="eyebrow">Reviews</p>
        <h3 id="reviews-heading" className="mt-2 text-2xl font-black">What shoppers say</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {reviews.slice(0, 6).map((item) => (
            <article className="rounded-xl bg-slate-50 p-4" key={item._id || item.body}>
              <div className="text-amber-700" aria-label={`${item.rating || 5} out of 5 stars`}>{'★'.repeat(item.rating || 5)}</div>
              <b className="mt-2 block">{item.title || 'Verified experience'}</b>
              <p className="mt-2 text-sm text-slate-700">{item.body}</p>
              <small className="mt-3 block muted">{item.userName || 'Halozon shopper'} {item.verifiedBuyer && <Check className="inline h-3 w-3 text-emerald-700" aria-label="Verified buyer" />}</small>
            </article>
          ))}
          {!reviews.length && <p className="text-sm muted">No reviews yet.</p>}
        </div>
      </section>

      <form onSubmit={alertStock} className="surface flex flex-col gap-3 p-6 sm:flex-row sm:items-end" aria-labelledby="restock-heading">
        <div className="flex-1">
          <p id="restock-heading" className="font-black"><Bell className="mr-1 inline h-4 w-4 text-indigo-700" aria-hidden="true" />Want a restock alert?</p>
          <label htmlFor="stock-email" className="sr-only">Email for restock alerts</label>
          <input id="stock-email" required type="email" className="input mt-3" placeholder="Your email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <button type="submit" className="btn btn-soft">Notify me</button>
      </form>
    </section>
  );
}
