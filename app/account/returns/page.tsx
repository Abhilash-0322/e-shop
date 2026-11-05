'use client';

import {useEffect, useState} from 'react';
import toast from 'react-hot-toast';

export default function Returns() {
  const [items, setItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({orderId: '', reason: 'Changed my mind', notes: ''});
  const load = () => fetch('/api/returns').then((response) => response.json()).then((data) => setItems(data.items || []));

  useEffect(() => {
    load();
    fetch('/api/checkout').then((response) => response.json()).then((data) => setOrders(data.items || [])).catch(() => {});
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const order = orders.find((item) => item._id === form.orderId);
    const response = await fetch('/api/returns', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({orderId: form.orderId, reason: form.reason, notes: form.notes, items: order?.items || []})});
    if (response.ok) {
      setStatus('Return request submitted.');
      toast.success('Return request submitted');
      load();
    } else {
      const data = await response.json();
      const message = data.error || 'Could not submit return';
      setStatus(message);
      toast.error(message);
    }
  }

  return (
    <div>
      <p className="eyebrow">After purchase</p>
      <h1 className="page-title mt-2">Returns, without the runaround.</h1>
      <p className="mt-3 muted">Delivered orders can be submitted for review with a reason and notes.</p>
      {status && <p className="mt-3 text-sm muted" role="status">{status}</p>}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-3" aria-labelledby="return-history">
          <h2 id="return-history" className="sr-only">Return history</h2>
          {items.length ? items.map((item) => <article className="surface p-5" key={item._id}><div className="flex justify-between gap-3"><b>{item.rma || 'Return request'}</b><span className="pill">{item.status}</span></div><p className="mt-2 text-sm muted">{item.reason} · Refund estimate ${item.refundAmount || 0}</p></article>) : <div className="surface p-8 muted">No return requests yet.</div>}
        </section>
        <form onSubmit={submit} className="surface h-fit p-6" aria-labelledby="start-return">
          <h2 id="start-return" className="text-xl font-black">Start a return</h2>
          <label htmlFor="return-order" className="sr-only">Delivered order</label>
          <select id="return-order" required className="input mt-5" value={form.orderId} onChange={(event) => setForm({...form, orderId: event.target.value})}><option value="">Select a delivered order</option>{orders.map((order) => <option key={order._id} value={order._id}>{order.orderNumber}</option>)}</select>
          <label htmlFor="return-reason" className="sr-only">Reason for return</label>
          <select id="return-reason" className="input mt-3" value={form.reason} onChange={(event) => setForm({...form, reason: event.target.value})}>{['Changed my mind', 'Damaged item', 'Wrong item', 'Not as described'].map((reason) => <option key={reason}>{reason}</option>)}</select>
          <label htmlFor="return-notes" className="sr-only">Additional notes</label>
          <textarea id="return-notes" className="input mt-3 min-h-24" placeholder="Additional notes" value={form.notes} onChange={(event) => setForm({...form, notes: event.target.value})} />
          <button type="submit" className="btn btn-primary mt-3 w-full">Submit request</button>
        </form>
      </div>
    </div>
  );
}
