import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export const I18nProvider: React.FC<React.PropsWithChildren> = async ({
  children,
}) => {
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
};
