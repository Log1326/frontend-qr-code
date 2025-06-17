'use client';

import type { PropsWithChildren } from 'react';

import { ReactQueryProvider } from '@/providers/client/ReactQueryProvider';
import { ThemeProvider } from '@/providers/client/ThemeProvider';

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </ThemeProvider>
  );
};
