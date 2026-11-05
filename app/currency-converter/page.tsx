'use client';

import { useMemo, useState } from 'react';
import { ArrowRightLeft, Globe2, RefreshCw } from 'lucide-react';

const rates: { [key: string]: number } = { USD: 1, EUR: .92, GBP: .78, INR: 83.1, JPY: 151, CAD: 1.36 };

export default function Currency() {
  const [amount, setAmount] = useState('100');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const result = useMemo(() => ((Number(amount) || 0) / rates[from] * rates[to]).toFixed(2), [amount, from, to]);
  return <div className="shell py-10 md:py-14"><div className="relative overflow-hidden rounded-[1.8rem] bg-[#17221c] p-8 text-white md:p-12"><div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-[#d7f36b]/15 blur-3xl" /><Globe2 className="h-10 w-10 text-[#d7f36b]" /><h1 className="mt-5 text-4xl font-black tracking-[-.05em] md:text-5xl">Currency, made clear.</h1><p className="mt-4 max-w-xl text-[#c5d0c4]">A simple planning tool for international shoppers. Final checkout totals use the store&apos;s supported currency.</p></div><div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]"><section className="surface p-7"><p className="eyebrow">Planning tool</p><h2 className="mt-2 text-2xl font-black">Convert an amount</h2><div className="mt-7 grid items-end gap-3 md:grid-cols-[1fr_auto_1fr]"><label className="text-sm font-bold">Amount<input className="input mt-2 text-xl" value={amount} onChange={(event) => setAmount(event.target.value)} /></label><button className="btn btn-soft" onClick={() => { setFrom(to); setTo(from); }} aria-label="Swap currencies"><ArrowRightLeft /></button><div className="grid grid-cols-2 gap-2"><label className="text-xs font-bold">From<select className="input mt-2" value={from} onChange={(event) => setFrom(event.target.value)}>{Object.keys(rates).map((value) => <option key={value}>{value}</option>)}</select></label><label className="text-xs font-bold">To<select className="input mt-2" value={to} onChange={(event) => setTo(event.target.value)}>{Object.keys(rates).map((value) => <option key={value}>{value}</option>)}</select></label></div></div><div className="mt-8 rounded-2xl bg-[#17221c] p-6 text-white"><small className="text-[#9cae9c]">Estimated conversion</small><p className="mt-2 text-4xl font-black">{result} {to}</p><p className="mt-2 text-sm text-[#9cae9c]">Indicative rate · refreshes from the configured table</p></div></section><aside className="surface p-6"><RefreshCw className="h-6 w-6 text-[#728749]" /><h3 className="mt-4 text-xl font-black">A note on checkout</h3><p className="muted mt-3 text-sm leading-relaxed">Prices, taxes, shipping, and payment authorization are confirmed at checkout. Use this tool to plan, then review the final order total.</p></aside></div></div>;
}
