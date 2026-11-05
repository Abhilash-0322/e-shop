'use client';

import {useMemo, useState} from 'react';
import {ArrowRightLeft, Globe2, RefreshCw} from 'lucide-react';
import {FormField, PageHeader} from '@/components/ui';

const rates: {[key: string]: number} = {USD: 1, EUR: .92, GBP: .78, INR: 83.1, JPY: 151, CAD: 1.36};

export default function Currency() {
  const [amount, setAmount] = useState('100');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const result = useMemo(() => ((Number(amount) || 0) / rates[from] * rates[to]).toFixed(2), [amount, from, to]);
  return (
    <div className="shell py-10 md:py-14">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-brand-700 to-emerald-600 p-8 text-white md:p-12">
        <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
        <div className="relative"><PageHeader inverse eyebrow="Planning tool" title="Currency, made clear." description="A simple planning tool for international shoppers. Final checkout totals use the store&apos;s supported currency." /></div>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="surface p-7">
          <p className="eyebrow">Configured rates</p><h2 className="mt-2 text-2xl font-black">Convert an amount</h2>
          <div className="mt-7 grid items-end gap-3 md:grid-cols-[1fr_auto_1fr]">
            <FormField label="Amount"><input className="input mt-2 text-xl" value={amount} onChange={event => setAmount(event.target.value)} /></FormField>
            <button className="btn btn-soft" onClick={() => {setFrom(to); setTo(from);}} aria-label="Swap currencies"><ArrowRightLeft /></button>
            <div className="grid grid-cols-2 gap-2">
              <FormField label="From"><select className="input mt-2" value={from} onChange={event => setFrom(event.target.value)}>{Object.keys(rates).map(currency => <option key={currency}>{currency}</option>)}</select></FormField>
              <FormField label="To"><select className="input mt-2" value={to} onChange={event => setTo(event.target.value)}>{Object.keys(rates).map(currency => <option key={currency}>{currency}</option>)}</select></FormField>
            </div>
          </div>
          <div className="mt-8 rounded-2xl bg-slate-950 p-6 text-white"><small className="text-slate-400">Estimated conversion</small><p className="mt-2 text-4xl font-black">{result} {to}</p><p className="mt-2 text-sm text-slate-400">Indicative rate · refreshes from the configured table</p></div>
        </section>
        <aside className="surface p-6"><Globe2 className="h-6 w-6 text-brand-600" /><h3 className="mt-4 text-xl font-black">A note on checkout</h3><p className="muted mt-3 text-sm leading-relaxed">Prices, taxes, shipping, and payment authorization are confirmed at checkout. Use this tool to plan, then review the final order total.</p><div className="mt-5 flex items-center gap-2 text-xs font-bold text-emerald-700"><RefreshCw className="h-4 w-4" /> Updated from configured rates</div></aside>
      </div>
    </div>
  );
}
