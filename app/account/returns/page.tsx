'use client';
import {useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import {LocalizedPrice} from '@/components/LocaleDisplay';
import FormField, {fieldA11y} from '@/components/FormField';

export default function Returns() {
  const [items, setItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [form, setForm] = useState({orderId: '', reason: 'Changed my mind', notes: ''});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const load = () => fetch('/api/returns').then((response) => response.json()).then((data) => setItems(data.items || []));
  useEffect(() => {load(); fetch('/api/checkout').then((response) => response.json()).then((data) => setOrders(data.items || [])).catch(() => {});}, []);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.orderId) {setErrors({orderId: 'Select a delivered order.'}); return;}
    const order = orders.find((item) => item._id === form.orderId);
    const response = await fetch('/api/returns', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({orderId: form.orderId, reason: form.reason, notes: form.notes, items: order?.items || []})});
    if (response.ok) {toast.success('Return request submitted'); setErrors({}); load();} else {const data = await response.json(); setErrors({form: data.error || 'Could not submit return'});}
  }
  return <div><p className="eyebrow">After purchase</p><h1 className="page-title mt-2">Returns, without the runaround.</h1><p className="mt-3 muted">Delivered orders can be submitted for review with a reason and notes.</p><div className="mt-8 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)]"><div className="min-w-0 space-y-3">{items.length ? items.map((item) => <div className="surface p-5" key={item._id}><div className="flex flex-wrap justify-between gap-3"><b>{item.rma || 'Return request'}</b><span className="pill">{item.status}</span></div><p className="mt-2 text-sm muted">{item.reason} · Refund estimate <LocalizedPrice value={Number(item.refundAmount || 0)}/></p></div>) : <div className="surface p-8 muted">No return requests yet.</div>}</div><form onSubmit={submit} noValidate className="surface h-fit min-w-0 space-y-4 p-5 sm:p-6"><h2 className="text-xl font-black">Start a return</h2>{errors.form && <p className="error-text rounded bg-rose-50 p-2" role="alert">{errors.form}</p>}<FormField id="return-order" label="Order" error={errors.orderId}><select {...fieldA11y('return-order', errors.orderId)} required className="input" value={form.orderId} onChange={(event) => {setForm({...form, orderId: event.target.value}); setErrors({});}}><option value="">Select a delivered order</option>{orders.map((order) => <option key={order._id} value={order._id}>{order.orderNumber}</option>)}</select></FormField><FormField id="return-reason" label="Reason"><select id="return-reason" className="input" value={form.reason} onChange={(event) => setForm({...form, reason: event.target.value})}>{['Changed my mind', 'Damaged item', 'Wrong item', 'Not as described'].map((reason) => <option key={reason}>{reason}</option>)}</select></FormField><FormField id="return-notes" label="Additional notes"><textarea id="return-notes" className="input min-h-24" placeholder="Anything we should know?" value={form.notes} onChange={(event) => setForm({...form, notes: event.target.value})}/></FormField><button className="btn btn-primary w-full">Submit request</button></form></div></div>;
}
