import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
export const numberFormat = (value: number): string =>
  new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
  }).format(value);
export const formattedDate = ({
  date,
  locale,
}: {
  date: Date | string;
  locale: string;
}) =>
  new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
  }).format(new Date(date));
