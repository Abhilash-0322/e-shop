'use client';

import {useLocale} from './LocaleProvider';
import {CurrencyCode} from '@/lib/locale';

export function LocalizedPrice({
  value,
  currency = 'USD',
  className,
}: {
  value: number;
  currency?: CurrencyCode;
  className?: string;
}) {
  const {formatMoney} = useLocale();
  return <span className={className}>{formatMoney(value, currency)}</span>;
}

export function LocalizedDate({
  value,
  className,
  options,
}: {
  value: string | number | Date;
  className?: string;
  options?: Intl.DateTimeFormatOptions;
}) {
  const {formatDate} = useLocale();
  const date = new Date(value);
  return <time className={className} dateTime={Number.isNaN(date.getTime()) ? undefined : date.toISOString()}>{formatDate(value, options)}</time>;
}
