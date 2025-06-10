'use client';

import { useLocale } from 'next-intl';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { locales } from '@/i18n/config';
import { setLocale } from '@/i18n/locale';
import type { Locale } from '@/i18n/types';

export const LocaleSwitcher = () => {
  const locale = useLocale();

  const onChange = (value: string) => {
    const nextLocale = value as Locale;
    setLocale(nextLocale);
  };

  return (
    <Select value={locale} onValueChange={onChange}>
      <SelectTrigger className="max-w-xs">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {loc.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
