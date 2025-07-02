export const defaultLocale = 'en';

export const locales = [defaultLocale, 'ru', 'he'] as const;

export const localesMap = [
  { key: 'en', title: 'English' },
  { key: 'ru', title: 'Русский' },
  { key: 'he', title: 'Hebrue' },
];
