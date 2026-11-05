'use client';

import {useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import {CornerUpLeft} from 'lucide-react';
import {EmptyState, FormField, PageHeader, StatusBadge} from '@/components/ui';

export default function Returns() {
  const [items, setItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [form, setForm] = useState({orderId: '', reason: 'Changed my mind', notes: ''});
  const load = () => fetch('/api/returns').then(response => response.json()).then(data => setItems(data.items || []));

  useEffect(() => {
    load();
    fetch('/api/checkout').then(response => response.json()).then(data => setOrders(data.items || [])).catch(() => undefined);
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const order = orders.find(item => item._id === form.orderId);
    const response = await fetch('/api/returns', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({orderId: form.orderId, reason: form.reason, notes: form.notes, items: order?.items || []})});
    if (response.ok) {
      toast.success('Return request submitted');
      load();
      setForm({...form, orderId: '', notes: ''});
    } else {
      const data = await response.json();
      toast.error(data.error || 'Could not submit return');
    }
  }

  return (
    <div>
      <PageHeader eyebrow="After purchase" title="Returns, without the runaround." description="Delivered orders can be submitted for review with a reason and notes." />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {items.length ? items.map(item => (
            <div className="surface p-5" key={item._id}>
              <div className="flex flex-wrap justify-between gap-3"><b>{item.rma || 'Return request'}</b><StatusBadge value={item.status} /></div>
              <p className="muted mt-2 text-sm">{item.reason} · Refund estimate ${item.refundAmount || 0}</p>
            </div>
          )) : <EmptyState title="No return requests" description="If something is not right with an order, you can start a review here." icon={<CornerUpLeft className="h-8 w-8" />} />}
        </div>
        <form onSubmit={submit} className="surface h-fit space-y-4 p-6">
          <div><p className="eyebrow">Start a request</p><h2 className="mt-2 text-xl font-black">Tell us what happened</h2></div>
          <FormField label="Order"><select required className="input mt-2" value={form.orderId} onChange={event => setForm({...form, orderId: event.target.value})}><option value="">Select a delivered order</option>{orders.map(order => <option key={order._id} value={order._id}>{order.orderNumber}</option>)}</select></FormField>
          <FormField label="Reason"><select className="input mt-2" value={form.reason} onChange={event => setForm({...form, reason: event.target.value})}>{['Changed my mind', 'Damaged item', 'Wrong item', 'Not as described'].map(reason => <option key={reason}>{reason}</option>)}</select></FormField>
          <FormField label="Additional notes"><textarea className="input mt-2 min-h-24" placeholder="Add useful context" value={form.notes} onChange={event => setForm({...form, notes: event.target.value})} /></FormField>
          <button className="btn btn-primary w-full">Submit request</button>
        </form>
      </div>
    </div>
  );
}
