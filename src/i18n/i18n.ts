import { getRequestConfig } from 'next-intl/server';

import { defaultLocale, locales } from '@/i18n/config';
import { getLocale } from '@/i18n/locale';
import type { Locale } from '@/i18n/types';

const i18nRequestConfig = getRequestConfig(async () => {
  const locale = (await getLocale()) as Locale;

  return {
    locale,
    messages:
      locale === defaultLocale || !locales.includes(locale)
        ? (await import(`@/messages/${defaultLocale}.json`)).default
        : (await import(`@/messages/${locale}.json`)).default,
  };
});

export default i18nRequestConfig;
