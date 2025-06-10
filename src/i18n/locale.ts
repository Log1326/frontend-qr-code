'use server';

import { cookies } from 'next/headers';

import { defaultLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/types';

const COOKIE_NAME = 'locale-ohwat';

const getLocale = async () => {
  return (await cookies()).get(COOKIE_NAME)?.value || defaultLocale;
};

const setLocale = async (locale?: string) => {
  (await cookies()).set(COOKIE_NAME, (locale as Locale) || defaultLocale, {
    secure: true,
    path: '/',
    sameSite: 'none',
  });
};

export { getLocale, setLocale };
