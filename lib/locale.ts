export const supportedLocales = [
  { value: 'en-US', label: 'English (US)', currency: 'USD' },
  { value: 'en-GB', label: 'English (UK)', currency: 'GBP' },
  { value: 'de-DE', label: 'Deutsch', currency: 'EUR' },
  { value: 'fr-FR', label: 'Français', currency: 'EUR' },
  { value: 'hi-IN', label: 'हिन्दी', currency: 'INR' },
] as const;

export const supportedCurrencies = [
  { value: 'USD', label: 'US Dollar', symbol: '$' },
  { value: 'EUR', label: 'Euro', symbol: '€' },
  { value: 'GBP', label: 'British Pound', symbol: '£' },
  { value: 'INR', label: 'Indian Rupee', symbol: '₹' },
  { value: 'JPY', label: 'Japanese Yen', symbol: '¥' },
  { value: 'CAD', label: 'Canadian Dollar', symbol: 'CA$' },
] as const;

export type LocaleCode = (typeof supportedLocales)[number]['value'];
export type CurrencyCode = (typeof supportedCurrencies)[number]['value'];

const ratesFromUsd: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  INR: 83.1,
  JPY: 151,
  CAD: 1.36,
};

export function convertCurrency(
  value: number,
  from: CurrencyCode = 'USD',
  to: CurrencyCode = 'USD',
) {
  const sourceRate = ratesFromUsd[from] || ratesFromUsd.USD;
  const targetRate = ratesFromUsd[to] || ratesFromUsd.USD;
  return (Number.isFinite(value) ? value : 0) / sourceRate * targetRate;
}

export function formatMoney(
  value: number,
  currency: CurrencyCode = 'USD',
  locale: LocaleCode = 'en-US',
  sourceCurrency: CurrencyCode = 'USD',
) {
  const safeCurrency = ratesFromUsd[currency] ? currency : 'USD';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: safeCurrency,
    currencyDisplay: 'symbol',
  }).format(convertCurrency(value, sourceCurrency, safeCurrency));
}

export function formatDate(
  value: string | number | Date,
  locale: LocaleCode = 'en-US',
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formatNumber(value: number, locale: LocaleCode = 'en-US') {
  return new Intl.NumberFormat(locale).format(Number.isFinite(value) ? value : 0);
}
