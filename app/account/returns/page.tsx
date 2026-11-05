'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import toast from 'react-hot-toast';

export default function Returns() {
  const [items, setItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [form, setForm] = useState({orderId: '', reason: 'Changed my mind', notes: ''});
  const requests = useRef(new Set<AbortController>());

  const load = useCallback(async () => {
    const controller = new AbortController();
    requests.current.add(controller);
    try {
      const response = await fetch('/api/returns', {signal: controller.signal});
      const data = await response.json();
      if (!controller.signal.aborted) setItems(data.items || []);
    } finally {
      requests.current.delete(controller);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    requests.current.add(controller);
    Promise.all([
      fetch('/api/returns', {signal: controller.signal}).then((response) => response.json()),
      fetch('/api/checkout', {signal: controller.signal}).then((response) => response.json()),
    ])
      .then(([returns, checkout]) => {
        if (!controller.signal.aborted) {
          setItems(returns.items || []);
          setOrders(checkout.items || []);
        }
      })
      .catch(() => undefined)
      .finally(() => requests.current.delete(controller));
    return () => {
      requests.current.forEach((request) => request.abort());
      requests.current.clear();
    };
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const order = orders.find((item) => item._id === form.orderId);
    const controller = new AbortController();
    requests.current.add(controller);
    try {
      const response = await fetch('/api/returns', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({orderId: form.orderId, reason: form.reason, notes: form.notes, items: order?.items || []}),
        signal: controller.signal,
      });
      if (response.ok) {
        toast.success('Return request submitted');
        await load();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Could not submit return');
      }
    } finally {
      requests.current.delete(controller);
    }
  }

  return (
    <div>
      <p className="eyebrow">After purchase</p>
      <h1 className="page-title mt-2">Returns, without the runaround.</h1>
      <p className="muted mt-3">Delivered orders can be submitted for review with a reason and notes.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {items.length ? items.map((item) => (
            <div className="surface p-5" key={item._id}>
              <div className="flex justify-between"><b>{item.rma || 'Return request'}</b><span className="pill">{item.status}</span></div>
              <p className="muted mt-2 text-sm">{item.reason} · Refund estimate ${item.refundAmount || 0}</p>
            </div>
          )) : <div className="surface muted p-8">No return requests yet.</div>}
        </div>
        <form onSubmit={submit} className="surface h-fit p-6">
          <h2 className="text-xl font-black">Start a return</h2>
          <select required className="input mt-5" value={form.orderId} onChange={(event) => setForm({...form, orderId: event.target.value})}><option value="">Select a delivered order</option>{orders.map((order) => <option key={order._id} value={order._id}>{order.orderNumber}</option>)}</select>
          <select className="input mt-3" value={form.reason} onChange={(event) => setForm({...form, reason: event.target.value})}>{['Changed my mind', 'Damaged item', 'Wrong item', 'Not as described'].map((reason) => <option key={reason}>{reason}</option>)}</select>
          <textarea className="input mt-3 min-h-24" placeholder="Additional notes" value={form.notes} onChange={(event) => setForm({...form, notes: event.target.value})} />
          <button className="btn btn-primary mt-3 w-full">Submit request</button>
        </form>
      </div>
    </div>
  );
}
