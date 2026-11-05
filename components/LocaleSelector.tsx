'use client';

import {Globe} from '@/lib/icons';
import {supportedCurrencies, supportedLocales} from '@/lib/locale';
import {useLocale} from './LocaleProvider';

export default function LocaleSelector({compact = false, idPrefix = 'locale'}: {compact?: boolean; idPrefix?: string}) {
  const {locale, currency, setLocale, setCurrency} = useLocale();

  return (
    <div className={`flex ${compact ? 'flex-col sm:flex-row' : 'flex-wrap'} items-center gap-2`}>
      <label className="sr-only" htmlFor={`${idPrefix}-language`}>Language</label>
      <select
        id={`${idPrefix}-language`}
        value={locale}
        onChange={(event) => setLocale(event.target.value as typeof locale)}
        className="locale-select"
        aria-label="Language"
      >
        {supportedLocales.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select>
      <label className="sr-only" htmlFor={`${idPrefix}-currency`}>Currency</label>
      <select
        id={`${idPrefix}-currency`}
        value={currency}
        onChange={(event) => setCurrency(event.target.value as typeof currency)}
        className="locale-select"
        aria-label="Currency"
      >
        {supportedCurrencies.map((item) => <option key={item.value} value={item.value}>{item.symbol} {item.value}</option>)}
      </select>
      {!compact && <Globe className="hidden sm:block h-4 w-4 text-indigo-500" aria-hidden="true" />}
    </div>
  );
}
