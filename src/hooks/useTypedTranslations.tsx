import { useTranslations } from 'next-intl';

import type messages from '@/messages/ru.json';

type Messages = typeof messages;
export type MessageKeys = keyof Messages;

export const useTypedTranslations = () => {
  const t = useTranslations();
  return (key: MessageKeys): string => t(key);
};
