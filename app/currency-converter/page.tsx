'use client';

import {useMemo, useState} from 'react';
import {ArrowRightLeft, Globe2, RefreshCw} from 'lucide-react';

const rates: {[key: string]: number} = {USD: 1, EUR: .92, GBP: .78, INR: 83.1, JPY: 151, CAD: 1.36};

export default function Currency() {
  const [amount, setAmount] = useState('100');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const result = useMemo(() => ((Number(amount) || 0) / rates[from] * rates[to]).toFixed(2), [amount, from, to]);

  return (
    <div className="shell py-12">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white md:p-12" aria-labelledby="currency-title">
        <Globe2 className="h-10 w-10 text-cyan-300" aria-hidden="true" />
        <h1 id="currency-title" className="mt-5 text-4xl font-black md:text-5xl">Currency, made clear.</h1>
        <p className="mt-4 max-w-xl text-slate-200">A simple planning tool for international shoppers. Final checkout totals use the store&apos;s supported currency.</p>
      </section>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="surface p-7" aria-labelledby="convert-title">
          <p className="eyebrow">Live planning tool</p>
          <h2 id="convert-title" className="mt-2 text-2xl font-black">Convert an amount</h2>
          <div className="mt-7 grid items-end gap-3 md:grid-cols-[1fr_auto_1fr]">
            <div><label htmlFor="currency-amount" className="text-sm font-bold">Amount</label><input id="currency-amount" inputMode="decimal" className="input mt-2 text-xl" value={amount} onChange={(event) => setAmount(event.target.value)} /></div>
            <button type="button" className="btn btn-soft" onClick={() => { setFrom(to); setTo(from); }} aria-label="Swap currencies"><ArrowRightLeft aria-hidden="true" /></button>
            <div className="grid grid-cols-2 gap-2">
              <div><label htmlFor="currency-from" className="text-xs font-bold">From</label><select id="currency-from" className="input mt-2" value={from} onChange={(event) => setFrom(event.target.value)}>{Object.keys(rates).map((currency) => <option key={currency}>{currency}</option>)}</select></div>
              <div><label htmlFor="currency-to" className="text-xs font-bold">To</label><select id="currency-to" className="input mt-2" value={to} onChange={(event) => setTo(event.target.value)}>{Object.keys(rates).map((currency) => <option key={currency}>{currency}</option>)}</select></div>
            </div>
          </div>
          <div className="mt-8 rounded-2xl bg-slate-950 p-6 text-white" aria-live="polite">
            <small className="text-slate-300">Estimated conversion</small>
            <p className="mt-2 text-4xl font-black">{result} {to}</p>
            <p className="mt-2 text-sm text-slate-300">Indicative rate · refreshes from the configured table</p>
          </div>
        </section>
        <aside className="surface p-6" aria-labelledby="checkout-note">
          <RefreshCw className="h-6 w-6 text-indigo-700" aria-hidden="true" />
          <h2 id="checkout-note" className="mt-4 text-xl font-black">A note on checkout</h2>
          <p className="mt-3 text-sm leading-relaxed muted">Prices, taxes, shipping, and payment authorization are confirmed at checkout. Use this tool to plan, then review the final order total.</p>
        </aside>
      </div>
    </div>
  );
}
