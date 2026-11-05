'use client';

import {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {
  CurrencyCode,
  formatDate,
  formatMoney,
  formatNumber,
  LocaleCode,
  supportedCurrencies,
  supportedLocales,
} from '@/lib/locale';

type LocaleContextValue = {
  locale: LocaleCode;
  currency: CurrencyCode;
  setLocale: (value: LocaleCode) => void;
  setCurrency: (value: CurrencyCode) => void;
  formatMoney: (value: number, sourceCurrency?: CurrencyCode) => string;
  formatDate: (value: string | number | Date, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (value: number) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);
const LOCALE_KEY = 'halozon-locale';
const CURRENCY_KEY = 'halozon-currency';

function isLocale(value: string | null): value is LocaleCode {
  return supportedLocales.some((item) => item.value === value);
}

function isCurrency(value: string | null): value is CurrencyCode {
  return supportedCurrencies.some((item) => item.value === value);
}

export default function LocaleProvider({children}: {children: React.ReactNode}) {
  const [locale, setLocaleState] = useState<LocaleCode>('en-US');
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');

  useEffect(() => {
    const savedLocale = window.localStorage.getItem(LOCALE_KEY);
    const savedCurrency = window.localStorage.getItem(CURRENCY_KEY);
    if (isLocale(savedLocale)) setLocaleState(savedLocale);
    if (isCurrency(savedCurrency)) setCurrencyState(savedCurrency);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LOCALE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    window.localStorage.setItem(CURRENCY_KEY, currency);
  }, [currency]);

  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    currency,
    setLocale: (next) => setLocaleState(next),
    setCurrency: (next) => setCurrencyState(next),
    formatMoney: (amount, sourceCurrency = 'USD') => formatMoney(amount, currency, locale, sourceCurrency),
    formatDate: (value, options) => formatDate(value, locale, options),
    formatNumber: (value) => formatNumber(value, locale),
  }), [currency, locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used inside LocaleProvider');
  return context;
}
